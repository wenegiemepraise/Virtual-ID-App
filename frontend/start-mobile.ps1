Write-Host "Starting Virtual ID App for Mobile Development..." -ForegroundColor Green
Write-Host ""
Write-Host "Your app will be available at:" -ForegroundColor Yellow
Write-Host "- Local: http://localhost:3000" -ForegroundColor Cyan
Write-Host "- Mobile: http://192.168.0.17:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Make sure your mobile device is on the same WiFi network!" -ForegroundColor Yellow
Write-Host ""

$env:HOST = "0.0.0.0"
npm start
