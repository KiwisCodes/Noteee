# Noteee: Comprehensive Research and Technical Setup Report

## System Definition and Product Philosophy
Noteee is defined as a capture-first notebook application built around a design philosophy that minimizes manual organizational friction for the user. The core intuition of the product is ultra-fast information capture across diverse input modalities, including real-world photographs, desktop/mobile screenshots, natural voice, quick text, PDF files, and freehand drawing on an infinite canvas. Immediately after data enters the system, on-device artificial intelligence (AI) models automatically analyze semantics, map the content into a tree-structured folder system, and assign contextual tags.

Powerful supplementary features—such as a Notion-style rich text editor, deep PDF document annotation, smart flashcards powered by the Spaced Repetition model (FSRS), and an interactive infinite canvas—create a seamless ecosystem for learning and productivity. This architectural specification transitions the entire legacy codebase from Swift/iOS to React Native (for mobile) and Next.js with TypeScript (for web). It leverages modern, stable libraries free of known security vulnerabilities (CVEs) while expanding strategic operational capabilities to turn Noteee into a highly successful commercial product.

---

## Detailed Feature List & Non-Functional Requirements

### Capture & Input
- **[MVP] Paper/Whiteboard Scanning:** Direct capture via the device camera utilizing React Native's native camera module.
- **[MVP] Continuous Multi-Photo Capture:** Allows users to shoot multiple photos within a single session before saving them into a single consolidated document.
- **[MVP] Screen Capture (Desktop/Web/Phones/Tablets):** Captures the active screen through the Next.js web application or desktop wrapper layer (Electron/Tauri).
- **[MVP] Quick Capture Bar:** Rapid text entry via a floating widget or minimal entry panel that launches instantly upon activation.
- **[MVP] Global Hotkey:** Triggers the Quick Capture Bar from anywhere in any device without needing the main Noteee window focused.
- **[MVP] Local Audio Recording & Transcription:** Direct voice recording with fully offline speech-to-text (STT) processing on the device.
- **[MVP] Clipboard Detection:** Automatically checks system clipboard contents when the app opens and prompts the user to quick-save with a single tap.
- **[MVP] Session Continuation:** Allows users to append photos, audio files, or text into a recently active capture session instead of forcing a new session creation.
- **[v2] Automated Sensitive Data Routing:** Detects structured sensitive text (such as credentials or API keys) to automatically route and store them in an encrypted vault folder.
- **[v3+] External Document Import:** Imports existing files (PDF, Word) or web articles via a browser extension (Web Clipper) to serve as source material for notes.

### Tree & Tags Data Organization
- **[MVP] Initial Onboarding Survey:** Generates a template directory tree based on user needs and goals through an interactive orientation flow during first launch.
- **[MVP] Tree Customization:** Enables editing, renaming, and reordering of the generated folder hierarchy prior to system use.
- **[MVP] Automated Folder Suggestions:** Converts new notes into vector embeddings and matches them against folder representation vectors to yield 2–3 optimal folder recommendations.
- **[MVP] One-Tap Folder Confirmation:** Users confirm suggested note placement with a single tap or manually select a destination via a traditional folder picker.
- **[MVP] Independent Tags:** Tagging operates independently of physical folder paths through a many-to-many relation model.
- **[v2] Implicit Auto-Tagging:** Tag suggestions are applied automatically without requiring explicit confirmation (due to low correction cost), whereas folder organization strictly requires confirmation to prevent misplacement.
- **[v2] Hybrid Search & Filtering:** Allows users to filter notes by folder, by tag, or by combining both criteria simultaneously.
- **[v2] Section-Level Filing:** Suggests inserting captured text under a specific, relevant subheading within an existing document rather than appending only at the document root level.
- **[v3+] Anchor Keyword Matching:** Assigns hardcoded rules to domain-specific keywords (e.g., course codes, project codes) to bypass vector search and route notes directly into predefined folders.

### Search & Retrieval
- **[MVP] Unified Semantic Search:** Performs natural language queries across manual text entries, OCR data extracted from photos, and transcribed speech text.
- **[MVP] Search Result Path Display:** Returns ranked note results alongside full directory paths, allowing direct navigation via tap/click.
- **[v2] Command Palette (⌘K / Ctrl+K):** A fast command modal for quick navigation and search across notes and folders without manual tree browsing.
- **[v2] Flashcard Content Search:** Extends search coverage to include questions and answers inside flashcards.
- **[v3+] Handwriting Canvas Search:** Searches recognized handwritten text characters embedded inside infinite canvas blocks.
- **[v3+] PDF Content Search:** Searches highlighted text, annotations, and direct notes inside attached PDF documents.

### Notion-like Block-based Editor
- **[MVP] Plain Text Editor with Markdown Shortcuts:** Standard text formatting (headings, bold, italics, lists) using standard Markdown syntax.
- **[v2] Block-based Editor:** Full support for rich content blocks including dynamic headings, collapsable toggle lists, task checkboxes, quote blocks, and horizontal dividers.
- **[v2] Advanced Code Blocks:** Code display blocks featuring syntax highlighting tailored to specific programming languages.
- **[v2] Inline Data Tables:** Directly creates data tables with resizable columns and cell-merging capabilities.
- **[v2] Inline Image Embeds:** Directly embeds images between arbitrary text blocks.
- **[v2] Nested Page-in-Page:** Ability to create sub-pages directly nested inside a parent page.
- **[v3+] LaTeX Math Rendering:** Smoothly renders complex mathematical formulas using KaTeX.
- **[v3+] Slash Command Menu (/):** Triggers a quick block-type selector by typing `/`.
- **[v3+] Notion-style Database Objects:** Defines typed data fields (text, number, single/multi-select, date, checkbox, formula, relational links) with multiple rich views (table, Kanban board, calendar, gallery) and advanced filtering/sorting.

### Smart Flashcards System
- **[MVP] Quick Cloze Flashcard Creation:** Highlights any text segment inside a note and converts it instantly into a cloze deletion card using a single keypress without manual syntax writing.
- **[MVP] Local AI Card Generation:** Upon saving a note, an on-device AI model analyzes the content and proposes 2–5 Q&A flashcards for rapid user review and approval.
- **[MVP] Minimalist Study Interface:** Focused review interface utilizing a card swipe mechanic (correct/incorrect, pass/fail) pulled randomly from all due cards across all folders.
- **[MVP] FSRS Spaced Repetition Algorithm:** Schedules reviews using the Free Spaced Repetition Scheduler algorithm to maximize long-term retention with minimal study effort.
- **[v2] Simultaneous Writing & Card Definition:** Uses shortcuts to define a text block as both note content and a flashcard simultaneously without breaking the editing flow.
- **[v2] Auto-Extraction from PDF Annotations:** Automatically converts highlights and annotations inside PDFs into review flashcards.
- **[v2] Image Occlusion Cards:** Allows drawing rectangular or freehand shapes to cover portions of an image or diagram in a PDF, converting hidden areas into test questions.
- **[v2] Merge/Split Occlusions:** Allows grouping multiple occlusion boxes on a single image into a single card (all revealed together) or splitting them into independent cards.
- **[v2] Flashcard Source Tracing:** Users can tap a button during a review session to immediately jump back to the exact location in the source document to review surrounding context.
- **[v3+] Card Clusters:** Groups closely related cards to present them sequentially during review without artificially inflating overall review counts.
- **[v3+] Direct Audio-to-Card Generation:** Directly extracts review questions from lecture audio transcripts without requiring intermediate document creation.

### PDF Annotation, Drawing & Image Occlusion
- **[MVP] Integrated PDF Reader:** Smooth PDF viewing with pinch-to-zoom gestures, fast page navigation, and a thumbnail sidebar.
- **[MVP] Freehand Drawing on PDF:** Uses a stylus or finger to sketch and write directly onto PDF pages.
- **[MVP] Text Highlighter:** Click-and-drag highlighting with support for copying deep links back to the original page location or copying as plain text.
- **[MVP] Area Highlighter:** Drag-to-select box capture for non-selectable visual content (e.g., complex charts, embedded tables).
- **[MVP] Scribble-to-Erase Gesture:** Recognizes fast back-and-forth scribbling across a stroke or highlight to erase it instantly without needing to switch tools.
- **[MVP] Standard Eraser Tool:** A traditional manual eraser button on the toolbar for precise editing.
- **[v2] PDF Occlusion Blocks:** Draws occlusion boxes on PDF documents for inline self-testing.
- **[v2] Freehand Occlusion Tape:** Freehand drawing tool for occluding non-rectangular or curved shapes and diagrams.
- **[v2] Occlusion Transparency Toggle:** Temporarily toggles visibility of occlusion boxes so users can read the original document normally outside of review mode.
- **[v2] AI OCR Area Extraction:** Extracts text directly from captured image area selections via local OCR.
- **[v2] Unified PDF Annotation Search:** All freehand strokes, highlighted text, and PDF overlay notes are indexed in the global semantic search database.
- **[v3+] Snap-to-Word Highlighting:** Automatically snaps highlight boundaries to adjacent word edges to prevent messy lines.
- **[v3+] Brush Memory:** Retains distinct stroke thickness and color presets per writing and highlighting tool for seamless switching.

### Infinite Canvas Block
- **[MVP] Inline Canvas Embedding:** Embeds an infinite canvas block directly into any note, supporting unlimited panning and zooming.
- **[MVP] Stylus Freehand Drawing:** Supports full pressure and tilt sensitivity for smart styluses.
- **[MVP] Text Boxes & Sticky Notes:** Places typed text boxes or colored sticky notes at any coordinate on the canvas.
- **[v2] Interactive Calendar Widget:** Attaches a visual calendar widget to the canvas for spatial daily/monthly planning.
- **[v2] Read-Only Mode for Mobile:** Displays canvas blocks as flattened previews on small screens, allowing pan/zoom viewing while locking edits to preserve layout integrity.
- **[v3+] Offline Canvas Handwriting Recognition:** Automatically converts handwritten strokes on the canvas into searchable text data without cloud transmission.
- **[v3+] Stroke Focus Auto-Pan:** Selecting a search result matching canvas handwriting smoothly pans and zooms the viewport to the exact coordinates of the target stroke.

### Text-to-Speech (TTS)
- **[MVP] Local Note Audio Playback:** Single-button action converts note text into artificial voice output directly on the device for on-the-go listening.
- **[MVP] Audio Control Panel:** Standard playback controls (Play/Pause, sentence skip forward/back, variable playback speed from 0.5x to 2.0x).
- **[MVP] Background Audio Playback:** Audio continues playing reliably when the app is minimized or the screen is locked.
- **[v2] Cross-Platform TTS Parity:** Ensures TTS functionality runs identically across tablet and desktop interfaces.
- **[v2] PDF Text-to-Speech:** Extracts text directly from attached PDF files for audio playback.
- **[v2] OCR Text-to-Speech:** Plays audio directly from text recognized inside captured images.
- **[v3+] High-Quality Cloud AI Voices:** Optional premium cloud AI voice models for natural-sounding audio, alongside the free offline OS system voices.

### Sync & Real-time Collaboration
- **[MVP] Continuous Personal Sync:** Synchronizes notes, flashcards, and settings across mobile and desktop devices using a local-first cloud sync database.
- **[v2] One-Tap Link Sharing (Excalidraw Model):** Generates a share link for instant collaborative sessions on a document or canvas with hash-fragment E2EE decryption key.
- **[v2] Live Cursor Visualization:** Shows real-time cursors and names of other active participants viewing or editing the document.
- **[v2] Active Session Revocation:** Document owners can terminate an active shared session at any time.
- **[v2] CRDT Conflict Resolution (Yjs):** Uses the Yjs shared data structure framework to resolve concurrent edits automatically.
- **[v3+] Password-Protected Links:** Option to require a secondary access password for real-time collaboration links.
- **[v3+] Persistent Collaboration Rooms:** Shared workspaces that remain active indefinitely.
- **[v3+] Web Cross-Platform Access:** Sign in to Noteee Cloud via any standard web browser.

### Account Management & Monetization
- **[MVP] 90-Day Unlimited Free Trial:** Access to all premium features for 90 days via an Apple-approved $0 USD In-App Purchase.
- **[MVP] Ad-Supported Free Tier:** Non-intrusive banner ads placed exclusively on non-sensitive screens (Home, global search). Strictly forbidden inside text editor, vault, or study views.
- **[MVP] Lifetime Unlock Purchase:** One-time purchase option to permanently remove ads.
- **[v2] Pro Cloud Subscription:** Monthly or annual plan unlocking sync storage, Web app access, and higher-tier cloud AI models.
- **[v2] Pay-As-You-Go AI Credits:** Credit packs for pay-per-use cloud AI tasks.
- **[v2] Bring-Your-Own-Key (BYOK):** Allows users to plug in personal API keys (Gemini, OpenAI, Anthropic).

### Accessibility & Localization
- **[MVP] Dynamic Type & Scalable Text:** Full compliance with OS-level text scaling (iOS Dynamic Type and Android Font Scaling) across all note renderers, tree views, menus, and editor blocks.
- **[MVP] Screen Reader Accessibility:** Comprehensive accessibility labels, roles, and hints for VoiceOver (iOS/macOS) and TalkBack (Android) to ensure total voice navigation across tree structures, capture modals, and flashcards.
- **[MVP] Right-to-Left (RTL) Layout Support:** Native text direction support for RTL languages (Arabic, Hebrew, Persian) across rich text editor blocks, folder trees, and navigation panels.
- **[MVP] Multi-Language i18n Core Framework:** Built-in internationalization infrastructure (`react-i18next`) with full English (US) string catalogs, English + Vietnamese dual-language support, and locale-aware date/time formatting.
- **[MVP] English + Vietnamese Dual-Language Support:** First-class English + Vietnamese dual-language support built into all core UI catalogs, system menus, onboarding flows, and note interfaces.
- **[MVP] Vietnamese-Tuned AI Models:** Dedicated on-device Vietnamese-tuned AI models (for Whisper STT and text processing) providing high-accuracy offline transcription, embedding generation, and semantic organization for Vietnamese voice and text.
- **[v2] Expanded Regional Localizations:** Support for localized UI catalogs in Spanish, French, German, Japanese, Simplified Chinese, and Korean.
- **[v2] Accessible High-Contrast Themes:** Specialized dark/light high-contrast visual themes meeting WCAG 2.1 AA contrast ratios ($\ge 4.5:1$ for body text).
- **[v2] Full Keyboard Navigation & Focus Rings:** Explicit keyboard shortcut tab indexing and focus indicators across desktop wrappers and web interfaces.
- **[v3+] Speech & TTS Multi-Lingual Auto-Switching:** Automatic language detection for offline speech-to-text (Whisper) and speech synthesis (TTS) across multi-lingual user notes.

---

## Non-Functional Requirements

### Performance & Responsiveness
- OCR text extraction execution on a standard document photo must complete in $\le 1.0\text{ second}$ on mid-tier mobile hardware.
- Smart folder suggestions must calculate and display within $2.0\text{ to }3.0\text{ seconds}$ post-capture.
- Semantic search queries across up to 10,000 notes must return ranked results in $< 500\text{ milliseconds}$.
- Cold-launch time to an active capture-ready state must not exceed $1.5\text{ seconds}$.

### Security & Privacy
- Core machine learning workloads (OCR, STT, Embeddings, classification) execute strictly on-device. Zero user text or image data is sent to external servers unless explicitly opted in.
- Local SQLite database encrypted at the file-system level. Vault folders encrypted using AES-GCM managed via hardware enclaves (iOS Keychain / Android Keystore).
- Sandboxed third-party Ad SDK prevented from accessing editor buffers, note stores, password vaults, or flashcards.
- Collaboration keys exist purely on client devices (never sent in plaintext to servers).
