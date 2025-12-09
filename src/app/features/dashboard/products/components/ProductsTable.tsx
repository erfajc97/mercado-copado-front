import { Link } from '@tanstack/react-router'
import { Button, Space, Switch, Table, Tag } from 'antd'
import { Delete, Edit, Eye } from 'lucide-react'
import type { ColumnsType } from 'antd/es/table'
import type { ProductsDashboardHookReturn } from './types'

interface ProductsTableProps {
  hook: ProductsDashboardHookReturn
}

export const ProductsTable = ({ hook }: ProductsTableProps) => {
  const columns: ColumnsType<any> = [
    {
      title: 'Imagen',
      dataIndex: 'images',
      key: 'image',
      width: 80,
      render: (images: Array<any>) => {
        const imageUrl = images.length > 0 ? images[0]?.url : null
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
      },
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: 'Categoría',
      key: 'category',
      render: (_: unknown, record: any) => record.category?.name || '-',
      filters: hook.categories?.map((cat: any) => ({
        text: cat.name,
        value: cat.id,
      })),
      onFilter: (value, record: any) => record.categoryId === value,
    },
    {
      title: 'Subcategoría',
      key: 'subcategory',
      render: (_: unknown, record: any) => record.subcategory?.name || '-',
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      sorter: (a: any, b: any) => Number(a.price) - Number(b.price),
      render: (price: string, record: any) => {
        const priceNum = Number(price)
        const discount = Number(record.discount || 0)
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
      },
    },
    {
      title: 'Descuento',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount: number) =>
        discount > 0 ? (
          <Tag color="red">-{discount}%</Tag>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: 'Estado',
      dataIndex: 'isActive',
      key: 'status',
      render: (isActive: boolean, record: any) => (
        <Switch
          checked={isActive}
          onChange={() => hook.handleToggleActive(record)}
          size="small"
        />
      ),
      filters: [
        { text: 'Activo', value: 'active' },
        { text: 'Inactivo', value: 'inactive' },
      ],
      onFilter: (value, record: any) => {
        if (value === 'active') return record.isActive
        if (value === 'inactive') return !record.isActive
        return true
      },
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
      width: 150,
      render: (_: unknown, record: any) => (
        <Space>
          <Link to="/products/$productId" params={{ productId: record.id }}>
            <Button type="link" icon={<Eye size={16} />} size="small">
              Ver
            </Button>
          </Link>
          <Link to="/dashboard/products/new" search={{ edit: record.id }}>
            <Button type="link" icon={<Edit size={16} />} size="small">
              Editar
            </Button>
          </Link>
          <Button
            type="link"
            danger
            icon={<Delete size={16} />}
            onClick={() => hook.handleDeleteClick(record.id)}
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
        columns={columns}
        dataSource={hook.products}
        loading={hook.isLoading}
        rowKey="id"
        pagination={{
          current: hook.currentPage,
          pageSize: hook.pageSize,
          total: hook.totalProducts,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} de ${total} productos`,
          onChange: (page, size) => {
            hook.setCurrentPage(page)
            hook.setPageSize(size)
          },
        }}
        scroll={{ x: 1200 }}
      />
    </div>
  )
}
