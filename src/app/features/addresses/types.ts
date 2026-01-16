export interface Address {
  id: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  reference?: string | null
  isDefault: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateAddressData {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  reference?: string
  isDefault?: boolean
}

export interface UpdateAddressData {
  street?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  reference?: string
  isDefault?: boolean
}
