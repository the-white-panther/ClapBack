# What2Say - Architecture

## High-Level Flow

```
User Input (text/screenshot)
        |
        v
  [Mobile App]
   - OCR (on-device, Apple Vision) converts screenshot -> text
   - User selects tone (preset or custom)
   - App checks: free analyses remaining OR active subscription
        |
        v
  POST /api/analyze { chatContext, tone }
        |
        v
  [Backend - Hono]
   - Validate subscription via RevenueCat API
   - Rate limit check
   - Build prompt with chat context + tone + system instructions
   - Call OpenRouter API
   - Parse AI response
   - Return { psychology, replies[3] }
        |
        v
  [Mobile App]
   - Display psychology insight
   - Display 3 reply options
   - User can copy any reply to clipboard
```

## Module Responsibilities

### Mobile App (`apps/mobile/`)

| Module | Responsibility |
|--------|---------------|
| `app/` | Expo Router screens (home, results, paywall) |
| `components/` | Reusable UI (TextInput, ToneSelector, ReplyCard, PaywallModal) |
| `services/api.ts` | HTTP calls to backend |
| `services/ocr.ts` | On-device OCR via Apple Vision |
| `services/purchases.ts` | RevenueCat initialization and subscription checks |
| `hooks/useAnalysis.ts` | Orchestrates input -> API call -> results |
| `hooks/useFreeCount.ts` | Tracks remaining free analyses in AsyncStorage |
| `types/` | All shared TypeScript interfaces |
| `constants/config.ts` | API URL, tone presets, free analysis limit |

### Backend (`apps/backend/`)

| Module | Responsibility |
|--------|---------------|
| `routes/analyze.ts` | POST /api/analyze endpoint |
| `routes/subscription.ts` | POST /api/validate-subscription |
| `services/openrouter.ts` | OpenRouter API integration |
| `services/revenuecat.ts` | RevenueCat receipt/subscription validation |
| `services/prompt.ts` | AI prompt construction |
| `middleware/rateLimit.ts` | Per-device rate limiting |
| `middleware/validateRequest.ts` | Input validation and sanitization |
| `config/index.ts` | Environment variables and constants |

### Shared (`packages/shared/`)

| Module | Responsibility |
|--------|---------------|
| `types.ts` | Request/response types used by both mobile and backend |
| `tones.ts` | Tone definitions (labels, system prompt modifiers) |

## Dependency Map

```
Mobile:
  app/ -> components/, hooks/
  hooks/ -> services/, types/
  components/ -> types/, constants/
  services/ -> types/, constants/

Backend:
  routes/ -> services/, middleware/, types/
  services/ -> config/, types/
  middleware/ -> config/

Shared:
  packages/shared/ <- used by both mobile and backend
```

## External Integrations

| Service | Purpose | Connection |
|---------|---------|-----------|
| OpenRouter | AI completions | Backend -> HTTPS API |
| RevenueCat | Subscription management | Mobile SDK + Backend API validation |
| Apple Vision | OCR | On-device framework (no network) |
| App Store Connect | Distribution + IAP | Via EAS Build + RevenueCat |

## State Management

- **No global state manager** (no Redux/Zustand needed)
- Analysis flow is one-shot: input -> result -> done
- Free count: AsyncStorage (local, per-device)
- Subscription status: RevenueCat SDK (cached locally, validated server-side)
- No database on backend — fully stateless
