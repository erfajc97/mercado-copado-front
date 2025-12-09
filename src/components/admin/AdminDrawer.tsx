import { useState } from 'react'
import { Drawer, Tabs } from 'antd'
import {
  BarChart3,
  FolderOpen,
  List,
  Package,
  ShoppingBag,
  Tag,
  Users,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
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
      key: 'users',
      label: (
        <span className="flex items-center gap-2">
          <Users size={18} />
          Usuarios
        </span>
      ),
      children: <AdminUsers />,
    },
    {
      key: 'products-list',
      label: (
        <Link
          to="/dashboard/products"
          className="flex items-center gap-2 text-inherit hover:text-blue-600"
          onClick={onClose}
        >
          <List size={18} />
          Lista de Productos
        </Link>
      ),
      children: (
        <div className="p-6 text-center">
          <p className="text-gray-600 mb-4">
            Redirigiendo a la lista de productos...
          </p>
          <Link
            to="/dashboard/products"
            className="text-blue-600 hover:text-blue-800 underline"
            onClick={onClose}
          >
            Ir a Lista de Productos
          </Link>
        </div>
      ),
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
      key: 'categories-list',
      label: (
        <Link
          to="/dashboard/categories"
          className="flex items-center gap-2 text-inherit hover:text-green-600"
          onClick={onClose}
        >
          <FolderOpen size={18} />
          Lista de Categorías
        </Link>
      ),
      children: (
        <div className="p-6 text-center">
          <p className="text-gray-600 mb-4">
            Redirigiendo a la lista de categorías...
          </p>
          <Link
            to="/dashboard/categories"
            className="text-green-600 hover:text-green-800 underline"
            onClick={onClose}
          >
            Ir a Lista de Categorías
          </Link>
        </div>
      ),
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
