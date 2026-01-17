import { create } from 'zustand'

interface Category {
  id: string
  name: string
  subcategories?: Array<{ id: string; name: string }>
}

interface CategoriesState {
  // Estado de modales
  createCategoryModalOpen: boolean
  editCategoryModalOpen: boolean
  deleteCategoryModalVisible: boolean
  deleteSubcategoryModalVisible: boolean
  subcategoryModalVisible: boolean

  // Estado de edición
  editingCategory: Category | null
  editingSubcategory: Category | null
  categoryToDelete: string | null
  subcategoryToDelete: string | null
  subcategoryName: string

  // Estado de búsqueda y filtros
  searchText: string
  subcategorySearchText: string

  // Estado de paginación
  currentPage: number
  pageSize: number

  // Actions - Modales
  setCreateCategoryModalOpen: (open: boolean) => void
  setEditCategoryModalOpen: (open: boolean) => void
  setDeleteCategoryModalVisible: (visible: boolean) => void
  setDeleteSubcategoryModalVisible: (visible: boolean) => void
  setSubcategoryModalVisible: (visible: boolean) => void

  // Actions - Edición
  setEditingCategory: (category: Category | null) => void
  setEditingSubcategory: (subcategory: Category | null) => void
  setCategoryToDelete: (id: string | null) => void
  setSubcategoryToDelete: (id: string | null) => void
  setSubcategoryName: (name: string) => void

  // Actions - Búsqueda
  setSearchText: (text: string) => void
  setSubcategorySearchText: (text: string) => void

  // Actions - Paginación
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void

  // Actions - Helpers
  resetSearch: () => void
  resetPagination: () => void
  resetModals: () => void
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  // Estado inicial - Modales
  createCategoryModalOpen: false,
  editCategoryModalOpen: false,
  deleteCategoryModalVisible: false,
  deleteSubcategoryModalVisible: false,
  subcategoryModalVisible: false,

  // Estado inicial - Edición
  editingCategory: null,
  editingSubcategory: null,
  categoryToDelete: null,
  subcategoryToDelete: null,
  subcategoryName: '',

  // Estado inicial - Búsqueda
  searchText: '',
  subcategorySearchText: '',

  // Estado inicial - Paginación
  currentPage: 1,
  pageSize: 10,

  // Actions - Modales
  setCreateCategoryModalOpen: (open) => set({ createCategoryModalOpen: open }),
  setEditCategoryModalOpen: (open) => set({ editCategoryModalOpen: open }),
  setDeleteCategoryModalVisible: (visible) =>
    set({ deleteCategoryModalVisible: visible }),
  setDeleteSubcategoryModalVisible: (visible) =>
    set({ deleteSubcategoryModalVisible: visible }),
  setSubcategoryModalVisible: (visible) =>
    set({ subcategoryModalVisible: visible }),

  // Actions - Edición
  setEditingCategory: (category) => set({ editingCategory: category }),
  setEditingSubcategory: (subcategory) =>
    set({ editingSubcategory: subcategory }),
  setCategoryToDelete: (id) => set({ categoryToDelete: id }),
  setSubcategoryToDelete: (id) => set({ subcategoryToDelete: id }),
  setSubcategoryName: (name) => set({ subcategoryName: name }),

  // Actions - Búsqueda
  setSearchText: (text) =>
    set({ searchText: text, currentPage: 1 }), // Resetear página al buscar
  setSubcategorySearchText: (text) => set({ subcategorySearchText: text }),

  // Actions - Paginación
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size, currentPage: 1 }), // Resetear página al cambiar tamaño

  // Actions - Helpers
  resetSearch: () => set({ searchText: '', subcategorySearchText: '' }),
  resetPagination: () => set({ currentPage: 1, pageSize: 10 }),
  resetModals: () =>
    set({
      createCategoryModalOpen: false,
      editCategoryModalOpen: false,
      deleteCategoryModalVisible: false,
      deleteSubcategoryModalVisible: false,
      subcategoryModalVisible: false,
      editingCategory: null,
      editingSubcategory: null,
      categoryToDelete: null,
      subcategoryToDelete: null,
      subcategoryName: '',
    }),
}))
