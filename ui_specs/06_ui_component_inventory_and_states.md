# UI Spec 06: Exhaustive Component Inventory & State Machines

## 1. Exhaustive Component Categorization Matrix

### A. Navigation & Tree Hierarchy
- `TreeSidebar`: Main collapsible tree navigation panel.
- `TreeNodeItem`: Single page/folder row item with drag handle, expand toggle, and title.
- `TopicBranchBlueprint`: Generative AI card previewing structured note branches.
- `BreadcrumbBar`: Top navigation bar with path links and view controls.
- `VaultSwitcherPill`: Dropdown selector for switching local vaults.

### B. Block Editor Components
- `EditorCanvasContainer`: Main scroll container for page blocks.
- `PageHeaderCover`: Hero cover image & icon picker anchor.
- `PagePropertiesBar`: Meta tags (Date, Word Count, Tags, Sync Status).
- `BlockWrapper`: Draggable wrapper for all 12 block types with hover handles.
- `SlashMenuPopover`: Interactive `/` block insertion command menu.
- `InlineSelectionBar`: Floating formatting toolbar.

### C. Generative AI Copilot & Chatbox
- `CopilotChatPanel`: Glassmorphic sidebar or modal chat interface.
- `GenerativeStreamMessage`: Chat message container supporting text + embedded UI cards.
- `GenerativeWidgetCard`: Renderer for live Flashcards, Note Blueprints, Code execution cards.
- `RAGCitationPill`: Clickable citation pill opening source document chunk.
- `VoiceQueryButton`: Microphone trigger button with animated speech audio wave.

### D. Flashcard & Study Workspace
- `StudyDeckHeader`: Progress title bar for flashcard sessions.
- `FlipFlashcardWidget`: 3D flipping card container (Front / Back).
- `FSRSGradeButtonRow`: Spaced repetition response buttons (*Again*, *Hard*, *Good*, *Easy*).
- `MasteryProgressRing`: SVG circular progress indicator showing recall percentage.

### E. Canvas & PDF Workspace
- `SkiaCanvasViewport`: Interactive 2D spatial canvas area.
- `CanvasToolbar`: Selection, Pen, Rectangle, Arrow, Node Linker tools.
- `PdfPageSidebar`: Thumbnail strip for PDF document navigation.
- `PdfAnnotationOverlay`: Highlighter and text selection overlay.

---

## 2. State Machine UI Specs (All Phases)

### 1. Idle State
- Clean, minimal layout with subtle ambient glass glows.
- Prompt suggestions in AI Chatbox (*"Summarize recent notes"*, *"Create topic branch"*).

### 2. Loading Phase (Skeleton Shimmer)
- Translucent shimmer sweep animations matching exact element bounds (`width: 100%`, `height: 24px`, gradient sweep angle 90deg).

### 3. Working / Processing Phase
- Pulsing glow border around active block or processing task (`box-shadow: 0 0 16px rgba(189, 147, 249, 0.4)`).

### 4. AI Thinking Phase
- Iridescent Apple Intelligence-style fluid gradient aura edging the AI Chatbox container.

### 5. Downloading / Exporting Phase
- Centered glass modal with radial percentage ring (`0%` -> `100%`) and status text (*Step 2 of 3: Rendering PDF pages...*).

### 6. Syncing / Wait Phase
- Micro-pill indicator in top header (*Saving...* -> *Saved 2m ago* with emerald checkmark).

### 7. Offline / Reconnecting Phase
- Floating top banner toast (`amber` background, retry timer button).
