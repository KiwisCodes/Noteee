export interface UserPresenceState {
  user: {
    id: string;
    name: string;
    color: string;
    avatarUrl?: string;
  };
  cursor: {
    blockId: string;
    anchorOffset: number;
    headOffset: number;
  } | null;
  lastActive: number; // UTC Unix Epoch MS
}

export function setupPresence(
  provider: WebsocketProvider,
  user: UserPresenceState['user']
): void {
  const awareness = provider.awareness;

  // Set local client awareness state
  awareness.setLocalStateField('user', user);
  awareness.setLocalStateField('cursor', null);
  awareness.setLocalStateField('lastActive', Date.now());

  // Heartbeat loop every 10 seconds to keep connection alive
  setInterval(() => {
    awareness.setLocalStateField('lastActive', Date.now());
  }, 10_000);
}