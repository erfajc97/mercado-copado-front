import { Button, Space, Table, Tag } from 'antd'
import { Edit, Trash2 } from 'lucide-react'
import type { ColumnsType } from 'antd/es/table'
import type { CategoriesDashboardHookReturn } from './types'

interface CategoriesTableProps {
  hook: CategoriesDashboardHookReturn
}

export const CategoriesTable = ({ hook }: CategoriesTableProps) => {
  const categoryColumns: ColumnsType<any> = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: 'Subcategorías',
      key: 'subcategories',
      render: (_: unknown, record: any) => (
        <div>
          {record.subcategories && record.subcategories.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {record.subcategories
                .filter((sub: any) =>
                  hook.subcategorySearchText
                    ? sub.name
                        .toLowerCase()
                        .includes(hook.subcategorySearchText.toLowerCase())
                    : true,
                )
                .map((sub: any) => (
                  <Tag key={sub.id} color="blue">
                    {sub.name}
                  </Tag>
                ))}
            </div>
          ) : (
            <span className="text-gray-400">Sin subcategorías</span>
          )}
        </div>
      ),
    },
    {
      title: 'Cantidad Subcategorías',
      key: 'subcategoryCount',
      render: (_: unknown, record: any) => record.subcategories?.length || 0,
      sorter: (a: any, b: any) =>
        (a.subcategories?.length || 0) - (b.subcategories?.length || 0),
    },
    {
      title: 'Productos',
      key: 'productCount',
      render: (_: unknown, record: any) => record._count?.products || 0,
      sorter: (a: any, b: any) =>
        (a._count?.products || 0) - (b._count?.products || 0),
    },
    {
      title: 'Fecha Creación',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) =>
        new Date(date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 200,
      render: (_: unknown, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<Edit size={16} />}
            onClick={() => hook.openEditCategory(record)}
            size="small"
          >
            Editar
          </Button>
          <Button
            type="link"
            danger
            icon={<Trash2 size={16} />}
            onClick={() => {
              hook.setCategoryToDelete(record.id)
              hook.setDeleteCategoryModalVisible(true)
            }}
            size="small"
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Table
        columns={categoryColumns}
        dataSource={hook.categories}
        loading={hook.isLoading}
        rowKey="id"
        expandable={{
          expandedRowRender: (record: any) => (
            <div className="p-4 bg-gray-50">
              <h4 className="font-semibold mb-3">Subcategorías:</h4>
              {record.subcategories && record.subcategories.length > 0 ? (
                <div className="space-y-2">
                  {record.subcategories
                    .filter((sub: any) =>
                      hook.subcategorySearchText
                        ? sub.name
                            .toLowerCase()
                            .includes(
                              hook.subcategorySearchText.toLowerCase(),
                            )
                        : true,
                    )
                    .map((subcategory: any) => (
                      <div
                        key={subcategory.id}
                        className="flex justify-between items-center p-3 bg-white rounded border"
                      >
                        <span>{subcategory.name}</span>
                        <Space>
                          <Button
                            type="link"
                            icon={<Edit size={14} />}
                            onClick={() => hook.openEditSubcategory(subcategory)}
                            size="small"
                          >
                            Editar
                          </Button>
                          <Button
                            type="link"
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
                        </Space>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No hay subcategorías</p>
              )}
            </div>
          ),
          rowExpandable: (record: any) =>
            record.subcategories && record.subcategories.length > 0,
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} categorías`,
        }}
      />
    </div>
  )
}

