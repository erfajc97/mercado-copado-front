import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button, Dropdown } from 'antd'
import {
  DollarSign,
  FolderOpen,
  LayoutDashboard,
  LogIn,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  UserPlus,
} from 'lucide-react'
import AuthModal from './auth/AuthModal'
import CartDrawer from './CartDrawer'
import AdminDrawer from './admin/AdminDrawer'
import UserAvatar from './UserAvatar'
import { useCartStore } from '@/app/store/cart/cartStore'
import { useAuthStore } from '@/app/store/auth/authStore'
import { useLogoutMutation } from '@/app/features/auth/login/mutations/useLogoutMutation'
import { userInfoService } from '@/app/features/auth/login/services/userInfoService'
import { useCartQuery } from '@/app/features/cart/queries/useCartQuery'
import { getDolarBlueRate } from '@/app/services/currencyService'

export default function Header() {
  const { token, roles } = useAuthStore()
  const { items: cartItems } = useCartStore()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const { mutateAsync: logout } = useLogoutMutation()

  const isAuthenticated = !!token
  const isAdmin = roles === 'ADMIN'

  // Obtener información del usuario si está autenticado
  const { data: userInfo } = useQuery({
    queryKey: ['userInfo'],
    queryFn: userInfoService,
    enabled: isAuthenticated,
  })

  // Obtener carrito de BD si está autenticado
  const { data: dbCartItems } = useCartQuery({
    enabled: isAuthenticated,
  })

  // Obtener tasa de dólar blue - Solo para admins
  const { data: blueRate } = useQuery({
    queryKey: ['dolarBlueRate'],
    queryFn: getDolarBlueRate,
    enabled: isAdmin, // Solo obtener si es admin
    staleTime: 60 * 60 * 1000, // Cache por 1 hora
    refetchInterval: 60 * 60 * 1000, // Refrescar cada hora
  })

  // Estado para el conteo de items - inicializar en 0 para evitar errores de hidratación
  const [itemCount, setItemCount] = useState(0)

  // Calcular conteo de items: usar BD si está autenticado, sino localStorage
  // Escuchar cambios en el carrito local y en el carrito de BD
  useEffect(() => {
    if (isAuthenticated && dbCartItems) {
      const count = dbCartItems.reduce(
        (sum: number, item: { quantity: number }) => sum + item.quantity,
        0,
      )
      setItemCount(count)
    } else {
      // Calcular directamente desde cartItems para que se actualice automáticamente
      const count = cartItems.reduce(
        (sum: number, item: { quantity: number }) => sum + item.quantity,
        0,
      )
      setItemCount(count)
    }
  }, [isAuthenticated, dbCartItems, cartItems])

  const handleLoginClick = () => {
    setAuthMode('login')
    setIsAuthModalOpen(true)
  }

  const handleRegisterClick = () => {
    setAuthMode('register')
    setIsAuthModalOpen(true)
  }

  const handleLogout = async () => {
    await logout()
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
                  <button
                    onClick={handleLoginClick}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 shadow-coffee hover:shadow-coffee-md"
                  >
                    <LogIn size={18} />
                    <span className="hidden sm:inline">Iniciar Sesión</span>
                  </button>
                  <button
                    onClick={handleRegisterClick}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-coffee-dark hover:bg-coffee-light rounded-lg transition-all duration-200 shadow-coffee hover:shadow-coffee-md font-semibold"
                  >
                    <UserPlus size={18} />
                    <span className="hidden sm:inline">Registrarse</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <>
                      <Button
                        type="text"
                        onClick={() => setIsAdminDrawerOpen(true)}
                        className="flex items-center gap-2 text-white hover:bg-white/20 h-10 px-3"
                      >
                        <LayoutDashboard size={18} className="text-white" />
                        <span className="hidden md:inline text-white">
                          Dashboard
                        </span>
                      </Button>
                      <Link to="/dashboard">
                        <Button
                          type="text"
                          className="flex items-center gap-2 text-white hover:bg-white/20 h-10 px-3"
                        >
                          <FolderOpen size={18} className="text-white" />
                          <span className="hidden md:inline text-white">
                            Panel
                          </span>
                        </Button>
                      </Link>
                    </>
                  )}
                  <Dropdown
                    menu={{ items: userMenuItems }}
                    placement="bottomRight"
                    trigger={['click']}
                  >
                    <Button
                      type="text"
                      className="flex items-center gap-2 text-white hover:bg-white/20 h-10 px-3"
                    >
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
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 shadow-coffee hover:shadow-coffee-md"
                aria-label="Abrir carrito"
              >
                <ShoppingCart size={24} className="text-white" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {isAdmin && (
        <AdminDrawer
          isOpen={isAdminDrawerOpen}
          onClose={() => setIsAdminDrawerOpen(false)}
        />
      )}
    </>
  )
}
