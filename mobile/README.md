# 📱 EduTrust Mobile App

React Native mobile application for on-the-go certificate verification.

## 📁 Project Structure

```
mobile/
├── App.tsx                # Entry component
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── babel.config.js       # Babel config
├── metro.config.js       # Metro bundler config
├── assets/              # Images, fonts, icons
└── src/
    ├── components/      # Reusable components
    │   ├── DrawerContent.tsx
    │   └── ErrorBoundary.tsx
    ├── context/         # React Context
    │   └── AuthContext.tsx
    ├── navigation/      # Navigation setup
    │   └── AppNavigator.tsx
    ├── screens/         # Screen components
    │   ├── WelcomeScreen.tsx
    │   ├── LoginScreen.tsx
    │   ├── RegisterScreen.tsx
    │   ├── HomeScreen.tsx
    │   ├── VerifyScreen.tsx
    │   ├── ProfileScreen.tsx
    │   ├── AdminDashboardScreen.tsx
    │   ├── AboutScreen.tsx
    │   ├── ContactScreen.tsx
    │   └── DiagnosticsScreen.tsx
    ├── services/        # API services
    │   └── api.ts
    ├── theme/           # Theme configuration
    │   └── theme.ts
    ├── i18n/            # Internationalization
    │   ├── config.ts
    │   └── locales/
    │       ├── en.json
    │       ├── hi.json
    │       └── ta.json
    └── utils/           # Utility functions
        └── connectionTest.ts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+**
- **npm 9+** or **yarn 1.22+**
- **Expo CLI**: `npm install -g expo-cli`
- **Expo Go app** (for testing on physical device)
- **Android Studio** (for Android emulator)
- **Xcode** (for iOS simulator, macOS only)

### Installation

1. **Install dependencies**
```powershell
npm install
```

2. **Start Expo development server**
```powershell
npx expo start
```

3. **Run on device/emulator**
- **Physical Device**: Scan QR code with Expo Go app
- **Android Emulator**: Press `a` in terminal
- **iOS Simulator**: Press `i` in terminal (macOS only)

## 📱 Platform-Specific Setup

### Android Setup

1. **Install Android Studio**
2. **Create virtual device (AVD)**
3. **Set environment variables:**
```powershell
$env:ANDROID_HOME = "C:\Users\YourName\AppData\Local\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools"
```

4. **Run Android emulator:**
```powershell
npx expo start --android
```

### iOS Setup (macOS only)

1. **Install Xcode from App Store**
2. **Install Command Line Tools:**
```bash
xcode-select --install
```

3. **Install CocoaPods:**
```bash
sudo gem install cocoapods
```

4. **Run iOS simulator:**
```bash
npx expo start --ios
```

## 🔧 Configuration

### API Endpoint

Edit `src/services/api.ts`:
```typescript
const BASE_URL = 'http://localhost:8000/api/v1'
// For physical device, use your computer's IP:
// const BASE_URL = 'http://192.168.1.100:8000/api/v1'
```

### Expo Configuration

`app.json`:
```json
{
  "expo": {
    "name": "EduTrust",
    "slug": "edutrust",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#3b82f6"
    },
    "android": {
      "package": "com.cosmos.edutrust",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#3b82f6"
      }
    },
    "ios": {
      "bundleIdentifier": "com.cosmos.edutrust",
      "supportsTablet": true
    }
  }
}
```

## 🎯 Key Features

### 🔐 Authentication
- User registration with validation
- Login with JWT tokens
- Biometric authentication (fingerprint/Face ID)
- Auto-refresh tokens
- Secure token storage (AsyncStorage)

### 📸 Certificate Scanning
- Camera integration
- Photo library access
- Document picker
- Real-time upload progress
- Multi-format support

### 📊 Results Display
- Comprehensive verification reports
- Confidence scores with visual indicators
- Anomaly checks breakdown
- Recommendations
- Share results

### 🌍 Internationalization
- English, Hindi, Tamil support
- RTL language support
- Language switcher in settings

### 📱 Native Features
- Push notifications
- Offline support
- File sharing
- Biometric authentication
- Camera & photo library access

## 🧩 Key Components

### Navigation

Using **React Navigation**:

```typescript
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'

const Drawer = createDrawerNavigator()

<NavigationContainer>
  <Drawer.Navigator>
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="Verify" component={VerifyScreen} />
  </Drawer.Navigator>
</NavigationContainer>
```

### AuthContext

```typescript
const { user, login, logout, isAuthenticated } = useAuth()

// Login
await login(email, password)

// Logout
await logout()
```

### API Service

```typescript
import api from '../services/api'

// Upload certificate
const formData = new FormData()
formData.append('file', {
  uri: file.uri,
  type: 'image/jpeg',
  name: 'certificate.jpg'
})

const response = await api.post('/verify/analyze-report', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
```

## 🎨 Styling & Theming

### Theme Configuration

`src/theme/theme.ts`:
```typescript
export const theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#10b981',
    danger: '#ef4444',
    background: '#f9fafb',
    text: '#111827',
    border: '#d1d5db'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  typography: {
    h1: { fontSize: 32, fontWeight: 'bold' },
    h2: { fontSize: 24, fontWeight: 'bold' },
    body: { fontSize: 16 },
    caption: { fontSize: 12, color: '#6b7280' }
  }
}
```

### StyleSheet Usage

```typescript
import { StyleSheet } from 'react-native'
import { theme } from '../theme/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text
  }
})
```

## 📸 Camera & File Access

### Camera Permissions

```typescript
import * as ImagePicker from 'expo-image-picker'

const { status } = await ImagePicker.requestCameraPermissionsAsync()
if (status === 'granted') {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8
  })
}
```

### Document Picker

```typescript
import * as DocumentPicker from 'expo-document-picker'

const result = await DocumentPicker.getDocumentAsync({
  type: ['image/*', 'application/pdf']
})
```

## 🔔 Push Notifications

Setup with Expo Notifications:

```typescript
import * as Notifications from 'expo-notifications'

// Request permissions
const { status } = await Notifications.requestPermissionsAsync()

// Schedule notification
await Notifications.scheduleNotificationAsync({
  content: {
    title: 'Verification Complete',
    body: 'Your certificate has been verified!'
  },
  trigger: null // Send immediately
})
```

## 💾 Local Storage

Using AsyncStorage:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'

// Save
await AsyncStorage.setItem('access_token', token)

// Retrieve
const token = await AsyncStorage.getItem('access_token')

// Remove
await AsyncStorage.removeItem('access_token')
```

## 🧪 Testing

### Unit Tests (Jest)

```powershell
npm run test
```

### E2E Tests (Detox)

```powershell
npm run test:e2e
```

## 📦 Building & Distribution

### Development Build

```powershell
# Android APK
eas build --platform android --profile development

# iOS build
eas build --platform ios --profile development
```

### Production Build

1. **Configure EAS**
```powershell
npm install -g eas-cli
eas login
eas build:configure
```

2. **Build for Android**
```powershell
eas build --platform android --profile production
```

3. **Build for iOS**
```powershell
eas build --platform ios --profile production
```

### Publishing

```powershell
# Publish update (OTA)
eas update --branch production

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

## 🐛 Troubleshooting

### Metro Bundler Issues

```powershell
# Clear cache
npx expo start -c

# Reset Metro
rm -rf node_modules
npm install
```

### Android Build Errors

```powershell
# Clean build
cd android
./gradlew clean
cd ..
npx expo run:android
```

### iOS Build Errors (macOS)

```bash
# Clean build
cd ios
pod deintegrate
pod install
cd ..
npx expo run:ios
```

### Network Connection Issues

For physical device testing:
1. Ensure device and computer are on same WiFi
2. Use computer's IP address instead of localhost
3. Check firewall settings

```typescript
// src/services/api.ts
const BASE_URL = 'http://192.168.1.100:8000/api/v1'
```

### Expo CLI Errors

Current known issue in workspace:
```
Error: Config _internal.projectRoot isn't defined
```

**Fix:**
```powershell
.\fix-mobile.ps1
```

Or manually:
```powershell
cd mobile
rm -rf node_modules
npm install
npx expo install --fix
```

## 📱 Device Testing

### On Physical Device

1. Install **Expo Go** from App Store / Play Store
2. Run `npx expo start`
3. Scan QR code with Expo Go (Android) or Camera (iOS)

### Using Emulator

**Android:**
```powershell
npx expo start --android
```

**iOS (macOS only):**
```bash
npx expo start --ios
```

## 🔒 Security

- Secure storage for tokens
- Certificate pinning for API requests
- Biometric authentication
- Input validation
- No sensitive data in AsyncStorage (encrypted if needed)

## 🌐 Offline Support

```typescript
import NetInfo from '@react-native-community/netinfo'

const unsubscribe = NetInfo.addEventListener(state => {
  console.log('Connected:', state.isConnected)
})
```

## 📚 Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Expo Icons](https://icons.expo.fyi/)

---

**Mobile app maintained by Team COSMOS**
