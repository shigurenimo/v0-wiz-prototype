/**
 * SecretKeyStorage
 */
export class SecretKeyStorage {
  constructor(private readonly storageKey: string) {
    Object.freeze(this)
  }

  /**
   * Get secret key from storage
   */
  get(): string | null {
    return localStorage.getItem(this.storageKey)
  }

  /**
   * Save secret key to storage
   */
  save(secretKey: string): void {
    localStorage.setItem(this.storageKey, secretKey)
  }

  /**
   * Delete secret key from storage
   */
  delete(): void {
    localStorage.removeItem(this.storageKey)
  }
}
