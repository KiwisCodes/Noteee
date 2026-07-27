export type SyncState = 'OFFLINE' | 'SYNCING' | 'ONLINE' | 'CONFLICT';

export class SyncStateMachine {
  private currentState: SyncState = 'OFFLINE';
  private retryAttempt = 0;
  private maxRetryIntervalMs = 60_000;

  constructor(private onStateChange: (state: SyncState) => void) {}

  public transition(newState: SyncState): void {
    if (this.currentState === newState) return;
    this.currentState = newState;
    this.onStateChange(newState);
  }

  public handleNetworkFailure(): void {
    this.transition('OFFLINE');
    this.scheduleReconnect();
  }

  private scheduleReconnect(): void {
    this.retryAttempt++;
    const delay = Math.min(
      this.maxRetryIntervalMs,
      Math.pow(2, this.retryAttempt) * 1000 + Math.random() * 200
    );

    setTimeout(() => {
      this.transition('SYNCING');
    }, delay);
  }

  public resetRetry(): void {
    this.retryAttempt = 0;
  }
}