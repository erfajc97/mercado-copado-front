import { useState } from 'react'
import { Button, Input, Modal, Select, Table } from 'antd'
import { Search, Trash2 } from 'lucide-react'
import type { ColumnsType } from 'antd/es/table'
import { useAdminUsersQuery } from '@/app/features/users/queries/useAdminUsersQuery'
import { useDeleteUserMutation } from '@/app/features/users/mutations/useDeleteUserMutation'
import { COUNTRIES } from '@/app/constants/countries'

interface UserData {
  id: string
  firstName: string
  lastName?: string
  email: string
  documentId?: string
  country?: string
  phoneNumber?: string
  totalOrders: number
  totalSpent: number
  createdAt: string
}

export default function AdminUsers() {
  const [searchText, setSearchText] = useState('')
  const [countryFilter, setCountryFilter] = useState<string>('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

  const { data: usersData, isLoading } = useAdminUsersQuery({
    search: searchText || undefined,
    country: countryFilter || undefined,
    page,
    limit: pageSize,
  })

  const { mutateAsync: deleteUser, isPending: isDeleting } =
    useDeleteUserMutation()

  const users = usersData?.users || []
  const total = usersData?.pagination?.total || 0

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId)
    setDeleteModalVisible(true)
  }

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete)
      setDeleteModalVisible(false)
      setUserToDelete(null)
    }
  }

  const columns: ColumnsType<UserData> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (text: string) => (
        <span className="font-mono text-xs">{text.substring(0, 8)}...</span>
      ),
    },
    {
      title: 'Nombre',
      key: 'name',
      render: (_: unknown, record: UserData) =>
        `${record.firstName} ${record.lastName || ''}`.trim(),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Documento',
      dataIndex: 'documentId',
      key: 'documentId',
      render: (text: string) => text || '-',
    },
    {
      title: 'País',
      dataIndex: 'country',
      key: 'country',
      render: (text: string) => text || '-',
    },
    {
      title: 'Teléfono',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (text: string) => text || '-',
    },
    {
      title: 'Total Órdenes',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      align: 'center',
      sorter: (a: UserData, b: UserData) => a.totalOrders - b.totalOrders,
    },
    {
      title: 'Total Gastado',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      align: 'right',
      render: (amount: number) =>
        new Intl.NumberFormat('es-SV', {
          style: 'currency',
          currency: 'USD',
        }).format(amount),
      sorter: (a: UserData, b: UserData) => a.totalSpent - b.totalSpent,
    },
    {
      title: 'Fecha Registro',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) =>
        new Date(date).toLocaleDateString('es-SV', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
      sorter: (a: UserData, b: UserData) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 100,
      render: (_: unknown, record: UserData) => (
        <Button
          type="text"
          danger
          icon={<Trash2 size={16} />}
          onClick={() => handleDeleteClick(record.id)}
          size="small"
        >
          Eliminar
        </Button>
      ),
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            size="large"
            placeholder="Buscar por ID, nombre, email o documento..."
            prefix={<Search size={18} className="text-gray-400" />}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value)
              setPage(1)
            }}
            className="flex-1"
            allowClear
          />
          <Select
            size="large"
            placeholder="Filtrar por país"
            value={countryFilter || undefined}
            onChange={(value) => {
              setCountryFilter(value)
              setPage(1)
            }}
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={COUNTRIES}
            className="w-full sm:w-64"
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showTotal: (totalCount, range) =>
            `${range[0]}-${range[1]} de ${totalCount} usuarios`,
          onChange: (newPage, newPageSize) => {
            setPage(newPage)
            setPageSize(newPageSize)
          },
        }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title="Eliminar Usuario"
        open={deleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalVisible(false)
          setUserToDelete(null)
        }}
        confirmLoading={isDeleting}
        okText="Eliminar"
        okButtonProps={{ danger: true }}
        cancelText="Cancelar"
      >
        <p>
          ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se
          puede deshacer.
        </p>
      </Modal>
    </div>
  )
}
