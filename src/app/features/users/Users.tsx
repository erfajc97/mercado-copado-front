import { useUsersHook } from './hooks/useUsersHook'
import { UsersTable } from './components/UsersTable'
import { UsersFilters } from './components/UsersFilters'
import { DeleteUserModal } from './components/modals/DeleteUserModal'
import { EditUserModal } from './components/modals/EditUserModal'
import type { UserData } from './hooks/useUsersHook'
import { useUsersStore } from '@/app/store/users/usersStore'

export function Users() {
  const {
    users,
    isLoading,
    totalPages,
    page,
    setPage,
    searchText,
    setSearchText,
    countryFilter,
    setCountryFilter,
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
  } = useUsersHook()

  const {
    deleteModalVisible,
    editModalVisible,
    setDeleteModalVisible,
    setUserToDelete,
  } = useUsersStore()

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
      </div>

      <UsersFilters
        searchText={searchText}
        onSearchChange={setSearchText}
        countryFilter={countryFilter}
        onCountryFilterChange={setCountryFilter}
      />

      <UsersTable
        users={users as unknown as Array<UserData>}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        onResendVerification={handleResendVerification}
        isResendingVerification={isResendingVerification}
        formatTotalSpent={formatTotalSpent}
        formatDate={formatDate}
      />

      <DeleteUserModal
        isOpen={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false)
          setUserToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />

      <EditUserModal
        isOpen={editModalVisible}
        onClose={handleEditCancel}
        onConfirm={handleEditSubmit}
        form={form}
        isLoading={isUpdating}
      />
    </div>
  )
}
