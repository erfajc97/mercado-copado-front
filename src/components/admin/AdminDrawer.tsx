import { useCallback, useMemo, useState } from 'react'
import { Drawer, Tabs } from 'antd'
import { useNavigate } from '@tanstack/react-router'
import {
  BarChart3,
  FolderOpen,
  Package,
  ShoppingBag,
  Tag,
  Users,
} from 'lucide-react'
import DashboardStats from './tabs/DashboardStats'
import CreateProduct from './tabs/CreateProduct'
import CreateCategory from './tabs/CreateCategory'
import AdminOrders from './tabs/AdminOrders'
import AdminUsers from './tabs/AdminUsers'

interface AdminDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminDrawer({ isOpen, onClose }: AdminDrawerProps) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const navigate = useNavigate()

  const handleTabChange = useCallback(
    (key: string) => {
      if (key === 'Panel') {
        // Usar setTimeout para evitar bloqueo síncrono
        setTimeout(() => {
          navigate({ to: '/dashboard' })
          onClose()
        }, 0)
      } else {
        setActiveTab(key)
      }
    },
    [navigate, onClose],
  )

  const tabItems = useMemo(
    () => [
      {
        key: 'dashboard',
        label: (
          <span className="ml-5 flex items-center gap-2">
            <BarChart3 size={18} />
            Dashboard
          </span>
        ),
        children: activeTab === 'dashboard' ? <DashboardStats /> : null,
      },
      {
        key: 'orders',
        label: (
          <span className="flex items-center gap-2">
            <ShoppingBag size={18} />
            Órdenes
          </span>
        ),
        children: activeTab === 'orders' ? <AdminOrders /> : null,
      },
      {
        key: 'users',
        label: (
          <span className="flex items-center gap-2">
            <Users size={18} />
            Usuarios
          </span>
        ),
        children: activeTab === 'users' ? <AdminUsers /> : null,
      },
      {
        key: 'products',
        label: (
          <span className="flex items-center gap-2">
            <Package size={18} />
            Crear Producto
          </span>
        ),
        children: activeTab === 'products' ? <CreateProduct /> : null,
      },
      {
        key: 'categories',
        label: (
          <span className="flex items-center gap-2">
            <Tag size={18} />
            Crear Categoría
          </span>
        ),
        children: activeTab === 'categories' ? <CreateCategory /> : null,
      },
      {
        key: 'Panel',
        label: (
          <span className="flex items-center gap-2">
            <FolderOpen size={18} />
            Panel
          </span>
        ),
        children: (
          <div className="p-6 text-center">
            <p className="text-gray-600 mb-4">
              Redirigiendo al panel administrativo...
            </p>
          </div>
        ),
      },
    ],
    [activeTab],
  )

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-coffee-darker">
            Panel de Administración
          </span>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={isOpen}
      size="large"
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabItems}
        className="px-6"
      />
    </Drawer>
  )
}
