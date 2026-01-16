import { Button, Card } from 'antd'
import { Edit, Home, MapPin, Plus, Trash2 } from 'lucide-react'
import { useAddressesHook } from './hooks/useAddressesHook'
import { AddressModal } from './components/modals/AddressModal'
import DeleteAddressModal from './components/modals/DeleteAddressModal'
import type { Address } from './types'

export function Addresses() {
  const {
    addresses,
    isModalOpen,
    editingAddress,
    form: addressForm,
    isCreatingAddress,
    isUpdatingAddress,
    isDeletingAddress,
    isDeleteModalOpen,
    openModal,
    closeModal,
    handleEditAddress,
    handleSaveAddress,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteAddress,
    handleSetDefaultAddress,
  } = useAddressesHook()

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-coffee-darker">
          Direcciones Guardadas
        </h2>
        <Button
          type="primary"
          icon={<Plus size={18} />}
          onClick={openModal}
          className="bg-gradient-coffee border-none hover:opacity-90"
        >
          Agregar Dirección
        </Button>
      </div>

      {addresses && addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address: Address) => (
            <Card
              key={address.id}
              className={`shadow-coffee ${
                address.isDefault ? 'border-2 border-coffee-medium' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-coffee-darker mb-2">
                    {address.street}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {address.city}, {address.state}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    {address.zipCode}, {address.country}
                  </p>
                  {address.reference && (
                    <p className="text-xs text-gray-500 mt-2">
                      <strong>Referencia:</strong> {address.reference}
                    </p>
                  )}
                  {address.isDefault && (
                    <span className="mt-2 bg-coffee-medium text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Home size={12} />
                      Por defecto
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefaultAddress(address.id)}
                      className="p-2 text-coffee-medium hover:bg-coffee-light rounded-lg transition-colors text-xs"
                      aria-label="Establecer como predeterminada"
                      title="Establecer como predeterminada"
                    >
                      <Home size={16} />
                    </button>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="p-2 text-coffee-medium hover:bg-coffee-light rounded-lg transition-colors"
                      aria-label="Editar dirección"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(address.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Eliminar dirección"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-coffee">
          <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">No tienes direcciones guardadas</p>
          <Button
            type="primary"
            icon={<Plus size={18} />}
            onClick={openModal}
            className="bg-gradient-coffee border-none hover:opacity-90"
          >
            Agregar Primera Dirección
          </Button>
        </div>
      )}

      <AddressModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editingAddress={editingAddress}
        form={addressForm}
        addresses={addresses}
        isLoading={isCreatingAddress || isUpdatingAddress}
        onSave={handleSaveAddress}
      />

      <DeleteAddressModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteAddress}
        isLoading={isDeletingAddress}
      />
    </div>
  )
}
