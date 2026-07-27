export interface EncryptedPayload {
  iv: string; // Base64 encoded 12-byte IV
  ciphertext: string; // Base64 encoded ciphertext
}

export class E2ECryptoEngine {
  /**
   * Generates a new 256-bit AES-GCM symmetric encryption key.
   */
  static async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Exports CryptoKey to URL-safe Base64 string for URL hash fragment.
   */
  static async exportKey(key: CryptoKey): Promise<string> {
    const rawKey = await crypto.subtle.exportKey('raw', key);
    return Buffer.from(rawKey).toString('base64url');
  }

  /**
   * Imports URL Base64 string back into CryptoKey instance.
   */
  static async importKey(base64Key: string): Promise<CryptoKey> {
    const rawKey = Buffer.from(base64Key, 'base64url');
    return await crypto.subtle.importKey(
      'raw',
      rawKey,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypts plain Uint8Array Yjs binary update into AES-GCM payload.
   */
  static async encrypt(data: Uint8Array, key: CryptoKey): Promise<EncryptedPayload> {
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit random IV
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    return {
      iv: Buffer.from(iv).toString('base64'),
      ciphertext: Buffer.from(encryptedBuffer).toString('base64'),
    };
  }

  /**
   * Decrypts AES-GCM payload back into plain Uint8Array Yjs binary update.
   */
  static async decrypt(payload: EncryptedPayload, key: CryptoKey): Promise<Uint8Array> {
    const iv = Buffer.from(payload.iv, 'base64');
    const ciphertext = Buffer.from(payload.ciphertext, 'base64');

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    return new Uint8Array(decryptedBuffer);
  }
}