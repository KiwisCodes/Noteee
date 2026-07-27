# UI Spec 05: Notion-Grade Block Editor & Infinite Canvas

## 1. Title & Header Cover Area

- **Cover Image Header**: Dynamic gradient, Unsplash integration, or AI-generated banner.
- **Emoji/Icon Selector**: Clickable icon anchor.
- **Page Properties Bar**: Interactive pills for Tags, Created Date, AI Summary, Word Count, and Sync Status.

---

## 2. Block JSON Component Specs (12 Core Types)

1. `ParagraphBlock`: Standard text editing block with markdown support (`**bold**`, `*italic*`).
2. `Heading1Block`, `Heading2Block`, `Heading3Block`: Stylized headers with auto-generated anchor links.
3. `CalloutBlock`: Colored glass container with customizable icon and text.
4. `CodeBlock`: Syntax-highlighted code editor with copy button and language selector.
5. `LatexMathBlock`: Rendered KaTeX formula editor.
6. `ToggleBlock`: Collapsible disclosure block for hidden content/answers.
7. `TableBlock`: Grid block with editable columns and rows.
8. `ImageAudioBlock`: Embedded image lightbox or audio player widget.
9. `SubpageLinkBlock`: Card link pointing to another note in the tree.
10. `FlashcardClozeBlock`: Interactive inline cloze deletion block for active recall practice.

---

## 3. Toolbars & Formatting Contexts

- **Slash Menu (`/`)**: Triggers filterable popover list of all 12 block types + AI actions (*/generate table*, */summarize*).
- **Inline Bubble Bar**: Appears on text selection for quick formatting, link attachment, or AI rewriting prompts (*Simplify*, *Fix Grammar*, *Translate*).

---

## 4. Infinite Canvas & PDF Annotation Overlays

- **GPU Skia Canvas Window**: Spatial zoom/pan canvas for diagramming.
- **PDF Viewer Overlay**: Page grid sidebar, highlight pen tools, and bounding quad snapping for text excerpts.
