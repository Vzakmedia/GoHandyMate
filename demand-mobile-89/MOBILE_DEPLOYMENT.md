
# Mobile Deployment Guide for GoHandyMate

## Prerequisites

1. **For iOS Development:**
   - macOS with Xcode installed
   - Apple Developer Account ($99/year)
   - iOS device for testing

2. **For Android Development:**
   - Android Studio installed
   - Google Play Console Account ($25 one-time fee)
   - Android device for testing

## Setup Steps

### 1. Initialize Capacitor Project
The Capacitor configuration is already set up in `capacitor.config.ts`.

### 2. Export to GitHub and Clone Locally
1. Click "Export to GitHub" button in Lovable
2. Clone the repository to your local machine:
   ```bash
   git clone <your-github-repo-url>
   cd <project-name>
   npm install
   ```

### 3. Add Mobile Platforms
```bash
# Add iOS platform (macOS only)
npx cap add ios

# Add Android platform
npx cap add android
```

### 4. Build and Sync
```bash
# Build the web app
npm run build

# Sync with native platforms
npx cap sync
```

## App Store Deployment (iOS)

### 1. Open iOS Project
```bash
npx cap open ios
```

### 2. Configure App in Xcode
- Set your Team and Bundle Identifier
- Configure app icons and launch screens
- Set deployment target (iOS 13.0+)
- Configure signing certificates

### 3. Build and Archive
- Select "Any iOS Device" as target
- Product → Archive
- Upload to App Store Connect

### 4. App Store Connect
- Complete app metadata
- Add screenshots (required sizes)
- Submit for review

## Google Play Store Deployment (Android)

### 1. Open Android Project
```bash
npx cap open android
```

### 2. Configure App in Android Studio
- Update `android/app/build.gradle` with correct package name
- Set version code and version name
- Configure app icons and splash screens

### 3. Generate Signed APK/AAB
- Build → Generate Signed Bundle/APK
- Create or use existing keystore
- Build release AAB (recommended) or APK

### 4. Google Play Console
- Create new app listing
- Upload AAB file
- Complete store listing
- Submit for review

## Required Assets

### App Icons
- **iOS:** 1024x1024px (App Store), various sizes for device
- **Android:** 512x512px (Play Store), various densities

### Screenshots
- **iOS:** Required for all supported device sizes
- **Android:** At least 2 screenshots, up to 8 per device type

### Store Descriptions
- **App Name:** GoHandyMate
- **Subtitle/Short Description:** Get Things Done
- **Description:** Connect with skilled professionals for home services
- **Keywords:** handyman, services, home, repair, maintenance

## Testing

### Before Submission
1. Test on real devices
2. Verify all features work offline/online
3. Test payment flows
4. Verify location permissions
5. Test push notifications (if implemented)

### App Store Guidelines
- Follow Apple Human Interface Guidelines
- Ensure app doesn't crash
- Implement proper error handling
- Respect user privacy

### Google Play Policies
- Follow Material Design guidelines
- Target latest Android API level
- Implement proper permissions
- Follow content policies

## Maintenance

### Updates
```bash
# After making changes to web app
npm run build
npx cap sync

# Then rebuild and resubmit to stores
```

### Version Management
- Update version in `package.json`
- Update native app versions before each store submission

## Support

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS App Store Guidelines](https://developer.apple.com/app-store/guidelines/)
- [Google Play Developer Policies](https://support.google.com/googleplay/android-developer/answer/4430948)
