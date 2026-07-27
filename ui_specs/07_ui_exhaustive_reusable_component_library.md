# UI Spec 07: Exhaustive Reusable Component Library & Extensibility Spec

## 1. Component Architecture & Reusability Principles

All components in Noteee follow atomic design principles and are built with extensible TypeScript props, theme variant tokens, slot composition APIs, and accessibility ARIA attributes.

---

## 2. Category 1: Core Atomic Primitives & Glass Controls

### `GlassPanel`
- **Description**: Reusable glassmorphism surface container.
- **Props**: `variant` ('surface-1' | 'surface-2' | 'surface-3'), `radius` ('sm' | 'md' | 'lg' | 'xl' | 'full'), `blur` (number), `border` (boolean).
- **Slot API**: `children`.

### `IconButton`
- **Description**: Tactile icon button with spring scale micro-interaction (`hover: scale(1.05)`, `active: scale(0.95)`).
- **Props**: `icon` (LucideIcon), `size` ('sm' | 'md' | 'lg'), `variant` ('ghost' | 'glass' | 'accent' | 'danger'), `tooltip` (string), `onClick`.

### `BadgePill`
- **Description**: Status/tag pill with theme color coding.
- **Props**: `label` (string), `color` ('dracula-pink' | 'dracula-purple' | 'dracula-cyan' | 'dracula-emerald' | 'nord-blue'), `icon` (optional).

### `ThemeToggle`
- **Description**: Segmented glass pill switcher for switching between Dracula Dark, Nordic Light, Apple Midnight, and Solarized modes.

---

## 3. Category 2: Navigation & Tree Hierarchy

### `TreeSidebarContainer`
- **Description**: Resizable glass sidebar holding the folder hierarchy, vault switcher, and workspace quick links.

### `TreeNodeItem`
- **Description**: Single row in the tree view supporting nested indentations (`depth * 16px`), collapse arrow, icon, title, active state, and drag handle.
- **Props**: `id`, `title`, `icon`, `depth`, `hasChildren`, `isExpanded`, `isActive`, `onSelect`, `onToggle`, `onDragStart`.

### `VaultSwitcher`
- **Description**: Top-left dropdown anchor for switching local database vaults (e.g. *Personal Vault*, *Work Notes*).

### `BreadcrumbBar`
- **Description**: Top bar path indicator with clickable folder breadcrumbs and view layout toggles.

---

## 4. Category 3: Block Editor UI Components

### `EditorWorkspace`
- **Description**: Main scrollable page canvas hosting the title cover, metadata bar, and block stack.

### `PageHeaderCover`
- **Description**: Hero banner supporting Unsplash images, gradient overlays, or AI cover generation, with an icon picker anchor.

### `BlockContainer`
- **Description**: Reusable block wrapper rendering drag handle on hover, block type icon, selection state, and keyboard focus.

### `SlashMenuPopover`
- **Description**: Searchable floating menu triggered by `/` to select from all 12 block types (Paragraph, Heading 1-3, Callout, Code, Math, Toggle, Table, Image, Audio, Subpage).

### `InlineSelectionBar`
- **Description**: Contextual floating bubble toolbar appearing on text selection for formatting (Bold, Italic, Code, Link, AI Rewrite).

---

## 5. Category 4: Generative AI Copilot & Chatbox

### `CopilotChatDrawer`
- **Description**: Glassmorphic right drawer or floating modal hosting the conversational AI stream.

### `GenerativeChatMessage`
- **Description**: Individual chat message bubble supporting user prompts, AI text responses, inline code runners, and generative card slots.

### `TopicBranchBlueprintCard`
- **Description**: Reusable UI card displaying AI-suggested structured note hierarchies with "Edit Tree" and "Instantiate Branch" action buttons.

### `FlashcardDeckWidget`
- **Description**: Embedded 3D flip-card deck preview card inside the chat stream.

### `RAGCitationPill`
- **Description**: Interactive badge showing document chunk source, vector similarity score, and click-to-highlight preview.

### `VoiceQueryWaveform`
- **Description**: Real-time canvas waveform visualizer active during speech input.

---

## 6. Category 5: Study, Canvas & System Modals

### `FSRSStudySessionModal`
- **Description**: Full-screen study overlay with 3D flashcard flip, timer, and FSRS difficulty buttons (*Again*, *Hard*, *Good*, *Easy*).

### `SkiaCanvasNode`
- **Description**: Spatial node container for note cards on the infinite 2D canvas.

### `PdfAnnotationLayer`
- **Description**: Overlay layer for PDF rendering with text highlight snapping and image occlusion mask tools.

### `CommandPaletteModal`
- **Description**: Spotlight-style `Cmd+K` launcher for instant note search and system actions.
