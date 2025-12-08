import { useState } from 'react'
import { Drawer, Tabs } from 'antd'
import { BarChart3, Package, ShoppingBag, Tag } from 'lucide-react'
import DashboardStats from './tabs/DashboardStats'
import CreateProduct from './tabs/CreateProduct'
import CreateCategory from './tabs/CreateCategory'
import AdminOrders from './tabs/AdminOrders'

interface AdminDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminDrawer({ isOpen, onClose }: AdminDrawerProps) {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabItems = [
    {
      key: 'dashboard',
      label: (
        <span className="ml-5 flex items-center gap-2">
          <BarChart3 size={18} />
          Dashboard
        </span>
      ),
      children: <DashboardStats />,
    },
    {
      key: 'orders',
      label: (
        <span className="flex items-center gap-2">
          <ShoppingBag size={18} />
          Órdenes
        </span>
      ),
      children: <AdminOrders />,
    },
    {
      key: 'products',
      label: (
        <span className="flex items-center gap-2">
          <Package size={18} />
          Crear Producto
        </span>
      ),
      children: <CreateProduct />,
    },
    {
      key: 'categories',
      label: (
        <span className="flex items-center gap-2">
          <Tag size={18} />
          Crear Categoría
        </span>
      ),
      children: <CreateCategory />,
    },
  ]

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
        onChange={setActiveTab}
        items={tabItems}
        className="px-6"
      />
    </Drawer>
  )
}
