# What2Say - Project Context

## What Is This

An iOS app that helps people respond to difficult conversations. Users paste chat text or upload a screenshot, pick a tone, and get AI-powered psychology insights + 3 suggested replies.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native, Expo (SDK 52+), TypeScript |
| Navigation | Expo Router |
| Styling | NativeWind (TailwindCSS) |
| Subscriptions | RevenueCat (react-native-purchases) |
| Backend | Node.js, Hono, TypeScript |
| Hosting | Railway or Fly.io |
| AI | OpenRouter (multi-model: GPT-4o + Llama 3.1 70B) |
| OCR | Apple Vision (on-device) |

## Key Dependencies

- `expo` — managed workflow
- `expo-router` — file-based routing
- `expo-image-picker` — screenshot selection
- `react-native-purchases` — RevenueCat SDK
- `@react-native-async-storage/async-storage` — local free-count tracking
- `hono` — backend framework

## Key Commands

```bash
# Mobile
cd apps/mobile
npx expo start              # Dev server
npx expo run:ios             # Run on iOS simulator
eas build --platform ios     # Production build

# Backend
cd apps/backend
npm run dev                  # Local dev server
npm run build                # Production build
npm run start                # Production start
```

## Monetization

- 2 free analyses (tracked in AsyncStorage)
- $1.99/week, $6.99/month, $39.99/year via RevenueCat + StoreKit
- No user accounts — RevenueCat anonymous IDs

## App Store Requirements

- Privacy policy URL required
- Photo library usage description in Info.plist
- AI-generated content disclosure
- Subscription terms visible before purchase
- Restore purchases button required
