# Noteee: System Sequence Diagrams Specification

## 1. Executive Summary & Architectural Overview

This document provides the definitive, comprehensive software sequence diagrams specification for **Noteee**, covering all 11 core operational workflows of the system architecture. Operating under Noteee's foundational principles—**ultra-fast zero-friction capture, offline-first local execution, Notion-grade hybrid block editing, state-of-the-art FSRS spaced repetition, zero-knowledge end-to-end encryption (E2EE), local-first cloud synchronization, agentic RAG reasoning, GPU canvas rendering, BullMQ job guardrails, and BYOK monetization**—these diagrams map out component lifelines, microsecond inter-module communications, transactional state boundaries, and data flows.

### Summary of Covered Workflows

| # | Workflow Name | Core Components & Lifelines | Primary Focus & SLA |
| :---: | :--- | :--- | :--- |
| **1** | **First-Launch Onboarding** | User $\rightarrow$ App UI $\rightarrow$ Auth Service $\rightarrow$ Local DB Migrations $\rightarrow$ RevenueCat Check $\rightarrow$ Initial Sync Pull | App bootstrap, Drizzle schema migration, 7 System Anchors seeding, AI orientation chat, billing check, initial hydration. |
| **2** | **Full Capture Session Lifecycle** | User $\rightarrow$ Capture UI $\rightarrow$ `ICaptureSource` $\rightarrow$ Audio Engine $\rightarrow$ Whisper STT $\rightarrow$ ONNX Embedder $\rightarrow$ SQLite Write $\rightarrow$ PowerSync Outbox | Zero-friction ingress ($\le 1.5\text{s}$), offline Whisper transcription JSI, ONNX embedding generation, 3 placement pathways, local persistence. |
| **3** | **Note Editing & Auto-Save** | User $\rightarrow$ Block Editor UI $\rightarrow$ TipTap RPC Bridge $\rightarrow$ Yjs Doc Update $\rightarrow$ Local SQLite Write $\rightarrow$ PowerSync Local Push | Microsecond JSI RPC protocol, ProseMirror document mutation, Yjs CRDT binding, sub-3ms local SQLite write, outbox background sync. |
| **4** | **Semantic Search Query** | User $\rightarrow$ Search Bar $\rightarrow$ ONNX Embedder $\rightarrow$ Vector Engine (`sqlite-vec`) $\rightarrow$ FTS5 BM25 $\rightarrow$ Hybrid RRF Ranker | Sub-500ms query resolution across 10,000 notes, parallel dense vector + sparse BM25 retrieval, Reciprocal Rank Fusion ($k=60$). |
| **5** | **Flashcard Study Session** | User $\rightarrow$ Flashcard UI $\rightarrow$ `FSRSScheduler` $\rightarrow$ Due Fetch $\rightarrow$ Flip Card $\rightarrow$ Rating $\rightarrow$ Compute $S', D', I$ $\rightarrow$ DB Save | FSRS v5.0.x spaced repetition execution, stability/difficulty updates, optimal interval computation ($R=0.90$), review log audit trail. |
| **6** | **Multi-Device Sync Conflict Resolution** | Device A & B Offline Edit $\rightarrow$ Reconnect $\rightarrow$ PowerSync / Yjs CRDT LWW & Array Merge $\rightarrow$ Reconciled State | Local-first outbox queues (`ps_crud`), exponential backoff reconnect, 3-tier conflict resolution (Metadata LWW, Block CRDT, Fractional Indexing). |
| **7** | **Collaboration Link Share & Join** | Owner $\rightarrow$ Generate Token Link $\rightarrow$ Guest Link Click $\rightarrow$ Supabase Auth Verification $\rightarrow$ Yjs Room Join $\rightarrow$ Encrypted Stream | Zero-knowledge E2EE (AES-GCM-256), URL hash fragment key isolation, WebSocket relay streaming, Yjs awareness cursor sync. |
| **8** | **Multi-Modal Agentic RAG Execution** | User $\rightarrow$ App UI $\rightarrow$ `AgenticRagOrchestrator` $\rightarrow$ `HybridRrfRetriever` $\rightarrow$ LLM Gateway $\rightarrow$ `ReflectiveEvaluator` | Hierarchical chunking, dense + sparse RRF fusion, reflective evaluation loop for self-correction before streaming final synthesis. |
| **9** | **Canvas Rendering & Handwriting Search** | Stylus $\rightarrow$ Skia Canvas Engine $\rightarrow$ Spatial R-Tree Index $\rightarrow$ SQLite Write $\rightarrow$ Vision OCR $\rightarrow$ FTS5 Handwriting Search | 60FPS GPU Skia stroke drawing, $O(\log N)$ R-Tree spatial indexing, offline Vision OCR, bounding box text search. |
| **10** | **BullMQ Async Job & Safety Guardrails** | App / Hono API $\rightarrow$ BullMQ Queue $\rightarrow$ Redis DB 2 $\rightarrow$ Worker Node $\rightarrow$ Safety Guardrail Chain $\rightarrow$ PostgreSQL | Distributed BullMQ background job execution, PII scrubbing, prompt injection canary detection, XSS sanitization. |
| **11** | **Subscription Purchase & BYOK Fallback** | User $\rightarrow$ Billing UI $\rightarrow$ RevenueCat SDK $\rightarrow$ Storekit / Play Store $\rightarrow$ BYOK KeyManager $\rightarrow$ Cloud AI Gateway | RevenueCat subscription purchasing, receipt verification, hardware enclave encrypted BYOK key fallback management. |

---

## 2. Component & Interface Mapping Matrix

All sequence diagrams strictly adhere to the technology stack, interface contracts, and database schemas specified in documents `01_original_feature_list.md` through `17_app_shipping_monetization_spec.md`.

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
────────────────────────────── Noteee Architecture Lifeline Layers ─────────────────────────────────
├──────────────────────────┬──────────────────────────────────────┬─────────────────────────────────┤
│ Layer / Domain           │ Core Class / Module Interface        │ Primary DB / Network Schema     │
├──────────────────────────┼──────────────────────────────────────┼─────────────────────────────────┤
│ **Presentation & UI**    │ `BlockEditorUI`, `QuickCaptureUI`,   │ React Native / TipTap WebView   │
│                          │ `SearchUI`, `FlashcardStudyUI`,      │ JSI RPC Bridge                  │
│                          │ `@noteee/skia-canvas` Engine         │ `@shopify/react-native-skia`    │
├──────────────────────────┼──────────────────────────────────────┼─────────────────────────────────┤
│ **Bridge & Execution**   │ `ITipTapBridge`, `whisper.rn`,       │ JSI C++ Direct Bindings         │
│                          │ `onnxruntime-react-native`           │ `@op-engineering/op-sqlite`     │
├──────────────────────────┼──────────────────────────────────────┼─────────────────────────────────┤
│ **Intelligence & RAG**   │ `IEmbedder`, `IRagEngine`,           │ `folder_vectors`, `page_vectors`│
│                          │ `HybridRrfRetriever`, `ts-fsrs`      │ `all-MiniLM-L6-v2` ONNX Int8    │
├──────────────────────────┼──────────────────────────────────────┼─────────────────────────────────┤
│ **Data & Storage**       │ `INoteRepository`, Drizzle ORM,      │ `folders`, `pages`, `blocks`,   │
│                          │ `IStrokeSpatialIndex`, R-Tree        │ `canvas_strokes`, `flashcards`  │
├──────────────────────────┼──────────────────────────────────────┼─────────────────────────────────┤
│ **Sync & Monetization**  │ `PowerSyncBackendConnector`,         │ PowerSync Outbox (`ps_crud`),   │
│                          │ `IJobQueueAdapter`, `IBillingAdapter`│ Redis DB 0-3, RevenueCat API    │
└──────────────────────────┴──────────────────────────────────────┴─────────────────────────────────┘
```

---

## 3. Workflow 1: First-Launch Onboarding & System Initialization

### 3.1 Mermaid Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant App as Noteee App UI (React Native)
    participant Auth as Supabase Auth Service
    participant KeyStorage as Native Secure Storage (Keychain/Keystore)
    participant DB as Local SQLite DB (op-sqlite)
    participant Anchors as System Anchor Initializer
    participant AI as Local Onboarding AI Engine
    participant RC as RevenueCat Billing SDK (react-native-purchases)
    participant Sync as PowerSync Backend Connector

    User->>App: Launch Noteee App (First Time)
    activate App
    App->>Auth: getSession() / Anonymous Authentication
    activate Auth
    Auth-->>App: Return User Auth Session & JWT Token
    deactivate Auth

    App->>KeyStorage: Store JWT Token securely
    activate KeyStorage
    KeyStorage-->>App: Acknowledge Token Persistence
    deactivate KeyStorage

    App->>DB: Execute Drizzle ORM Migrations (noteee.db)
    activate DB
    DB->>DB: Create Tables (folders, pages, blocks, capture_sessions, etc.)
    DB-->>App: Database Schema Migrated Successfully
    deactivate DB

    App->>Anchors: Seed 7 Mandatory System Anchors
    activate Anchors
    Anchors->>DB: Insert System Folders & Views (Daily Notes, Miscellaneous, Vault, etc.)
    DB-->>Anchors: Confirm 7 Anchors Initialized
    Anchors-->>App: Anchor Seeding Complete
    deactivate Anchors

    App->>AI: Initialize Onboarding Orientation Chat
    activate AI
    AI->>User: Display Orientation Questions & Propose Folder Tree Templates
    User-->>AI: Select Template (e.g. Academic / Engineering)
    AI->>DB: Inject Selected Folder Tree Structure
    DB-->>AI: Confirm Tree Hydrated
    AI-->>App: Onboarding Customization Complete
    deactivate AI

    App->>RC: configure(apiKey, userId) & checkEntitlements()
    activate RC
    RC-->>App: Return CustomerInfo (Trial Active / Free Tier)
    deactivate RC

    opt Active Subscription or Trial Enabled
        App->>Sync: init(powersyncUrl) & connect(NoteeePowerSyncConnector)
        activate Sync
        Sync->>Sync: Fetch Credentials & Establish WebSocket Connection
        Sync->>DB: Execute Initial Sync Pull (Hydrate Cloud PostgreSQL Delta)
        DB-->>Sync: Acknowledge Local SQLite Hydrated
        Sync-->>App: Sync Engine Ready & Online
        deactivate Sync
    end

    App-->>User: Render Home View with Interactive Tree & System Anchors
    deactivate App
```

---

## 4. Workflow 2: Full Capture Session Lifecycle & Multi-Modal Ingress

### 4.1 Mermaid Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant UI as Quick Capture UI
    participant Mgr as CaptureSessionManager
    participant Source as ICaptureSource (AudioCaptureSource)
    participant STT as Whisper STT Engine (whisper.rn JSI)
    participant Embed as ONNX Embedder (all-MiniLM-L6-v2)
    participant Class as Local LLM Classifier
    participant DB as Local SQLite DB (op-sqlite)
    participant Outbox as PowerSync Outbox Queue

    User->>UI: Press Quick Record Hotkey / Tap Button
    activate UI
    UI->>Mgr: startSession(AUDIO, options)
    activate Mgr
    Mgr->>DB: INSERT INTO capture_sessions (status='RECORDING')
    DB-->>Mgr: Session Draft Initialized

    Mgr->>Source: startCapture()
    activate Source
    Source-->>UI: Capture Stream Active (Live Waveform)
    deactivate UI

    User->>UI: Tap Stop Recording
    activate UI
    UI->>Mgr: stopCaptureAndProcess(sessionId)
    Mgr->>Source: stopCapture()
    Source-->>Mgr: Return Audio Buffer File Path
    deactivate Source

    Mgr->>STT: transcribeAudioFile(filePath)
    activate STT
    STT-->>Mgr: Return Text Transcript
    deactivate STT

    Mgr->>Embed: generateEmbedding(transcriptText)
    activate Embed
    Embed-->>Mgr: Return 384-Float Embedding Vector
    deactivate Embed

    Mgr->>Class: evaluatePlacement(transcriptText, embedding)
    activate Class
    Class-->>Mgr: Return PlacementPathway (e.g., Folder "CS101", score 0.85)
    deactivate Class

    Mgr->>DB: Write Page & Paragraph Block Records
    activate DB
    DB-->>Mgr: Write Confirmed
    deactivate DB

    Mgr->>Outbox: Stage Sync Mutation in ps_crud
    Outbox-->>Mgr: Mutation Staged

    Mgr-->>UI: Display Success Toast & Open New Page
    deactivate Mgr
    deactivate UI
```

---

## 5. Workflow 3: Note Editing & Microsecond Auto-Save

### 5.1 Mermaid Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant Editor as TipTap Block Editor UI
    participant Bridge as JSI RPC Bridge
    participant Yjs as Yjs Y.Doc Container
    participant DB as Local SQLite DB (op-sqlite)
    participant Sync as PowerSync Local Client

    User->>Editor: Type Character / Modify Block
    activate Editor
    Editor->>Bridge: emitLocalMutationDelta(blockId, patch)
    activate Bridge

    Bridge->>Yjs: updateYDocStateVector(patch)
    activate Yjs
    Yjs-->>Bridge: CRDT Delta Computed
    deactivate Yjs

    Bridge->>DB: UPDATE blocks SET content_json = :json WHERE id = :id
    activate DB
    DB-->>Bridge: SQLite Write Success (< 3ms)
    deactivate DB

    Bridge->>Sync: appendMutationToOutbox(ps_crud)
    Sync-->>Bridge: Outbox Queued
    Bridge-->>Editor: Acknowledge UI State Clean
    deactivate Bridge
    deactivate Editor
```

---

## 6. Workflow 4: Semantic Search & Hybrid Reciprocal Rank Fusion (RRF)

### 6.1 Mermaid Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant SearchUI as Search UI Component
    participant Embed as ONNX Embedder (all-MiniLM-L6-v2)
    participant VecDB as sqlite-vec Vector Engine
    participant FTS as SQLite FTS5 BM25 Engine
    participant RRF as Hybrid RRF Ranker

    User->>SearchUI: Type Search Query ("quantum physics")
    activate SearchUI

    SearchUI->>Embed: generateEmbedding("quantum physics")
    activate Embed
    Embed-->>SearchUI: Return Query Vector (384 Float)
    deactivate Embed

    par Parallel Retrieval Phase
        SearchUI->>VecDB: SELECT page_id, distance FROM vectors ORDER BY distance LIMIT 50
        activate VecDB
        VecDB-->>SearchUI: Return Dense Vector Results
        deactivate VecDB
    and
        SearchUI->>FTS: SELECT page_id, bm25(page_fts) FROM page_fts WHERE match("quantum physics")
        activate FTS
        FTS-->>SearchUI: Return Sparse BM25 Results
        deactivate FTS
    end

    SearchUI->>RRF: combine(denseResults, sparseResults, k=60)
    activate RRF
    RRF-->>SearchUI: Return Re-Ranked Hybrid Page Candidates
    deactivate RRF

    SearchUI-->>User: Render Ranked Search Results Cards (< 500ms)
    deactivate SearchUI
```

---

## 7. Workflow 5: Flashcard Review Session & FSRS Engine Update

### 7.1 Mermaid Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant StudyUI as Flashcard Study UI
    participant Scheduler as FSRSScheduler (ts-fsrs v5.0.x)
    participant DB as Local SQLite DB (op-sqlite)

    User->>StudyUI: Open Daily Review Deck
    activate StudyUI
    StudyUI->>DB: SELECT * FROM flashcards WHERE due <= NOW() ORDER BY due ASC
    activate DB
    DB-->>StudyUI: Return Due Flashcard Array
    deactivate DB

    StudyUI-->>User: Display Front Side of Flashcard 1
    User->>StudyUI: Tap "Show Answer"
    StudyUI-->>User: Flip Card to Render Back / Cloze Answer

    User->>StudyUI: Select Rating (e.g. Rating.Good = 3)
    StudyUI->>Scheduler: processReview(card, Rating.Good, currentDate)
    activate Scheduler
    Scheduler->>Scheduler: Compute updated Stability S', Difficulty D', and Interval I'
    Scheduler-->>StudyUI: Return FSRSSchedulingInfo (Updated Card & Review Log)
    deactivate Scheduler

    StudyUI->>DB: UPDATE flashcards SET stability=S', difficulty=D', due=due' WHERE id=:id
    activate DB
    DB->>DB: INSERT INTO flashcard_review_logs
    DB-->>StudyUI: Persistence Complete
    deactivate DB

    StudyUI-->>User: Advance to Next Card in Queue
    deactivate StudyUI
```

---

## 8. Workflow 6: Multi-Device Sync Conflict Resolution

### 8.1 Mermaid Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor UserA as Device A User
    participant AppA as Device A Client
    participant SyncRelay as PowerSync Cloud Relay Server
    participant AppB as Device B Client
    actor UserB as Device B User

    Note over AppA, AppB: Device A & B go offline simultaneously
    UserA->>AppA: Edit Folder Title & Edit Block 1 (Offline)
    UserB->>AppB: Edit Folder Title & Insert Block 2 (Offline)

    Note over AppA, AppB: Connectivity Restored
    AppA->>SyncRelay: Push Outbox Mutations (Timestamp TA)
    activate SyncRelay
    AppB->>SyncRelay: Push Outbox Mutations (Timestamp TB > TA)

    SyncRelay->>SyncRelay: Evaluate LWW Rules for Metadata (TB Title Wins)
    SyncRelay->>SyncRelay: Merge Block Arrays using Fractional Indexing (Block 1 & 2 Persisted)

    par Distribute Reconciled Delta
        SyncRelay-->>AppA: Push Reconciled Delta Patch
        AppA->>AppA: Apply Patch to Local SQLite
        AppA-->>UserA: UI Updates to Reconciled State
    and
        SyncRelay-->>AppB: Push Reconciled Delta Patch
        deactivate SyncRelay
        AppB->>AppB: Apply Patch to Local SQLite
        AppB-->>UserB: UI Updates to Reconciled State
    end
```

---

## 9. Workflow 7: Zero-Knowledge E2EE Collaboration Link Share & Real-Time Join

### 9.1 Mermaid Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Owner as Document Owner (User A)
    participant ClientA as Owner Client Runtime
    participant Auth as Supabase Auth Service
    participant Relay as Yjs WebSocket Relay Server
    participant ClientB as Guest Client Runtime
    actor Guest as Collaboration Guest (User B)

    Owner->>ClientA: Click "Share E2EE Link"
    activate ClientA
    ClientA->>ClientA: E2ECryptoEngine.generateKey() (256-bit AES-GCM Key K)
    ClientA->>ClientA: Construct URL: https://noteee.app/collab/#key=K
    ClientA-->>Owner: Display Share Link & Copy to Clipboard
    deactivate ClientA

    Owner->>Guest: Send Share Link via Messaging

    Guest->>ClientB: Click Share Link
    activate ClientB
    ClientB->>ClientB: Extract Key K from URL Hash Fragment into RAM
    ClientB->>Auth: Authenticate Guest (getSession / Anonymous)
    Auth-->>ClientB: Return Valid Guest JWT

    ClientB->>Relay: Connect WebsocketProvider(room="page-123", token)
    activate Relay
    Relay-->>ClientB: WebSocket Handshake Established

    rect rgb(240, 255, 240)
        Note over ClientA, ClientB: Zero-Knowledge Encrypted Real-Time Collaboration
        ClientB->>Relay: Send State Vector
        Relay->>ClientA: Relay Request
        ClientA->>ClientA: Encode Missing Delta & Encrypt with Key K
        ClientA->>Relay: Push Encrypted Binary Payload
        Relay->>ClientB: Relay Raw Ciphertext Payload
        ClientB->>ClientB: Decrypt Payload with Key K & Apply to Y.Doc / TipTap UI
    end
    deactivate Relay
    deactivate ClientB
```

---

## 10. Workflow 8: Multi-Modal Agentic RAG Execution & Self-Reflection Loop

### 10.1 Overview & SLA Constraints
1. **Multi-Modal Query Routing:** Decomposes queries involving text, images, and audio notes into parallel retrieval sub-goals.
2. **Hybrid Reciprocal Rank Fusion:** Combines sparse BM25 keywords with 384-dim dense vector similarity ($k=60$).
3. **Self-Reflection Guardrail:** The `ReflectiveEvaluator` checks synthesized answer groundedness. If confidence score is $< 0.85$, it executes a re-retrieval loop with query expansion before streaming output to the user.

### 10.2 Mermaid Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant UI as Noteee RAG UI
    participant Orch as AgenticRagOrchestrator
    participant RRF as HybridRrfRetriever
    participant VectorDB as ONNX / pgvector Index
    participant LLM as Cloud LLM Gateway (GPT-4o)
    participant Eval as ReflectiveEvaluator

    User->>UI: Submit Multi-Modal Query ("Explain diagram & voice notes in CS101")
    activate UI
    UI->>Orch: executeAgenticLoop(queryText, contextFilters)
    activate Orch

    Orch->>RRF: hybridRrfSearch(queryText, topK=20)
    activate RRF
    RRF->>VectorDB: Query Sparse BM25 + Dense Vector Index
    VectorDB-->>RRF: Return Candidate Chunks
    RRF-->>Orch: Return Re-Ranked RRF Chunks
    deactivate RRF

    Orch->>LLM: generateDraftResponse(queryText, RRFChunks)
    activate LLM
    LLM-->>Orch: Return Draft Synthesis Response
    deactivate LLM

    Orch->>Eval: evaluateConfidence(draftResponse, RRFChunks)
    activate Eval
    
    alt Confidence Score >= 0.85 (High Groundedness)
        Eval-->>Orch: Evaluation Passed (Score: 0.92)
    else Confidence Score < 0.85 (Low Groundedness / Missing Context)
        Eval-->>Orch: Evaluation Failed -> Trigger Query Expansion Loop
        Orch->>RRF: hybridRrfSearch(expandedQuery, topK=40)
        RRF-->>Orch: Return Secondary Chunks
        Orch->>LLM: reGenerateResponse(expandedContext)
        LLM-->>Orch: Return Refined Draft Synthesis
    end
    deactivate Eval

    Orch-->>UI: Stream Verified Response Tokens
    deactivate Orch
    UI-->>User: Render Agentic RAG Answer Card with Citation Anchors
    deactivate UI
```

---

## 11. Workflow 9: Canvas Rendering & Offline Handwriting Search Pipeline

### 11.1 Overview & SLA Constraints
1. **60FPS GPU Skia Rendering:** Stylus input renders smooth vector strokes via `@shopify/react-native-skia` with zero frame drops.
2. **Spatial R-Tree Indexing:** Every stroke bounding box is inserted into `IStrokeSpatialIndex` in $O(\log N)$ time.
3. **Offline OCR Handwriting Search:** Background worker rasterizes canvas stroke clusters, runs Vision OCR, and populates `canvas_stroke_fts` for immediate text search.

### 11.2 Mermaid Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Stylus as Stylus / Finger Touch
    participant CanvasUI as Skia Canvas Component
    participant Skia as GPU Skia Render Engine
    participant RTree as RTreeSpatialIndex (IStrokeSpatialIndex)
    participant DB as Local SQLite DB (op-sqlite)
    participant OCR as Vision OCR Engine
    participant FTS as Canvas FTS5 Index

    Stylus->>CanvasUI: Touch TouchMove / Stylus Drawing
    activate CanvasUI
    CanvasUI->>Skia: drawPath(strokePoints, color, width)
    Skia-->>CanvasUI: Render 60FPS GPU Command Buffer

    Stylus->>CanvasUI: TouchTouchEnd (Stroke Complete)
    CanvasUI->>RTree: insert(canvasStroke)
    activate RTree
    RTree->>RTree: Calculate BoundingBox & Insert into R-Tree
    RTree-->>CanvasUI: Spatial Index Updated
    deactivate RTree

    CanvasUI->>DB: INSERT INTO canvas_strokes (stroke_points_blob, bounds_json)
    DB-->>CanvasUI: Stroke Saved Locally

    par Asynchronous Handwriting Recognition
        CanvasUI->>OCR: recognizeHandwritingCluster(strokeBoundingBox)
        activate OCR
        OCR-->>CanvasUI: Return Transcribed Text String ("Neural Networks")
        deactivate OCR
        CanvasUI->>FTS: INSERT INTO canvas_stroke_fts (stroke_id, text)
        FTS-->>CanvasUI: Handwriting Search Index Hydrated
    end

    deactivate CanvasUI
```

---

## 12. Workflow 10: BullMQ Async Job Execution with Safety Guardrail Chain

### 12.1 Overview & SLA Constraints
1. **Asynchronous Job Dispatch:** Heavy background tasks (batch PDF rendering, RAG re-indexing) are queued into BullMQ backed by Redis Cluster DB 2.
2. **Multi-Stage Safety Chain:** Prior to job processing, `SystemSafetyGuardrailChain` executes PII Scrubbing, Prompt Injection Canary checks, and XSS Sanitization.

### 12.2 Mermaid Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Client as Client App / Hono API
    participant Gateway as Backend API Gateway
    participant Redis as Redis Cluster (DB 2 Job Queue)
    participant Worker as BullMQ Worker Node
    participant Guard as SafetyGuardrailChain (ISafetyGuardrail)
    participant Postgres as Supabase PostgreSQL DB

    Client->>Gateway: POST /api/v1/jobs/process-pdf (PDF Asset Payload)
    activate Gateway
    Gateway->>Redis: addJob("pdf-processing-queue", payload, jobOptions)
    activate Redis
    Redis-->>Gateway: Return Job ID (job_uuid_99)
    deactivate Redis
    Gateway-->>Client: 202 Accepted (Job Enqueued)
    deactivate Gateway

    Redis->>Worker: Consume Job Event (job_uuid_99)
    activate Worker
    Worker->>Guard: validatePayload(jobPayload)
    activate Guard
    
    Guard->>Guard: 1. scrubPii(textPayload)
    Guard->>Guard: 2. detectPromptInjection(promptString)
    Guard->>Guard: 3. sanitizeXss(htmlContent)

    alt Payload Safe (No Violations)
        Guard-->>Worker: Return SafetyAuditResult (isSafe = true)
    else Violation Detected (PII or Injection Found)
        Guard-->>Worker: Return SafetyAuditResult (isSafe = false, sanitizedContent)
    end
    deactivate Guard

    Worker->>Worker: Execute Heavy Task (PDF Page Extraction & Vector Embedding)
    Worker->>Postgres: INSERT INTO pdf_annotations & vectors
    Postgres-->>Worker: DB Write Confirmed

    Worker->>Redis: updateJobStatus(job_uuid_99, "COMPLETED")
    deactivate Worker
```

---

## 13. Workflow 11: RevenueCat Subscription Purchase & BYOK Fallback

### 13.1 Overview & SLA Constraints
1. **RevenueCat Payment Pipeline:** Handles native Apple StoreKit / Google Play Billing purchases and receipt verification.
2. **BYOK Security Fallback:** If a user chooses not to subscribe to Pro, they can supply their own OpenAI / Anthropic API keys. `BYOKKeyManager` encrypts keys into native hardware enclave storage (iOS Keychain / Android Keystore).

### 13.2 Mermaid Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant BillingUI as Subscription Billing UI
    participant RC as RevenueCat SDK (react-native-purchases)
    participant Store as App Store / Google Play Billing
    participant BYOK as BYOKKeyManager (Native KeyStorage)
    participant AIGateway as Cloud AI Gateway

    alt User Purchases Pro Subscription
        User->>BillingUI: Select Pro Annual Plan -> Tap Purchase
        activate BillingUI
        BillingUI->>RC: purchasePackage(packageProAnnual)
        activate RC
        RC->>Store: Process Payment (StoreKit / Google Play)
        activate Store
        Store-->>RC: Payment Success & Signed Receipt
        deactivate Store
        RC->>RC: Verify Receipt & Update Entitlement State
        RC-->>BillingUI: Return EntitlementState (isPro = true)
        deactivate RC
        BillingUI-->>User: Unlock All Pro Features
        deactivate BillingUI

    else User Uses BYOK (Bring-Your-Own-Key) Fallback
        User->>BillingUI: Enter Personal OpenAI API Key -> Tap Save
        activate BillingUI
        BillingUI->>BYOK: validateAndSaveKey(userApiKey, "openai")
        activate BYOK
        BYOK->>BYOK: Encrypt Key with AES-256-GCM
        BYOK->>BYOK: Store Encrypted Blob in Hardware Keystore / Keychain
        BYOK-->>BillingUI: Key Saved Successfully
        deactivate BYOK

        User->>BillingUI: Execute Cloud LLM Feature Request
        BillingUI->>BYOK: getDecryptedKey("openai")
        activate BYOK
        BYOK-->>BillingUI: Return Decrypted API Key String
        deactivate BYOK
        BillingUI->>AIGateway: Proxy Call with User BYOK Header
        AIGateway-->>BillingUI: Return LLM Result
        BillingUI-->>User: Render Cloud AI Response
        deactivate BillingUI
    end
```

---

## 14. Unified Cross-System Verification & Consistency Matrix

| Sequence Diagram | Primary Module / Interface | Key Schema Tables Involved | Encryption / Security Boundary | Primary Spec Ref |
| :--- | :--- | :--- | :--- | :--- |
| **Workflow 1: Onboarding** | `SystemAnchorInitializer`, `DrizzleORM`, `Purchases` | `folders`, `pages`, `blocks`, 7 Anchors | iOS Keychain / Android Keystore JWT | `03_sector_1`, `09_sector_6` |
| **Workflow 2: Capture Lifecycle** | `ICaptureSource`, `whisper.rn`, `IEmbedder` | `capture_sessions`, `pages`, `blocks`, `page_vectors` | Hardware Enclave (Vault detection) | `03_sector_1`, `05_sector_2`, `07_sector_4` |
| **Workflow 3: Editing & Auto-Save** | `ITipTapBridge`, `y-prosemirror`, `op-sqlite` | `blocks`, `pages`, `ps_crud` Outbox | Microsecond RPC JSI Boundary | `03_sector_1`, `06_sector_3`, `09_sector_6` |
| **Workflow 4: Semantic Search** | `HybridSemanticSearchEngine`, `sqlite-vec`, `FTS5` | `page_vectors`, `page_fts`, `folders` | Local ONNX Execution (`all-MiniLM-L6-v2`) | `03_sector_1`, `07_sector_4` |
| **Workflow 5: Flashcards (FSRS)** | `FSRSScheduler` (`ts-fsrs`), `AuditRecorder` | `flashcards`, `flashcard_review_logs` | Mathematical FSRS Retention ($R=0.90$) | `03_sector_1`, `07_sector_4` |
| **Workflow 6: Sync & Conflict Res.** | `PowerSyncBackendConnector`, `SyncStateMachine` | `ps_crud`, `folders`, `pages`, `blocks` | Exponential Backoff with Jitter | `03_sector_1`, `09_sector_6` |
| **Workflow 7: E2EE Link Share & Join** | `E2ECryptoEngine`, `WebsocketProvider` (Yjs) | Client RAM `Y.Doc`, `yjs_updates` | Zero-Knowledge AES-GCM-256 Hash Fragment | `06_sector_3`, `09_sector_6` |
| **Workflow 8: Agentic RAG Execution** | `AgenticRagOrchestrator`, `IRagEngine`, `ReflectiveEvaluator` | `vectors`, `blocks`, pgvector DB | Groundedness Evaluator Loop ($Score \ge 0.85$) | `14_agentic_rag_spec.md` |
| **Workflow 9: Canvas & Handwriting** | `@noteee/skia-canvas`, `IStrokeSpatialIndex`, `VisionOCR` | `canvas_strokes`, `canvas_stroke_fts` | 60FPS Skia GPU & R-Tree Index | `08_sector_5`, `16_canvas_pdf_media_workflows.md` |
| **Workflow 10: BullMQ & Safety** | `IJobQueueAdapter`, `BullMQ`, `ISafetyGuardrail` | Redis DB 2, `pdf_annotations`, Postgres | PII Scrubber, Injection Canary, XSS Sanitizer | `15_cloud_infrastructure_spec.md` |
| **Workflow 11: Purchase & BYOK** | `IBillingAdapter`, `RevenueCat`, `BYOKKeyManager` | Hardware KeyStore, RevenueCat API | AES-256-GCM Hardware Enclave Encryption | `09_sector_6`, `17_app_shipping_monetization_spec.md` |

---
*End of Sequence Diagrams Specification (`12_sequence_diagrams.md`)*
