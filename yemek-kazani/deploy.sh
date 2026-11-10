#!/usr/bin/env bash
# Yemek kazanı: E-Tablo + bağlı Apps Script oluşturur, kodu yükler, web uygulaması olarak yayınlar.
# Tekrar çalıştırıldığında aynı /exec linkini koruyarak günceller.
set -euo pipefail
cd "$(dirname "$0")"

command -v clasp >/dev/null || { echo "clasp yok: npm i -g @google/clasp"; exit 1; }
[ -f "$HOME/.clasprc.json" ] || clasp login

if [ ! -f .clasp.json ]; then
  # clasp create uzaktaki manifesti src/ içine yazar; bizimkini koru.
  cp src/appsscript.json .appsscript.backup.json
  clasp create --type sheets --title "Yemek kazanı" --rootDir ./src
  mv .appsscript.backup.json src/appsscript.json
fi

clasp push --force

if [ -f .deployment-id ]; then
  clasp deploy --deploymentId "$(cat .deployment-id)" --description "Güncelleme $(date +%F_%H:%M)"
else
  out=$(clasp deploy --description "İlk yayın")
  echo "$out"
  echo "$out" | grep -oE 'AKfy[A-Za-z0-9_-]+' | head -1 > .deployment-id
fi

DEP=$(cat .deployment-id)
SHEET_ID=$(node -e 'const c=require("./.clasp.json");const p=c.parentId;console.log(Array.isArray(p)?p[0]:(p||""))')
SCRIPT_ID=$(node -e 'console.log(require("./.clasp.json").scriptId)')
echo
echo "Web uygulaması : https://script.google.com/macros/s/$DEP/exec"
[ -n "$SHEET_ID" ] && echo "E-Tablo        : https://docs.google.com/spreadsheets/d/$SHEET_ID/edit"
echo "Script editörü : https://script.google.com/d/$SCRIPT_ID/edit"
