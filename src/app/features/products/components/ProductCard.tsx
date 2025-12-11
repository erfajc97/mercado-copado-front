import { Link, useNavigate } from '@tanstack/react-router'
import { ShoppingCart } from 'lucide-react'
import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Product } from '../types'
import { useAuthStore } from '@/app/store/auth/authStore'
import { useCartStore } from '@/app/store/cart/cartStore'
import { useAddToCartMutation } from '@/app/features/cart/mutations/useCartMutations'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'
import { useCurrency } from '@/app/hooks/useCurrency'
import { formatUSD } from '@/app/services/currencyService'
import { userInfoService } from '@/app/features/auth/login/services/userInfoService'

interface ProductCardProps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { token, roles } = useAuthStore()
  const { addItem } = useCartStore()
  const { mutateAsync: addToCart, isPending } = useAddToCartMutation()
  const { formatPrice, currency } = useCurrency()
  const navigate = useNavigate()

  const isAuthenticated = !!token
  const isAdmin = roles === 'ADMIN'
  const price = Number(product.price)
  const discount = Number(product.discount)
  const finalPrice = price * (1 - discount / 100)
  const hasMultipleImages = product.images.length > 1
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Obtener información del usuario para comparar país
  const { data: userInfo } = useQuery({
    queryKey: ['userInfo'],
    queryFn: userInfoService,
    enabled: isAuthenticated,
  })

  // País del usuario: si está autenticado usa su país, sino usa Argentina por defecto
  const userCountry = isAuthenticated
    ? userInfo?.country || 'Argentina'
    : 'Argentina'
  const isInternational = product.country && product.country !== userCountry

  // Carrusel automático de imágenes
  useEffect(() => {
    if (!hasMultipleImages) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }, 3000) // Cambiar imagen cada 3 segundos

    return () => clearInterval(interval)
  }, [hasMultipleImages, product.images.length])

  // Obtener la imagen actual de forma segura
  const currentImage =
    product.images.length > 0
      ? product.images[currentImageIndex]?.url || product.images[0]?.url
      : null

  const addProductToCart = async () => {
    // Siempre agregar al carrito local (localStorage)
    addItem({
      id: '', // Se generará en el servidor si está autenticado
      productId: product.id,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        discount: product.discount,
        images: product.images,
      },
      quantity: 1,
    })

    // Mostrar notificación de éxito inmediatamente
    sonnerResponse('Producto agregado al carrito', 'success')

    // Si está autenticado, también sincronizar con el backend
    if (isAuthenticated) {
      try {
        await addToCart({
          productId: product.id,
          quantity: 1,
        })
      } catch (error) {
        console.error('Error adding to cart:', error)
      }
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await addProductToCart()
  }

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await addProductToCart()
    navigate({ to: '/checkout' })
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-coffee overflow-hidden hover:shadow-coffee-lg transition-all duration-300 transform hover:-translate-y-1 group">
        <Link
          to="/products/$productId"
          params={{ productId: product.id }}
          className="block"
        >
          <div className="aspect-square bg-gray-100 overflow-hidden relative">
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-coffee-light">
                <span>Sin imagen</span>
              </div>
            )}
            {/* Contenedor de etiquetas */}
            <div className="absolute inset-0 pointer-events-none z-30">
              {/* Etiqueta de país - siempre en top-left */}
              {product.country && (
                <div className="absolute top-2 left-2 bg-blue-50/90 text-blue-700 text-xs font-medium px-2 py-1 rounded-full border border-blue-200/80 backdrop-blur-sm pointer-events-auto">
                  {product.country}
                </div>
              )}
              {/* Etiqueta Internacional - top-right si existe */}
              {isInternational && (
                <div className="absolute top-2 right-2 bg-purple-50/90 text-purple-700 text-xs font-medium px-2 py-1 rounded-full border border-purple-200/80 backdrop-blur-sm pointer-events-auto">
                  Internacional
                </div>
              )}
              {/* Etiqueta de descuento - top-right si no hay internacional, o debajo si hay */}
              {discount > 0 && (
                <div
                  className={`absolute ${isInternational ? 'top-11' : 'top-2'} right-2 bg-red-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-lg border border-red-600 pointer-events-auto`}
                >
                  -{discount}%
                </div>
              )}
            </div>
            {/* Indicadores del carrusel */}
            {hasMultipleImages && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setCurrentImageIndex(index)
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'bg-white w-6'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Ver imagen ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-coffee-darker group-hover:text-coffee-medium transition-colors">
              {product.name}
            </h3>
            <div className="flex flex-col gap-1 mb-4 min-h-[60px]">
              {discount > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 line-through text-sm">
                    {isAdmin ? formatUSD(price) : formatPrice(price)}
                  </span>
                  {isAdmin && currency === 'ARS' && (
                    <span className="text-gray-400 line-through text-xs">
                      {formatPrice(price)}
                    </span>
                  )}
                </div>
              ) : (
                <div className="h-5"></div>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-2xl font-bold text-coffee-dark">
                  {isAdmin ? formatUSD(finalPrice) : formatPrice(finalPrice)}
                </span>
                {isAdmin && currency === 'ARS' && (
                  <span className="text-lg font-semibold text-coffee-medium">
                    / {formatPrice(finalPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>

        {/* Botones de acción */}
        <div className="px-4 pb-4 flex gap-2">
          <Button
            type="default"
            icon={<ShoppingCart size={18} />}
            onClick={handleAddToCart}
            loading={isPending && isAuthenticated}
            className="flex-1 border-coffee-medium text-coffee-dark hover:bg-coffee-light rounded-lg h-10"
            title="Agregar al Carrito"
          />
          <Button
            type="primary"
            onClick={handleBuyNow}
            loading={isPending && isAuthenticated}
            className="flex-1 bg-gradient-coffee border-none hover:opacity-90 rounded-lg h-10 font-semibold"
          >
            Comprar
          </Button>
        </div>
      </div>
    </>
  )
}
