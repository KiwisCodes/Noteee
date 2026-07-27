## 2026-07-26T16:39:39Z

<USER_REQUEST>
You are worker_m6_shipping for Noteee.
Your working directory is: /Users/apple/Coding-projects/Noteee/.agents/worker_m6_shipping
Your task is to create the complete specification file: `/Users/apple/Coding-projects/Noteee/17_app_shipping_monetization_spec.md`.

Context: Noteee is an offline-first, capture-first, AI-powered notebook monorepo built with TypeScript, React Native (Expo SDK 57), and Next.js 15.

Requirements for `17_app_shipping_monetization_spec.md`:
Enforce strict SOLID, DIP (Dependency Inversion Principle), Clean Architecture, GOF Design Patterns, and Production Pain-Point Analysis ("What pain points lead to this problem and how does our pattern resolve it?") in all sections.

1. App Store (iOS) & Google Play Store Submission:
   - Guidelines, metadata, native iOS (`Info.plist`) & Android (`AndroidManifest.xml`) permissions manifests (Camera, Microphone, Photo Library, Speech Recognition, Local Notifications, Dynamic Island / Live Activities).
   - In-app rating review triggers (`expo-store-review` rules: trigger after 3 completed captures or 5 flashcard review sessions, never prompt after errors).

2. Monetization Engine (RevenueCat Integration):
   - Tiered billing model: 90-day free trial, ad-supported free tier (AdMob banner constraints, frequency caps), lifetime unlock, Pro subscription (monthly/annual).
   - BYOK (Bring Your Own Key) API key manager encrypted in iOS Keychain / Android Keystore via `expo-secure-store`.
   - Pay-As-You-Go AI credit packs.
   - Interfaces: `IBillingAdapter`, `IKeyStoreManager`, `IUsageQuotaTracker`.

3. Analytics, Telemetry & Observability:
   - Sentry error monitoring with PII scrubbing, telemetry metrics pipeline, feature flag toggle system, experiment analytics.
   - `IObservabilityService` interface.

4. Architecture Diagrams:
   - Include at least 2 complete, 100% valid Mermaid diagrams:
     - Sequence diagram for RevenueCat Subscription & BYOK Fallback Execution.
     - State Machine diagram for User Subscription Lifecycle & Entitlements.

5. Full TypeScript Interfaces & Code Contracts (Clean Architecture, DIP).

MANDATORY INTEGRITY WARNING: DO NOT CHEAT. All implementations must be genuine and production-ready. DO NOT leave placeholders, TODOs, or incomplete sections. DO NOT break Mermaid diagram syntax (ensure no unescaped special characters or semicolons inside node labels).

When completed, create `progress.md` and `handoff.md` in `/Users/apple/Coding-projects/Noteee/.agents/worker_m6_shipping/` and notify parent via `send_message`.
</USER_REQUEST>
