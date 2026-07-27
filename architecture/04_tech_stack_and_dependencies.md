## 1. Languages & Core Runtimes

| Component | Technology | Verified Current Version (Jul 2026) | Notes |
| :--- | :--- | :--- | :--- |
| **Primary Language** | **TypeScript** | `v6.0.x` | TS 6.0 shipped Mar 2026 — the last JS-based compiler release before the Go-based TS 7.0 rewrite. Minor breaking changes vs 5.x (import assertions deprecated). |
| **JS Runtime Engine** | **Node.js** | `v24.x LTS` ("Krypton") | Node 24 became Active LTS in 2026, supported to Apr 2028. Node 22 is now Maintenance LTS only (EOL Apr 2027); Node 26 is Current, not yet LTS until Oct 2026 — don't ship on it yet. |
| **Package Manager** | **Yarn / pnpm** | Yarn `v4.6+` / pnpm `v9.15+` | Largely unchanged; pin exact patch at install time. |
| **Monorepo Build Engine** | **Turborepo** | `v2.10.x` | v2.10.3 shipped Jul 3 2026. |

## 2. Mobile & Desktop App Architecture (`apps/mobile`)

| Domain | Library / Tool | Verified Current Version (Jul 2026) | Notes |
| :--- | :--- | :--- | :--- |
| **Framework** | **Expo SDK** | `v57.x` (React Native `0.86`) | SDK 57 is stable as of this month (RN 0.85→0.86 bump, non-breaking). SDK 56/RN 0.85 is the safer fallback if you want a slightly more battle-tested base. |
| **Navigation & Router** | **Expo Router** | `v5.x` (tracks Expo SDK 57) | Confirm exact version against your SDK — Router majors are tied to SDK majors. |
| **Animations & UI** | **React Native Reanimated** & `react-native-worklets` | `v4.x` / `v0.x` | v4 split the worklets runtime into a separate `react-native-worklets` package — this is a real breaking change vs the v3.16 assumed in the old doc. |
| **Gestures** | **React Native Gesture Handler** | `v2.24+` | Verify against RN 0.86 compatibility table before locking. |
| **Camera & Media** | **`expo-camera` & `expo-image-picker`** | Track Expo SDK 57's bundled versions | Don't pin independently — install via `npx expo install` so Expo resolves the exact native dependencies. |

## 3. Local Data, Utilities & Storage Engine

| Domain | Library / Package | Verified Current Version (Jul 2026) | Notes |
| :--- | :--- | :--- | :--- |
| **High-Speed SQLite JSI** | **`@op-engineering/op-sqlite`** | `v10.3.x` | Direct C++ JSI bindings to SQLite engine. Executes microsecond queries 10x-20x faster than standard async bridges. |
| **Type-Safe ORM & Schemas** | **`drizzle-orm`**, `drizzle-kit` & `zod` | `v0.38.x` / `v3.23.x` | TypeScript ORM and runtime schema validation for block content JSON payloads across React Native and Next.js. |
| **Identifiers & Indexing** | **`uuid` & `fractional-indexing`** | `v10.0.x` / `v3.2.x` | UUID v4 generation for pages/blocks/folders and fractional order indexing for fluid block drag & drop. |
| **Date & Time Utilities** | **`date-fns`** | `v4.1.x` | Lightweight locale-aware date manipulation and formatting supporting Universal Date-Time Axis queries. |

## 4. On-Device AI, Audio & Intelligence Pipeline

| Domain | Library / Package | Verified Current Version (Jul 2026) | Notes |
| :--- | :--- | :--- | :--- |
| **Vector Embeddings Execution** | **`onnxruntime-react-native`** | `v1.20.x` | Hardware-accelerated ONNX runtime executing `all-MiniLM-L6-v2` 384-dim embeddings directly on iOS (CoreML) and Android (NNAPI). |
| **Offline Audio Speech-to-Text** | **`whisper.rn`** | `v1.8.x` | React Native binding for OpenAI Whisper (C++ `whisper.cpp`), delivering fully offline voice recording transcription. |
| **Offline Audio Speech Synthesis** | **`expo-speech`** | Track Expo SDK 57 | Local offline note text-to-speech (TTS) synthesis engine for background audio playback. |

## 5. Rich Text Editor & Math Rendering Engine

| Domain | Library / Package | Verified Current Version (Jul 2026) | Notes |
| :--- | :--- | :--- | :--- |
| **Notion-Grade Block Editor** | **`@tiptap/react` & `@tiptap/core`** | `v2.11.x` | ProseMirror-based headless block editor engine. Powering web native editor and WebView mobile bridge. |
| **LaTeX Formula Rendering** | **`katex` & `react-native-katex`** | `v0.16.x` | High-performance KaTeX math formula parsing and visual block rendering. |

## 6. GPU Graphics, Canvas, Media & PDF Engine

| Domain | Library / Package | Verified Current Version (Jul 2026) | Notes |
| :--- | :--- | :--- | :--- |
| **GPU Drawing Canvas** | **`@shopify/react-native-skia`** | `v1.5.x` | 60FPS GPU Skia drawing engine for infinite canvas and freehand stylus input. |
| **PDF Viewing & Highlighting** | **`react-native-pdf` & `pdfjs-dist`** | `v6.7.x` / `v4.10.x` | Multi-page PDF viewport renderer, text extraction layer, and highlight annotation tracker. |
| **Media, Storage & Inputs** | **`expo-file-system`, `expo-clipboard`, `expo-haptics`** | Track Expo SDK 57 | Offline file storage, automated system clipboard detection, and tactile haptic feedback for user interactions. |

## 7. Cloud Sync, CRDT & Security Infrastructure

| Domain | Library / Package | Verified Current Version (Jul 2026) | Notes |
| :--- | :--- | :--- | :--- |
| **Local-First Cloud Relay** | **`@powersync/react-native`** | `v1.8.x` | Local SQLite-to-Cloud PostgreSQL WebSocket streaming sync engine. |
| **Cloud Identity & Auth** | **`@supabase/supabase-js`** | `v2.48.x` | Supabase Auth client, OAuth flow handlers, and JWT access token manager for cloud sync. |
| **Real-Time CRDT Engine** | **`yjs` & `y-websocket`** | `v13.6.x` / `v0.2.x` | Shared document CRDT timeline merge algorithm for real-time multiplayer collaboration. |
| **Hardware Vault Security** | **`react-native-keychain` & `expo-local-authentication`** | `v9.0.x` / `v15.x` | AES-256 Keychain/Keystore hardware enclave storage and FaceID/TouchID biometric unlock handler. |

## 8. Algorithms, Notifications & Monetization SDKs

| Domain | Library / Package | Verified Current Version (Jul 2026) | Notes |
| :--- | :--- | :--- | :--- |
| **Spaced Repetition Scheduler** | **`ts-fsrs`** | `v5.0.x` | Free Spaced Repetition Scheduler algorithm engine calculating memory stability and flashcard review intervals. |
| **In-App Billing & Subscriptions** | **`react-native-purchases`** | `v8.5.x` | RevenueCat SDK managing Apple App Store / Google Play In-App Purchases, free trial state, and Pro subscriptions. |
| **Ad-Supported Free Tier** | **`react-native-google-mobile-ads`** | `v14.x` | Google Mobile Ads SDK rendering non-intrusive banner ads on non-sensitive app screens. |
| **Push Notifications & Alerts** | **`expo-notifications`** | Track Expo SDK 57 | Local push notification dispatcher for task reminders and due-date alerts. |