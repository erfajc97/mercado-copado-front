import { create } from 'zustand'

interface ProductsState {
  // Modales
  productModalOpen: boolean
  deleteModalVisible: boolean
  productToDelete: string | null
  productToEdit: string | null // null = crear, string = editar

  // Filtros y búsqueda
  searchText: string
  categoryFilter: string
  subcategoryFilter: string
  priceFilter: string
  statusFilter: string

  // Paginación
  currentPage: number
  pageSize: number

  // Setters
  setProductModalOpen: (open: boolean) => void
  setDeleteModalVisible: (visible: boolean) => void
  setProductToDelete: (id: string | null) => void
  setProductToEdit: (id: string | null) => void
  setSearchText: (text: string) => void
  setCategoryFilter: (filter: string) => void
  setSubcategoryFilter: (filter: string) => void
  setPriceFilter: (filter: string) => void
  setStatusFilter: (filter: string) => void
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
}

export const useProductsStore = create<ProductsState>((set) => ({
  // Estado inicial
  productModalOpen: false,
  deleteModalVisible: false,
  productToDelete: null,
  productToEdit: null, // null = crear, string = editar
  searchText: '',
  categoryFilter: '',
  subcategoryFilter: '',
  priceFilter: '',
  statusFilter: 'all',
  currentPage: 1,
  pageSize: 10,

  // Setters
  setProductModalOpen: (open) => set({ productModalOpen: open }),
  setDeleteModalVisible: (visible) => set({ deleteModalVisible: visible }),
  setProductToDelete: (id) => set({ productToDelete: id }),
  setProductToEdit: (id) => set({ productToEdit: id }),
  setSearchText: (text) => set({ searchText: text, currentPage: 1 }),
  setCategoryFilter: (filter) => set({ categoryFilter: filter, currentPage: 1 }),
  setSubcategoryFilter: (filter) => set({ subcategoryFilter: filter, currentPage: 1 }),
  setPriceFilter: (filter) => set({ priceFilter: filter, currentPage: 1 }),
  setStatusFilter: (filter) => set({ statusFilter: filter, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),
}))
