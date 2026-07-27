# UI Spec 04: Tree Navigation & Knowledge Graph UI

## 1. Nested Knowledge Tree Sidebar

The left sidebar renders the complete hierarchical structure of the user's notes:

```
Vault
├── 📁 01_Computer_Science
│   ├── 📁 Distributed_Systems (AI Generated Branch)
│   │   ├── 📄 CAP_Theorem.md
│   │   └── 📄 Consensus_Raft.md
│   └── 📄 Data_Structures.md
├── 📁 02_Personal
└── 🗑️ Trash
```

### UI Features & Interactions
- **Drag-and-Drop Reordering**: Smooth drag handles for moving notes between parent folders or re-nesting branches.
- **Context Actions (Right-Click / Hover)**: New Page, New Sub-folder, AI Auto-Summarize Branch, Duplicate, Delete.
- **Favicon / Emoji Customization**: Pick custom icons or let AI assign emojis based on page topic.

---

## 2. Interactive Knowledge Graph View

A visual 2D force-directed graph rendering relationships between notes:
- **Nodes**: Spherical glass nodes color-coded by folder/tag. Node size scales with note word count and connection count.
- **Edges**: Glowing vector lines showing subpage links and RAG semantic similarity connections.
- **Filters**: Toggle node types (Notes, Flashcards, PDFs, Tags).
