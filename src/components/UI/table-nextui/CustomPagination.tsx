// components/PaginationComponent.tsx
import React from 'react'
import { Pagination } from '@heroui/pagination'
import useDeviceType from '@/app/hooks/useDeviceType'

type PaginationProps = {
  page: number
  pages: number
  setPage: (page: number) => void
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const CustomPagination: React.FC<PaginationProps> = ({
  page,
  pages,
  setPage,
  size,
  isLoading = false,
}) => {
  type DeviceType = 'mobile' | 'desktop' | 'tablet' | undefined
  const deviceType: DeviceType = useDeviceType()

  // Evitar renderizar si no hay datos válidos
  if (!pages || pages <= 0) {
    return null
  }

  return (
    <div className="flex justify-center items-center mt-auto pt-1">
      <Pagination
        showControls
        showShadow
        color="primary"
        radius="full"
        page={page}
        total={pages}
        onChange={setPage}
        size={size ? size : deviceType === 'mobile' ? 'sm' : 'sm'}
        isDisabled={isLoading}
      />
    </div>
  )
}

export default CustomPagination
