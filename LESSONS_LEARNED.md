# What2Say - Lessons Learned

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
- For a small app (3 screens), StyleSheet is simpler and has no setup overhead

### 2026-03-07 - Multi-Model AI Routing
- Claude Sonnet via OpenRouter was too cautious for edgy tones (savage, cold)
- GPT-4o handles cold/funny/romantic/savage well but defaults to AI cliches for calm/assertive
- Llama 3.1 70B follows style instructions more literally — better for calm/assertive
- Final routing: GPT-4o for cold/funny/romantic/savage, Llama 3.1 70B for calm/assertive/custom
- Few-shot examples as actual message turns (user/assistant pairs) are FAR more effective than text examples in system prompts
- Anti-cliche blocklists in prompts don't work with GPT-4o — it ignores negative instructions
- The "sounds like" / "does NOT sound like" pattern in tone modifiers helps but isn't enough alone

### 2026-03-07 - Backend .env Loading
- Hono/tsx doesn't auto-load .env files — must use `tsx watch --env-file=.env` flag
- Missing this caused 401 errors that looked like API issues

### 2026-03-07 - Expo Go Emoji Rendering
- Emojis in Text components render as ? boxes in Expo Go on iOS Simulator
- Unicode escapes (\u{1F60C}) and literal emoji characters both fail
- Removed emojis from tone selector; will revisit with development builds later
