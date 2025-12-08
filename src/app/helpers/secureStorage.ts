import SecureStorage from 'secure-web-storage'
import CryptoJS from 'crypto-js'

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || 'default-secret-key'

// Verificar que estamos en el navegador antes de usar localStorage
const getLocalStorage = (): Storage => {
  if (typeof window === 'undefined') {
    // Fallback para SSR: crear un objeto mock que implementa la interfaz de Storage
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    } as Storage
  }
  return window.localStorage
}

const secureStorage = new SecureStorage(getLocalStorage(), {
  hash: function hash(key: string) {
    const hashed = CryptoJS.SHA256(key, SECRET_KEY)
    return hashed.toString()
  },
  encrypt: function encrypt(data: any) {
    const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY)
    return encrypted.toString()
  },
  decrypt: function decrypt(data: any) {
    const decrypted = CryptoJS.AES.decrypt(data, SECRET_KEY)
    return decrypted.toString(CryptoJS.enc.Utf8)
  },
})

export default secureStorage
