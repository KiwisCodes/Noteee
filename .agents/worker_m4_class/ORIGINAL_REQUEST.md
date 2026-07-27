## 2026-07-26T10:39:31Z
<USER_REQUEST>
You are a specialist Worker agent assigned to Milestone 4.
Your working directory is `/Users/apple/Coding-projects/Noteee/.agents/worker_m4_class/`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

YOUR TASK:
Create the complete class diagrams and data model specification file: `/Users/apple/Coding-projects/Noteee/11_class_diagrams.md`.

REQUIREMENTS:
1. Provide a comprehensive software class diagram and interface contract specification for Noteee.
2. Include valid standard Mermaid `classDiagram` blocks for all core domains:
   - Repository Interfaces & Implementations: `INoteRepository`, `IFolderRepository`, `ITagRepository` and Drizzle SQLite implementations (`DrizzleNoteRepository`, `DrizzleFolderRepository`, `DrizzleTagRepository`).
   - AI Service Interfaces & Implementations: `IEmbedder` (`MiniLMEmbedder`), `ISpeechToText` (`WhisperSTT`), `ITextRecognizer` (`VisionOCR`), `IClassificationEngine` (`LocalLLMClassifier`).
   - Capture Strategy Pattern: `ICaptureSource` interface with implementations `AudioCaptureSource`, `VideoCaptureSource`, `ImageCaptureSource`, `WebCaptureSource`, `TextCaptureSource`, and `CaptureSessionManager`.
   - Block Type Hierarchy & Data Models: `BaseBlock` abstract class/interface, `ParagraphBlock`, `HeadingBlock`, `TodoBlock`, `ToggleBlock`, `CalloutBlock`, `CodeBlock`, `MathBlock`, `ImageBlock`, `AudioBlock`, `SubpageLinkBlock`, `CanvasEmbedBlock`, `FlashcardClozeBlock`. Include attributes (`id`, `pageId`, `parentBlockId`, `type`, `contentJson`, `sortOrder`, `createdAt`, `updatedAt`).
   - FSRS Spaced Repetition Engine: `FSRSScheduler`, `Card`, `Rating` enum (Again=1, Hard=2, Good=3, Easy=4), `SchedulingState`, `FSRSParameters` (weights w0..w18, decay F=1/9 formula).
   - Billing Provider Adapter: `IBillingAdapter`, `RevenueCatAdapter`, `EntitlementState`, `SubscriptionTier` enum (Free, Pro, Team).
3. Include full method signatures, parameter types, return types, field visibility (+/-/#), and proper class relationships (`<|--` inheritance, `<|..` realization, `-->` association, `o--` aggregation, `*--` composition).
4. Ensure 100% cross-file consistency with `01_original_feature_list.md` through `09_sector_6_sync_collab_monetization_spec.md`.
5. Ensure valid standard Mermaid syntax. Do NOT use unescaped semicolons or invalid syntax characters inside Mermaid node text or lines.
6. Write the completed deliverable directly to `/Users/apple/Coding-projects/Noteee/11_class_diagrams.md` using `write_to_file`.

When completed, output a summary and call `send_message` back to parent orchestrator.
</USER_REQUEST>
