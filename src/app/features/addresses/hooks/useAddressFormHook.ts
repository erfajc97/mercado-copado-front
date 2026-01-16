import { useMemo } from 'react'
import type { Address, CreateAddressData } from '../types'

interface UseAddressFormHookProps {
  addresses?: Array<Address>
  editingAddress: Address | null
}

export const useAddressFormHook = ({
  addresses,
  editingAddress,
}: UseAddressFormHookProps) => {
  // Determinar si debe ser default automáticamente
  const shouldBeDefault = useMemo(() => {
    if (editingAddress) {
      return editingAddress.isDefault
    }
    // Si no hay direcciones, la primera debe ser default
    return addresses && addresses.length === 0
  }, [addresses, editingAddress])

  // Valores iniciales del formulario
  const initialValues = useMemo<Partial<CreateAddressData>>(() => {
    if (editingAddress) {
      return {
        street: editingAddress.street,
        city: editingAddress.city,
        state: editingAddress.state,
        zipCode: editingAddress.zipCode,
        country: editingAddress.country,
        reference: editingAddress.reference || undefined,
        isDefault: editingAddress.isDefault,
      }
    }
    return {
      isDefault: shouldBeDefault,
    }
  }, [editingAddress, shouldBeDefault])

  return {
    shouldBeDefault,
    initialValues,
  }
}
