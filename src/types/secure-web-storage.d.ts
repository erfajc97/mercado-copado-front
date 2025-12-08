declare module 'secure-web-storage' {
  interface SecureStorageOptions {
    hash: (key: string) => string
    encrypt: (data: any) => string
    decrypt: (data: any) => string
  }

  class SecureStorage {
    constructor(storage: Storage, options: SecureStorageOptions)
    setItem(key: string, value: any): void
    getItem(key: string): any
    removeItem(key: string): void
    clear(): void
    key(index: number): string | null
    get length(): number
  }

  export default SecureStorage
}

