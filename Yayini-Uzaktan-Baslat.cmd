@echo off
chcp 65001 >nul
setlocal
pushd "%~dp0web"
node -e "const [a,b]=process.versions.node.split('.').map(Number);if(a<22||(a===22&&b<12))process.exit(1)" >nul 2>&1
if errorlevel 1 (
  echo Node.js 22.12 veya daha yenisini kurup bu dosyayi tekrar ac.
  pause
  popd
  exit /b 1
)
if not exist node_modules\vite\bin\vite.js (
  call npm ci
  if errorlevel 1 goto failed
)
if not exist node_modules\three\package.json (
  call npm ci
  if errorlevel 1 goto failed
)
if not exist public\atlas\aruzahr.dzi (
  call npm run assets
  if errorlevel 1 goto failed
)
echo Aruzahr yerel ag yayini aciliyor. Telefonda Yayin panelindeki eslestirme kodunu kullan. Bu pencereyi yayin boyunca acik tut.
call npm run dev -- --host 0.0.0.0 --open http://127.0.0.1:5173/#/broadcast
popd
exit /b 0
:failed
echo Kurulum tamamlanamadi. Yukaridaki hata mesajini kontrol et.
pause
popd
exit /b 1
