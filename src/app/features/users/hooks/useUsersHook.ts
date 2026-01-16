import { useState, useEffect } from 'react'
import { Form } from 'antd'
import { useAdminUsersQuery } from '../queries/useAdminUsersQuery'
import { useDeleteUserMutation } from '../mutations/useDeleteUserMutation'
import { useUpdateUserAdminMutation } from '../mutations/useUpdateUserAdminMutation'

export interface UserData {
  id: string
  firstName: string
  lastName?: string
  email: string
  documentId?: string
  country?: string
  phoneNumber?: string
  totalOrders: number
  totalSpent: number
  createdAt: string
}

export const useUsersHook = () => {
  const [searchText, setSearchText] = useState('')
  const [countryFilter, setCountryFilter] = useState<string>('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [userToEdit, setUserToEdit] = useState<UserData | null>(null)
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

  const users = usersData?.users || []
  const total = usersData?.pagination?.total || 0
  const totalPages = Math.ceil(total / pageSize)

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId)
    setDeleteModalVisible(true)
  }

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete)
      setDeleteModalVisible(false)
      setUserToDelete(null)
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
    if (!userToEdit) return

    try {
      const values = await form.validateFields()
      await updateUser({
        userId: userToEdit.id,
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
    setPage(1)
  }

  const handleCountryFilterChange = (value: string) => {
    setCountryFilter(value)
    setPage(1)
  }

  useEffect(() => {
    if (!editModalVisible) {
      form.resetFields()
    }
  }, [editModalVisible, form])

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
    deleteModalVisible,
    setDeleteModalVisible,
    userToDelete,
    setUserToDelete,
    editModalVisible,
    setEditModalVisible,
    userToEdit,
    setUserToEdit,
    form,
    isDeleting,
    isUpdating,
    handleDeleteClick,
    handleConfirmDelete,
    handleEditClick,
    handleEditCancel,
    handleEditSubmit,
    formatTotalSpent,
    formatDate,
  }
}
