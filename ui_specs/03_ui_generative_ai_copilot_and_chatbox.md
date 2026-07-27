# UI Spec 03: Generative AI Copilot & Chatbox System

## 1. Vision: Conversational Generative Workspace

The AI Chatbox in Noteee is not just a side-panel text assistant. It serves as an interactive **generative workspace engine** accessible at startup or via `Cmd+K`.

---

## 2. Generative UI Streaming Architecture

When the user chats with the AI, the assistant outputs rich **Generative UI Cards** directly inside the chat timeline rather than plain text responses:

```
User: "Generate a flashcard deck on Machine Learning Loss Functions."

AI Assistant:
"I've generated 5 flashcards based on your notes in Deep Learning 101:"
+-------------------------------------------------------------------+
| 🃏 GENERATIVE FLASHCARD WIDGET                                     |
| [ Card 1 of 5 ] Cross-Entropy Loss Equation                       |
| [ Flip Card ]   [ Add Deck to Vault ]   [ Start Spaced Study ]    |
+-------------------------------------------------------------------+
```

### Supported Generative UI Widgets
1. `TopicBranchCard`: Interactive note tree preview card with "Instantiate to Vault" button.
2. `FlashcardDeckCard`: Interactive flip-card widget with direct study trigger.
3. `RAGCitationCard`: Expandable document preview card showing exact vector chunks referenced.
4. `CodeSandboxCard`: Interactive executable code snippet card.

---

## 3. Systematic Topic Branching Workflow

When a user wants to research and take notes on a complex topic systematically:

1. **User Request**: User types *"Help me build a structured note workspace for studying Distributed Systems."*
2. **AI Analysis & Blueprint Generation**: The AI queries local vector memory and online models, then renders an interactive **Topic Branch Blueprint**:

```
+-------------------------------------------------------------------+
| 🌳 TOPIC BRANCH BLUEPRINT: Distributed Systems                    |
| ├── 📄 01_Fundamentals_and_CAP_Theorem.md                         |
| ├── 📄 02_Consensus_Algorithms_Raft_Paxos.md                      |
| ├── 📄 03_Vector_Clocks_and_Logical_Time.md                       |
| └── 📄 04_Replication_and_Eventual_Consistency.md                |
|                                                                   |
| [ Edit Tree Hierarchy ]               [ 🚀 Instantiate Branch ]   |
+-------------------------------------------------------------------+
```

3. **Instantiation**: Clicking **"Instantiate Branch"** creates all pages in the Knowledge Tree sidebar with template outline blocks, tags, and cross-links ready for note-taking.

---

## 4. Note Search & RAG Query UI

The chatbox includes a **Semantic Search Filter Bar**:
- Filter by Vault sub-folders, date ranges, or tags.
- Voice input button with real-time waveform visualization during speech.
- RAG confidence indicator pill (*High confidence: 4 vault notes matched*).
