import { Button } from '@heroui/react'
import { Edit, Trash2 } from 'lucide-react'
import type { Column } from '@/components/UI/table-nextui/CustomTableNextUi'
import type { UserData } from '../hooks/useUsersHook'
import CustomTableNextUi from '@/components/UI/table-nextui/CustomTableNextUi'
import CustomPagination from '@/components/UI/table-nextui/CustomPagination'

interface UsersTableProps {
  users: Array<UserData>
  isLoading: boolean
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onEditClick: (user: UserData) => void
  onDeleteClick: (userId: string) => void
  formatTotalSpent: (amount: number) => string
  formatDate: (date: string) => string
}

export const UsersTable = ({
  users,
  isLoading,
  page,
  totalPages,
  onPageChange,
  onEditClick,
  onDeleteClick,
  formatTotalSpent,
  formatDate,
}: UsersTableProps) => {
  const columns: Array<Column> = [
    {
      name: 'ID',
      uid: 'id',
      width: 100,
    },
    {
      name: 'Nombre',
      uid: 'name',
    },
    {
      name: 'Email',
      uid: 'email',
    },
    {
      name: 'Documento',
      uid: 'documentId',
    },
    {
      name: 'País',
      uid: 'country',
    },
    {
      name: 'Teléfono',
      uid: 'phoneNumber',
    },
    {
      name: 'Total Órdenes',
      uid: 'totalOrders',
      align: 'center',
      sortable: true,
    },
    {
      name: 'Total Gastado',
      uid: 'totalSpent',
      align: 'end',
      sortable: true,
    },
    {
      name: 'Fecha Registro',
      uid: 'createdAt',
      sortable: true,
    },
    {
      name: 'Acciones',
      uid: 'actions',
      width: 150,
    },
  ]

  const renderCell = (user: UserData, columnKey: React.Key) => {
    switch (columnKey) {
      case 'id':
        return (
          <span className="font-mono text-xs">
            {user.id.substring(0, 8)}...
          </span>
        )
      case 'name':
        return `${user.firstName} ${user.lastName || ''}`.trim()
      case 'email':
        return user.email
      case 'documentId':
        return user.documentId || '-'
      case 'country':
        return user.country || '-'
      case 'phoneNumber':
        return user.phoneNumber || '-'
      case 'totalOrders':
        return user.totalOrders
      case 'totalSpent':
        return formatTotalSpent(user.totalSpent)
      case 'createdAt':
        return formatDate(user.createdAt)
      case 'actions':
        return (
          <div className="flex gap-2">
            <Button
              variant="light"
              size="sm"
              onPress={() => onEditClick(user)}
              isIconOnly
            >
              <Edit size={16} />
            </Button>
            <Button
              color="danger"
              variant="light"
              size="sm"
              onPress={() => onDeleteClick(user.id)}
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

  return (
    <div>
      <CustomTableNextUi
        items={users}
        columns={columns}
        renderCell={renderCell}
        loading={isLoading}
        bottomContent={
          totalPages > 1 ? (
            <CustomPagination
              page={page}
              pages={totalPages}
              setPage={onPageChange}
              isLoading={isLoading}
            />
          ) : null
        }
      />
    </div>
  )
}
