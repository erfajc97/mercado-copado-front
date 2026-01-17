import { Link, useNavigate } from '@tanstack/react-router'
import {
  ChevronLeft,
  ChevronRight,
  Package,
  RotateCcw,
  ShoppingCart,
  Star,
  Truck,
} from 'lucide-react'
import { Button } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import type { Product } from '@/app/features/products/types'
import { useProductQuery } from '@/app/features/products/queries/useProductQuery'
import { useRelatedProductsQuery } from '@/app/features/products/queries/useRelatedProductsQuery'
import { ProductGallery } from '@/app/features/products/components/ProductGallery'
import { ProductCard } from '@/app/features/products/components/ProductCard'
import { useAuthStore } from '@/app/store/auth/authStore'
import { useCartStore } from '@/app/store/cart/cartStore'
import { useAddToCartMutation } from '@/app/features/cart/mutations/useCartMutations'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'
import { useCurrency } from '@/app/hooks/useCurrency'
import { formatUSD } from '@/app/services/currencyService'
import { userInfoService } from '@/app/features/auth/login/services/userInfoService'

interface ProductDetailProps {
  productId: string
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const { data: product, isLoading } = useProductQuery(productId)
  const { data: relatedProducts } = useRelatedProductsQuery(productId, 8)
  const { token, roles } = useAuthStore()
  const { addItem } = useCartStore()
  const { mutateAsync: addToCart, isPending } = useAddToCartMutation()
  const { formatPrice, currency } = useCurrency()
  const navigate = useNavigate()
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const relatedProductsRef = useRef<HTMLDivElement>(null)

  const isAuthenticated = !!token
  const isAdmin = roles === 'ADMIN'

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
  const isInternational = product?.country && product.country !== userCountry

  const addProductToCart = async () => {
    if (!product) return

    // Si está autenticado, solo agregar al backend (no al carrito local)
    // La mutation useAddToCartMutation ya maneja sonnerResponse en onSuccess y onError
    if (isAuthenticated) {
      await addToCart({
        productId: product.id,
        quantity: 1,
      })
    } else {
      // Si no está autenticado, agregar al carrito local (localStorage)
      // Caso especial: no pasa por mutation, así que se mantiene sonnerResponse
      addItem({
        id: '', // Se generará en el servidor si se autentica después
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
      // Caso especial: carrito local sin mutation, mantener sonnerResponse
      sonnerResponse('Producto agregado al carrito', 'success')
    }
  }

  const handleAddToCart = async () => {
    await addProductToCart()
  }

  const handleBuyNow = async () => {
    await addProductToCart()
    navigate({ to: '/checkout' })
  }

  if (isLoading) {
    return <div className="p-8 text-center">Cargando...</div>
  }

  if (!product) {
    return <div className="p-8 text-center">Producto no encontrado</div>
  }

  const price = Number(product.price)
  const discount = Number(product.discount)
  const finalPrice = price * (1 - discount / 100)
  const isProductInactive = !product.isActive

  const scrollRelatedProducts = (direction: 'left' | 'right') => {
    if (relatedProductsRef.current) {
      const scrollAmount = 400
      relatedProductsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-coffee-medium transition-colors">
              Inicio
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <Link
              to="/"
              search={{ category: product.category.id }}
              className="hover:text-coffee-medium transition-colors"
            >
              {product.category.name}
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <Link
              to="/"
              search={{
                category: product.category.id,
                subcategory: product.subcategory.id,
              }}
              className="text-gray-900 font-medium hover:text-coffee-medium transition-colors"
            >
              {product.subcategory.name}
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-400 truncate max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isProductInactive && (
          <div className="mb-6 bg-linear-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-5 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-800 text-xl mb-2">
                  Producto no disponible
                </h3>
                <p className="text-red-700 text-base mb-2">
                  Este producto está actualmente <strong>desactivado</strong> y
                  no está disponible para la venta.
                </p>
                <p className="text-red-600 text-sm">
                  Por favor, consulta otros productos similares o vuelve más
                  tarde.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Layout principal: Galería + Info en 2 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Galería - 50% */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <ProductGallery images={product.images} />
            </div>
          </div>

          {/* Información del producto - 50% */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Estado y badges sutiles */}
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                  Nuevo
                </span>
                {product.country && (
                  <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded border border-blue-200">
                    {product.country}
                  </span>
                )}
                {isInternational && (
                  <span className="bg-purple-50 text-purple-600 text-xs font-medium px-2 py-1 rounded border border-purple-200">
                    Internacional
                  </span>
                )}
              </div>

              {/* Título y Descripción en la misma fila */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className="fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">(25)</span>
                  </div>
                </div>
                {/* Descripción al lado del nombre */}
                <div className="md:border-l md:border-gray-200 md:pl-4">
                  <h2 className="text-sm font-bold mb-2 text-coffee-darker">
                    Descripción
                  </h2>
                  <div
                    className={`text-xs text-gray-700 ${
                      isDescriptionExpanded ? '' : 'line-clamp-3'
                    }`}
                  >
                    <p>{product.description}</p>
                  </div>
                  <button
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                    className="mt-1 text-coffee-medium hover:text-coffee-dark font-semibold text-xs"
                  >
                    {isDescriptionExpanded ? 'Ver menos' : 'Ver más'}
                  </button>
                </div>
              </div>

              {/* Precio */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                {discount > 0 && (
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-gray-500 line-through text-lg">
                      {isAdmin ? formatUSD(price) : formatPrice(price)}
                    </span>
                    <span className="bg-red-100 text-red-700 text-sm font-bold px-2 py-1 rounded">
                      -{discount}% OFF
                    </span>
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-coffee-darker">
                    {isAdmin ? formatUSD(finalPrice) : formatPrice(finalPrice)}
                  </span>
                  {isAdmin && currency === 'ARS' && (
                    <span className="text-xl font-semibold text-coffee-medium">
                      / {formatPrice(finalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  en 6 cuotas sin interés de{' '}
                  <span className="font-semibold">
                    {isAdmin
                      ? formatUSD(finalPrice / 6)
                      : formatPrice(finalPrice / 6)}
                  </span>
                </p>
              </div>

              {/* Información destacada - más compacta */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                  <Truck className="text-green-600 shrink-0" size={16} />
                  <div>
                    <p className="font-semibold text-green-800 text-xs">
                      Envío gratis
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <RotateCcw className="text-blue-600 shrink-0" size={16} />
                  <div>
                    <p className="font-semibold text-blue-800 text-xs">
                      Devolución gratis
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-coffee-light/20 rounded-lg border border-coffee-medium/30">
                  <Package className="text-coffee-medium shrink-0" size={16} />
                  <div>
                    <p className="font-semibold text-coffee-darker text-xs">
                      Stock disponible
                    </p>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-2 mb-4">
                <Button
                  color="primary"
                  onPress={handleBuyNow}
                  isDisabled={isPending || isProductInactive}
                  isLoading={isPending && isAuthenticated}
                  size="lg"
                  className="w-full bg-gradient-coffee border-none hover:opacity-90 h-12 text-base font-bold shadow-coffee hover:shadow-coffee-md text-white"
                >
                  {isProductInactive ? 'No disponible' : 'Comprar ahora'}
                </Button>
                <Button
                  variant="bordered"
                  startContent={<ShoppingCart size={18} />}
                  onPress={handleAddToCart}
                  isDisabled={isPending || isProductInactive}
                  isLoading={isPending && isAuthenticated}
                  size="lg"
                  className="w-full border-2 border-coffee-medium text-coffee-dark hover:bg-coffee-light h-11 text-sm font-semibold"
                >
                  {isProductInactive ? 'No disponible' : 'Agregar al carrito'}
                </Button>
              </div>

              {/* Categorías */}
              <div className="text-sm text-gray-600 border-t border-gray-200 pt-4">
                <p className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-gray-700 text-base">
                    Categoría:
                  </span>
                  <Link
                    to="/"
                    search={{ category: product.category.id }}
                    className="text-coffee-medium hover:text-coffee-dark transition-colors text-base"
                  >
                    {product.category.name}
                  </Link>
                  <span className="text-gray-400">•</span>
                  <span className="font-semibold text-gray-700 text-base">
                    Subcategoría:
                  </span>
                  <Link
                    to="/"
                    search={{
                      category: product.category.id,
                      subcategory: product.subcategory.id,
                    }}
                    className="text-coffee-medium hover:text-coffee-dark transition-colors text-base"
                  >
                    {product.subcategory.name}
                  </Link>
                </p>
              </div>
            </div>

            {/* Productos relacionados con carrusel - debajo de la info del producto */}
            {relatedProducts && relatedProducts.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-coffee-darker">
                    Productos relacionados
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => scrollRelatedProducts('left')}
                      className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 shadow-sm transition-colors"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft size={18} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => scrollRelatedProducts('right')}
                      className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 shadow-sm transition-colors"
                      aria-label="Scroll right"
                    >
                      <ChevronRight size={18} className="text-gray-600" />
                    </button>
                  </div>
                </div>
                <div
                  ref={relatedProductsRef}
                  className="flex gap-4 overflow-x-auto scroll-smooth pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                  {relatedProducts.map((relatedProduct: Product) => (
                    <div key={relatedProduct.id} className="shrink-0 w-64">
                      <ProductCard product={relatedProduct} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
