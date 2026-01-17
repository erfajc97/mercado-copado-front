import { Link } from '@tanstack/react-router'
import { Button, Chip, Switch } from '@heroui/react'
import { Delete, Edit, Eye } from 'lucide-react'
import type { useProductsHook } from '../hooks/useProductsHook'
import type { Column } from '@/components/UI/table-nextui/CustomTableNextUi'
import CustomTableNextUi from '@/components/UI/table-nextui/CustomTableNextUi'
import CustomPagination from '@/components/UI/table-nextui/CustomPagination'

interface ProductsTableProps {
  hook: ReturnType<typeof useProductsHook>
}

export const ProductsTable = ({ hook }: ProductsTableProps) => {
  const columns: Array<Column> = [
    {
      name: 'Imagen',
      uid: 'image',
      width: 80,
    },
    {
      name: 'Nombre',
      uid: 'name',
      sortable: true,
    },
    {
      name: 'Categoría',
      uid: 'category',
    },
    {
      name: 'Subcategoría',
      uid: 'subcategory',
    },
    {
      name: 'Precio',
      uid: 'price',
      sortable: true,
      align: 'end',
    },
    {
      name: 'Descuento',
      uid: 'discount',
    },
    {
      name: 'Estado',
      uid: 'status',
    },
    {
      name: 'Fecha Creación',
      uid: 'createdAt',
      sortable: true,
    },
    {
      name: 'Acciones',
      uid: 'actions',
      width: 200,
    },
  ]

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const renderCell = (product: any, columnKey: React.Key) => {
    switch (columnKey) {
      case 'image': {
        const imageUrl = product.images?.length > 0 ? product.images[0]?.url : null
        return imageUrl ? (
          <img
            src={imageUrl}
            alt="Producto"
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
            Sin imagen
          </div>
        )
      }
      case 'name':
        return <span className="font-semibold">{product.name}</span>
      case 'category':
        return product.category?.name || '-'
      case 'subcategory':
        return product.subcategory?.name || '-'
      case 'price': {
        const priceNum = Number(product.price)
        const discount = Number(product.discount || 0)
        const finalPrice = priceNum * (1 - discount / 100)
        return (
          <div className="flex flex-col">
            <span className="font-semibold">{hook.formatUSD(finalPrice)}</span>
            {hook.currency === 'ARS' && (
              <span className="text-xs text-gray-500">
                {hook.formatPrice(finalPrice)}
              </span>
            )}
          </div>
        )
      }
      case 'discount':
        return product.discount > 0 ? (
          <Chip color="danger" size="sm" variant="flat">
            -{product.discount}%
          </Chip>
        ) : (
          <span className="text-gray-400">-</span>
        )
      case 'status':
        return (
          <Switch
            isSelected={product.isActive}
            onValueChange={() => hook.handleToggleActive(product)}
            size="sm"
            color="success"
          />
        )
      case 'createdAt':
        return formatDate(product.createdAt)
      case 'actions':
        return (
          <div className="flex gap-2">
            <Link to="/products/$productId" params={{ productId: product.id }}>
              <Button variant="light" size="sm" isIconOnly>
                <Eye size={16} />
              </Button>
            </Link>
            <Button
              variant="light"
              size="sm"
              onPress={() => hook.handleEditClick(product.id)}
              isIconOnly
            >
              <Edit size={16} />
            </Button>
            <Button
              color="danger"
              variant="light"
              size="sm"
              onPress={() => hook.handleDeleteClick(product.id)}
              isIconOnly
            >
              <Delete size={16} />
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  const items = hook.products.map((product: any) => ({
    ...product,
    id: product.id,
  }))

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <CustomTableNextUi
        items={items}
        columns={columns}
        renderCell={renderCell}
        loading={hook.isLoading}
        bottomContent={
          <CustomPagination
            page={hook.currentPage}
            pages={hook.totalPages}
            setPage={hook.setCurrentPage}
            isLoading={hook.isLoading}
          />
        }
      />
    </div>
  )
}
