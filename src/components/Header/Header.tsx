import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Dropdown } from 'antd'
import { Button, useDisclosure } from '@heroui/react'
import {
  DollarSign,
  LayoutDashboard,
  LogIn,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  UserPlus,
} from 'lucide-react'
import UserAvatar from '../UserAvatar'
import { useHeaderHook } from './hooks/useHeaderHook'
import CartDrawer from '@/app/features/cart/components/CartDrawer'
import AuthModal from '@/app/features/auth/components/AuthModal'

export default function Header() {
  const {
    isAuthenticated,
    isAdmin,
    userInfo,
    blueRate,
    itemCount,
    handleLogout,
  } = useHeaderHook()

  const {
    isOpen: isAuthModalOpen,
    onOpen: onOpenAuthModal,
    onOpenChange: onAuthModalOpenChange,
  } = useDisclosure()
  const {
    isOpen: isCartOpen,
    onOpen: onOpenCart,
    onOpenChange: onCartOpenChange,
  } = useDisclosure()
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  const handleLoginClick = () => {
    setAuthMode('login')
    onOpenAuthModal()
  }

  const handleRegisterClick = () => {
    setAuthMode('register')
    onOpenAuthModal()
  }

  const userMenuItems = [
    {
      key: 'orders',
      label: (
        <Link to="/orders" className="flex items-center gap-2">
          <Package size={16} />
          Mis Pedidos
        </Link>
      ),
    },
    {
      key: 'addresses',
      label: (
        <Link to="/profile" className="flex items-center gap-2">
          <Settings size={16} />
          Configuraciones
        </Link>
      ),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: (
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full text-left text-red-600"
        >
          <LogOut size={16} />
          Cerrar Sesión
        </button>
      ),
    },
  ]

  return (
    <>
      <header className="bg-gradient-coffee shadow-coffee-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center shadow-coffee overflow-hidden">
                  <img
                    src="/box.png"
                    alt="Mercado Copado"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <span className="text-white font-bold text-lg md:text-xl hidden sm:block">
                  Mercado Copado
                </span>
              </div>
            </Link>

            {/* Right side - Auth buttons or Cart */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Dólar Blue Display - Solo para admins */}
              {isAdmin && blueRate && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg text-white text-sm font-semibold">
                  <DollarSign size={16} />
                  <span>Dólar Blue: ${blueRate.toLocaleString('es-AR')}</span>
                </div>
              )}
              {!isAuthenticated ? (
                <>
                  <Button
                    variant="flat"
                    onPress={handleLoginClick}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 shadow-coffee hover:shadow-coffee-md"
                  >
                    <LogIn size={18} />
                    <span className="hidden sm:inline">Iniciar Sesión</span>
                  </Button>
                  <Button
                    color="primary"
                    variant="solid"
                    onPress={handleRegisterClick}
                    className="flex items-center gap-2 px-4 py-2 font-semibold"
                  >
                    <UserPlus size={18} />
                    <span className="hidden sm:inline">Registrarse</span>
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <Link to="/dashboard/dashboard">
                      <Button
                        variant="light"
                        className="flex items-center gap-2 text-white hover:bg-white/20 h-10 px-3"
                      >
                        <LayoutDashboard size={18} className="text-white" />
                        <span className="hidden md:inline text-white">
                          Dashboard
                        </span>
                      </Button>
                    </Link>
                  )}
                  <Dropdown
                    menu={{ items: userMenuItems }}
                    placement="bottomRight"
                    trigger={['click']}
                  >
                    {/* --- Custom primary/pretty background to username+avatar button --- */}
                    <Button className="flex items-center gap-2 h-10 px-3 bg-linear-to-r from-coffee-dark to-coffee-medium hover:opacity-90 text-white rounded-lg transition-all duration-200 shadow-coffee font-semibold border-none focus:outline-none">
                      <UserAvatar
                        firstName={userInfo?.firstName}
                        lastName={userInfo?.lastName}
                        size={32}
                      />
                      <span className="hidden md:inline text-white font-semibold">
                        {userInfo?.firstName || 'Usuario'}
                      </span>
                    </Button>
                  </Dropdown>
                </div>
              )}

              {/* Cart Icon */}
              <Button
                onPress={onOpenCart}
                className="relative p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 shadow-coffee hover:shadow-coffee-md overflow-visible"
                aria-label="Abrir carrito"
                isIconOnly
              >
                <ShoppingCart size={24} className="text-white" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center leading-none">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={onAuthModalOpenChange}
        onOpenChange={(open) => {
          if (!open) {
            onAuthModalOpenChange()
          }
        }}
        initialMode={authMode}
      />
      <CartDrawer isOpen={isCartOpen} onClose={() => onCartOpenChange()} />
    </>
  )
}
