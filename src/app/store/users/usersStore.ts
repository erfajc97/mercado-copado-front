import { create } from 'zustand'
import type { UserData } from '@/app/features/users/hooks/useUsersHook'

interface UsersState {
  // Modales
  deleteModalVisible: boolean
  editModalVisible: boolean
  userToDelete: string | null
  userToEdit: UserData | null

  // Filtros y búsqueda
  searchText: string
  countryFilter: string

  // Paginación
  page: number
  pageSize: number

  // Setters
  setDeleteModalVisible: (visible: boolean) => void
  setEditModalVisible: (visible: boolean) => void
  setUserToDelete: (id: string | null) => void
  setUserToEdit: (user: UserData | null) => void
  setSearchText: (text: string) => void
  setCountryFilter: (filter: string) => void
  setPage: (page: number) => void
  setPageSize: (size: number) => void
}

export const useUsersStore = create<UsersState>((set) => ({
  // Estado inicial
  deleteModalVisible: false,
  editModalVisible: false,
  userToDelete: null,
  userToEdit: null,
  searchText: '',
  countryFilter: '',
  page: 1,
  pageSize: 10,

  // Setters
  setDeleteModalVisible: (visible) => set({ deleteModalVisible: visible }),
  setEditModalVisible: (visible) => set({ editModalVisible: visible }),
  setUserToDelete: (id) => set({ userToDelete: id }),
  setUserToEdit: (user) => set({ userToEdit: user }),
  setSearchText: (text) => set({ searchText: text, page: 1 }),
  setCountryFilter: (filter) => set({ countryFilter: filter, page: 1 }),
  setPage: (page) => set({ page }),
  setPageSize: (size) => set({ pageSize: size, page: 1 }),
}))
