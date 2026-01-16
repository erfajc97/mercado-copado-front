import { Button } from '@heroui/react'
import { Collapse } from 'antd'
import { Edit, Trash2 } from 'lucide-react'
import type { useCategoriesHook } from '../hooks/useCategoriesHook'

const { Panel } = Collapse

interface CategoriesCollapseProps {
  hook: ReturnType<typeof useCategoriesHook> & {
    openEditCategory: (category: any) => void
  }
}

export const CategoriesCollapse = ({ hook }: CategoriesCollapseProps) => {
  return (
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
                      hook.setCategoryToDelete(category.id)
                      hook.setDeleteCategoryModalVisible(true)
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
                          hook.setSubcategoryToDelete(subcategory.id)
                          hook.setDeleteSubcategoryModalVisible(true)
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
  )
}
