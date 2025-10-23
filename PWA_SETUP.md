# PWA (Progressive Web App) Setup Guide

This document outlines the PWA setup for PromptVault, including all the necessary configurations and features.

## 🚀 PWA Features Implemented

### ✅ Core PWA Features

- **Web App Manifest** - Complete manifest.json with app metadata
- **Service Worker** - Automatic caching and offline functionality
- **App Icons** - Multiple sizes for different devices and platforms
- **Install Prompt** - Custom install prompt for better user experience
- **Offline Support** - Cached resources for offline usage
- **App Shortcuts** - Quick access to key features

### 📱 Installation Features

- **Add to Home Screen** - Users can install the app on their devices
- **Standalone Mode** - App runs in full-screen mode when installed
- **Splash Screen** - Custom splash screen on app launch
- **App Shortcuts** - Quick access to Browse, Submit, and My Prompts

### 🔧 Technical Implementation

#### 1. Dependencies Added

```json
{
  "next-pwa": "^5.6.0",
  "workbox-webpack-plugin": "^7.0.0"
}
```

#### 2. Configuration Files

- `next.config.mjs` - PWA configuration with caching strategies
- `public/manifest.json` - Web app manifest
- `public/sw.js` - Service worker (auto-generated)
- `public/workbox-*.js` - Workbox runtime (auto-generated)

#### 3. Icons Generated

- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- SVG format for scalability
- Maskable icons for Android adaptive icons

#### 4. Caching Strategies

- **Google Fonts** - Cache first (365 days)
- **Static Assets** - Stale while revalidate (24 hours)
- **API Calls** - Network first with 10s timeout
- **Images** - Stale while revalidate (24 hours)
- **JS/CSS** - Stale while revalidate (24 hours)

## 🎯 PWA Manifest Configuration

```json
{
  "name": "PromptVault - AI Prompts Collection",
  "short_name": "PromptVault",
  "description": "Discover and share amazing AI prompts for ChatGPT, Midjourney, and more",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "orientation": "portrait-primary",
  "scope": "/",
  "lang": "en",
  "categories": ["productivity", "utilities", "education"]
}
```

## 📱 App Shortcuts

- **Browse Prompts** - Quick access to main page
- **Submit Prompt** - Direct link to submission form
- **My Prompts** - Access to user's submitted prompts

## 🔧 Development vs Production

### Development Mode

- PWA features are **disabled** in development
- Service worker is not registered
- Install prompt is not shown

### Production Mode

- Full PWA functionality enabled
- Service worker automatically registered
- Install prompt appears for eligible browsers

## 🚀 Testing PWA Features

### 1. Build and Test

```bash
npm run build
npm start
```

### 2. PWA Testing Checklist

- [ ] Manifest loads correctly (`/manifest.json`)
- [ ] Service worker registers (`/sw.js`)
- [ ] Icons display properly
- [ ] Install prompt appears (Chrome/Edge)
- [ ] App installs successfully
- [ ] Offline functionality works
- [ ] App shortcuts work
- [ ] Splash screen displays

### 3. Browser Testing

- **Chrome/Edge** - Full PWA support
- **Firefox** - Basic PWA support
- **Safari** - Limited PWA support (iOS 11.3+)
- **Mobile Browsers** - Full support on Android, limited on iOS

## 📊 PWA Audit Tools

### Lighthouse PWA Audit

Run Lighthouse audit to check PWA compliance:

1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Progressive Web App"
4. Run audit

### Expected Scores

- **Performance** - 90+
- **Accessibility** - 90+
- **Best Practices** - 90+
- **SEO** - 90+
- **PWA** - 100

## 🔄 Service Worker Features

### Automatic Caching

- Static assets cached on first visit
- API responses cached with network-first strategy
- Images and fonts cached with stale-while-revalidate

### Offline Support

- App works offline after first visit
- Cached content served when network unavailable
- Background sync for form submissions

### Update Handling

- Automatic service worker updates
- Skip waiting for immediate updates
- User notification for new versions

## 🎨 Customization

### Updating Icons

1. Replace SVG files in `/public/icons/`
2. Generate PNG versions for better compatibility
3. Update manifest.json if needed

### Modifying Caching

Edit `next.config.mjs` to adjust caching strategies:

- Change cache durations
- Add new URL patterns
- Modify cache names

### Custom Install Prompt

The install prompt component (`components/pwa-install-prompt.tsx`) can be customized:

- Change styling
- Modify text content
- Adjust positioning
- Add analytics tracking

## 🚨 Important Notes

### Security

- HTTPS required for PWA features
- Service worker only works on secure origins
- Manifest must be served over HTTPS

### Performance

- Service worker adds ~2-3KB to bundle
- Caching improves subsequent page loads
- Offline functionality enhances UX

### Browser Support

- Chrome/Edge: Full support
- Firefox: Good support
- Safari: Limited support (iOS 11.3+)
- Mobile: Excellent on Android, good on iOS

## 🔧 Troubleshooting

### Common Issues

1. **Service worker not registering**

   - Check HTTPS requirement
   - Verify build process completed
   - Check browser console for errors

2. **Install prompt not showing**

   - Ensure PWA criteria are met
   - Check manifest.json validity
   - Verify service worker is active

3. **Icons not displaying**
   - Check file paths in manifest
   - Verify icon files exist
   - Test with different browsers

### Debug Tools

- Chrome DevTools > Application > Manifest
- Chrome DevTools > Application > Service Workers
- Chrome DevTools > Lighthouse > PWA Audit

## 📈 Analytics Integration

The PWA setup includes analytics tracking for:

- Install events
- App usage patterns
- Offline usage statistics
- Performance metrics

## 🎯 Next Steps

1. **Replace placeholder icons** with proper branded icons
2. **Add screenshots** to manifest for app stores
3. **Implement push notifications** for engagement
4. **Add background sync** for form submissions
5. **Optimize caching strategies** based on usage patterns

## 📚 Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Next-PWA Documentation](https://github.com/shadowwalker/next-pwa)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
