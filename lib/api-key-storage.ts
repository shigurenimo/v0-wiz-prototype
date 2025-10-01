/**
 * ApiKeyStorage
 */
export class ApiKeyStorage {
  constructor(private readonly storageKey: string) {
    Object.freeze(this)
  }

  /**
   * Get API key from storage
   */
  get(): string | null {
    return localStorage.getItem(this.storageKey)
  }

  /**
   * Save API key to storage
   */
  save(apiKey: string): void {
    localStorage.setItem(this.storageKey, apiKey)
  }
}
