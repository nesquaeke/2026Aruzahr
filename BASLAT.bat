@echo off
chcp 65001 >nul
setlocal
title Aruzahr - Valhunar Atlası
cd /d "%~dp0web"
where node >nul 2>nul
if errorlevel 1 goto :missingnode
node -e "const [major, minor] = process.versions.node.split('.').map(Number); if (major < 22 || (major === 22 && minor < 12)) process.exit(1);"
if errorlevel 1 goto :missingnode
echo Aruzahr hazırlanıyor. İlk açılış birkaç dakika sürebilir.
call npm ci --no-audit --no-fund
if errorlevel 1 goto :failed
call npm run assets
if errorlevel 1 goto :failed
echo Atlas tarayıcıda açılacak. Kullanırken bu pencereyi açık bırak.
call npm run dev -- --host 127.0.0.1 --open
if errorlevel 1 goto :failed
exit /b 0
:missingnode
echo Node.js 22.12 veya daha yeni bir sürüm gerekiyor.
echo https://nodejs.org/en/download adresinden Node.js LTS sürümünü kur,
echo sonra bu dosyayı tekrar aç.
pause
exit /b 1
:failed
echo.
echo Başlatma tamamlanamadı. Yukarıdaki hata mesajını kontrol et.
echo 5173 portu kullanılıyorsa önceki atlas terminalinde Ctrl+C yapıp tekrar dene.
pause
exit /b 1
