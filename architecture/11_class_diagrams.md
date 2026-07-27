# Noteee: System Class Diagrams & Data Model Specification

## 1. Architectural Overview & Domain Decomposition

Noteee is built upon a decoupled, offline-first architecture following the **Dependency Inversion Principle (DIP)** and the **Open/Closed Principle (OCP)**. This document provides the complete, authoritative software class diagrams, interface contract specifications, and object model relationships across all core domains of the application.

The core domains modeled within this specification include:
1. **Repository Interfaces & SQLite Implementations** (`INoteRepository`, `IFolderRepository`, `ITagRepository`, `DrizzleNoteRepository`, `DrizzleFolderRepository`, `DrizzleTagRepository`).
2. **AI Service Interfaces & Local Intelligence Engines** (`IEmbedder`, `ISpeechToText`, `ITextRecognizer`, `IClassificationEngine`, `MiniLMEmbedder`, `WhisperSTT`, `VisionOCR`, `LocalLLMClassifier`).
3. **Multi-Modal Capture Strategy Pattern** (`ICaptureSource`, `AudioCaptureSource`, `VideoCaptureSource`, `ImageCaptureSource`, `WebCaptureSource`, `TextCaptureSource`, `CaptureSessionManager`).
4. **Notion-Grade Block Type Hierarchy & Data Models** (`BaseBlock` abstract class, 12 specialized block classes, and JSON payload contracts).
5. **FSRS Spaced Repetition Engine** (`IFSRSScheduler`, `FSRSScheduler`, `Card`, `Rating`, `SchedulingState`, `FSRSParameters`).
6. **Billing Provider Adapter & Multi-Source Monetization** (`IBillingAdapter`, `MultiSourceBillingAdapter`, `RevenueCatAdapter`, `BYOKKeyManager`, `AdMobBannerAdapter`).
7. **Multi-Modal Agentic RAG Subsystem** (`IRagEngine`, `LocalOnnxRagEngine`, `CloudPgVectorRagEngine`, `HybridRrfRetriever`, `TextChunker`).
8. **Spatial Canvas Indexing Engine** (`IStrokeSpatialIndex`, `RTreeSpatialIndex`, `CanvasStroke`, `BoundingBox`).
9. **Asynchronous Job Queue Adapter** (`IJobQueueAdapter`, `BullMQJobQueueAdapter`, `QueueJob`, `JobStatus`).
10. **Tiered Rate Limiter** (`IRateLimiter`, `RedisLuaRateLimiter`, `RateLimitResult`).
11. **PDF Annotation & Occlusion Engine** (`IPdfAnnotationEngine`, `SkiaPdfAnnotationEngine`, `QuadSnapBox`, `OcclusionMask`).
12. **Safety Guardrail Pipeline** (`ISafetyGuardrail`, `SystemSafetyGuardrailChain`, `SafetyAuditResult`).

---

## 2. Repository Layer Class Diagrams

The repository layer isolates domain business logic from the underlying persistent storage (Drizzle ORM over SQLite via `@op-engineering/op-sqlite` on native platforms and PostgreSQL on cloud/web).

### 2.1 Domain Class Diagram

```mermaid
classDiagram
    class Page {
        +string id
        +string folderId
        +string parentPageId
        +string title
        +string icon
        +string coverImage
        +boolean isVault
        +string createdAt
        +string updatedAt
    }

    class Folder {
        +string id
        +string parentId
        +string name
        +string icon
        +string color
        +string path
        +boolean isSystemAnchor
        +boolean isVault
        +string createdAt
        +string updatedAt
    }

    class Tag {
        +string id
        +string name
        +string color
    }

    class PageTag {
        +string id
        +string pageId
        +string tagId
        +boolean isAutoTag
    }

    class INoteRepository {
        <<interface>>
        +findById(id: string) Promise~Page~
        +findByFolder(folderId: string) Promise~PageArray~
        +create(page: PageInsert) Promise~Page~
        +update(id: string, updates: PageUpdate) Promise~Page~
        +delete(id: string) Promise~boolean~
        +searchByTitle(query: string) Promise~PageArray~
        +getDailyNote(date: string) Promise~Page~
    }

    class IFolderRepository {
        <<interface>>
        +findById(id: string) Promise~Folder~
        +findSubfolders(parentId: string) Promise~FolderArray~
        +create(folder: FolderInsert) Promise~Folder~
        +update(id: string, updates: FolderUpdate) Promise~Folder~
        +delete(id: string) Promise~boolean~
        +getSystemAnchors() Promise~FolderArray~
    }

    class ITagRepository {
        <<interface>>
        +findById(id: string) Promise~Tag~
        +findByName(name: string) Promise~Tag~
        +create(tag: TagInsert) Promise~Tag~
        +delete(id: string) Promise~boolean~
        +getTagsForPage(pageId: string) Promise~TagArray~
        +attachTagToPage(pageId: string, tagId: string, isAutoTag: boolean) Promise~void~
        +detachTagFromPage(pageId: string, tagId: string) Promise~void~
    }

    class DrizzleNoteRepository {
        -db: DrizzleDatabase
        +constructor(db: DrizzleDatabase)
        +findById(id: string) Promise~Page~
        +findByFolder(folderId: string) Promise~PageArray~
        +create(page: PageInsert) Promise~Page~
        +update(id: string, updates: PageUpdate) Promise~Page~
        +delete(id: string) Promise~boolean~
        +searchByTitle(query: string) Promise~PageArray~
        +getDailyNote(date: string) Promise~Page~
    }

    class DrizzleFolderRepository {
        -db: DrizzleDatabase
        +constructor(db: DrizzleDatabase)
        +findById(id: string) Promise~Folder~
        +findSubfolders(parentId: string) Promise~FolderArray~
        +create(folder: FolderInsert) Promise~Folder~
        +update(id: string, updates: FolderUpdate) Promise~Folder~
        +delete(id: string) Promise~boolean~
        +getSystemAnchors() Promise~FolderArray~
    }

    class DrizzleTagRepository {
        -db: DrizzleDatabase
        +constructor(db: DrizzleDatabase)
        +findById(id: string) Promise~Tag~
        +findByName(name: string) Promise~Tag~
        +create(tag: TagInsert) Promise~Tag~
        +delete(id: string) Promise~boolean~
        +getTagsForPage(pageId: string) Promise~TagArray~
        +attachTagToPage(pageId: string, tagId: string, isAutoTag: boolean) Promise~void~
        +detachTagFromPage(pageId: string, tagId: string) Promise~void~
    }

    INoteRepository <|.. DrizzleNoteRepository : realizes
    IFolderRepository <|.. DrizzleFolderRepository : realizes
    ITagRepository <|.. DrizzleTagRepository : realizes

    Folder "1" o-- "0..*" Folder : subfolders
    Folder "1" *-- "0..*" Page : contains
    Page "1" o-- "0..*" Page : nested subpages
    Page "1" *-- "0..*" PageTag : tagged with
    Tag "1" *-- "0..*" PageTag : attached to
```

### 2.2 Interface & Entity Contract Details

- **`INoteRepository`**: Handles page CRUD and Daily Note lookup operations. Enforces Zero-Orphans routing into system folders when parent folder ID is omitted.
- **`IFolderRepository`**: Manages recursive folder hierarchies and system anchor retrieval (7 mandatory anchors: Daily Notes, To-Do & Planner, Miscellaneous, Ideas, Vault, Inbox, Flashcards Hub).
- **`ITagRepository`**: Controls flat tag operations and junction record management in `page_tags`.

---

## 3. AI Service Interfaces & Local Intelligence Class Diagrams

Noteee incorporates on-device AI capabilities for embeddings (`all-MiniLM-L6-v2`), local speech-to-text transcription (`whisper.cpp`), text recognition (`Vision OCR`), and auto-filing placement evaluation.

### 3.1 Domain Class Diagram

```mermaid
classDiagram
    class EmbeddingResult {
        +Float32Array vector
        +number dimensions
        +number tokenCount
        +number executionTimeMs
    }

    class TokenizerOutput {
        +Int32Array inputIds
        +Int32Array attentionMask
        +Int32Array tokenTypeIds
    }

    class PlacementPathway {
        +string pathwayType
        +string targetFolderId
        +string targetFolderPath
        +number confidenceScore
        +string reasoning
    }

    class BoundingBox {
        +number x
        +number y
        +number width
        +number height
    }

    class IEmbedder {
        <<interface>>
        +initialize() Promise~void~
        +generateEmbedding(text: string) Promise~EmbeddingResult~
        +generateBatchEmbeddings(texts: string[]) Promise~EmbeddingResultArray~
        +tokenize(text: string, maxLength: number) Promise~TokenizerOutput~
        +dispose() Promise~void~
    }

    class ISpeechToText {
        <<interface>>
        +initialize(modelName: string) Promise~void~
        +startRealtimeTranscription(onSegment: Function) Promise~void~
        +transcribeAudioFile(filePath: string) Promise~string~
        +stopTranscription() Promise~string~
        +dispose() Promise~void~
    }

    class ITextRecognizer {
        <<interface>>
        +recognizeText(imageUri: string) Promise~string~
        +detectBoundingBoxes(imageUri: string) Promise~BoundingBoxArray~
        +cropAndRecognize(imageUri: string, box: BoundingBox) Promise~string~
    }

    class IClassificationEngine {
        <<interface>>
        +evaluatePlacement(noteText: string, noteEmbedding: Float32Array) Promise~PlacementPathway~
        +updateFolderVector(folderId: string) Promise~void~
        +reindexWorkspaceVectors() Promise~void~
    }

    class MiniLMEmbedder {
        -modelPath: string
        -onnxSession: ONNXInferenceSession
        -tokenizer: ONNXBertTokenizer
        -isLoaded: boolean
        +initialize() Promise~void~
        +generateEmbedding(text: string) Promise~EmbeddingResult~
        +generateBatchEmbeddings(texts: string[]) Promise~EmbeddingResultArray~
        +tokenize(text: string, maxLength: number) Promise~TokenizerOutput~
        +dispose() Promise~void~
    }

    class WhisperSTT {
        -modelPath: string
        -whisperContext: WhisperContext
        -isRecording: boolean
        +initialize(modelName: string) Promise~void~
        +startRealtimeTranscription(onSegment: Function) Promise~void~
        +transcribeAudioFile(filePath: string) Promise~string~
        +stopTranscription() Promise~string~
        +dispose() Promise~void~
    }

    class VisionOCR {
        -ocrEngine: VisionNativeEngine
        +recognizeText(imageUri: string) Promise~string~
        +detectBoundingBoxes(imageUri: string) Promise~BoundingBoxArray~
        +cropAndRecognize(imageUri: string, box: BoundingBox) Promise~string~
    }

    class LocalLLMClassifier {
        -embedder: IEmbedder
        -folderRepo: IFolderRepository
        +evaluatePlacement(noteText: string, noteEmbedding: Float32Array) Promise~PlacementPathway~
        +updateFolderVector(folderId: string) Promise~void~
        +reindexWorkspaceVectors() Promise~void~
    }

    IEmbedder <|.. MiniLMEmbedder : realizes
    ISpeechToText <|.. WhisperSTT : realizes
    ITextRecognizer <|.. VisionOCR : realizes
    IClassificationEngine <|.. LocalLLMClassifier : realizes

    LocalLLMClassifier --> IEmbedder : uses for vector generation
    LocalLLMClassifier --> PlacementPathway : produces
    MiniLMEmbedder --> EmbeddingResult : produces
    MiniLMEmbedder --> TokenizerOutput : produces
    VisionOCR --> BoundingBox : uses
```

---

## 4. Multi-Modal Capture Strategy Pattern Class Diagrams

The multi-modal capture subsystem uses the **Strategy Pattern** to decouple media acquisition logic from session management and persistence.

### 4.1 Domain Class Diagram

```mermaid
classDiagram
    class CaptureModality {
        <<enumeration>>
        AUDIO
        VIDEO
        IMAGE
        WEB
        TEXT
    }

    class CaptureSessionState {
        <<enumeration>>
        IDLE
        RECORDING
        PROCESSING
        SUGGESTION
        FILED
        CANCELLED
    }

    class RawCapturePayload {
        +string sourceMetadata
        +string[] binaryPaths
        +string textPayload
        +Record~string, any~ metadata
    }

    class CaptureSession {
        +string id
        +CaptureSessionState status
        +CaptureModality mediaType
        +string targetFolderId
        +string targetPageId
        +Record~string, any~ sessionData
        +string createdAt
        +string updatedAt
    }

    class ICaptureSource {
        <<interface>>
        +CaptureModality modality
        +boolean isAvailable
        +initialize() Promise~void~
        +startCapture(options: Record~string, any~) Promise~void~
        +pauseCapture() Promise~void~
        +resumeCapture() Promise~void~
        +stopCapture() Promise~RawCapturePayload~
        +dispose() Promise~void~
    }

    class AudioCaptureSource {
        -audioRecorder: AudioRecorder
        -whisperSTT: ISpeechToText
        +CaptureModality modality
        +boolean isAvailable
        +initialize() Promise~void~
        +startCapture(options: Record~string, any~) Promise~void~
        +pauseCapture() Promise~void~
        +resumeCapture() Promise~void~
        +stopCapture() Promise~RawCapturePayload~
        +dispose() Promise~void~
    }

    class VideoCaptureSource {
        -cameraDriver: VideoCameraDriver
        +CaptureModality modality
        +boolean isAvailable
        +initialize() Promise~void~
        +startCapture(options: Record~string, any~) Promise~void~
        +stopCapture() Promise~RawCapturePayload~
        +dispose() Promise~void~
    }

    class ImageCaptureSource {
        -cameraEngine: ExpoCamera
        -visionOCR: ITextRecognizer
        +CaptureModality modality
        +boolean isAvailable
        +initialize() Promise~void~
        +startCapture(options: Record~string, any~) Promise~void~
        +stopCapture() Promise~RawCapturePayload~
        +dispose() Promise~void~
    }

    class WebCaptureSource {
        -htmlParser: WebScraper
        +CaptureModality modality
        +boolean isAvailable
        +initialize() Promise~void~
        +startCapture(options: Record~string, any~) Promise~void~
        +stopCapture() Promise~RawCapturePayload~
        +dispose() Promise~void~
    }

    class TextCaptureSource {
        -clipboardDetector: ClipboardDetector
        +CaptureModality modality
        +boolean isAvailable
        +initialize() Promise~void~
        +startCapture(options: Record~string, any~) Promise~void~
        +stopCapture() Promise~RawCapturePayload~
        +dispose() Promise~void~
    }

    class CaptureSessionManager {
        -activeSession: CaptureSession
        -currentSource: ICaptureSource
        -observers: ICaptureEventObserverArray
        +startSession(modality: CaptureModality, options: Record~string, any~) Promise~CaptureSession~
        +appendMediaChunk(sessionId: string, chunk: RawCapturePayload) Promise~CaptureSession~
        +pauseSession(sessionId: string) Promise~void~
        +resumeSession(sessionId: string) Promise~void~
        +stopCaptureAndProcess(sessionId: string) Promise~CaptureSession~
        +confirmPlacement(sessionId: string, targetFolderId: string, targetPageId: string) Promise~string~
        +cancelSession(sessionId: string) Promise~void~
        +recoverOrphanSessions() Promise~CaptureSessionArray~
    }

    ICaptureSource <|.. AudioCaptureSource : realizes
    ICaptureSource <|.. VideoCaptureSource : realizes
    ICaptureSource <|.. ImageCaptureSource : realizes
    ICaptureSource <|.. WebCaptureSource : realizes
    ICaptureSource <|.. TextCaptureSource : realizes

    CaptureSessionManager o-- ICaptureSource : encapsulates strategy
    CaptureSessionManager *-- CaptureSession : manages lifecycle
    ICaptureSource --> RawCapturePayload : produces
    CaptureSession --> CaptureModality : uses
    CaptureSession --> CaptureSessionState : tracks
```

---

## 5. Notion-Grade Block Type Hierarchy & Data Models

Noteee's block engine uses a recursive composite pattern where pages are constructed as ordered lists of `BaseBlock` instances. Every block record in SQLite contains fixed core tracking attributes (`id`, `pageId`, `parentBlockId`, `type`, `contentJson`, `sortOrder`, `createdAt`, `updatedAt`).

### 5.1 Domain Class Diagram

```mermaid
classDiagram
    class BaseBlock {
        <<abstract>>
        +string id
        +string pageId
        +string parentBlockId
        +string type
        +Record~string, any~ contentJson
        +number sortOrder
        +string createdAt
        +string updatedAt
        +render() JSXElement*
        +toJSON() Record~string, any~*
        +clone() BaseBlock*
    }

    class ParagraphBlock {
        +ParagraphBlockContent contentJson
        +render() JSXElement
        +toJSON() Record~string, any~
        +clone() BaseBlock
    }

    class HeadingBlock {
        +HeadingBlockContent contentJson
        +render() JSXElement
        +toJSON() Record~string, any~
        +clone() BaseBlock
    }

    class TodoBlock {
        +TodoItemBlockContent contentJson
        +render() JSXElement
        +toJSON() Record~string, any~
        +clone() BaseBlock
    }

    class ToggleBlock {
        +ToggleListBlockContent contentJson
        +render() JSXElement
        +toJSON() Record~string, any~
        +clone() BaseBlock
    }

    class CalloutBlock {
        +QuoteBlockContent contentJson
        +render() JSXElement
        +toJSON() Record~string, any~
        +clone() BaseBlock
    }

    class CodeBlock {
        +CodeBlockContent contentJson
        +render() JSXElement
        +toJSON() Record~string, any~
        +clone() BaseBlock
    }

    class MathBlock {
        +LatexMathBlockContent contentJson
        +render() JSXElement
        +toJSON() Record~string, any~
        +clone() BaseBlock
    }

    class ImageBlock {
        +ImageEmbedBlockContent contentJson
        +render() JSXElement
        +toJSON() Record~string, any~
        +clone() BaseBlock
    }

    class AudioBlock {
        +AudioBlockContent contentJson
        +render() JSXElement
        +toJSON() Record~string, any~
        +clone() BaseBlock
    }

    class SubpageLinkBlock {
        +PageLinkBlockContent contentJson
        +render() JSXElement
        +toJSON() Record~string, any~
        +clone() BaseBlock
    }

    class CanvasEmbedBlock {
        +CanvasEmbedBlockContent contentJson
        +render() JSXElement
        +toJSON() Record~string, any~
        +clone() BaseBlock
    }

    class FlashcardClozeBlock {
        +FlashcardClozeBlockContent contentJson
        +render() JSXElement
        +toJSON() Record~string, any~
        +clone() BaseBlock
    }

    BaseBlock <|-- ParagraphBlock : inherits
    BaseBlock <|-- HeadingBlock : inherits
    BaseBlock <|-- TodoBlock : inherits
    BaseBlock <|-- ToggleBlock : inherits
    BaseBlock <|-- CalloutBlock : inherits
    BaseBlock <|-- CodeBlock : inherits
    BaseBlock <|-- MathBlock : inherits
    BaseBlock <|-- ImageBlock : inherits
    BaseBlock <|-- AudioBlock : inherits
    BaseBlock <|-- SubpageLinkBlock : inherits
    BaseBlock <|-- CanvasEmbedBlock : inherits
    BaseBlock <|-- FlashcardClozeBlock : inherits
```

---

## 6. FSRS Spaced Repetition Engine Class Diagrams

Noteee schedules smart flashcards (Cloze deletion & Q&A) using the **Free Spaced Repetition Scheduler (FSRS v5.0.x)** algorithm implemented via `ts-fsrs`.

### 6.1 Domain Class Diagram

```mermaid
classDiagram
    class Rating {
        <<enumeration>>
        Again = 1
        Hard = 2
        Good = 3
        Easy = 4
    }

    class SchedulingState {
        <<enumeration>>
        New
        Learning
        Review
        Relearning
    }

    class Card {
        +string id
        +string pageId
        +string sourceBlockId
        +string type
        +string front
        +string back
        +string clozeHint
        +Date due
        +number stability
        +number difficulty
        +number elapsedDays
        +number scheduledDays
        +number repetition
        +number lapses
        +SchedulingState state
        +Date lastReview
        +string createdAt
        +string updatedAt
    }

    class FSRSReviewLog {
        +Rating rating
        +SchedulingState state
        +Date due
        +number stability
        +number difficulty
        +number elapsedDays
        +number lastElapsedDays
        +number scheduledDays
        +Date review
    }

    class FSRSParameters {
        +number[] w
        +number requestRetention
        +number maximumInterval
        +boolean enableFuzz
        +decayFormulaF() number
    }

    class FSRSSchedulingInfo {
        +Card card
        +FSRSReviewLog log
    }

    class FSRSNextSchedules {
        +FSRSSchedulingInfo scheduleAgain
        +FSRSSchedulingInfo scheduleHard
        +FSRSSchedulingInfo scheduleGood
        +FSRSSchedulingInfo scheduleEasy
    }

    class IFSRSScheduler {
        <<interface>>
        +calculateNextSchedules(card: Card, reviewDate: Date) FSRSNextSchedules
        +processReview(card: Card, rating: Rating, reviewDate: Date) FSRSSchedulingInfo
        +createNewCard(id: string) Card
    }

    class FSRSScheduler {
        -parameters: FSRSParameters
        +constructor(params: FSRSParameters)
        +calculateNextSchedules(card: Card, reviewDate: Date) FSRSNextSchedules
        +processReview(card: Card, rating: Rating, reviewDate: Date) FSRSSchedulingInfo
        +createNewCard(id: string) Card
    }

    IFSRSScheduler <|.. FSRSScheduler : realizes
    FSRSScheduler *-- FSRSParameters : contains
    Card --> SchedulingState : tracks state
    FSRSReviewLog --> Rating : logs rating
    FSRSReviewLog --> SchedulingState : logs state
    FSRSSchedulingInfo *-- Card : updated card
    FSRSSchedulingInfo *-- FSRSReviewLog : audit log
    FSRSNextSchedules *-- FSRSSchedulingInfo : rating options
```

---

## 7. Billing Provider & Entitlement Adapter Class Diagrams

The billing provider adapter abstracts payment SDKs (`react-native-purchases` for RevenueCat) behind `IBillingAdapter`, ensuring isolated monetization checks.

### 7.1 Domain Class Diagram

```mermaid
classDiagram
    class SubscriptionTier {
        <<enumeration>>
        Free
        Pro
        Team
    }

    class EntitlementState {
        +boolean isPro
        +boolean isLifetime
        +string[] activeEntitlements
        +Date expirationDate
        +boolean willRenew
        +SubscriptionTier subscriptionTier
    }

    class RevenueCatAdapter {
        -apiKey: string
        -userId: string
        -currentEntitlements: EntitlementState
        +initialize(apiKey: string, userId: string) Promise~void~
        +getEntitlements() Promise~EntitlementState~
        +purchasePackage(packageId: string) Promise~EntitlementState~
        +restorePurchases() Promise~EntitlementState~
        +onEntitlementsUpdated(callback: Function) Function
    }

    RevenueCatAdapter --> EntitlementState : produces
    EntitlementState --> SubscriptionTier : contains
```

---

## 8. Cross-Domain Class Relationship Macro Map

```mermaid
classDiagram
    class CaptureSessionManager {
        +confirmPlacement(sessionId: string, targetFolderId: string, targetPageId: string) Promise~string~
    }

    class IClassificationEngine {
        +evaluatePlacement(noteText: string, noteEmbedding: Float32Array) Promise~PlacementPathway~
    }

    class INoteRepository {
        +create(page: PageInsert) Promise~Page~
    }

    class Page {
        +string id
        +string folderId
    }

    class BaseBlock {
        +string id
        +string pageId
    }

    class Card {
        +string id
        +string sourceBlockId
    }

    class FSRSScheduler {
        +processReview(card: Card, rating: Rating, reviewDate: Date) FSRSSchedulingInfo
    }

    class RevenueCatAdapter {
        +getEntitlements() Promise~EntitlementState~
    }

    CaptureSessionManager --> IClassificationEngine : requests placement analysis
    CaptureSessionManager --> INoteRepository : persists confirmed page & blocks
    INoteRepository --> Page : manages
    Page "1" *-- "0..*" BaseBlock : contains
    Card "0..1" --> "1" BaseBlock : links to source block
    FSRSScheduler --> Card : updates spaced repetition state
    RevenueCatAdapter --> CaptureSessionManager : unlocks cloud & TTS entitlements
```

---

## 9. Multi-Modal Agentic RAG Subsystem Class Diagrams (`IRagEngine`)

The Multi-Modal Agentic RAG subsystem isolates query decomposition, hybrid Reciprocal Rank Fusion (RRF) retrieval, and reflective evaluation behind `IRagEngine`.

### 9.1 Domain Class Diagram

```mermaid
classDiagram
    class Chunk {
        +string id
        +string pageId
        +string blockId
        +string textContent
        +Float32Array vectorEmbedding
        +number tokenCount
        +Record~string, any~ metadata
    }

    class SearchResult {
        +Chunk chunk
        +number denseScore
        +number sparseScore
        +number rrfScore
    }

    class IRagEngine {
        <<interface>>
        +chunkDocument(text: string, maxTokens: number) ChunkArray
        +generateEmbeddings(text: string) Promise~Float32Array~
        +vectorSearch(embedding: Float32Array, topK: number) Promise~SearchResultArray~
        +hybridRrfSearch(query: string, topK: number) Promise~SearchResultArray~
        +executeAgenticLoop(query: string) Promise~string~
    }

    class LocalOnnxRagEngine {
        -embedder: MiniLMEmbedder
        -chunker: TextChunker
        +chunkDocument(text: string, maxTokens: number) ChunkArray
        +generateEmbeddings(text: string) Promise~Float32Array~
        +vectorSearch(embedding: Float32Array, topK: number) Promise~SearchResultArray~
        +hybridRrfSearch(query: string, topK: number) Promise~SearchResultArray~
        +executeAgenticLoop(query: string) Promise~string~
    }

    class CloudPgVectorRagEngine {
        -pgPool: PostgresPool
        -chunker: TextChunker
        +chunkDocument(text: string, maxTokens: number) ChunkArray
        +generateEmbeddings(text: string) Promise~Float32Array~
        +vectorSearch(embedding: Float32Array, topK: number) Promise~SearchResultArray~
        +hybridRrfSearch(query: string, topK: number) Promise~SearchResultArray~
        +executeAgenticLoop(query: string) Promise~string~
    }

    class HybridRrfRetriever {
        -kConstant: number
        +combine(sparseResults: SearchResultArray, denseResults: SearchResultArray) SearchResultArray
    }

    class TextChunker {
        +maxTokens: number
        +overlapTokens: number
        +splitText(text: string) ChunkArray
    }

    IRagEngine <|.. LocalOnnxRagEngine : realizes
    IRagEngine <|.. CloudPgVectorRagEngine : realizes
    LocalOnnxRagEngine --> TextChunker : uses
    CloudPgVectorRagEngine --> TextChunker : uses
    LocalOnnxRagEngine --> HybridRrfRetriever : uses
    CloudPgVectorRagEngine --> HybridRrfRetriever : uses
    IRagEngine --> Chunk : creates
    IRagEngine --> SearchResult : produces
```

---

## 10. Spatial R-Tree Canvas Index Class Diagrams (`IStrokeSpatialIndex`)

The spatial stroke indexing engine provides $O(\log N)$ spatial query resolution over infinite GPU Skia vector canvas paths.

### 10.1 Domain Class Diagram

```mermaid
classDiagram
    class BoundingBox {
        +number minX
        +number minY
        +number maxX
        +number maxY
    }

    class StrokePoint {
        +number x
        +number y
        +number pressure
        +number timestamp
    }

    class CanvasStroke {
        +string id
        +string layerId
        +StrokePointArray points
        +BoundingBox bounds
        +string color
        +number width
    }

    class IStrokeSpatialIndex {
        <<interface>>
        +insert(stroke: CanvasStroke) void
        +remove(strokeId: string) boolean
        +queryRange(box: BoundingBox) CanvasStrokeArray
        +queryNearest(x: number, y: number, radius: number) CanvasStrokeArray
        +clear() void
    }

    class RTreeSpatialIndex {
        -maxNodeEntries: number
        -minNodeEntries: number
        +insert(stroke: CanvasStroke) void
        +remove(strokeId: string) boolean
        +queryRange(box: BoundingBox) CanvasStrokeArray
        +queryNearest(x: number, y: number, radius: number) CanvasStrokeArray
        +clear() void
    }

    IStrokeSpatialIndex <|.. RTreeSpatialIndex : realizes
    CanvasStroke --> BoundingBox : defines bounds
    CanvasStroke *-- StrokePoint : contains
    IStrokeSpatialIndex --> CanvasStroke : indexes
```

---

## 11. Asynchronous Job Queue Class Diagrams (`IJobQueueAdapter`)

The job queue subsystem wraps BullMQ over Redis Cluster DB 2 to handle background task dispatch, worker concurrency, and retry strategies.

### 11.1 Domain Class Diagram

```mermaid
classDiagram
    class JobOptions {
        +number priority
        +number delay
        +number attempts
        +Record~string, any~ backoff
    }

    class JobStatus {
        <<enumeration>>
        WAITING
        ACTIVE
        COMPLETED
        FAILED
        DELAYED
    }

    class QueueJob {
        +string id
        +string name
        +Record~string, any~ payload
        +JobStatus status
        +number progress
    }

    class IJobQueueAdapter {
        <<interface>>
        +addJob(queueName: string, jobName: string, payload: Record~string, any~, opts: JobOptions) Promise~QueueJob~
        +processQueue(queueName: string, handler: Function) void
        +getJobStatus(jobId: string) Promise~JobStatus~
        +cancelJob(jobId: string) Promise~boolean~
    }

    class BullMQJobQueueAdapter {
        -redisHost: string
        -redisPort: number
        -activeQueues: Map~string, any~
        +addJob(queueName: string, jobName: string, payload: Record~string, any~, opts: JobOptions) Promise~QueueJob~
        +processQueue(queueName: string, handler: Function) void
        +getJobStatus(jobId: string) Promise~JobStatus~
        +cancelJob(jobId: string) Promise~boolean~
    }

    IJobQueueAdapter <|.. BullMQJobQueueAdapter : realizes
    IJobQueueAdapter --> QueueJob : manages
    QueueJob --> JobStatus : tracks
    QueueJob --> JobOptions : uses
```

---

## 12. Tiered Rate Limiter Class Diagrams (`IRateLimiter`)

The cloud rate limiter enforces multi-tenant token bucket and sliding window rate limiting backed by Redis Cluster DB 0 Lua scripts.

### 12.1 Domain Class Diagram

```mermaid
classDiagram
    class RateLimitResult {
        +boolean allowed
        +number remainingTokens
        +number resetTimeMs
        +string limitType
    }

    class RateLimitAlgorithm {
        <<enumeration>>
        TOKEN_BUCKET
        SLIDING_WINDOW
        LEAKY_BUCKET
    }

    class IRateLimiter {
        <<interface>>
        +checkRateLimit(key: string, limit: number, windowMs: number) Promise~RateLimitResult~
        +consumeToken(key: string, tokens: number) Promise~RateLimitResult~
        +resetLimit(key: string) Promise~void~
    }

    class RedisLuaRateLimiter {
        -redisCluster: RedisClient
        -algorithm: RateLimitAlgorithm
        -scriptSha: string
        +checkRateLimit(key: string, limit: number, windowMs: number) Promise~RateLimitResult~
        +consumeToken(key: string, tokens: number) Promise~RateLimitResult~
        +resetLimit(key: string) Promise~void~
        -executeLuaScript(key: string, args: string[]) Promise~RateLimitResult~
    }

    IRateLimiter <|.. RedisLuaRateLimiter : realizes
    IRateLimiter --> RateLimitResult : produces
    RedisLuaRateLimiter --> RateLimitAlgorithm : configures
```

---

## 13. PDF Annotation & Occlusion Engine Class Diagrams (`IPdfAnnotationEngine`)

The PDF Annotation & Occlusion Engine handles text quad snapping and FSRS image occlusion mask creation for active recall study workflows.

### 13.1 Domain Class Diagram

```mermaid
classDiagram
    class QuadSnapBox {
        +number x1
        +number y1
        +number x2
        +number y2
        +number x3
        +number y3
        +number x4
        +number y4
        +number confidence
    }

    class OcclusionMask {
        +string id
        +string annotationId
        +QuadSnapBox quad
        +string hiddenText
        +boolean isRevealed
        +Card fsrsCard
    }

    class IPdfAnnotationEngine {
        <<interface>>
        +snapToTextQuad(pageNumber: number, rawBox: BoundingBox) Promise~QuadSnapBox~
        +createAnnotation(pageId: string, pdfUrl: string, quad: QuadSnapBox, text: string) Promise~string~
        +createOcclusionMask(annotationId: string, quad: QuadSnapBox, hiddenText: string) Promise~OcclusionMask~
        +toggleOcclusionMask(maskId: string) Promise~boolean~
        +exportOcclusionsToFsrs(pageId: string) Promise~CardArray~
    }

    class SkiaPdfAnnotationEngine {
        -pdfDistEngine: PdfJsDistWrapper
        -fsrsScheduler: IFSRSScheduler
        +snapToTextQuad(pageNumber: number, rawBox: BoundingBox) Promise~QuadSnapBox~
        +createAnnotation(pageId: string, pdfUrl: string, quad: QuadSnapBox, text: string) Promise~string~
        +createOcclusionMask(annotationId: string, quad: QuadSnapBox, hiddenText: string) Promise~OcclusionMask~
        +toggleOcclusionMask(maskId: string) Promise~boolean~
        +exportOcclusionsToFsrs(pageId: string) Promise~CardArray~
    }

    IPdfAnnotationEngine <|.. SkiaPdfAnnotationEngine : realizes
    OcclusionMask --> QuadSnapBox : bounds
    IPdfAnnotationEngine --> OcclusionMask : creates
```

---

## 14. Multi-Source Monetization, BYOK & AdMob Class Diagrams (`IBillingAdapter`)

The monetization adapter provides a unified domain boundary over RevenueCat subscriptions, Bring-Your-Own-Key (BYOK) hardware-secured key management, and AdMob banner ads for Free Tier users.

### 14.1 Domain Class Diagram

```mermaid
classDiagram
    class KeyManagerConfig {
        +string providerName
        +string userApiKeyEncrypted
        +boolean isByokEnabled
        +number dailyQuota
    }

    class AdMobConfig {
        +string bannerUnitId
        +string interstitialUnitId
        +boolean showAds
    }

    class IBillingAdapter {
        <<interface>>
        +initialize(apiKey: string, userId: string) Promise~void~
        +getEntitlements() Promise~EntitlementState~
        +purchasePackage(packageId: string) Promise~EntitlementState~
        +restorePurchases() Promise~EntitlementState~
        +validateByokKey(apiKey: string, provider: string) Promise~boolean~
        +setByokKey(apiKey: string, provider: string) Promise~void~
        +shouldShowAds() Promise~boolean~
    }

    class MultiSourceBillingAdapter {
        -revenueCat: RevenueCatAdapter
        -keyManager: BYOKKeyManager
        -adMobAdapter: AdMobBannerAdapter
        +initialize(apiKey: string, userId: string) Promise~void~
        +getEntitlements() Promise~EntitlementState~
        +purchasePackage(packageId: string) Promise~EntitlementState~
        +restorePurchases() Promise~EntitlementState~
        +validateByokKey(apiKey: string, provider: string) Promise~boolean~
        +setByokKey(apiKey: string, provider: string) Promise~void~
        +shouldShowAds() Promise~boolean~
    }

    class BYOKKeyManager {
        -secureStorage: NativeKeyStorage
        +encryptAndSaveKey(key: string, provider: string) Promise~void~
        +getDecryptedKey(provider: string) Promise~string~
        +validateKeyFormat(key: string, provider: string) boolean
    }

    class AdMobBannerAdapter {
        -adUnitId: string
        -isInitialized: boolean
        +initializeAdMob() Promise~void~
        +renderBannerAd() JSXElement
        +showInterstitial() Promise~void~
    }

    IBillingAdapter <|.. MultiSourceBillingAdapter : realizes
    MultiSourceBillingAdapter --> BYOKKeyManager : delegates BYOK
    MultiSourceBillingAdapter --> AdMobBannerAdapter : delegates ads
    BYOKKeyManager --> KeyManagerConfig : manages
    AdMobBannerAdapter --> AdMobConfig : configures
```

---

## 15. Safety Guardrail Pipeline Class Diagrams (`ISafetyGuardrail`)

The safety guardrail pipeline enforces PII scrubbing, prompt injection canary detection, and HTML/XSS input sanitization across all AI and user data boundaries.

### 15.1 Domain Class Diagram

```mermaid
classDiagram
    class SafetyAuditResult {
        +boolean isSafe
        +boolean piiDetected
        +boolean promptInjectionDetected
        +boolean xssDetected
        +string sanitizedContent
        +stringArray violationFlags
    }

    class ISafetyGuardrail {
        <<interface>>
        +scrubPii(text: string) Promise~string~
        +detectPromptInjection(prompt: string) Promise~boolean~
        +sanitizeXss(inputHtml: string) Promise~string~
        +validatePayload(content: string) Promise~SafetyAuditResult~
    }

    class SystemSafetyGuardrailChain {
        -piiScrubber: PiiScrubberEngine
        -injectionDetector: InjectionCanaryDetector
        -xssSanitizer: XssSanitizerEngine
        +scrubPii(text: string) Promise~string~
        +detectPromptInjection(prompt: string) Promise~boolean~
        +sanitizeXss(inputHtml: string) Promise~string~
        +validatePayload(content: string) Promise~SafetyAuditResult~
    }

    ISafetyGuardrail <|.. SystemSafetyGuardrailChain : realizes
    ISafetyGuardrail --> SafetyAuditResult : evaluates
```

---
*End of Class Diagrams Specification (`11_class_diagrams.md`)*
