# Email Configuration Setup for Trovia Treks

## Setting up Email Service

To enable email functionality for booking confirmations, you need to set up email credentials in Firebase Functions.

### Option 1: Using Gmail (Recommended for development)

1. Create a Gmail account or use an existing one
2. Enable 2-factor authentication on the account
3. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate an app password for "Mail"
   - Save this password

4. Set the Firebase configuration:
   ```bash
   firebase functions:config:set email.user="your-email@gmail.com" email.password="your-app-password"
   ```

### Option 2: Using Environment Variables (Local Development)

Create a `.env` file in the `functions` directory:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Option 3: Production Email Services

For production, consider using:
- **SendGrid**: More reliable for transactional emails
- **AWS SES**: Cost-effective for high volume
- **Mailgun**: Good developer experience
- **Nodemailer with OAuth2**: More secure than app passwords

### Testing Email Functionality

1. Deploy the functions:
   ```bash
   firebase deploy --only functions
   ```

2. Test booking flow in the application
3. Check Firebase Functions logs:
   ```bash
   firebase functions:log
   ```

### Email Templates

The email templates are customizable in `functions/index.js`:
- `generateBookingConfirmationEmailContent()` - Success emails
- `generatePaymentFailureEmailContent()` - Failure emails

### Security Notes

- Never commit email credentials to version control
- Use Firebase Config or environment variables
- Consider using OAuth2 for production
- Regularly rotate email credentials

### Troubleshooting

- Check Firebase Functions logs for errors
- Verify email credentials are set correctly
- Ensure Gmail account has app passwords enabled
- Check spam folder for test emails
