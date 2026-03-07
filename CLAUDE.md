# What2Say - Project CLAUDE.md

## Project Overview

What2Say is an iOS app that helps people craft replies in difficult conversations (ex-partners, couples, friends). Users provide chat context (text paste or screenshot), select a tone, and receive AI-powered analysis: a short psychology insight explaining what's happening, plus 3 suggested replies.

## Product Rules

- Input: text paste OR screenshot (OCR via Apple Vision framework)
- Tones: presets (Calm, Assertive, Cold, Funny, Romantic, Savage) + custom free-text
- Output per analysis: 1 short psychology explanation + 3 reply alternatives
- No conversation history — every analysis is one-shot
- No user accounts — anonymous usage, subscription via StoreKit
- AI writes in whatever language the user's chat is in (auto-detected)
- Free tier: 2 free analyses (stored locally), then paywall
- Pricing: $1.99/week, $6.99/month, $39.99/year

## Tech Stack

### Mobile (Frontend)
- **React Native** with **Expo** (SDK 52+)
- **TypeScript** — strict mode, no `any`
- **Expo Router** — file-based navigation
- **expo-image-picker** — for screenshot selection
- **react-native-purchases (RevenueCat)** — StoreKit subscription management
- **AsyncStorage** — track free analysis count locally
- **StyleSheet** — React Native built-in styling (NativeWind dropped due to Expo Go incompatibility)

### Backend
- **Node.js** with **Hono** (lightweight, fast, edge-ready)
- **TypeScript** — shared types with frontend where possible
- Deployed on **Railway** or **Fly.io** (simple, cheap, auto-scaling)
- Responsibilities:
  - Proxy AI requests (protect API key)
  - Validate RevenueCat subscription receipts
  - Rate limiting

### AI
- **OpenRouter** as the AI gateway
- Multi-model routing per tone:
  - **GPT-4o** (OPENROUTER_MODEL_DEFAULT) → cold, funny, romantic, savage
  - **Llama 3.1 70B** (OPENROUTER_MODEL_ALT) → calm, assertive, custom
- Few-shot examples as actual message turns (user/assistant pairs) for tone accuracy

### OCR
- **Apple Vision framework** via `expo-modules` or a React Native bridge
- Runs on-device — no server round-trip for OCR
- Fallback: Google Cloud Vision API if on-device quality is insufficient

## Architecture Decisions

1. **RevenueCat over raw StoreKit** — handles receipt validation, subscription status, analytics, and future Android support in one SDK
2. **OpenRouter over direct API** — model flexibility, single billing, easy fallback between providers
3. **Hono over Express** — lighter, faster, better TypeScript support, runs on edge
4. **On-device OCR first** — privacy-friendly, no extra API cost, lower latency
5. **No auth system** — RevenueCat anonymous user IDs handle subscription identity
6. **No database** — app is stateless; RevenueCat handles subscription state, free count is local

## Directory Structure (planned)

```
What2Say/
  apps/
    mobile/              # Expo React Native app
      app/               # Expo Router pages
      components/        # UI components
      services/          # API calls, OCR, RevenueCat
      hooks/             # Custom hooks
      types/             # Shared TypeScript types
      constants/         # Config, tone presets, pricing
      assets/            # Images, fonts
    backend/             # Hono API server
      src/
        routes/          # API endpoints
        services/        # OpenRouter, RevenueCat validation
        middleware/       # Rate limiting, auth
        types/           # Shared types
        config/          # Environment config
  packages/
    shared/              # Types shared between mobile & backend
```

## API Design

### POST /api/analyze
Request:
```json
{
  "chatContext": "string (the conversation text)",
  "tone": "calm | assertive | cold | funny | romantic | savage | custom",
  "customTone": "string (only if tone=custom)",
  "locale": "auto"
}
```

Response:
```json
{
  "psychology": "Short explanation of what's happening in this conversation",
  "replies": [
    { "label": "Direct", "text": "..." },
    { "label": "Softer", "text": "..." },
    { "label": "Bold", "text": "..." }
  ]
}
```

### POST /api/validate-subscription
Request: RevenueCat user ID
Response: subscription status + remaining free analyses

## Environment Variables

### Mobile (.env)
```
EXPO_PUBLIC_API_URL=         # Backend URL
EXPO_PUBLIC_REVENUECAT_KEY=  # RevenueCat public SDK key
```

### Backend (.env)
```
OPENROUTER_API_KEY=          # OpenRouter API key
REVENUECAT_SECRET_KEY=       # RevenueCat webhook/API secret
ALLOWED_ORIGINS=             # CORS whitelist
RATE_LIMIT_PER_MINUTE=       # Per-device rate limit
PORT=                        # Server port
```

## Non-Negotiable Rules

1. Follow global CLAUDE.md rules (no hardcoding, modular architecture, git discipline)
2. Every config value goes in `constants/config.ts` (mobile) or `config/index.ts` (backend)
3. All types in `types/` directories — never inline
4. Test on a real iOS device before any App Store submission
5. App Store Review Guidelines compliance:
   - Must have a privacy policy URL
   - Must explain AI-generated content to users
   - Must handle subscription restore correctly
   - OCR/photo access requires clear purpose strings in Info.plist
6. Never send raw screenshots to the backend — OCR happens on-device, only text is sent
7. Rate limit both client-side and server-side to control OpenRouter costs
