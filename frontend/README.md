# 🎨 EduTrust Frontend

React-based web application for certificate verification with multi-language support.

## 📁 Project Structure

```
frontend/
├── index.html              # Entry HTML
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # TailwindCSS config
├── postcss.config.js      # PostCSS config
├── public/               # Static assets
└── src/
    ├── main.jsx          # Application entry
    ├── App.jsx           # Main App component
    ├── index.css         # Global styles
    ├── components/       # Reusable components
    │   ├── ProtectedRoute.jsx
    │   └── layout/
    │       ├── Navbar.jsx
    │       └── Footer.jsx
    ├── context/          # React Context
    │   └── AuthContext.jsx
    ├── pages/            # Page components
    │   ├── Home.jsx
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── VerifyCertificate.jsx
    │   ├── Profile.jsx
    │   ├── AdminDashboard.jsx
    │   ├── About.jsx
    │   └── Contact.jsx
    ├── services/         # API services
    │   └── api.js
    ├── utils/            # Utility functions
    │   └── helpers.js
    └── i18n/             # Internationalization
        ├── config.js
        └── locales/
            ├── en.json   # English
            ├── hi.json   # Hindi
            └── ta.json   # Tamil
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+**
- **npm 9+** or **yarn 1.22+**

### Installation

1. **Install dependencies**
```powershell
npm install
```

2. **Configure API endpoint**

Edit `src/services/api.js`:
```javascript
const BASE_URL = 'http://localhost:8000/api/v1'
```

3. **Run development server**
```powershell
npm run dev
```

Application opens at: `http://localhost:5173`

### Build for Production

```powershell
npm run build
```

Output in `dist/` directory.

Preview production build:
```powershell
npm run preview
```

## 🌐 Features

### 🔐 Authentication
- User registration with password validation
- JWT-based login
- Protected routes
- Auto-refresh tokens
- Persistent sessions

### 📄 Certificate Verification
- Drag-and-drop file upload
- Multi-format support (JPEG, PNG, PDF)
- Real-time verification progress
- Comprehensive verification reports
- Downloadable results

### 👤 User Profile
- View profile information
- Edit user details
- Verification history
- Statistics dashboard

### 👨‍💼 Admin Dashboard
- System-wide statistics
- Verification trends (charts)
- Recent verifications table
- Language distribution analytics
- User management

### 🌍 Internationalization (i18n)
- **English** (en)
- **हिंदी** (hi)
- **தமிழ்** (ta)

Language switcher in navbar, persists in localStorage.

## 🎯 Key Components

### AuthContext
Manages authentication state globally:
```jsx
const { user, login, logout, isAuthenticated } = useAuth()
```

### ProtectedRoute
Wraps routes requiring authentication:
```jsx
<Route 
  path="/verify" 
  element={
    <ProtectedRoute>
      <VerifyCertificate />
    </ProtectedRoute>
  } 
/>
```

### API Service
Centralized API calls with interceptors:
```javascript
import api from './services/api'

const response = await api.post('/auth/login', credentials)
```

## 📡 API Integration

### Configuration

`src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Auto-attach JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### API Methods

```javascript
// Authentication
await api.post('/auth/register', userData)
await api.post('/auth/login', credentials)
await api.get('/auth/me')

// Certificate Verification
const formData = new FormData()
formData.append('file', file)
formData.append('certificate_type', 'degree')
await api.post('/verify/analyze-report', formData)

// User Profile
await api.get('/auth/me')
await api.put('/auth/me', updates)
```

## 🎨 Styling

### TailwindCSS

Utility-first CSS framework for rapid UI development.

**Configuration:** `tailwind.config.js`
```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981',
        danger: '#ef4444'
      }
    }
  }
}
```

### Global Styles

`src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
  }
  
  .card {
    @apply bg-white shadow-lg rounded-lg p-6;
  }
}
```

### Animations

Custom animations in `index.css`:
```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-in;
}
```

## 🌍 Internationalization

### Setup

`src/i18n/config.js`:
```javascript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: require('./locales/en.json') },
      hi: { translation: require('./locales/hi.json') },
      ta: { translation: require('./locales/ta.json') }
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en'
  })
```

### Usage

```jsx
import { useTranslation } from 'react-i18next'

function Component() {
  const { t, i18n } = useTranslation()
  
  return (
    <div>
      <h1>{t('home.title')}</h1>
      <button onClick={() => i18n.changeLanguage('hi')}>
        हिंदी
      </button>
    </div>
  )
}
```

### Translation Files

`src/i18n/locales/en.json`:
```json
{
  "home": {
    "title": "Welcome to EduTrust",
    "subtitle": "Verify educational certificates with AI"
  },
  "verify": {
    "upload": "Upload Certificate",
    "analyzing": "Analyzing..."
  }
}
```

## 📊 Charts & Visualizations

Uses **Recharts** for data visualization:

```jsx
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={verificationTrends}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="verifications" stroke="#3b82f6" />
  </LineChart>
</ResponsiveContainer>
```

## 🔧 Configuration

### Environment Variables

Create `.env` (not committed):
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=EduTrust
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

### Vite Config

`vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
```

## 🧪 Testing

### Unit Tests (Vitest)

```powershell
npm run test
```

### E2E Tests (Playwright)

```powershell
npm run test:e2e
```

## 📱 Responsive Design

Mobile-first approach with Tailwind breakpoints:

```jsx
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-4 
  gap-6
">
  {/* Content */}
</div>
```

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🚢 Deployment

### Static Hosting (Netlify, Vercel)

```powershell
npm run build
# Deploy dist/ folder
```

**Netlify config** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Docker

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🎯 Performance Optimization

- **Code Splitting**: Lazy load routes
- **Image Optimization**: Use WebP format
- **Bundle Analysis**: `npm run build -- --analyze`
- **Caching**: Service worker for PWA

## 🔒 Security Best Practices

- XSS protection with React's escaping
- CSRF tokens for state-changing operations
- HTTPS in production
- Content Security Policy headers
- Regular dependency updates

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Change port in vite.config.js or:
npm run dev -- --port 3000
```

### Build Errors
```powershell
# Clear cache
rm -rf node_modules
rm package-lock.json
npm install
```

### API Connection Issues
```powershell
# Check CORS in backend
# Verify API_URL in src/services/api.js
```

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/)
- [i18next](https://www.i18next.com/)

---

**Frontend maintained by Team COSMOS**
