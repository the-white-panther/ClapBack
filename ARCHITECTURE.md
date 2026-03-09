# ClapBack - Architecture

## High-Level Flow

```
User Input (text/screenshots + optional context)
        |
        v
  [Mobile App]
   - OCR (on-device, Apple Vision) converts screenshots -> text
   - Multi-photo: select multiple screenshots, OCR each, concatenate
   - User adds optional context ("This is my boss, we've had tension...")
   - App checks: free analyses remaining OR active subscription
        |
        v
  POST /api/clarify { chatContext, additionalContext }
        |
        v
  [Backend - Hono]
   - Validate request
   - Build clarify prompt
   - Call OpenRouter (Gemini 2.5 Flash)
   - Return { questions: ["...", "...", ...] }
        |
        v
  [Mobile App]
   - Display 3-5 clarifying questions inline
   - User answers each question
   - Format answers as Q&A pairs
        |
        v
  POST /api/analyze { chatContext, additionalContext, clarifyingAnswers }
        |
        v
  [Backend - Hono]
   - Build analyze prompt with full context + answers
   - Call OpenRouter (Gemini 3.1 Pro Preview)
   - Parse AI response
   - Return { analysis, recommendation, replies[] }
        |
        v
  [Mobile App]
   - Display analysis card (what's happening)
   - Display recommendation card (how to handle it)
   - Display reply cards (suggested messages to send)
   - User can copy any reply to clipboard
```

## Module Responsibilities

### Mobile App (`apps/mobile/`)

| Module | Responsibility |
|--------|---------------|
| `app/index.tsx` | Home screen: text input, multi-photo OCR, context field |
| `app/results.tsx` | Two-phase flow: questions -> answers -> analysis |
| `app/paywall.tsx` | Static subscription paywall UI |
| `components/AnalysisCard.tsx` | Displays situation analysis |
| `components/RecommendationCard.tsx` | Displays strategic recommendation |
| `components/ReplyCard.tsx` | Displays suggested reply with copy button |
| `components/TextInputArea.tsx` | Multi-line text input for chat context |
| `services/api.ts` | HTTP calls: clarifyChat() + analyzeChat() |
| `services/ocr.ts` | OCR service helper (stub) |
| `services/purchases.ts` | RevenueCat service (stub, not yet wired) |
| `modules/expo-ocr/` | Custom Expo module — Apple Vision OCR (Swift native) |
| `hooks/useAnalysis.ts` | Two-phase state machine (clarify -> answer -> analyze) |
| `contexts/FreeCountContext.tsx` | Free analysis count shared across screens |
| `types/navigation.ts` | Navigation-related TypeScript types |
| `constants/config.ts` | API URL, free analysis limit |

### Backend (`apps/backend/`)

| Module | Responsibility |
|--------|---------------|
| `routes/clarify.ts` | POST /api/clarify — generates clarifying questions |
| `routes/analyze.ts` | POST /api/analyze — full conversation analysis |
| `routes/subscription.ts` | POST /api/validate-subscription (stub) |
| `services/openrouter.ts` | OpenRouter API integration |
| `services/prompt.ts` | Two prompt builders: buildClarifyPrompt + buildAnalyzePrompt |
| `services/revenuecat.ts` | RevenueCat validation (stub, not yet wired) |
| `middleware/rateLimit.ts` | Per-device rate limiting |
| `middleware/validateRequest.ts` | Input validation |
| `config/index.ts` | Environment variables and model config |

### Shared (`packages/shared/`)

| Module | Responsibility |
|--------|---------------|
| `types.ts` | Request/response types (AnalyzeRequest, AnalyzeResponse, ClarifyResponse) |
| `config.ts` | Shared constants |

## Dependency Map

```
Mobile:
  app/ -> components/, hooks/, contexts/, services/
  hooks/ -> services/
  contexts/ -> constants/
  components/ -> (standalone, no cross-imports)
  services/ -> constants/

Backend:
  routes/ -> services/, middleware/, config/, types/
  services/ -> config/, types/
  middleware/ -> types/
```

## External Integrations

| Service | Purpose | Connection |
|---------|---------|-----------|
| OpenRouter | AI completions | Backend -> HTTPS API |
| Gemini 2.5 Flash | Clarifying questions (cheap, fast) | Via OpenRouter |
| Gemini 3.1 Pro Preview | Full analysis (highest intelligence score) | Via OpenRouter |
| Railway | Backend hosting | CLI deploy (`railway up`) |
| Apple Vision | OCR | On-device framework (no network) |
| RevenueCat | Subscription management (planned) | Not yet integrated |

## State Management

- **No global state manager** (no Redux/Zustand)
- Two-phase analysis flow managed by `useAnalysis` hook state machine
- Free count: React Context + AsyncStorage (local, per-device)
- Subscription status: RevenueCat SDK (planned)
- No database on backend — fully stateless

## AI Model Strategy

| Purpose | Model | Cost/1M input | Cost/1M output | Intelligence Score |
|---------|-------|---------------|----------------|-------------------|
| Clarify | Gemini 2.5 Flash | $0.30 | $2.50 | 46.4 |
| Analyze | Gemini 3.1 Pro Preview | $2.00 | $12.00 | 57.2 (#1) |

Estimated cost per full analysis (clarify + analyze): **~$0.015**
