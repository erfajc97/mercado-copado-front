import { Button } from '@heroui/react'
import { Collapse } from 'antd'
import { Edit, Trash2 } from 'lucide-react'
import type { useCategoriesHook } from '../hooks/useCategoriesHook'
import { useCategoriesStore } from '@/app/store/categories/categoriesStore'
import CustomPagination from '@/components/UI/table-nextui/CustomPagination'

const { Panel } = Collapse

interface CategoriesCollapseProps {
  hook: ReturnType<typeof useCategoriesHook> & {
    openEditCategory: (category: any) => void
  }
}

export const CategoriesCollapse = ({ hook }: CategoriesCollapseProps) => {
  const {
    currentPage,
    setCurrentPage,
    setCategoryToDelete,
    setDeleteCategoryModalVisible,
    setSubcategoryToDelete,
    setDeleteSubcategoryModalVisible,
  } = useCategoriesStore()

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Collapse defaultActiveKey={hook.expandedCategories}>
          {hook.categories.map((category: any) => (
            <Panel
              key={category.id}
              header={
                <div className="flex justify-between items-center w-full pr-4">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{category.name}</span>
                    <span className="text-sm text-gray-500">
                      {category.subcategories?.length || 0} subcategorías •{' '}
                      {category._count?.products || 0} productos
                    </span>
                  </div>
                  <div
                    className="flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
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
                        setCategoryToDelete(category.id)
                        setDeleteCategoryModalVisible(true)
                      }}
                      isIconOnly
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              }
            >
              <div className="space-y-2">
                {category.subcategories && category.subcategories.length > 0 ? (
                  category.subcategories.map((subcategory: any) => (
                    <div
                      key={subcategory.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                      <span>{subcategory.name}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="light"
                          size="sm"
                          onPress={() => hook.openEditSubcategory(subcategory)}
                          isIconOnly
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          color="danger"
                          variant="light"
                          size="sm"
                          onPress={() => {
                            setSubcategoryToDelete(subcategory.id)
                            setDeleteSubcategoryModalVisible(true)
                          }}
                          isIconOnly
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No hay subcategorías</p>
                )}
              </div>
            </Panel>
          ))}
        </Collapse>
      </div>
      <CustomPagination
        page={currentPage}
        pages={hook.totalPages}
        setPage={setCurrentPage}
        isLoading={hook.isLoading}
      />
    </div>
  )
}
