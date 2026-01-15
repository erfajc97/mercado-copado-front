import { useAuthStore } from './authStore'

/**
 * Zustand persist rehidrata el store de forma async. En rutas protegidas,
 * necesitamos asegurarnos de que la rehidratación terminó antes de leer token/roles.
 */
export async function ensureAuthHydrated() {
  const persist = (useAuthStore as any).persist

  // Si por alguna razón persist no existe, devolvemos el estado actual.
  if (!persist) return useAuthStore.getState()

  // Evitar rehidratar si ya está listo.
  if (typeof persist.hasHydrated === 'function' && persist.hasHydrated()) {
    return useAuthStore.getState()
  }

  if (typeof persist.rehydrate === 'function') {
    await persist.rehydrate()
  }

  return useAuthStore.getState()
}
