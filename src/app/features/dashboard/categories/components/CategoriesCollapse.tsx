import { Button, Collapse } from 'antd'
import { Edit, Trash2 } from 'lucide-react'
import type { CategoriesDashboardHookReturn } from './types'

const { Panel } = Collapse

interface CategoriesCollapseProps {
  hook: CategoriesDashboardHookReturn
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
                    type="text"
                    icon={<Edit size={16} />}
                    onClick={() => hook.openEditCategory(category)}
                    size="small"
                  >
                    Editar
                  </Button>
                  <Button
                    type="text"
                    danger
                    icon={<Trash2 size={16} />}
                    onClick={() => {
                      hook.setCategoryToDelete(category.id)
                      hook.setDeleteCategoryModalVisible(true)
                    }}
                    size="small"
                  >
                    Eliminar
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
                        type="text"
                        icon={<Edit size={14} />}
                        onClick={() => hook.openEditSubcategory(subcategory)}
                        size="small"
                      >
                        Editar
                      </Button>
                      <Button
                        type="text"
                        danger
                        icon={<Trash2 size={14} />}
                        onClick={() => {
                          hook.setSubcategoryToDelete(subcategory.id)
                          hook.setDeleteSubcategoryModalVisible(true)
                        }}
                        size="small"
                      >
                        Eliminar
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

