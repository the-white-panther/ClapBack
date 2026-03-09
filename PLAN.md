# ClapBack - Sprint Roadmap

## Context

Sprint 1 delivered the core AI analysis pipeline (home -> analyze -> results with copy). Sprint 2 added the two-phase clarify flow, product pivot, backend deployment, and OCR working on device. Next: monetization and App Store.

---

## Sprint 1: Project Skeleton ✅ COMPLETADO

**Goal:** Monorepo funcional con flujo básico end-to-end.

### Lo que se hizo

1. **Monorepo** — apps/mobile + apps/backend + packages/shared
2. **Home screen** — text input + screenshot selection (single photo)
3. **Results screen** — mostraba psychology card + reply cards
4. **Paywall screen** — UI estática
5. **Backend** — Hono server, /api/analyze, OpenRouter (GPT-4o)
6. **Tone selector** — 6 presets (eliminado en Sprint 2)
7. **NativeWind dropped** — cambiado a StyleSheet.create()
8. **Custom OCR module** — expo-ocr con Apple Vision (estructura base)

---

## Sprint 2: Core Loop + Backend Deploy ✅ COMPLETADO

**Goal:** Free count enforced, UX completo, backend deployed. App funcional en dispositivo real.

### Lo que se hizo

1. **Product pivot** — de "responder a tu ex" a "manejar conversaciones difíciles" (trabajo, familia, amigos, vecinos)
2. **Tones eliminados** — sin selector de tono, AI se adapta al contexto
3. **Two-phase clarify flow** — AI siempre pregunta 3-5 preguntas antes de analizar
   - Nuevo endpoint: `POST /api/clarify` (Gemini 2.5 Flash)
   - `POST /api/analyze` actualizado con `clarifyingAnswers`
   - Hook `useAnalysis`: state machine (idle → clarifying → answering → analyzing → done | error)
4. **OCR funcional** — Apple Vision, multi-foto, autolinking con package.json + podspec
5. **FreeCountContext** — React Context reemplaza hook antiguo, compartido entre pantallas
6. **Free count enforced** — badge en home, redirect a paywall cuando llega a 0
7. **Backend deployed en Railway** — `https://jubilant-celebration-production.up.railway.app`
8. **AI models optimizados** — Gemini Flash (clarify) + Gemini 3.1 Pro Preview (analyze) — ~$0.015/análisis
9. **Language detection** — AI responde en el idioma de la conversación
10. **Nuevos componentes** — AnalysisCard, RecommendationCard (reemplazaron PsychologyCard)

---

## Sprint 3: RevenueCat + Pagos Reales

**Goal:** Usuarios pueden suscribirse y pagar. Paywall funcional.

**Status:** ⏳ Bloqueado — esperando aprobación DUNS de Apple Developer

### Prerequisitos manuales (antes de codear)
- Apple Developer Account configurada
- App Store Connect: crear app, bundle ID real, 3 productos de suscripción auto-renewable
- RevenueCat: crear proyecto, configurar entitlements + offerings
- Obtener API keys (pública para mobile, secreta para backend)

### Tasks

1. **Instalar RevenueCat SDK** (`package.json`, `app.json`)
   - Agregar `react-native-purchases`
   - Plugin en app.json

2. **Implementar purchases service** (`services/purchases.ts` - rewrite completo)
   - `initializePurchases()`, `checkSubscription()`, `purchaseSubscription()`, `restorePurchases()`, `getOfferings()`

3. **Inicializar RevenueCat** (`_layout.tsx`)

4. **Paywall funcional** (`app/paywall.tsx` - rewrite)
   - Fetch offerings dinámicos de RevenueCat
   - Flujo de compra real
   - Botón "Restore Purchases" (requerido por App Store)
   - Texto de términos de suscripción

5. **Hook de suscripción** (nuevo `hooks/useSubscription.ts`)
   - Si suscrito, bypass del free count

6. **Validación backend** (`services/revenuecat.ts` - rewrite)
   - Llamada real a RevenueCat REST API
   - Verificar en `/api/analyze` antes de procesar

7. **Bundle ID real** (`app.json`)

**Resultado:** App con pagos reales. Free tier -> paywall -> suscripción funciona end-to-end.

---

## Sprint 4: Polish + App Store Prep

**Goal:** App profesional, todos los assets listos para submission.

### Tasks

1. **UI polish**
   - Animaciones de entrada en cards (fade-in escalonado)
   - Haptic feedback en copy y acciones clave (`expo-haptics`)
   - Mejorar loading state (skeleton loader o tips rotativas)
   - Mejorar diseño visual del paywall (feature list, trust badges)

2. **Error handling mejorado** (`services/api.ts`)
   - Timeout, mensajes claros para errores comunes (offline, rate limited, server error)

3. **App icon + splash screen**
   - Diseñar icono 1024x1024
   - Actualizar assets y `app.json`

4. **Privacy policy**
   - Crear y hostear (GitHub Pages o similar)
   - Cubrir: datos enviados al server, AI disclosure, no datos personales guardados

5. **EAS Build config** (nuevo `eas.json`)
   - Perfiles: development, preview, production

6. **Limpiar app.json**
   - Quitar permisos Android innecesarios (RECORD_AUDIO)
   - Verificar todos los campos requeridos

**Resultado:** App pulida y profesional, lista para review.

---

## Sprint 5: App Store Submission + Post-Launch

**Goal:** App live en el App Store.

### Tasks

1. **Build de producción + TestFlight**
   - `eas build --platform ios --profile production`
   - Testing completo en dispositivo real via TestFlight

2. **App Store Connect**
   - Upload build
   - Descripción, keywords, screenshots, privacy policy URL
   - AI content disclosure
   - Submit for review

3. **Device ID para rate limiting** (`services/api.ts`, `middleware/rateLimit.ts`)
   - ID anónimo estable via `expo-application`

4. **Analytics básicos** (opcional)
   - RevenueCat built-in analytics o Posthog
   - Tracking: analysis requested, paywall shown, purchase completed

**Resultado:** App live en el App Store.

---

## Dependencias entre sprints

```
Sprint 2 (Core Loop + Deploy)        ✅ DONE
    |
    v
Sprint 3 (RevenueCat + Pagos)        ⏳ Blocked (Apple DUNS)
    |
    v
Sprint 4 (Polish + Prep)
    |
    v
Sprint 5 (Submission)
```

Cada sprint es independientemente valioso — la app mejora después de cada uno.

---

## Recordatorios

- `FREE_ANALYSIS_LIMIT` está en 50 para testing → bajar a 2 antes de App Store
- Sprint 4 se puede adelantar parcialmente (UI polish, error handling) sin depender de Sprint 3
