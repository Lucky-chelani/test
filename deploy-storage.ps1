# Deploy Firebase Storage Rules
Write-Host "Deploying Firebase Storage Rules..." -ForegroundColor Green

try {
    # Deploy storage rules
    firebase deploy --only storage
    
    Write-Host "Storage rules deployed successfully!" -ForegroundColor Green
    Write-Host "The trek image upload should now work." -ForegroundColor Yellow
} catch {
    Write-Host "Error deploying storage rules: $_" -ForegroundColor Red
    Write-Host "Make sure you're logged in to Firebase CLI" -ForegroundColor Yellow
    Write-Host "Run: firebase login" -ForegroundColor Cyan
}
