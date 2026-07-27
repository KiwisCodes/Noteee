# Noteee: Software State Machines Specification

**Document Identifier:** `13_state_machines.md`  
**System Target:** Noteee Cross-Platform Notebook Architecture  
**Dependencies:** `01_original_feature_list.md` through `17_app_shipping_monetization_spec.md`  
**Specification Version:** 1.0.0 (Production Release)  

---

## 1. Executive Summary & State Architecture Principles

Noteee relies on deterministic Finite State Machines (FSMs) to govern its core reactive subsystems: **Multi-Modal Capture Engine**, **Spaced Repetition Flashcards (FSRS v5.0.x)**, **Encrypted Vault Security**, **Local-First Cloud Synchronization**, **Agentic RAG Query Control**, **Subscription Entitlements**, **BullMQ Job Lifecycles**, and **PDF Occlusion Masks**. In a local-first, offline-ready architecture, dynamic runtime entities must maintain deterministic state transitions, clear data invariants, crash recovery mechanisms, and strict error handling boundaries.

### Core Architectural Directives
1. **Deterministic State Transitions:** State transitions are pure functions of `(CurrentState, TriggerEvent, GuardConditions) => (NextState, SideEffects)`. Invalid or non-permitted transitions produce immediate exception handling without altering persistent state.
2. **Offline-First State Persistence:** Critical state transitions (e.g., active capture buffering, FSRS review score logs, outbox queueing) write atomically to SQLite buffers (`capture_sessions`, `ps_crud`, `blocks`, `pages`). Cold launches or process kills restore exact prior states.
3. **Composite & Nested Isolation:** Complex lifecycles (e.g., capture session recording/processing, flashcard learning/relearning steps, RAG control loops, sync push/pull loops) use composite/nested states to encapsulate sub-state transitions without leaking internal state noise to external system observers.
4. **Security & Memory Safety Invariants:** Cryptographic secrets and decrypted data models exist in RAM exclusively during `Unlocked` states and undergo zero-fill key purging immediately upon entering `Locked`, `AutoLockTimer` expiration, or app process suspension.

---

## 2. Standardized FSM Specification Conventions

All state machine diagrams and specification tables in this document conform to standard Unified Modeling Language (UML) / Mermaid `stateDiagram-v2` syntax using the following formal notation:

| Component | Syntax Format | Description | Example |
| :--- | :--- | :--- | :--- |
| **State Name** | `PascalCase` | Standard identifier for top-level and nested composite states. | `Recording`, `BiometricPrompt`, `Syncing` |
| **Trigger Event** | `UPPER_SNAKE_CASE` | Event string emitting from UI actions, timers, or network triggers. | `START_CAPTURE`, `RATING_GOOD`, `LOCK_TIMEOUT` |
| **Guard Condition** | `[camelCaseCondition]` | Boolean predicate evaluated prior to executing state transition. | `[hasPermissions]`, `[failedAttempts >= 5]` |
| **Entry Action** | `entry / action()` | Side effect executed upon entering the state. | `entry / startAudioStream()` |
| **Exit Action** | `exit / action()` | Side effect executed immediately prior to leaving the state. | `exit / purgeRAMKeyBuffer()` |
| **Transition Action** | `/ action()` | Action executed during state transition. | `/ commitToDatabase()` |

---

## 3. State Machine 1: Capture Session Lifecycle Specification

### 3.1 Capture Session State Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle

    Idle --> Initializing : START_CAPTURE [hasValidSessionConfig] / allocateSessionId()

    state Initializing {
        [*] --> CheckingHardware
        CheckingHardware --> ReadyToRecord : CAPTURE_INIT_OK [hasPermissions && storageAvailable] / setupMediaEncoder()
    }

    Initializing --> Error : INIT_FAILED [permissionDenied || storageFull] / logInitError()
    Initializing --> Cancelled : CANCEL_CAPTURE / releaseHardwareResources()

    Initializing --> Recording : INIT_COMPLETE

    state Recording {
        [*] --> Active
        Active --> Paused : PAUSE_RECORDING / pauseEncoderStream()
        Paused --> Active : RESUME_RECORDING / resumeEncoderStream()
    }

    Recording --> Finalizing : STOP_RECORDING / stopEncoderStream()
    Recording --> Cancelled : CANCEL_CAPTURE / purgeMediaBuffers()

    state Finalizing {
        [*] --> WritingHeaders
        WritingHeaders --> ComputingChecksum : WRITE_COMPLETE
        ComputingChecksum --> StagingMedia : CHECKSUM_OK [isIntegrityValid]
    }

    Finalizing --> Error : FINALIZATION_FAILED [corruptFile || writeError] / logFinalizeError()
    Finalizing --> Cancelled : CANCEL_CAPTURE / deleteTempFiles()

    Finalizing --> Processing : STAGING_COMPLETE

    state Processing {
        [*] --> Transcribing
        Transcribing --> Embedding : TRANSCRIPTION_COMPLETE [hasTextTranscript] / runMiniLMEncoder()
        Embedding --> Structuring : EMBEDDING_COMPLETE [has384DimVectors] / extractEntitiesAndTags()
    }

    Processing --> SummarizingAndInterviewing : STAGING_COMPLETE / generateSummaryAndContextQuestion()

    state SummarizingAndInterviewing {
        [*] --> AwaitingUserContext
        AwaitingUserContext --> EvaluatingPlacement : USER_ANSWERED_CONTEXT / calculateSimilarity()
    }

    SummarizingAndInterviewing --> Completed : PLACEMENT_CONFIRMED / commitToDatabase()
    SummarizingAndInterviewing --> Error : INTERVIEW_FAILED / logProcessingError()
    SummarizingAndInterviewing --> Cancelled : CANCEL_CAPTURE / purgeStagedData()

    Completed --> [*]
    Error --> Initializing : RETRY / reinitializeSession()
    Error --> Cancelled : DISCARD / purgeSessionData()
    Cancelled --> [*]
```

---

## 4. State Machine 2: Flashcard Review Card Lifecycle Specification (FSRS v5.0.x)

### 4.1 Flashcard Review Card State Diagram

```mermaid
stateDiagram-v2
    [*] --> New

    New --> Learning : START_STUDY / initFSRSCard()

    state Learning {
        [*] --> Step1
        Step1 --> Step1 : RATING_AGAIN [Rating == 1] / resetStep1Timer()
        Step1 --> Step2 : RATING_HARD [Rating == 2] / setStep2Timer()
        Step1 --> Step2 : RATING_GOOD [Rating == 3] / setStep2Timer()
        Step1 --> Graduated : RATING_EASY [Rating == 4] / calculateEasyGraduation()

        Step2 --> Step1 : RATING_AGAIN [Rating == 1] / fallbackToStep1()
        Step2 --> Step2 : RATING_HARD [Rating == 2] / extendStep2Timer()
        Step2 --> Review : RATING_GOOD [Rating == 3] / graduateToReview()
        Step2 --> Graduated : RATING_EASY [Rating == 4] / graduateWithBonus()
    }

    state Review {
        [*] --> ScheduledReview
        ScheduledReview --> ScheduledReview : RATING_HARD [Rating == 2] / updateFSRS(S_hard, D_hard)
        ScheduledReview --> ScheduledReview : RATING_GOOD [Rating == 3] / updateFSRS(S_good, D_good)
        ScheduledReview --> ScheduledReview : RATING_EASY [Rating == 4] / updateFSRS(S_easy, D_easy)
    }

    Review --> Lapsed : RATING_AGAIN [Rating == 1] / incrementLapses()

    Lapsed --> Relearning : INIT_RELEARNING / prepareRelearningSteps()

    state Relearning {
        [*] --> RelearningStep
        RelearningStep --> RelearningStep : RATING_AGAIN [Rating == 1] / resetRelearnTimer()
        RelearningStep --> Review : RATING_HARD [Rating == 2] / reGraduateToReview()
        RelearningStep --> Review : RATING_GOOD [Rating == 3] / reGraduateToReview()
        RelearningStep --> Graduated : RATING_EASY [Rating == 4] / reGraduateWithBonus()
    }

    Graduated --> Review : ENTER_REVIEW_QUEUE / scheduleNextDueDate()
```

---

## 5. State Machine 3: Vault Lock/Unlock Security Specification

### 5.1 Vault Lock/Unlock State Diagram

```mermaid
stateDiagram-v2
    [*] --> Locked

    Locked --> Authenticating : REQUEST_UNLOCK / promptAuthentication()

    state Authenticating {
        [*] --> BiometricPrompt
        BiometricPrompt --> PasscodeEntry : BIOMETRIC_FAILED [attempts < 5] / displayPasscodeUI()
        BiometricPrompt --> PasscodeEntry : BIOMETRIC_UNAVAILABLE / displayPasscodeUI()

        PasscodeEntry --> PasscodeEntry : INCORRECT_PIN [attempts < 5] / incrementFailedAttempts()
    }

    Authenticating --> Unlocked : AUTH_SUCCESS [biometricMatch || passcodeCorrect] / decryptMasterKey()
    Authenticating --> FailedLockout : AUTH_FAILED [failedAttempts >= 5] / startLockoutTimer(300s)

    state Unlocked {
        [*] --> VaultActive
    }

    Unlocked --> AutoLockTimer : USER_INACTIVE [inactivityTime > 0s] / start60sCountdown()
    Unlocked --> Locked : MANUAL_LOCK / purgeMasterKeyFromRAM()
    Unlocked --> Locked : APP_BACKGROUNDED / zeroizeKeyMemory()

    state AutoLockTimer {
        [*] --> CountingDown
        CountingDown --> CountingDown : TIMECOUNT_TICK
    }

    AutoLockTimer --> Unlocked : USER_ACTIVITY_DETECTED / cancelTimer()
    AutoLockTimer --> Locked : TIMER_EXPIRED [timer >= 60s] / purgeMasterKeyFromRAM()
    AutoLockTimer --> Locked : APP_SUSPENDED / zeroizeKeyMemory()

    state FailedLockout {
        [*] --> LockoutEnforced
        LockoutEnforced --> LockoutEnforced : TICK_LOCKOUT_TIMER
    }

    FailedLockout --> Locked : LOCKOUT_EXPIRED [lockoutTimer == 0] / resetFailedAttempts()
```

---

## 6. State Machine 4: Cloud Sync Connection Lifecycle Specification

### 6.1 Cloud Sync Connection State Diagram

```mermaid
stateDiagram-v2
    [*] --> Offline

    Offline --> Connecting : NETWORK_AVAILABLE [isNetworkConnected] / initPowerSyncConnector()

    state Connecting {
        [*] --> FetchingJWT
        FetchingJWT --> EstablishingWebSocket : JWT_ACQUIRED / connectWebSocket()
    }

    Connecting --> Syncing : HANDSHAKE_OK / startSyncStream()
    Connecting --> Reconnecting : CONNECT_FAILED [timeout || tokenError] / scheduleBackoff()
    Connecting --> Offline : NETWORK_LOST [!isNetworkConnected] / closeSockets()

    state Syncing {
        [*] --> Pulling
        Pulling --> Pushing : PULL_COMPLETE / processOutboxCrud()
    }

    Syncing --> Online : SYNC_COMPLETE [outboxEmpty] / updateSyncStatusGreen()
    Syncing --> ConflictResolution : CONFLICT_DETECTED [crdtMismatch || pageVersionConflict] / pauseSyncPipeline()
    Syncing --> Reconnecting : SYNC_ERROR [networkDrop || server5xx] / scheduleBackoff()
    Syncing --> Offline : NETWORK_LOST [!isNetworkConnected] / resetSockets()

    state Online {
        [*] --> ListeningStream
    }

    Online --> Syncing : LOCAL_MUTATION [hasOutboxItems] / triggerPush()
    Online --> Syncing : REMOTE_UPDATE_RECEIVED / triggerPull()
    Online --> ConflictResolution : REMOTE_CONFLICT_EVENT / isolateConflictingDoc()
    Online --> Offline : NETWORK_LOST [!isNetworkConnected] / setStatusOffline()

    state ConflictResolution {
        [*] --> AnalyzingConflicts
        AnalyzingConflicts --> ApplyingYjsLWW : MERGE_PROSEMIRROR / runYjsMerge()
        ApplyingYjsLWW --> ResolvingMetadata : YJS_MERGED / resolveFieldMetadata()
    }

    ConflictResolution --> Syncing : CONFLICT_RESOLVED / resumeSyncPipeline()
    ConflictResolution --> Reconnecting : RESOLUTION_FAILED [schemaIncompatible] / escalateSyncError()

    state Reconnecting {
        [*] --> ExponentialBackoffWait
        ExponentialBackoffWait --> ExponentialBackoffWait : BACKOFF_TIMER_TICK
    }

    Reconnecting --> Connecting : RETRY_TIMER_EXPIRED [retryCount < maxRetries] / incrementRetryCount()
    Reconnecting --> Offline : MAX_RETRIES_EXCEEDED [retryCount >= maxRetries] / fallbackToOffline()
    Reconnecting --> Offline : NETWORK_LOST [!isNetworkConnected] / cancelBackoff()
```

---

## 7. State Machine 5: Agentic RAG Query Control Loop Specification

### 7.1 Agentic RAG Query Control Loop State Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle

    Idle --> ClassifyingQuery : SUBMIT_QUERY / parseQueryIntent()

    state ClassifyingQuery {
        [*] --> AnalyzingIntent
        AnalyzingIntent --> RouteLocal : LOCAL_SIMPLE [confidence >= 0.90]
        AnalyzingIntent --> RouteHybrid : COMPLEX_OR_MULTI_MODAL
    }

    ClassifyingQuery --> RetrievingHybrid : CLASSIFICATION_COMPLETE

    state RetrievingHybrid {
        [*] --> FetchingBM25
        FetchingBM25 --> FetchingDenseVectors
        FetchingDenseVectors --> ComputingRRF : RRF_COMBINE [k = 60]
    }

    RetrievingHybrid --> GeneratingResponse : RRF_CHUNKS_READY

    state GeneratingResponse {
        [*] --> SynthesizingDraft
        SynthesizingDraft --> DraftReady : LLM_DRAFT_COMPLETE
    }

    GeneratingResponse --> ReflectingAndEvaluating : EVALUATE_GROUNDEDNESS

    state ReflectingAndEvaluating {
        [*] --> CheckingConfidence
        CheckingConfidence --> EvaluationPassed : CONFIDENCE_HIGH [score >= 0.85]
        CheckingConfidence --> QueryExpansionNeeded : CONFIDENCE_LOW [score < 0.85 && retries < 2]
    }

    ReflectingAndEvaluating --> RetrievingHybrid : RE_QUERY [queryExpanded] / incrementRetryCount()
    ReflectingAndEvaluating --> OutputStreaming : EVALUATION_PASSED / initializeStream()
    ReflectingAndEvaluating --> Failed : EVALUATION_FAILED [retries >= 2] / logRAGFailure()

    state OutputStreaming {
        [*] --> StreamingTokens
        StreamingTokens --> StreamComplete : LAST_TOKEN_EMITTED
    }

    OutputStreaming --> Completed : STREAM_FINISHED
    Failed --> [*]
    Completed --> [*]
```

---

## 8. State Machine 6: User Subscription Lifecycle & Entitlements Specification

### 8.1 User Subscription Lifecycle State Diagram

```mermaid
stateDiagram-v2
    [*] --> FreeTier

    FreeTier --> TrialActive : START_FREE_TRIAL / grantProTrial(90_DAYS)
    FreeTier --> ProSubscribed : PURCHASE_PRO_SUBSCRIPTION / activateProEntitlement()
    FreeTier --> BYOKActive : CONFIGURE_BYOK_KEY / validateAndStoreBYOK()

    state TrialActive {
        [*] --> TrialRunning
        TrialRunning --> TrialRunning : DAILY_TRIAL_TICK
    }

    TrialActive --> ProSubscribed : CONVERT_TO_PRO / processPayment()
    TrialActive --> Expired : TRIAL_EXPIRED [trialDays == 0] / revokeProEntitlement()

    state ProSubscribed {
        [*] --> ActiveSubscription
        ActiveSubscription --> Renewing : BILLING_RENEWAL_TICK
        Renewing --> ActiveSubscription : PAYMENT_SUCCESS
    }

    ProSubscribed --> GracePeriod : PAYMENT_FAILED / grantGracePeriod(7_DAYS)
    ProSubscribed --> Cancelled : CANCEL_SUBSCRIPTION / setWillNotRenew()

    state GracePeriod {
        [*] --> GraceCountdown
    }

    GracePeriod --> ProSubscribed : RECOVERY_PAYMENT_SUCCESS / restoreSubscription()
    GracePeriod --> Expired : GRACE_EXPIRED [graceDays == 0] / revokeProEntitlement()

    state Cancelled {
        [*] --> ActiveUntilPeriodEnd
    }

    Cancelled --> Expired : PERIOD_ENDED / revokeProEntitlement()
    Cancelled --> ProSubscribed : RESUBSCRIBE / reactivateEntitlement()

    Expired --> FreeTier : FALLBACK_TO_FREE / enableAdMobBanners()
    Expired --> BYOKActive : CONFIGURE_BYOK_KEY / enableBYOKMode()
    BYOKActive --> ProSubscribed : PURCHASE_PRO_SUBSCRIPTION / activateProEntitlement()
```

---

## 9. State Machine 7: BullMQ Async Job Lifecycle Specification

### 9.1 BullMQ Async Job Lifecycle State Diagram

```mermaid
stateDiagram-v2
    [*] --> Waiting

    Waiting --> Active : WORKER_PICKUP / startJobExecution()
    Waiting --> Delayed : DELAY_SCHEDULED / setTimer()
    Delayed --> Waiting : DELAY_EXPIRED / returnToQueue()

    state Active {
        [*] --> EvaluatingGuardrails
        EvaluatingGuardrails --> RunningTask : GUARDRAILS_PASSED [isSafe == true]
    }

    Active --> Failed : GUARDRAIL_VIOLATION [injectionOrPiiDetected] / logViolation()

    state RunningTask {
        [*] --> ProcessingData
        ProcessingData --> TaskFinished : TASK_SUCCESS
    }

    RunningTask --> Completed : TASK_COMPLETE / updateRedisJobState("COMPLETED")
    RunningTask --> Retrying : UNHANDLED_EXCEPTION [attempts < maxAttempts] / scheduleRetrying()

    state Retrying {
        [*] --> ExponentialBackoff
    }

    Retrying --> Waiting : BACKOFF_EXPIRED / reEnqueueJob()
    Retrying --> Failed : MAX_ATTEMPTS_EXCEEDED [attempts >= maxAttempts] / markJobFailed()

    Completed --> [*]
    Failed --> [*]
```

---

## 10. State Machine 8: PDF Annotation & FSRS Occlusion Card Specification

### 10.1 PDF Annotation & FSRS Occlusion Card State Diagram

```mermaid
stateDiagram-v2
    [*] --> SelectingRegion

    SelectingRegion --> SnappingQuad : DRAW_SELECTION_BOX / captureRawBounds()

    state SnappingQuad {
        [*] --> SnappingToTextQuad
        SnappingToTextQuad --> QuadSnapped : QUAD_SNAPPED [confidence >= 0.80]
    }

    SnappingQuad --> OcclusionMaskCreated : CREATE_MASK / instantiateMask()

    state OcclusionMaskCreated {
        [*] --> IdleMask
    }

    OcclusionMaskCreated --> ActiveStudy : START_STUDY_SESSION / enterStudyMode()

    state ActiveStudy {
        [*] --> Occluded
        Occluded --> Revealed : USER_TAP_MASK / revealHiddenText()
        Revealed --> Occluded : HIDE_MASK / hideText()
    }

    ActiveStudy --> FSRSScheduled : SUBMIT_RATING [rating 1-4] / processFSRSReview()

    state FSRSScheduled {
        [*] --> NextDueDateCalculated
    }

    FSRSScheduled --> ActiveStudy : STUDY_DUE_TRIGGER
```

---

## 11. Cross-State Machine Interactions & System Integration Matrix

The 8 state machines operate concurrently, coordinating through the central Event Bus and local SQLite database:

```
┌─────────────────────────┐          Structured Blocks          ┌─────────────────────────┐
│ Capture Session FSM     │ ──────────────────────────────────> │ Vault Security FSM      │
│ (Ingress & Parsing)     │   Sensitive Data Trigger Check      │ (Encryption & Lockout)  │
└─────────────────────────┘                                     └─────────────────────────┘
            │                                                                │
            │ Auto-Generated Cloze Flashcards                                │ Encrypted Page Payload
            ▼                                                                ▼
┌─────────────────────────┐                                     ┌─────────────────────────┐
│ Flashcard / Occlusion   │                                     │ Cloud Sync / BullMQ FSM │
│ (FSRS Spaced Repetition)│ ──────────────────────────────────> │ (PowerSync & Jobs Out)  │
└─────────────────────────┘      Sync Review Logs & Stability   └─────────────────────────┘
```

| Primary Initiating FSM | Event Trigger | Secondary Target FSM | Inter-FSM Reaction & Action |
| :--- | :--- | :--- | :--- |
| **Capture Session** | `Processing.Structuring` complete | **Vault Security FSM** | Sensitive data detector identifies passwords/API keys $\rightarrow$ Triggers prompt for auto-routing into encrypted Vault. |
| **Capture Session** | `Completed` | **Flashcard Review FSM** | AI block parser generates `flashcard_cloze` blocks $\rightarrow$ Instantiates new card record in `New` state in FSRS deck. |
| **Flashcard / Occlusion** | Review rating submitted (`1-4`) | **Cloud Sync FSM** | Rating updates `FSRSCard` parameters in SQLite $\rightarrow$ Inserts mutation row into `ps_crud` outbox for cloud sync. |
| **Vault Security** | Transition to `Locked` | **Cloud Sync FSM** | Clears decrypted Vault page caches in memory; ensures only encrypted ciphertext blobs are passed to PowerSync connector outbox. |
| **Agentic RAG FSM** | `ReflectingAndEvaluating` retry | **Cloud Sync / DB** | Low confidence triggers expanded vector search against local and cloud RRF indices. |
| **Subscription FSM** | Transition to `BYOKActive` | **Agentic RAG FSM** | Decrypts and injects user BYOK API keys into LLM request headers. |
| **BullMQ Job FSM** | `GUARDRAIL_VIOLATION` | **Audit Logger** | Logs injection canary or PII detection flags to Redis security stream. |
| **PDF Occlusion FSM** | `SUBMIT_RATING` | **Flashcard Review FSM** | Integrates image occlusion masks into standard FSRS review queue ($R \ge 0.90$). |

---
*End of State Machines Specification (`13_state_machines.md`)*
