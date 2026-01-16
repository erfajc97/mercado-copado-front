import { Button, Chip } from '@heroui/react'
import { Edit, Trash2 } from 'lucide-react'
import type { Column } from '@/components/UI/table-nextui/CustomTableNextUi'
import type { useCategoriesHook } from '../hooks/useCategoriesHook'
import CustomTableNextUi from '@/components/UI/table-nextui/CustomTableNextUi'
import CustomPagination from '@/components/UI/table-nextui/CustomPagination'

interface CategoriesTableProps {
  hook: ReturnType<typeof useCategoriesHook> & {
    openEditCategory: (category: any) => void
  }
}

export const CategoriesTable = ({ hook }: CategoriesTableProps) => {
  const columns: Array<Column> = [
    {
      name: 'Nombre',
      uid: 'name',
      sortable: true,
    },
    {
      name: 'Subcategorías',
      uid: 'subcategories',
    },
    {
      name: 'Cantidad Subcategorías',
      uid: 'subcategoryCount',
      sortable: true,
    },
    {
      name: 'Productos',
      uid: 'productCount',
      sortable: true,
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

  const renderCell = (category: any, columnKey: React.Key) => {
    switch (columnKey) {
      case 'name':
        return <span className="font-semibold">{category.name}</span>
      case 'subcategories':
        return (
          <div>
            {category.subcategories && category.subcategories.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {category.subcategories
                  .filter((sub: any) =>
                    hook.subcategorySearchText
                      ? sub.name
                          .toLowerCase()
                          .includes(hook.subcategorySearchText.toLowerCase())
                      : true,
                  )
                  .map((sub: any) => (
                    <Chip key={sub.id} color="primary" size="sm" variant="flat">
                      {sub.name}
                    </Chip>
                  ))}
              </div>
            ) : (
              <span className="text-gray-400">Sin subcategorías</span>
            )}
          </div>
        )
      case 'subcategoryCount':
        return category.subcategories?.length || 0
      case 'productCount':
        return category._count?.products || 0
      case 'createdAt':
        return formatDate(category.createdAt)
      case 'actions':
        return (
          <div className="flex gap-2">
            <Button
              variant="light"
              size="sm"
              onPress={() => hook.openEditCategory(category)}
              isIconOnly
            >
              <Edit size={16} />
            </Button>
            <Button
              color="danger"
              variant="light"
              size="sm"
              onPress={() => {
                hook.setCategoryToDelete(category.id)
                hook.setDeleteCategoryModalVisible(true)
              }}
              isIconOnly
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  const items = hook.categories.map((category: any) => ({
    ...category,
    id: category.id,
  }))

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <CustomTableNextUi
        items={items}
        columns={columns}
        renderCell={renderCell}
        loading={hook.isLoading}
        bottomContent={
          hook.categories.length > 10 ? (
            <CustomPagination
              page={1}
              pages={Math.ceil(hook.categories.length / 10)}
              setPage={() => {}}
              isLoading={hook.isLoading}
            />
          ) : null
        }
      />
    </div>
  )
}
