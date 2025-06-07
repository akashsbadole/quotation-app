# Google Integrations Setup Guide

This guide will help you set up Google Analytics and Google Drive integrations for the QuoteManager application.

## 🔧 Google Analytics Setup

### 1. Create Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Start measuring"
4. Create a new account and property
5. Choose "Web" as the platform
6. Enter your website details

### 2. Get Measurement ID

1. In Google Analytics, go to Admin (gear icon)
2. Select your property
3. Click on "Data Streams"
4. Click on your web stream
5. Copy the "Measurement ID" (starts with G-)

### 3. Configure in Application

1. Open `src/services/google-analytics.ts`
2. Replace `'G-XXXXXXXXXX'` with your actual Measurement ID:

```typescript
const GA_MEASUREMENT_ID = 'G-YOUR-MEASUREMENT-ID';
```

### 4. Environment Variables (Optional)

For better security, you can use environment variables:

1. Create a `.env` file in your project root:
```
REACT_APP_GA_MEASUREMENT_ID=G-YOUR-MEASUREMENT-ID
```

2. Update the service file:
```typescript
const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
```

## 🔧 Google Drive Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Drive API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"

### 2. Create Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Configure OAuth consent screen if prompted
6. Choose "Web application"
7. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production domain
8. Copy the Client ID

### 3. Configure in Application

1. Open `src/services/google-drive.ts`
2. Replace the configuration:

```typescript
private config: GoogleDriveConfig = {
  apiKey: 'YOUR_API_KEY',
  clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
  discoveryDoc: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
  scopes: 'https://www.googleapis.com/auth/drive.file'
};
```

### 4. Environment Variables (Recommended)

1. Add to your `.env` file:
```
REACT_APP_GOOGLE_API_KEY=YOUR_API_KEY
REACT_APP_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

2. Update the service file:
```typescript
private config: GoogleDriveConfig = {
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY || 'YOUR_API_KEY',
  clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID.apps.googleusercontent.com',
  discoveryDoc: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
  scopes: 'https://www.googleapis.com/auth/drive.file'
};
```

## 🚀 Testing the Integrations

### Google Analytics Testing

1. Start your development server: `npm start`
2. Open browser developer tools
3. Go to Console tab
4. Navigate through the app
5. You should see GA tracking logs like:
   ```
   GA: Page view tracked - /dashboard
   GA: Event tracked - User Interaction:click
   ```

### Google Drive Testing

1. Navigate to Settings > Integrations
2. Find Google Drive integration
3. Click "Connect"
4. Sign in with your Google account
5. Grant permissions
6. Test upload functionality

## 📊 Analytics Events Being Tracked

The application automatically tracks:

- **Page Views**: Every page navigation
- **User Interactions**: Button clicks, form submissions
- **Business Events**: 
  - Quotation created
  - Quotation sent
  - Quotation approved
  - Client added
  - Product added
- **Performance Metrics**: Load times, API calls
- **Errors**: JavaScript errors and API failures

## 📁 Google Drive Features

The integration provides:

- **Automatic Upload**: Quotation PDFs are automatically saved
- **File Organization**: Files are organized in a "QuoteManager" folder
- **Sharing**: Share files with customers via email
- **Access Control**: Set read/write permissions
- **Search**: Find files by quotation reference
- **Backup**: Automatic cloud backup of all quotations

## 🔒 Security Considerations

### Google Analytics
- Measurement ID is public and safe to expose
- No sensitive data is sent to GA
- User data is anonymized

### Google Drive
- API keys should be restricted by domain
- OAuth consent screen should be configured properly
- Only necessary scopes are requested
- Files are stored in user's personal Drive

## 🐛 Troubleshooting

### Google Analytics Issues

**Problem**: No data appearing in GA
- Check Measurement ID is correct
- Verify GA is initialized before tracking
- Check browser console for errors
- Ensure ad blockers aren't blocking GA

**Problem**: Events not tracking
- Check event parameters are valid
- Verify GA is properly initialized
- Look for JavaScript errors

### Google Drive Issues

**Problem**: Sign-in fails
- Check Client ID is correct
- Verify authorized origins are set
- Ensure OAuth consent screen is configured
- Check browser console for errors

**Problem**: Upload fails
- Verify API key is correct and enabled
- Check Drive API is enabled in Cloud Console
- Ensure user has granted necessary permissions
- Check file size limits

**Problem**: Files not appearing
- Check if QuoteManager folder exists
- Verify user permissions
- Try refreshing the file list
- Check browser console for API errors

## 📈 Monitoring and Analytics

### Google Analytics Dashboard

Key metrics to monitor:
- Page views and user sessions
- Quotation creation/send rates
- User engagement and retention
- Error rates and performance

### Google Drive Usage

Monitor:
- Storage usage
- File upload success rates
- Sharing activity
- API quota usage

## 🔄 Updates and Maintenance

### Regular Tasks
- Monitor API quotas and usage
- Update OAuth consent screen annually
- Review and rotate API keys if needed
- Check for Google API updates

### Scaling Considerations
- Google Drive has API rate limits
- Consider implementing retry logic
- Monitor storage usage across users
- Plan for increased API quota if needed

## 📞 Support

For issues with:
- **Google Analytics**: [GA Help Center](https://support.google.com/analytics/)
- **Google Drive API**: [Drive API Documentation](https://developers.google.com/drive)
- **OAuth Setup**: [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)

## ✅ Verification Checklist

- [ ] Google Analytics Measurement ID configured
- [ ] GA tracking working in browser console
- [ ] Google Cloud project created
- [ ] Drive API enabled
- [ ] OAuth credentials created
- [ ] API key configured
- [ ] Google Drive sign-in working
- [ ] File upload functionality tested
- [ ] Environment variables set (if using)
- [ ] Production domains added to OAuth settings

Once all items are checked, your Google integrations should be fully functional!
