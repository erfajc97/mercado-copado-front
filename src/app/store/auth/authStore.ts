import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import secureStorage from '@/app/helpers/secureStorage'

export interface AuthState {
  token: string | null
  refreshToken: string | null
  tokenExpiration: number | null
  setToken: (token: string, refreshToken: string, expiration: number) => void
  getToken: () => string | null
  getRefreshToken: () => string | null
  getTokenExpiration: () => number | null
  removeToken: () => void
  keepSession: boolean
  setKeepSession: (keep: boolean) => void
  roles: string
  setRoles: (roles: string) => void
}

export type AuthStore = ReturnType<typeof useAuthStore>

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      token: null,
      refreshToken: null,
      tokenExpiration: null,
      keepSession: false,
      roles: '',

      setRoles: (roles: string) => {
        secureStorage.setItem('roles', JSON.stringify(roles))
        set({ roles })
      },

      setToken: (token: string, refreshToken: string, expiration: number) => {
        secureStorage.setItem('token', token)
        secureStorage.setItem('refreshToken', refreshToken)
        secureStorage.setItem('tokenExpiration', String(expiration))
        set({ token, refreshToken, tokenExpiration: expiration })
      },

      setKeepSession: (keep: boolean) => {
        secureStorage.setItem('keepSession', String(keep))
        set({ keepSession: keep })
      },

      getToken: () => {
        return get().token
      },

      getRefreshToken: () => {
        return get().refreshToken
      },

      getTokenExpiration: () => {
        return get().tokenExpiration
      },

      removeToken: () => {
        secureStorage.removeItem('token')
        secureStorage.removeItem('refreshToken')
        secureStorage.removeItem('tokenExpiration')
        secureStorage.removeItem('keepSession')
        secureStorage.removeItem('roles')
        set({
          token: null,
          refreshToken: null,
          tokenExpiration: null,
          keepSession: false,
          roles: '',
        })
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => secureStorage),
    },
  ),
)

