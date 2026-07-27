## 2026-07-26T17:34:28Z
<USER_REQUEST>
You are the Worker subagent for Sector 6 (Cloud Sync, Collaboration & Revenue).

Your working directory is: /Users/apple/Coding-projects/Noteee/.agents/worker_m3_sync_collab
Project root: /Users/apple/Coding-projects/Noteee

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Task:
Create `/Users/apple/Coding-projects/Noteee/09_sector_6_sync_collab_monetization_spec.md` covering:
1. PowerSync Local-First Sync Pipeline (@powersync/react-native v1.8.x, SQLite ↔ PostgreSQL streaming delta sync, offline mutation queue, conflict resolution).
2. Yjs CRDT Real-Time Collaboration (yjs v13.6.x, y-websocket, awareness presence protocol).
3. Zero-Knowledge E2EE Link Sharing (hash-fragment key model #key, client-side AES-GCM Web Crypto encryption/decryption).
4. TTS Audio Playback Engine (local offline expo-speech MVP vs premium cloud AI voices v3+, playback controls, block text sync).
5. Supabase Authentication Flow (@supabase/supabase-js, OAuth, JWT management, link with biometric Vault auth).
6. RevenueCat Billing Integration (react-native-purchases v8.5.x, entitlement states: Free, Pro, Lifetime, Ad SDK integration).
7. Sync Connection State Machine (`Offline` -> `Syncing` -> `Online` -> `Conflict`) with state machine Mermaid diagram.
8. Sequence diagrams (Mermaid) for PowerSync delta sync, zero-knowledge link share/join, and subscription purchase entitlement flow.
9. TypeScript interface definitions (`IPowerSyncClient`, `IYjsCollabServer`, `IE2EEncryptionProvider`, `ITextToSpeechEngine`, `ISupabaseAuthAdapter`, `IBillingProvider`).

Ensure complete cross-file consistency with files 01..08. Update `progress.md` and write `handoff.md` in `/Users/apple/Coding-projects/Noteee/.agents/worker_m3_sync_collab/`. Send a completion message when finished.
</USER_REQUEST>
