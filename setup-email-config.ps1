# Firebase Email Configuration Setup Script
# This script helps you set up email credentials for Firebase Cloud Functions

Write-Host "🔧 Firebase Email Configuration Setup" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

# Check if Firebase CLI is installed
try {
    $firebaseVersion = firebase --version
    Write-Host "✅ Firebase CLI found: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Firebase CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "   npm install -g firebase-tools" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📧 Email Configuration" -ForegroundColor Cyan
Write-Host "----------------------" -ForegroundColor Cyan

# Get email credentials from user
$emailUser = Read-Host "Enter your Gmail address (e.g., yourapp@gmail.com)"
$emailPassword = Read-Host "Enter your Gmail App Password (not your regular password)" -AsSecureString

# Convert secure string to plain text for Firebase config
$emailPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($emailPassword))

Write-Host ""
Write-Host "🔑 Setting Firebase configuration..." -ForegroundColor Yellow

try {
    # Set the email configuration
    firebase functions:config:set email.user="$emailUser" email.password="$emailPasswordPlain"
    Write-Host "✅ Email configuration set successfully!" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Deploy your functions: firebase deploy --only functions" -ForegroundColor White
    Write-Host "2. Test the email functionality in your app" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 Important notes:" -ForegroundColor Yellow
    Write-Host "- Make sure you're using a Gmail App Password, not your regular password" -ForegroundColor White
    Write-Host "- You can generate an App Password at: https://myaccount.google.com/apppasswords" -ForegroundColor White
    Write-Host "- The email credentials are securely stored in Firebase" -ForegroundColor White
    
} catch {
    Write-Host "❌ Failed to set Firebase configuration: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Manual setup:" -ForegroundColor Yellow
    Write-Host "Run these commands manually:" -ForegroundColor White
    Write-Host "firebase functions:config:set email.user=`"$emailUser`"" -ForegroundColor Gray
    Write-Host "firebase functions:config:set email.password=`"YOUR_APP_PASSWORD`"" -ForegroundColor Gray
}

# Clear the password variable for security
$emailPasswordPlain = $null
