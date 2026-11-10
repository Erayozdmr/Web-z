/**
 * Yemek kazanı kayıt sayfası — Google Sheets + Apps Script web uygulaması.
 *
 * Sayfalar:
 *   Kayıtlar : Zaman | Ad Soyad | Günler | Öğünler
 *   Ayarlar  : B1 = kayıt başlangıcı, B2 = kayıt bitişi (tarih + saat)
 */

var GUNLER = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum'];
var OGUNLER = ['Sabah', 'Öğle', 'Akşam'];
var SHEET_KAYIT = 'Kayıtlar';
var SHEET_AYAR = 'Ayarlar';
var TZ = 'Europe/Istanbul';
var MAX_AD = 60;

var SHEET_OZET = 'Özet';

/**
 * Script editöründe elle çalıştırın (tekrar çalıştırmak güvenlidir):
 * sayfaları kurar, biçimlendirir, saat dilimini İstanbul yapar.
 */
function kurulum() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone(TZ); // Dosya → Ayarlar → Saat dilimi: İstanbul (GMT+3)

  var kayit = ss.getSheetByName(SHEET_KAYIT) || ss.insertSheet(SHEET_KAYIT);
  if (kayit.getLastRow() === 0) {
    kayit.getRange(1, 1, 1, 4).setValues([['Zaman', 'Ad Soyad', 'Günler', 'Öğünler']]);
  }
  kayitBicimle_(kayit);

  var ayar = ss.getSheetByName(SHEET_AYAR) || ss.insertSheet(SHEET_AYAR);
  if (!ayar.getRange('A1').getValue()) {
    var simdi = new Date();
    var bitis = new Date(simdi.getTime() + 7 * 24 * 3600 * 1000);
    ayar.getRange('A1:B2').setValues([
      ['Başlangıç', simdi],
      ['Bitiş', bitis]
    ]);
    ayar.getRange('A4').setValue('B1 ve B2 hücrelerine tarih ve saat girin (örn. 10.11.2026 18:00). Bu aralığın dışında form kilitlenir.');
  }
  ayar.getRange('A1:A2').setFontWeight('bold');
  ayar.getRange('B1:B2').setNumberFormat('dd.mm.yyyy HH:mm');
  ayar.setColumnWidth(1, 110);
  ayar.setColumnWidth(2, 160);

  // Varsayılan boş "Sayfa1"/"Sheet1" varsa kaldır.
  ['Sayfa1', 'Sheet1'].forEach(function (ad) {
    var s = ss.getSheetByName(ad);
    if (s && s.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(s);
  });

  var ozet = ozetYaz_(ss);
  ss.setActiveSheet(ozet);
  ss.moveActiveSheet(1);
}

/** E-Tablo açılınca üstte "Yemek kazanı" menüsü. */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('Yemek kazanı')
    .addItem('Özeti yenile', 'ozetiYenile')
    .addItem('Kurulumu / biçimi yenile', 'kurulum')
    .addToUi();
}

function ozetiYenile() {
  ozetYaz_(SpreadsheetApp.getActiveSpreadsheet());
}

/** Kayıtlar veya Ayarlar elle değiştirilirse (ör. satır silme) özeti güncelle. */
function onEdit(e) {
  try {
    var ad = e && e.range ? e.range.getSheet().getName() : '';
    if (ad === SHEET_KAYIT || ad === SHEET_AYAR) ozetYaz_(e.source);
  } catch (err) { /* sessizce geç */ }
}

function kayitBicimle_(sh) {
  sh.setFrozenRows(1);
  sh.getRange(1, 1, 1, 4).setValues([['Zaman', 'Ad Soyad', 'Günler', 'Öğünler']])
    .setFontWeight('bold').setFontColor('#ffffff').setHorizontalAlignment('center');
  sh.getRange('A:A').setNumberFormat('dd.mm.yyyy HH:mm').setHorizontalAlignment('center');
  sh.setColumnWidth(1, 130);
  sh.setColumnWidth(2, 200);
  sh.setColumnWidth(3, 190);
  sh.setColumnWidth(4, 160);
  var bantlar = sh.getBandings();
  for (var i = 0; i < bantlar.length; i++) bantlar[i].remove();
  sh.getRange('A1:D').applyRowBanding(SpreadsheetApp.BandingTheme.ORANGE, true, false)
    .setHeaderRowColor('#d9480f').setFirstRowColor('#ffffff').setSecondRowColor('#fff4e6');
}

/**
 * "Özet" sayfasını baştan yazar: porsiyon tablosu (gün × öğün) ve
 * kişi bazında ✓ tablosu. Her kayıtta ve elle düzenlemede çağrılır.
 */
function ozetYaz_(ss) {
  var sh = ss.getSheetByName(SHEET_OZET) || ss.insertSheet(SHEET_OZET, 0);
  var kayitlar = kayitlariOku_(ss);
  var ozet = ozetHesapla_(kayitlar);
  var pencere = kayitPenceresi_(ss);
  var GENISLIK = 1 + GUNLER.length + OGUNLER.length + 1; // 10 sütun

  sh.clear();
  sh.clearConditionalFormatRules();
  sh.setHiddenGridlines(true);

  // Başlık
  sh.getRange(1, 1).setValue('Yemek kazanı').setFontSize(18).setFontWeight('bold');
  sh.getRange(2, 1).setValue(
    'Kayıt: ' + (pencere.baslangicStr || '—') + ' → ' + (pencere.bitisStr || '—') +
    '   ·   ' + kayitlar.length + ' kişi   ·   Güncellendi: ' + fmt_(new Date())
  ).setFontColor('#6a6f76');

  // Porsiyon tablosu
  var r0 = 4;
  sh.getRange(r0, 1).setValue('Porsiyonlar').setFontSize(13).setFontWeight('bold');
  var porsiyon = [['Gün'].concat(OGUNLER, ['Toplam'])];
  var sutunTop = OGUNLER.map(function () { return 0; });
  GUNLER.forEach(function (g) {
    var satir = [g], top = 0;
    OGUNLER.forEach(function (o, j) {
      var n = ozet[g][o];
      satir.push(n); top += n; sutunTop[j] += n;
    });
    satir.push(top);
    porsiyon.push(satir);
  });
  var genel = sutunTop.reduce(function (a, b) { return a + b; }, 0);
  porsiyon.push(['Toplam'].concat(sutunTop, [genel]));
  var pr = sh.getRange(r0 + 1, 1, porsiyon.length, porsiyon[0].length);
  pr.setValues(porsiyon).setHorizontalAlignment('center').setFontSize(12)
    .setBorder(true, true, true, true, true, true, '#e3e0d8', SpreadsheetApp.BorderStyle.SOLID);
  sh.getRange(r0 + 1, 1, 1, porsiyon[0].length)
    .setBackground('#1f2328').setFontColor('#ffffff').setFontWeight('bold');
  sh.getRange(r0 + 2, 1, GUNLER.length, 1).setFontWeight('bold').setBackground('#f6f4ef');
  sh.getRange(r0 + 1 + porsiyon.length - 1, 1, 1, porsiyon[0].length)
    .setFontWeight('bold').setBackground('#fff4e6');
  sh.getRange(r0 + 2, porsiyon[0].length, GUNLER.length, 1)
    .setFontWeight('bold').setBackground('#fff4e6');
  var hucreler = sh.getRange(r0 + 2, 2, GUNLER.length, OGUNLER.length);

  // Kişi tablosu
  var k0 = r0 + porsiyon.length + 3;
  sh.getRange(k0, 1).setValue('Kişiler (' + kayitlar.length + ')').setFontSize(13).setFontWeight('bold');
  var baslik = ['Ad Soyad'].concat(GUNLER, OGUNLER, ['Porsiyon']);
  var kisi = [baslik];
  kayitlar
    .slice()
    .sort(function (a, b) { return a.ad.localeCompare(b.ad, 'tr'); })
    .forEach(function (k) {
      var satir = [k.ad];
      GUNLER.forEach(function (g) { satir.push(k.gunler.indexOf(g) >= 0 ? '✓' : ''); });
      OGUNLER.forEach(function (o) { satir.push(k.ogunler.indexOf(o) >= 0 ? '✓' : ''); });
      satir.push(k.gunler.length * k.ogunler.length);
      kisi.push(satir);
    });
  var kr = sh.getRange(k0 + 1, 1, kisi.length, baslik.length);
  kr.setValues(kisi).setHorizontalAlignment('center').setFontSize(11)
    .setBorder(true, true, true, true, true, true, '#e3e0d8', SpreadsheetApp.BorderStyle.SOLID);
  sh.getRange(k0 + 1, 1, kisi.length, 1).setHorizontalAlignment('left');
  sh.getRange(k0 + 1, 1, 1, baslik.length)
    .setBackground('#1f2328').setFontColor('#ffffff').setFontWeight('bold');
  // Gün ve öğün gruplarını ayıran ince çizgiler
  sh.getRange(k0 + 1, 2 + GUNLER.length, kisi.length, 1)
    .setBorder(null, true, null, null, null, null, '#1f2328', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  sh.getRange(k0 + 1, 2, kisi.length, 1)
    .setBorder(null, true, null, null, null, null, '#1f2328', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  sh.getRange(k0 + 1, baslik.length, kisi.length, 1)
    .setBorder(null, true, null, null, null, null, '#1f2328', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  var kurallar = [
    SpreadsheetApp.newConditionalFormatRule()
      .setRanges([hucreler])
      .setGradientMinpointWithValue('#ffffff', SpreadsheetApp.InterpolationType.NUMBER, '0')
      .setGradientMaxpoint('#f08c4a')
      .build()
  ];
  if (kisi.length > 1) {
    kurallar.push(SpreadsheetApp.newConditionalFormatRule()
      .setRanges([sh.getRange(k0 + 2, 2, kisi.length - 1, GUNLER.length + OGUNLER.length)])
      .whenTextEqualTo('✓')
      .setBackground('#d3f9d8').setFontColor('#2b8a3e').setBold(true)
      .build());
  } else {
    sh.getRange(k0 + 2, 1).setValue('Henüz kayıt yok.').setFontColor('#6a6f76');
  }
  sh.setConditionalFormatRules(kurallar);

  sh.setColumnWidth(1, 190);
  for (var c = 2; c <= GENISLIK; c++) sh.setColumnWidth(c, 64);
  sh.setColumnWidth(GENISLIK, 80);
  sh.setFrozenRows(0);
  return sh;
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Yemek kazanı kaydı')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/* ---------- İstemciden çağrılan fonksiyonlar ---------- */

function getVeri() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var pencere = kayitPenceresi_(ss);
  var kayitlar = kayitlariOku_(ss);
  return {
    acik: pencere.acik,
    durum: pencere.durum,
    baslangic: pencere.baslangicStr,
    bitis: pencere.bitisStr,
    kayitlar: kayitlar.map(function (k) {
      return { ad: k.ad, gunler: k.gunler, ogunler: k.ogunler };
    }),
    ozet: ozetHesapla_(kayitlar),
    gunler: GUNLER,
    ogunler: OGUNLER
  };
}

function gonder(form) {
  form = form || {};
  var ad = String(form.ad || '').replace(/\s+/g, ' ').trim();
  if (!ad) throw new Error('Lütfen ad soyad yazın.');
  if (ad.length > MAX_AD) throw new Error('Ad soyad en fazla ' + MAX_AD + ' karakter olabilir.');

  var gunler = filtrele_(form.gunler, GUNLER);
  var ogunler = filtrele_(form.ogunler, OGUNLER);
  if (!gunler.length) throw new Error('En az bir gün seçin.');
  if (!ogunler.length) throw new Error('En az bir öğün seçin.');

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) throw new Error('Sunucu meşgul, lütfen tekrar deneyin.');
  var guncellendi = false;
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var pencere = kayitPenceresi_(ss);
    if (!pencere.acik) throw new Error('Kayıt şu anda kapalı. ' + pencere.durum);

    var sheet = ss.getSheetByName(SHEET_KAYIT);
    if (!sheet) throw new Error('"Kayıtlar" sayfası bulunamadı. Yönetici kurulum fonksiyonunu çalıştırmalı.');

    var anahtar = normalAd_(ad);
    var satir = [new Date(), guvenli_(ad), gunler.join(', '), ogunler.join(', ')];
    var son = sheet.getLastRow();
    var hedef = -1;
    if (son > 1) {
      var adlar = sheet.getRange(2, 2, son - 1, 1).getValues();
      for (var i = 0; i < adlar.length; i++) {
        if (normalAd_(adlar[i][0]) === anahtar) { hedef = i + 2; break; }
      }
    }
    if (hedef > 0) {
      sheet.getRange(hedef, 1, 1, 4).setValues([satir]);
      guncellendi = true;
    } else {
      sheet.appendRow(satir);
    }
    SpreadsheetApp.flush();
    try { ozetYaz_(ss); } catch (err) { console.error(err); }
  } finally {
    lock.releaseLock();
  }

  var veri = getVeri();
  veri.mesaj = guncellendi ? 'Kaydınız güncellendi.' : 'Kaydınız alındı.';
  return veri;
}

/* ---------- Yardımcılar ---------- */

function kayitPenceresi_(ss) {
  var ayar = ss.getSheetByName(SHEET_AYAR);
  var bas = ayar ? tarihOku_(ayar.getRange('B1').getValue()) : null;
  var bit = ayar ? tarihOku_(ayar.getRange('B2').getValue()) : null;
  var simdi = new Date();
  var r = {
    acik: false,
    baslangicStr: bas ? fmt_(bas) : '',
    bitisStr: bit ? fmt_(bit) : ''
  };
  if (!bas || !bit) {
    r.durum = 'Kayıt tarihleri henüz ayarlanmadı.';
  } else if (simdi < bas) {
    r.durum = 'Kayıt ' + r.baslangicStr + ' tarihinde açılacak.';
  } else if (simdi > bit) {
    r.durum = 'Kayıt ' + r.bitisStr + ' tarihinde kapandı.';
  } else {
    r.acik = true;
    r.durum = 'Kayıt açık — son: ' + r.bitisStr;
  }
  return r;
}

function tarihOku_(v) {
  if (v instanceof Date && !isNaN(v.getTime())) return v;
  if (typeof v === 'string' && v.trim()) {
    // "10.11.2026 18:00" biçimini İstanbul saatiyle yorumla
    var m = v.trim().match(/^(\d{1,2})[.\/](\d{1,2})[.\/](\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/);
    if (m) {
      var iso = m[3] + '-' + pad_(m[2]) + '-' + pad_(m[1]) + 'T' +
        pad_(m[4] || '0') + ':' + (m[5] || '00') + ':00+03:00';
      var d = new Date(iso);
      if (!isNaN(d.getTime())) return d;
    }
  }
  return null;
}

function pad_(s) { s = String(s); return s.length < 2 ? '0' + s : s; }

function fmt_(d) { return Utilities.formatDate(d, TZ, 'dd.MM.yyyy HH:mm'); }

function kayitlariOku_(ss) {
  var sheet = ss.getSheetByName(SHEET_KAYIT);
  if (!sheet || sheet.getLastRow() < 2) return [];
  var vals = sheet.getRange(2, 2, sheet.getLastRow() - 1, 3).getDisplayValues();
  return vals
    .filter(function (r) { return String(r[0]).trim(); })
    .map(function (r) {
      return {
        ad: String(r[0]).replace(/^'/, ''),
        gunler: liste_(r[1], GUNLER),
        ogunler: liste_(r[2], OGUNLER)
      };
    });
}

function ozetHesapla_(kayitlar) {
  var ozet = {};
  GUNLER.forEach(function (g) {
    ozet[g] = {};
    OGUNLER.forEach(function (o) { ozet[g][o] = 0; });
  });
  kayitlar.forEach(function (k) {
    k.gunler.forEach(function (g) {
      k.ogunler.forEach(function (o) { ozet[g][o]++; });
    });
  });
  return ozet;
}

function liste_(s, izinli) {
  return filtrele_(String(s || '').split(',').map(function (x) { return x.trim(); }), izinli);
}

/** Yalnızca izinli değerleri, izinli sırayla ve tekrarsız döndürür. */
function filtrele_(arr, izinli) {
  if (!Array.isArray(arr)) return [];
  var set = {};
  arr.forEach(function (x) { set[String(x)] = true; });
  return izinli.filter(function (x) { return set[x]; });
}

/** Aynı kişiyi bulmak için: büyük/küçük harf, Türkçe İ/I ve fazla boşluk farkını yok say. */
function normalAd_(s) {
  return String(s || '')
    .replace(/^'/, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .toLowerCase();
}

/** E-Tabloda formül olarak yorumlanmasını engelle. */
function guvenli_(s) {
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
