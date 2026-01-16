import { useState } from 'react'
import { Form } from 'antd'
import { useAddressesQuery } from '../queries/useAddressesQuery'
import { useCreateAddressMutation } from '../mutations/useCreateAddressMutation'
import { useUpdateAddressMutation } from '../mutations/useUpdateAddressMutation'
import { useDeleteAddressMutation } from '../mutations/useDeleteAddressMutation'
import { useSetDefaultAddressMutation } from '../mutations/useSetDefaultAddressMutation'
import type { Address, CreateAddressData } from '../types'

export const useAddressesHook = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null)
  const [form] = Form.useForm()

  const { data: addresses, refetch: refetchAddresses } = useAddressesQuery()
  const { mutateAsync: createAddress, isPending: isCreatingAddress } =
    useCreateAddressMutation()
  const { mutateAsync: deleteAddress, isPending: isDeletingAddress } =
    useDeleteAddressMutation()
  const { mutateAsync: setDefaultAddress } = useSetDefaultAddressMutation()
  const { mutateAsync: updateAddress, isPending: isUpdatingAddress } =
    useUpdateAddressMutation()

  const openModal = () => {
    setIsModalOpen(true)
    setEditingAddress(null)
    form.resetFields()
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingAddress(null)
    form.resetFields()
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    form.setFieldsValue(address)
    setIsModalOpen(true)
  }

  const handleCreateAddress = async (values: CreateAddressData) => {
    try {
      const addressData: CreateAddressData = {
        ...values,
        isDefault:
          addresses && addresses.length === 0 ? true : values.isDefault,
      }
      await createAddress(addressData)
      await refetchAddresses()
      closeModal()
    } catch (error) {
      console.error('Error creating address:', error)
    }
  }

  const handleUpdateAddress = async (values: CreateAddressData) => {
    if (!editingAddress) return

    try {
      await updateAddress({
        addressId: editingAddress.id,
        data: values,
      })
      await refetchAddresses()
      closeModal()
    } catch (error) {
      console.error('Error updating address:', error)
    }
  }

  const openDeleteModal = (addressId: string) => {
    setAddressToDelete(addressId)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setAddressToDelete(null)
  }

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return

    try {
      await deleteAddress(addressToDelete)
      await refetchAddresses()
      closeDeleteModal()
    } catch (error) {
      console.error('Error deleting address:', error)
    }
  }

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await setDefaultAddress(addressId)
      await refetchAddresses()
    } catch (error) {
      console.error('Error setting default address:', error)
    }
  }

  const handleSubmit = async (values: CreateAddressData) => {
    if (editingAddress) {
      await handleUpdateAddress(values)
    } else {
      await handleCreateAddress(values)
    }
  }

  // Alias para compatibilidad
  const handleSaveAddress = handleSubmit

  return {
    // Estados
    isModalOpen,
    editingAddress,
    addresses,
    form,
    isCreatingAddress,
    isUpdatingAddress,
    isDeletingAddress,
    isDeleteModalOpen,
    addressToDelete,

    // Funciones
    openModal,
    closeModal,
    handleEditAddress,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteAddress,
    handleSetDefaultAddress,
    handleSubmit,
    handleSaveAddress, // Alias para compatibilidad
    refetchAddresses,
  }
}
