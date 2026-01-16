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
    description: 'Pago con Payphone',
  },
  {
    id: 'CASH_DEPOSIT',
    name: 'Depósito en Efectivo',
    available: true,
    description: 'Sube comprobante',
  },
  {
    id: 'MERCADOPAGO',
    name: 'Mercado Pago',
    available: false,
    description: 'Próximamente',
  },
  {
    id: 'CRYPTO',
    name: 'Crypto USDT',
    available: false,
    description: 'Próximamente',
  },
]
