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
