# UI Spec 08: Exhaustive Page Workflows & Feature Play-Outs

## 1. Page Workflow 1: Workspace Note Creation & Editing

```
[ User Action ] -> [ UI State Transition ] -> [ Visual Feedback ]
```

1. **Opening a Note**:
   - User clicks a page node in the `TreeSidebar`.
   - `TreeSidebar` sets `isActive: true` on the item with a smooth slide indicator (`Dracula Pink` active background).
   - Center workspace triggers a `Loading (Skeleton Shimmer)` for 120ms, then fades in `PageHeaderCover` and `BlockContainer` list.
2. **Adding Content via Slash Command**:
   - User presses `Enter` to create a new block, then types `/code`.
   - `SlashMenuPopover` opens instantly at cursor position.
   - User hits `Enter` on "Code Block".
   - Block transitions from `ParagraphBlock` to `CodeBlock` with syntax highlighting and a language selector pill.
3. **Drag-and-Drop Block Reordering**:
   - User hovers over a block; `BlockContainer` displays six-dot drag handle on left.
   - User drags handle down; drop target line highlights in `Dracula Cyan` with subtle spring displacement of surrounding blocks.

---

## 2. Page Workflow 2: Generative AI Copilot & Systematic Topic Branching

1. **Launching AI Chat**:
   - User clicks top-right AI orb or presses `Cmd+K` -> selects "Talk to AI".
   - `CopilotChatDrawer` slides in from right with glass blur backdrop (`backdrop-filter: blur(24px)`).
   - AI displays `Idle State` with ambient prompt pills (*"Research Quantum Computing"*, *"Summarize this page"*).
2. **Generative Topic Branch Creation**:
   - User types: *"Build me a systematic note branch for Quantum Computing."*
   - AI container switches to `AI Thinking Phase` with an iridescent fluid border glow.
   - AI streams response and renders a `TopicBranchBlueprintCard` inside the message history:
     ```
     🌳 Distributed Quantum Computing
     ├── 📄 01_Qubits_and_Superposition.md
     ├── 📄 02_Quantum_Entanglement.md
     └── 📄 03_Shor_and_Grover_Algorithms.md
     ```
3. **Instantiating the Branch**:
   - User clicks **"🚀 Instantiate Branch"**.
   - `TopicBranchBlueprintCard` shows a `Working / Processing` pulse glow with step checkmarks.
   - Left `TreeSidebar` animates open, smoothly expanding a new parent folder `Distributed Quantum Computing` with 3 subpages ready to edit.

---

## 3. Page Workflow 3: Flashcard Active Recall Study Session

1. **Initiating Session**:
   - User opens `/flashcards` route or clicks "Study Deck" on a page property bar.
   - App opens full-screen glass modal `FSRSStudySessionModal`.
2. **Card Flip & Evaluation**:
   - Question side of `FlipFlashcardWidget` displays.
   - User clicks "Show Answer" or presses `Spacebar` -> 3D flip animation rotates card 180deg on Y-axis.
   - Answer side reveals explanation + image occlusion mask.
   - FSRS Grade Buttons appear at bottom: `Again (<10m)`, `Hard (1d)`, `Good (3d)`, `Easy (7d)`.
3. **Session Completion**:
   - On last card, modal transitions to `MasteryProgressRing` summary with accuracy graphs and FSRS stability retention metrics.

---

## 4. Page Workflow 4: Multi-Modal Ingress (Voice, OCR & Web Snip)

1. **Voice Capture**:
   - User taps microphone icon on mobile or desktop search bar.
   - `VoiceQueryWaveform` visualizes speech frequencies in real-time (`Dracula Pink/Purple` dynamic bars).
   - Local Whisper STT converts speech to text, creating a new `ParagraphBlock` or sending to AI Copilot.
2. **Web Snipping & OCR**:
   - Image dragged into editor -> local ONNX OCR extracts text -> creates a callout block with image thumbnail and selectable text.
