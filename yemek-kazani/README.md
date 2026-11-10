# Yemek kazanı kayıt sayfası

Google E-Tablo + bağlı Apps Script web uygulaması. Giriş gerektirmez, tek link ile çalışır.

- `src/Code.gs`: sunucu tarafı (kayıt, aynı isimle güncelleme, süre kontrolü, özet)
- `src/Index.html`: form, kayıt tablosu ve gün × öğün porsiyon özeti
- `src/appsscript.json`: `Europe/Istanbul`, `USER_DEPLOYING` + `ANYONE_ANONYMOUS`

## Kurulum (kendi bilgisayarınızda)

1. https://script.google.com/home/usersettings adresinden **Google Apps Script API**'yi açın.
2. `npm i -g @google/clasp`
3. `cd yemek-kazani && ./deploy.sh`
   (`clasp login` tarayıcıyı açar. Betik E-Tabloyu oluşturur, kodu yükler ve yayınlar.)
4. Betiğin yazdığı **Script editörü** linkini açın. Üstteki fonksiyon listesinden `kurulum`'u seçip **Çalıştır**'a basın ve izinleri verin.
   Bu adım `Kayıtlar` ile `Ayarlar` sayfalarını oluşturur ve E-Tablonun saat dilimini İstanbul (GMT+3) yapar.
5. E-Tablodaki `Ayarlar` sayfasında **B1** hücresine başlangıç, **B2** hücresine bitiş tarih ve saatini girin (örn. `10.11.2026 18:00`).
6. Betiğin yazdığı `/exec` linkini gruba atın.

Kodu değiştirdikten sonra `./deploy.sh` komutunu tekrar çalıştırın. Aynı `/exec` linki güncellenir.
