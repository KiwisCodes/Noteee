import { PowerSyncCredentials, AbstractPowerSyncDatabase } from '@powersync/react-native';
import { User, Session } from '@supabase/supabase-js';

// ----------------------------------------------------------------------------
// 1. IPowerSyncClient Interface
// ----------------------------------------------------------------------------
export interface IPowerSyncClient {
  init(powersyncUrl: string, dbName: string): Promise<void>;
  connect(connector: IPowerSyncConnector): Promise<void>;
  disconnect(): Promise<void>;
  execute(sql: string, params?: unknown[]): Promise<unknown>;
  getAll<T>(sql: string, params?: unknown[]): Promise<T[]>;
  watch<T>(sql: string, params: unknown[], onChange: (data: T[]) => void): () => void;
  getSyncStatus(): { isConnected: boolean; hasUnsyncedChanges: boolean };
}

export interface IPowerSyncConnector {
  fetchCredentials(): Promise<PowerSyncCredentials>;
  uploadData(db: AbstractPowerSyncDatabase): Promise<void>;
}

// ----------------------------------------------------------------------------
// 2. IYjsCollabServer Interface
// ----------------------------------------------------------------------------
export interface IYjsCollabServer {
  createRoom(pageId: string): Promise<{ roomId: string; websocketUrl: string }>;
  closeRoom(roomId: string): Promise<void>;
  getActivePeerCount(roomId: string): Promise<number>;
  revokeSession(roomId: string): Promise<boolean>;
}

// ----------------------------------------------------------------------------
// 3. IE2EEncryptionProvider Interface
// ----------------------------------------------------------------------------
export interface EncryptedDataPayload {
  iv: string; // Base64 12-byte IV
  ciphertext: string; // Base64 ciphertext
}

export interface IE2EEncryptionProvider {
  generateSymmetricKey(): Promise<string>; // Returns Base64URL key
  encryptBinary(data: Uint8Array, base64Key: string): Promise<EncryptedDataPayload>;
  decryptBinary(payload: EncryptedDataPayload, base64Key: string): Promise<Uint8Array>;
  deriveShareableUrl(baseUrl: string, pageId: string, base64Key: string): string;
  extractKeyFromUrl(url: string): string | null;
}

// ----------------------------------------------------------------------------
// 4. ITextToSpeechEngine Interface
// ----------------------------------------------------------------------------
export interface TTSOptions {
  rate?: number; // 0.5 - 2.0
  pitch?: number; // 0.5 - 1.5
  voiceUri?: string;
  useCloudVoice?: boolean;
}

export interface ITextToSpeechEngine {
  speak(text: string, options?: TTSOptions, onBoundary?: (charIndex: number) => void): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  stop(): Promise<void>;
  getAvailableVoices(): Promise<Array<{ id: string; name: string; language: string; isCloud: boolean }>>;
  isPlaying(): boolean;
}

// ----------------------------------------------------------------------------
// 5. ISupabaseAuthAdapter Interface
// ----------------------------------------------------------------------------
export interface ISupabaseAuthAdapter {
  signInWithOAuth(provider: 'apple' | 'google'): Promise<{ user: User | null; session: Session | null }>;
  signInWithMagicLink(email: string): Promise<{ success: boolean }>;
  signOut(): Promise<void>;
  getSession(): Promise<Session | null>;
  getUser(): Promise<User | null>;
  onAuthStateChange(callback: (user: User | null, session: Session | null) => void): () => void;
  authenticateVaultBiometrics(promptReason: string): Promise<boolean>;
}

// ----------------------------------------------------------------------------
// 6. IBillingProvider Interface
// ----------------------------------------------------------------------------
export interface UserEntitlements {
  isPro: boolean;
  isLifetime: boolean;
  activeOfferings: string[];
}

export interface IBillingProvider {
  initialize(apiKey: string, userId: string): Promise<void>;
  getEntitlements(): Promise<UserEntitlements>;
  purchasePackage(packageIdentifier: string): Promise<UserEntitlements>;
  restorePurchases(): Promise<UserEntitlements>;
  onEntitlementsUpdated(callback: (entitlements: UserEntitlements) => void): () => void;
}