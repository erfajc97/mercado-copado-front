import { Button } from '@heroui/react'

interface OrdersPaginationProps {
  currentPage: number
  totalPages: number
  total: number
  isLoading: boolean
  onPageChange: (page: number) => void
}

export const OrdersPagination = ({
  currentPage,
  totalPages,
  total,
  isLoading,
  onPageChange,
}: OrdersPaginationProps) => {
  if (totalPages <= 1) return null

  return (
    <div className="mt-8 flex justify-center items-center gap-2">
      <Button
        color="primary"
        onPress={() => onPageChange(Math.max(1, currentPage - 1))}
        isDisabled={currentPage === 1 || isLoading}
        className="bg-gradient-coffee border-none hover:opacity-90"
      >
        Anterior
      </Button>
      <span className="text-gray-600 px-4">
        Página {currentPage} de {totalPages} ({total} órdenes)
      </span>
      <Button
        color="primary"
        onPress={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        isDisabled={currentPage === totalPages || isLoading}
        className="bg-gradient-coffee border-none hover:opacity-90"
      >
        Siguiente
      </Button>
    </div>
  )
}
