#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../web"
if ! node -e "const [a,b]=process.versions.node.split('.').map(Number);if(a<22||(a===22&&b<12))process.exit(1)" >/dev/null 2>&1; then
  echo 'Node.js 22.12 veya daha yenisini kurup tekrar çalıştır.' >&2
  exit 1
fi
if [[ ! -f node_modules/vite/bin/vite.js || ! -f node_modules/three/package.json ]]; then npm ci; fi
if [[ ! -f public/atlas/aruzahr.dzi ]]; then npm run assets; fi
echo 'Aruzahr Yayın Masası açılıyor. Bu pencereyi yayın boyunca açık tut.'
exec npm run dev -- --host 127.0.0.1 --open /#/broadcast
