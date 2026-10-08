#!/usr/bin/env bash
set -eu
cd "$(dirname "$0")/web"
if ! command -v node >/dev/null 2>&1; then
  printf '%s\n' 'Node.js 22.12 veya daha yeni bir sürüm gerekiyor.' 'https://nodejs.org/en/download adresinden Node.js LTS sürümünü kur.'
  exit 1
fi
if ! node -e 'const [major, minor] = process.versions.node.split(".").map(Number); if (major < 22 || (major === 22 && minor < 12)) process.exit(1);'; then
  printf '%s\n' 'Node.js sürümünü 22.12 veya üzerine güncelle.'
  exit 1
fi
printf '%s\n' 'Aruzahr hazırlanıyor. İlk açılış birkaç dakika sürebilir.'
npm ci --no-audit --no-fund
npm run assets
printf '%s\n' 'Atlas tarayıcıda açılacak. Kullanırken bu terminali açık bırak.'
npm run dev -- --host 127.0.0.1 --open
