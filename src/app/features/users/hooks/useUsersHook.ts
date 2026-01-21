import { useMemo } from 'react'
import { Form } from 'antd'
import { useAdminUsersQuery } from '../queries/useAdminUsersQuery'
import { useDeleteUserMutation } from '../mutations/useDeleteUserMutation'
import { useUpdateUserAdminMutation } from '../mutations/useUpdateUserAdminMutation'
import { useAdminResendVerificationMutation } from '../mutations/useAdminResendVerificationMutation'
import { extractItems, extractPagination } from '@/app/helpers/parsePaginatedResponse'
import { useUsersStore } from '@/app/store/users/usersStore'

export interface UserData {
  id: string
  firstName: string
  lastName?: string
  email: string
  documentId?: string
  country?: string
  phoneNumber?: string
  isVerified: boolean
  totalOrders: number
  totalSpent: number
  createdAt: string
}

export const useUsersHook = () => {
  const {
    searchText,
    countryFilter,
    page,
    pageSize,
    setSearchText,
    setCountryFilter,
    setPage,
    setPageSize,
    setUserToDelete,
    setDeleteModalVisible,
    setUserToEdit,
    setEditModalVisible,
  } = useUsersStore()
  const [form] = Form.useForm()

  const { data: usersData, isLoading } = useAdminUsersQuery({
    search: searchText || undefined,
    country: countryFilter || undefined,
    page,
    limit: pageSize,
  })

  const { mutateAsync: deleteUser, isPending: isDeleting } =
    useDeleteUserMutation()

  const { mutateAsync: updateUser, isPending: isUpdating } =
    useUpdateUserAdminMutation()

  const { mutate: resendVerification, isPending: isResendingVerification } =
    useAdminResendVerificationMutation()

  // El helper parsePaginatedResponse normaliza usuarios para usar 'content' en lugar de 'users'
  // Extraer usando extractItems y extractPagination
  const users = useMemo(() => {
    if (!usersData) return []
    return extractItems(usersData)
  }, [usersData])

  const pagination = useMemo(() => {
    if (!usersData) return undefined
    return extractPagination(usersData)
  }, [usersData])

  const total = pagination?.total || 0
  const totalPages = pagination?.totalPages || Math.ceil(total / pageSize)

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId)
    setDeleteModalVisible(true)
  }

  const handleConfirmDelete = async () => {
    const store = useUsersStore.getState()
    if (store.userToDelete) {
      await deleteUser(store.userToDelete)
      store.setDeleteModalVisible(false)
      store.setUserToDelete(null)
    }
  }

  const handleEditClick = (user: UserData) => {
    setUserToEdit(user)
    form.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName || '',
      email: user.email,
      documentId: user.documentId || '',
      phoneNumber: user.phoneNumber || '',
      country: user.country || '',
    })
    setEditModalVisible(true)
  }

  const handleEditCancel = () => {
    setEditModalVisible(false)
    setUserToEdit(null)
    form.resetFields()
  }

  const handleEditSubmit = async () => {
    const store = useUsersStore.getState()
    if (!store.userToEdit) return

    try {
      const values = await form.validateFields()
      await updateUser({
        userId: store.userToEdit.id,
        data: {
          firstName: values.firstName,
          lastName: values.lastName || undefined,
          email: values.email,
          documentId: values.documentId || undefined,
          phoneNumber: values.phoneNumber || undefined,
          country: values.country || undefined,
        },
      })
      handleEditCancel()
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchText(value)
  }

  const handleCountryFilterChange = (value: string) => {
    setCountryFilter(value)
  }

  const formatTotalSpent = (amount: number) => {
    return new Intl.NumberFormat('es-SV', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-SV', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleResendVerification = (email: string) => {
    resendVerification(email)
  }

  return {
    users,
    isLoading,
    total,
    totalPages,
    page,
    pageSize,
    setPage,
    setPageSize,
    searchText,
    setSearchText: handleSearchChange,
    countryFilter,
    setCountryFilter: handleCountryFilterChange,
    form,
    isDeleting,
    isUpdating,
    isResendingVerification,
    handleDeleteClick,
    handleConfirmDelete,
    handleEditClick,
    handleEditCancel,
    handleEditSubmit,
    handleResendVerification,
    formatTotalSpent,
    formatDate,
  }
}
