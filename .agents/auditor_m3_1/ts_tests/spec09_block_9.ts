import * as LocalAuthentication from 'expo-local-authentication';
import * as Keychain from 'react-native-keychain';

export class VaultHardwareManager {
  private static VAULT_KEY_SERVICE = 'noteee_vault_master_key';

  /**
   * Authenticates user via FaceID / TouchID biometric prompt.
   */
  static async authenticateBiometrics(reason: string): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      throw new Error('Biometric hardware authentication unavailable or not enrolled.');
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: reason,
      fallbackLabel: 'Enter Passcode',
      disableDeviceFallback: false,
    });

    return result.success;
  }

  /**
   * Retrieves AES-GCM Vault Master Key from Hardware Keychain upon successful biometric auth.
   */
  static async getVaultMasterKey(): Promise<string> {
    const authenticated = await this.authenticateBiometrics('Unlock Encrypted Vault');
    if (!authenticated) throw new Error('Biometric authentication failed.');

    const credentials = await Keychain.getGenericPassword({
      service: this.VAULT_KEY_SERVICE,
      authenticationPrompt: { title: 'Vault Unlock' },
    });

    if (!credentials) throw new Error('Vault Master Key not found in Secure Enclave.');
    return credentials.password;
  }
}