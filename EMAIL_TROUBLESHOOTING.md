# Email Verification Troubleshooting Guide

## Issue: Not Receiving Verification Emails

### Quick Checks

1. **Check Spam/Junk Folder**
   - Gmail often filters automated emails
   - Look for emails from "The Recipe Book" or `simonazike155@gmail.com`

2. **Check Backend Logs**
   - Look for "Email sent successfully to: [your-email]"
   - Look for "Failed to send verification email:" errors
   - Check for "Message ID:" in the logs

3. **Verify Email Address**
   - Make sure you entered the correct email during registration
   - Check for typos

### Common Issues and Solutions

#### 1. Gmail App Password Issues

The backend uses Gmail with an app password. If emails aren't sending:

**Check if the app password is valid:**
```bash
# Test the email configuration
curl -X POST http://localhost:5000/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"your-email@example.com","password":"Test123!","confirmPassword":"Test123!"}'
```

**Regenerate Gmail App Password:**
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already enabled
3. Go to "App passwords"
4. Generate a new password for "Mail"
5. Update `NODEMAILER_PASSWORD` in `.env` file

#### 2. Gmail Security Blocking

Gmail might block the app if it detects suspicious activity:

**Solution:**
1. Check [Gmail Security Checkup](https://myaccount.google.com/security-checkup)
2. Look for "Less secure app access" warnings
3. Allow the app to send emails

#### 3. Rate Limiting

Gmail has sending limits:
- **Free Gmail**: ~500 emails/day
- **Google Workspace**: ~2000 emails/day

If you've been testing a lot, you might have hit the limit.

#### 4. FRONTEND_URL Configuration

The verification link uses `FRONTEND_URL` from `.env`:

**Current setting:**
```
FRONTEND_URL=http://localhost:5174
```

**For production, update to:**
```
FRONTEND_URL=https://therecipebook-liard.vercel.app
```

### Backend Changes Made

#### 1. Enhanced Email Error Logging ([`utils/index.js:169`](Back-End/utils/index.js:169))
- Now logs successful email sends with message ID
- Logs detailed error information
- Re-throws errors for better debugging

#### 2. Improved Registration Flow ([`authService.js:39`](Back-End/services/Users/authService.js:39))
- Saves user before sending email (prevents data loss if email fails)
- Catches email errors separately
- Logs email sending status
- Registration succeeds even if email fails

### Testing Email Functionality

#### Option 1: Check Backend Logs
After registering, check the backend console for:
```
Email sent successfully to: your-email@example.com
Message ID: <some-id>
```

#### Option 2: Use a Test Email Service
For development, consider using:
- [Mailtrap](https://mailtrap.io/) - Email testing service
- [Ethereal Email](https://ethereal.email/) - Fake SMTP service

Update `.env` with test credentials:
```env
NODEMAILER_MAIL=your-test-email
NODEMAILER_PASSWORD=your-test-password
```

### Temporary Workaround

If you need to test the app without email verification:

#### Option 1: Manually Verify in Database
1. Connect to MongoDB
2. Find your user document
3. Set `isVerified: true`

#### Option 2: Disable Email Verification (Development Only)
In [`authService.js:84`](Back-End/services/Users/authService.js:84), comment out the verification check:
```javascript
// if (!user.isVerified) {
//   return callback(messageHandler("Please confirm your email...", true, SUCCESS));
// }
```

**⚠️ WARNING:** Remove this for production!

### Alternative Email Providers

If Gmail continues to have issues, consider switching to:

1. **SendGrid** (Free tier: 100 emails/day)
2. **Mailgun** (Free tier: 5000 emails/month)
3. **AWS SES** (Pay as you go)

### Email Template Location

The verification email template is at:
- [`Back-End/modules/views/emailConfirmation.handlebars`](Back-End/modules/views/emailConfirmation.handlebars)

### Next Steps

1. **Register a new user** and check backend logs
2. **Check spam folder** in your email
3. **Verify Gmail app password** is correct
4. **Check Gmail security settings**
5. If still not working, consider using a test email service

### Support

If emails still aren't working after trying these steps:
1. Check the backend console for specific error messages
2. Verify the `.env` file has correct credentials
3. Test with a different email address
4. Consider using an alternative email service
