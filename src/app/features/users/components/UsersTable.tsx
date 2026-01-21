import { Button, Tooltip } from '@heroui/react'
import { CheckCircle, Edit, Mail, Trash2 } from 'lucide-react'
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
  onResendVerification: (email: string) => void
  isResendingVerification: boolean
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
  onResendVerification,
  isResendingVerification,
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
      name: 'Verificado',
      uid: 'isVerified',
      align: 'center',
      width: 130,
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
      case 'isVerified':
        if (user.isVerified) {
          return (
            <Tooltip content="Email verificado">
              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
            </Tooltip>
          )
        }
        return (
          <Button
            color="warning"
            variant="flat"
            size="sm"
            startContent={<Mail className="h-3 w-3" />}
            onPress={() => onResendVerification(user.email)}
            isLoading={isResendingVerification}
            disabled={isResendingVerification}
          >
            Reenviar
          </Button>
        )
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

  // Asegurar que users siempre sea un array
  const safeUsers = Array.isArray(users) ? users : []

  return (
    <div>
      <CustomTableNextUi
        items={safeUsers}
        columns={columns}
        renderCell={renderCell}
        loading={isLoading}
        bottomContent={
          <CustomPagination
            page={page}
            pages={totalPages}
            setPage={onPageChange}
            isLoading={isLoading}
          />
        }
      />
    </div>
  )
}
