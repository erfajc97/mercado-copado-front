export interface PaymentMethod {
  id: string
  userId: string
  gatewayToken: string
  cardBrand: string
  last4Digits: string
  expirationMonth: number
  expirationYear: number
  isDefault: boolean
  createdAt: string
  updatedAt: string
}
