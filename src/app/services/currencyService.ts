// Servicio para conversión de moneda
// Obtiene la tasa de dólar blue para Argentina

interface CachedRate {
  rate: number
  timestamp: number
}

// Cache en memoria (1 hora de duración)
let cachedRate: CachedRate | null = null
const CACHE_DURATION = 60 * 60 * 1000 // 1 hora en milisegundos

/**
 * Obtiene la tasa de dólar blue desde la API pública
 * Usa dolarapi.com como fuente principal
 */
export async function getDolarBlueRate(): Promise<number> {
  // Verificar cache primero
  if (cachedRate && Date.now() - cachedRate.timestamp < CACHE_DURATION) {
    return cachedRate.rate
  }

  try {
    // Intentar con dolarapi.com
    const response = await fetch('https://dolarapi.com/v1/dolares/blue')

    if (!response.ok) {
      throw new Error('Error al obtener tasa de dólar blue')
    }

    const data = await response.json()
    const rate = data.venta || data.compra || 0

    if (rate > 0) {
      // Guardar en cache
      cachedRate = {
        rate,
        timestamp: Date.now(),
      }
      return rate
    }

    throw new Error('Tasa inválida')
  } catch (error) {
    console.error('Error obteniendo dólar blue:', error)

    // Fallback: usar tasa estática si la API falla
    // Esta es una tasa aproximada que se puede actualizar manualmente
    const fallbackRate = 1200 // Tasa aproximada de dólar blue
    console.warn('Usando tasa de fallback para dólar blue:', fallbackRate)

    cachedRate = {
      rate: fallbackRate,
      timestamp: Date.now(),
    }

    return fallbackRate
  }
}

/**
 * Convierte dólares (USD) a pesos argentinos (ARS) usando dólar blue
 */
export async function convertUSDToARS(usdAmount: number): Promise<number> {
  const rate = await getDolarBlueRate()
  return usdAmount * rate
}

/**
 * Formatea un monto en pesos argentinos
 */
export function formatARS(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formatea un monto en dólares
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
