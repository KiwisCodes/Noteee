## 2026-07-26T10:26:55Z

You are the Worker subagent for Sector 2 (Multi-Modal Capture Engine).

Your working directory is: /Users/apple/Coding-projects/Noteee/.agents/worker_m2_capture
Project root: /Users/apple/Coding-projects/Noteee

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Task:
Create `/Users/apple/Coding-projects/Noteee/05_sector_2_capture_spec.md` covering:
1. Feature breakdown with user interaction flows (Camera multi-photo scanning, Whisper offline STT, Quick Capture bar, Clipboard detection).
2. Background session persistence (iOS Live Activities / Dynamic Island integration & lifecycle).
3. Session state machine (`IDLE` -> `RECORDING` -> `PROCESSING` -> `SUGGESTION` -> `FILED` -> `CANCELLED`) with state machine Mermaid diagram.
4. Design patterns & rationale (`ICaptureSource` Strategy pattern, Session Builder pattern, Capture Event Observer pattern).
5. Data models and schema additions for capture sessions (consistent with `capture_sessions` Drizzle table in file 03).
6. Sequence diagrams (Mermaid) showing end-to-end multi-modal capture session flows.
7. TypeScript interface definitions (`ICaptureSource`, `ICaptureSessionManager`, `ISuggestionEngine`, etc.).

Ensure complete consistency with files 01..04. Update `progress.md` and write `handoff.md` in `/Users/apple/Coding-projects/Noteee/.agents/worker_m2_capture/`. Send a completion message when finished.
