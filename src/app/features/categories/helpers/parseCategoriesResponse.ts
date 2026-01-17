/**
 * Re-exportar desde el helper genérico para mantener compatibilidad
 */
export {
  parsePaginatedResponse as parseCategoriesResponse,
  extractItems as extractCategories,
  extractPagination,
  type PaginatedResponse,
} from '@/app/helpers/parsePaginatedResponse'
