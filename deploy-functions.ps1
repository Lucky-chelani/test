# PowerShell script to deploy Firebase functions
Write-Host "Installing dependencies in functions directory..." -ForegroundColor Green
cd functions
npm install
Write-Host "Dependencies installed. Deploying functions..." -ForegroundColor Green
cd ..
firebase deploy --only "functions"
Write-Host "Functions deployment complete!" -ForegroundColor Green
