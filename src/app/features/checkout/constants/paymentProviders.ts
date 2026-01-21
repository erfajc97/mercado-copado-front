export type PaymentProvider = 'PAYPHONE' | 'MERCADOPAGO' | 'CRYPTO' | 'CASH_DEPOSIT'

export interface PaymentProviderOption {
  id: PaymentProvider
  name: string
  available: boolean
  description: string
}

export const PAYMENT_PROVIDERS: Array<PaymentProviderOption> = [
  {
    id: 'PAYPHONE',
    name: 'Payphone',
    available: true,
    description: 'Tarjeta / Link',
  },
  {
    id: 'CASH_DEPOSIT',
    name: 'Depósito',
    available: true,
    description: 'Efectivo',
  },
  {
    id: 'MERCADOPAGO',
    name: 'Mercado Pago',
    available: true,
    description: 'Argentina',
  },
  {
    id: 'CRYPTO',
    name: 'Crypto',
    available: true,
    description: 'USDT',
  },
]
