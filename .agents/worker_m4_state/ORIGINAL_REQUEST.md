## 2026-07-26T10:39:31Z
<USER_REQUEST>
You are a specialist Worker agent assigned to Milestone 4.
Your working directory is `/Users/apple/Coding-projects/Noteee/.agents/worker_m4_state/`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

YOUR TASK:
Create the complete state machines specification file: `/Users/apple/Coding-projects/Noteee/13_state_machines.md`.

REQUIREMENTS:
1. Provide comprehensive software state machine specifications for all dynamic entities in Noteee.
2. Include valid standard Mermaid `stateDiagram-v2` blocks for all 4 required state machines:
   - State Machine 1: Capture Session States (Idle -> Initializing -> Recording with sub-states Active/Paused -> Finalizing -> Processing with sub-states Transcribing/Embedding/Structuring -> Completed / Error / Cancelled).
   - State Machine 2: Flashcard Review Card States (New -> Learning with sub-states Step1/Step2 -> Review -> Relearning -> Graduated / Lapsed, driven by FSRS ratings Again/Hard/Good/Easy).
   - State Machine 3: Vault Lock/Unlock States (Unlocked -> AutoLockTimer -> Locked -> Authenticating with sub-states BiometricPrompt/PasscodeEntry -> Unlocked / FailedLockout).
   - State Machine 4: Sync Connection States (Offline -> Connecting -> Syncing with sub-states Pulling/Pushing -> Online -> ConflictResolution -> Reconnecting with exponential backoff).
3. Include guard conditions `[condition]`, transition events/triggers, entry/exit actions, composite/nested states, and error transition branches.
4. Ensure 100% cross-file consistency with `01_original_feature_list.md` through `09_sector_6_sync_collab_monetization_spec.md`.
5. Ensure valid standard Mermaid syntax. Do NOT use unescaped semicolons or invalid syntax characters inside Mermaid lines.
6. Write the completed deliverable directly to `/Users/apple/Coding-projects/Noteee/13_state_machines.md` using `write_to_file`.

When completed, output a summary and call `send_message` back to parent orchestrator.
</USER_REQUEST>
