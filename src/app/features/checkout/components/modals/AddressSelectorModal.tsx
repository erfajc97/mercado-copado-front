import { Button } from '@heroui/react'
import { Home } from 'lucide-react'
import type { Address } from '@/app/features/addresses/types'
import CustomModalNextUI from '@/components/UI/customModalNextUI/CustomModalNextUI'

interface AddressSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  addresses: Array<Address> | undefined
  selectedAddressId: string
  onSelectAddress: (addressId: string) => void
  onAddNewAddress: () => void
}

export function AddressSelectorModal({
  isOpen,
  onClose,
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddNewAddress,
}: AddressSelectorModalProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      isDismissable
      size="2xl"
      placement="center"
      headerContent="Seleccionar Dirección"
    >
      <div className="space-y-2 mt-2">
        {addresses?.map((address) => {
          const isSelected = selectedAddressId === address.id
          return (
            <label
              key={address.id}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? 'border-coffee-medium bg-coffee-light/20'
                  : 'border-gray-200 hover:border-coffee-light'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="selectAddress"
                  value={address.id}
                  checked={isSelected}
                  onChange={(e) => {
                    onSelectAddress(e.target.value)
                    onClose()
                  }}
                  className="mt-1"
                />
                <div className="flex-1">
                  {address.isDefault && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-coffee-medium text-white px-2 py-1 rounded flex items-center gap-1">
                        <Home size={12} />
                        Por defecto
                      </span>
                    </div>
                  )}
                  <p className="font-semibold text-coffee-darker">
                    {address.street}, {address.city}
                  </p>
                  <p className="text-sm text-gray-600">
                    {address.state}, {address.zipCode}, {address.country}
                  </p>
                  {address.reference && (
                    <p className="text-xs text-gray-500 mt-1">
                      Referencia: {address.reference}
                    </p>
                  )}
                </div>
              </div>
            </label>
          )
        })}
      </div>
      <div className="mt-4 pt-4 border-t">
        <Button
          variant="bordered"
          onPress={() => {
            onClose()
            onAddNewAddress()
          }}
          className="w-full"
        >
          Agregar Nueva Dirección
        </Button>
      </div>
    </CustomModalNextUI>
  )
}
