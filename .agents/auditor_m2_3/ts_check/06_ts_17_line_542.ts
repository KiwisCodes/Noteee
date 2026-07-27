export interface YjsAwarenessState {
  clientHolderId: number; // Unique Yjs client ID
  user: {
    name: string;
    avatarUrl?: string;
    color: string; // Distinct cursor highlight hex color (e.g. "#FF5733")
  };
  cursor: {
    anchorBlockId: string;
    anchorOffset: number;
    headBlockId: string;
    headOffset: number;
  } | null;
}
