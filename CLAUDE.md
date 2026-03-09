# ClapBack - Project CLAUDE.md

## Project Overview

ClapBack is an iOS app that helps people handle difficult conversations — work conflicts, family drama, friend issues, neighbor disputes, anything. Users paste chat text or upload screenshots (multi-photo OCR), add context about the situation, and get AI-powered analysis: what's happening, how to handle it strategically, and suggested reply messages. The AI always asks clarifying questions first before giving its analysis.

## Product Rules

- Input: text paste OR multi-screenshot (OCR via Apple Vision framework, on-device)
- Two-phase flow: AI asks 3-5 clarifying questions first, then gives full analysis
- Output per analysis: situation analysis + strategic recommendation + 3 reply alternatives
- No tones — AI adapts naturally to the conversation context
- No conversation history — every analysis is one-shot
- No user accounts — anonymous usage, subscription via StoreKit
- AI writes in whatever language the user's chat is in (auto-detected)
- Free tier: 2 free analyses (stored locally), then paywall
- Pricing: $1.99/week, $6.99/month, $39.99/year

## Tech Stack

### Mobile (Frontend)
- **React Native** with **Expo** (SDK 55)
- **TypeScript** — strict mode, no `any`
- **Expo Router** — file-based navigation
- **expo-image-picker** — for screenshot selection
- **react-native-purchases (RevenueCat)** — StoreKit subscription management
- **AsyncStorage** — track free analysis count locally
- **StyleSheet** — React Native built-in styling (NativeWind dropped due to Expo Go incompatibility)

### Backend
- **Node.js** with **Hono** (lightweight, fast, edge-ready)
- **TypeScript** — shared types with frontend where possible
- Deployed on **Railway** (CLI deploy via `railway up`)
- Production URL: `https://jubilant-celebration-production.up.railway.app`
- Responsibilities:
  - Two-phase AI flow: /api/clarify + /api/analyze
  - Proxy AI requests (protect API key)
  - Validate RevenueCat subscription receipts (planned)
  - Rate limiting

### AI
- **OpenRouter** as the AI gateway
- Two-model strategy:
  - **Gemini 2.5 Flash** (OPENROUTER_MODEL_CHEAP) → clarifying questions (fast, cheap)
  - **Gemini 3.1 Pro Preview** (OPENROUTER_MODEL_DEFAULT) → full analysis (#1 intelligence score)
- Cost per analysis: ~$0.015

### OCR
- **Apple Vision framework** via custom Expo module (`modules/expo-ocr/`)
- Swift native bridge using expo-modules-core (AsyncFunction + Promise)
- Runs on-device — no server round-trip for OCR
- Requires dev builds (`npx expo run:ios`) — no Expo Go

## Architecture Decisions

1. **RevenueCat over raw StoreKit** — handles receipt validation, subscription status, analytics, and future Android support in one SDK
2. **OpenRouter over direct API** — model flexibility, single billing, easy fallback between providers
3. **Hono over Express** — lighter, faster, better TypeScript support, runs on edge
4. **On-device OCR first** — privacy-friendly, no extra API cost, lower latency
5. **No auth system** — RevenueCat anonymous user IDs handle subscription identity
6. **No database** — app is stateless; RevenueCat handles subscription state, free count is local

## Directory Structure

```
ClapBack/
  apps/
    mobile/              # Expo React Native app
      app/               # Expo Router pages (index, results, paywall)
      components/        # UI components (AnalysisCard, RecommendationCard, ReplyCard, TextInputArea)
      contexts/          # React Contexts (FreeCountContext)
      hooks/             # Custom hooks (useAnalysis)
      services/          # API calls, OCR, RevenueCat stubs
      types/             # TypeScript types (navigation)
      constants/         # Config (API URL, free analysis limit)
      modules/expo-ocr/  # Custom Expo module — Apple Vision OCR (Swift native)
      assets/            # Images, fonts
    backend/             # Hono API server
      src/
        routes/          # API endpoints (clarify, analyze, subscription)
        services/        # OpenRouter, prompt builders, RevenueCat stub
        middleware/       # Rate limiting, request validation
        types/           # Request/response types
        config/          # Environment variables and model config
  packages/
    shared/              # Types shared between mobile & backend
```

## API Design

### POST /api/clarify
Request:
```json
{
  "chatContext": "string (the conversation text)",
  "additionalContext": "string (optional user context)"
}
```
Response:
```json
{
  "questions": ["question 1", "question 2", "..."]
}
```

### POST /api/analyze
Request:
```json
{
  "chatContext": "string (the conversation text)",
  "additionalContext": "string (optional user context)",
  "clarifyingAnswers": "string (formatted Q&A pairs)"
}
```
Response:
```json
{
  "analysis": "What's happening in this conversation",
  "recommendation": "Strategic advice on how to handle it",
  "replies": [
    { "label": "Direct", "text": "..." },
    { "label": "Softer", "text": "..." },
    { "label": "Bold", "text": "..." }
  ]
}
```

### POST /api/validate-subscription (stub)
Request: RevenueCat user ID
Response: subscription status

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
