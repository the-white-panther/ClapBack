# ClapBack - Lessons Learned

## Decisions

### 2026-03-05 - Initial Architecture Decisions
- Chose React Native + Expo over Swift for future Android portability
- Chose RevenueCat over raw StoreKit to avoid subscription validation complexity
- Chose OpenRouter for model flexibility and single billing
- Chose Hono over Express for lighter, faster backend
- Chose on-device OCR to avoid sending images to server (privacy + cost)
- No database needed — app is stateless by design
- No auth system — RevenueCat anonymous IDs are sufficient

### 2026-03-07 - NativeWind v4 Dropped
- NativeWind v4 doesn't work in Expo Go (requires development build + CocoaPods)
- NativeWind v2 has peer dependency conflicts with React 19 / Expo SDK 55
- Switched to React Native StyleSheet.create() — zero dependencies, works everywhere

### 2026-03-07 - Backend .env Loading
- Hono/tsx doesn't auto-load .env files — must use `tsx watch --env-file=.env` flag
- Missing this caused 401 errors that looked like API issues

### 2026-03-07 - Screenshot OCR via Custom Expo Module
- Apple Vision (VNRecognizeTextRequest) runs on-device — no API cost, no privacy concerns
- Required a custom Expo module (`modules/expo-ocr/`) using expo-modules-core
- Swift bridges to JS via AsyncFunction + Promise pattern
- This means Expo Go is no longer usable — must use dev builds (`npx expo run:ios`)
- Module needs: package.json + podspec + expo-module.config.json for autolinking
- Must be added as `"expo-ocr": "file:./modules/expo-ocr"` in package.json dependencies
- Do NOT add to app.json plugins — autolinking handles it via node_modules

### 2026-03-07 - CocoaPods + Spaces in Paths
- CocoaPods/React Native prebuild fails if the project path contains spaces
- Renamed parent folder from "Vibe Coding" to "VibeCoding" to fix
- System Ruby 2.6 is too old for the `ffi` gem required by CocoaPods — install via Homebrew instead

### 2026-03-07 - Product Pivot: General Difficult Conversations
- Originally positioned as "reply to your ex" — too narrow
- Pivoted to "handle any difficult conversation" (work, family, friends, neighbors, etc.)
- Removed tone selector (calm/assertive/cold/funny/romantic/savage)
- New output format: analysis + recommendation + replies (was: psychology + replies)
- Much broader market appeal

### 2026-03-07 - Two-Phase Clarify Flow
- Single-shot analysis with limited context produced inaccurate, guessing responses
- Added mandatory clarifying questions step: AI asks 3-5 questions before analyzing
- Two API calls per analysis: /api/clarify (cheap model) -> /api/analyze (smart model)
- Dramatically improved analysis quality — AI no longer guesses
- UX: questions shown inline (not modal), user answers text inputs, then submits

### 2026-03-07 - AI Language Detection
- AI was responding in English even when conversation was in Spanish
- Added explicit CRITICAL language rule to system prompt
- Must detect conversation language and write EVERYTHING in that language
- Including reply labels (Direct -> Directo, etc.)

### 2026-03-08 - AI Model Selection
- GPT-4o: decent but not the best for nuanced emotional analysis
- Claude Sonnet 4: great empathy but expensive ($3/$15 per 1M tokens)
- Gemini 3.1 Pro Preview: #1 intelligence score (57.2) at $2/$12 — best value
- Gemini 2.5 Flash: cheap ($0.30/$2.50) and fast — perfect for clarifying questions
- Final setup: Flash for clarify, Gemini 3.1 Pro for analyze — ~$0.015 per analysis
- At this cost, break-even is 87+ analyses/week per monthly subscriber (impossible in normal use)

### 2026-03-08 - Railway Deployment
- Railway GitHub integration had issues detecting the repo — used CLI instead
- `railway init` + `railway up` from apps/backend/ directory works reliably
- Must `railway service <name>` to link before setting variables
- `railway variables set KEY=VALUE` for env vars
- `railway domain` to generate public URL
- Multi-stage Dockerfile (node:20-alpine) keeps image small

## Cost Analysis

### Per Analysis Cost
- Clarify (Gemini 2.5 Flash): ~$0.0006
- Analyze (Gemini 3.1 Pro): ~$0.014
- Total: ~$0.015 per analysis

### Revenue per Subscriber (post-Apple 30%)
- Weekly $1.99 -> $1.39/week
- Monthly $6.99 -> $4.89/month
- Yearly $39.99 -> $27.99/year

### Margin
- Monthly subscriber doing 30 analyses/month: $4.89 revenue - $0.45 AI cost = $4.44 profit (91% margin)
