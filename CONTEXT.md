# ClapBack - Project Context

## What Is This

An iOS app that helps people handle difficult conversations — work conflicts, family drama, friend issues, neighbor disputes, anything. Users paste chat text or upload screenshots (multi-photo OCR), add context about the situation, and get AI-powered analysis: what's happening, how to handle it strategically, and suggested reply messages.

The AI always asks clarifying questions first before giving its analysis, ensuring it never guesses or assumes.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native, Expo (SDK 55), TypeScript |
| Navigation | Expo Router |
| Styling | StyleSheet (React Native built-in) |
| Subscriptions | RevenueCat (planned, not yet wired) |
| Backend | Node.js, Hono, TypeScript |
| Hosting | Railway (deployed) |
| AI (clarify) | Gemini 2.5 Flash via OpenRouter |
| AI (analyze) | Gemini 3.1 Pro Preview via OpenRouter |
| OCR | Apple Vision (on-device, multi-photo) |

## Key Dependencies

- `expo` — managed workflow with dev builds (no Expo Go)
- `expo-router` — file-based routing
- `expo-image-picker` — multi-screenshot selection
- `expo-clipboard` — copy replies to clipboard
- `@react-native-async-storage/async-storage` — local free-count tracking
- `hono` — backend framework
- Custom `expo-ocr` module — Apple Vision Swift bridge

## Key Commands

```bash
# Mobile
cd apps/mobile
npx expo prebuild --platform ios   # Generate native project
npx expo run:ios                    # Build & run on simulator
eas build --platform ios            # Production build (future)

# Backend
cd apps/backend
npm run dev                  # Local dev server (tsx watch --env-file=.env)
npm run build                # Production build (tsc)
npm run start                # Production start
railway up                   # Deploy to Railway
```

## Monetization

- 2 free analyses (tracked in AsyncStorage, currently set to 50 for testing)
- $1.99/week, $6.99/month, $39.99/year (planned, paywall is static UI only)
- No user accounts — RevenueCat anonymous IDs (when integrated)

## API Endpoints

- `POST /api/clarify` — Returns 3-5 clarifying questions about the conversation
- `POST /api/analyze` — Returns analysis + recommendation + suggested replies
- `POST /api/validate-subscription` — RevenueCat validation (stub)
- `GET /health` — Health check

## Backend URL

- Production: `https://jubilant-celebration-production.up.railway.app`
- Env vars configured in Railway dashboard

## App Store Requirements (for future submission)

- Privacy policy URL required
- Photo library usage description in Info.plist
- AI-generated content disclosure
- Subscription terms visible before purchase
- Restore purchases button required
