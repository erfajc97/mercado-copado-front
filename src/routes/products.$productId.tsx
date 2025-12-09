import { createFileRoute } from '@tanstack/react-router'
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

export const Route = createFileRoute('/products/$productId')({
  component: ProductDetail,
})

function ProductDetail() {
  const { productId } = Route.useParams()
  const { data: product, isLoading } = useProductQuery(productId)
  const { data: relatedProducts } = useRelatedProductsQuery(productId, 4)
  const { token, roles } = useAuthStore()
  const { addItem } = useCartStore()
  const { mutateAsync: addToCart, isPending } = useAddToCartMutation()
  const { formatPrice, currency } = useCurrency()

  const isAuthenticated = !!token
  const isAdmin = roles === 'ADMIN'

  const handleAddToCart = async () => {
    if (!product) return

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
        // El sonner ya se muestra en la mutación, pero lo mostramos antes para feedback inmediato
      } catch (error) {
        console.error('Error adding to cart:', error)
        // El error ya se maneja en la mutación con sonner
      }
    }
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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ProductGallery images={product.images} />
        <div>
          <h1 className="text-2xl font-bold mb-3">{product.name}</h1>
          <div className="mb-3">
            {discount > 0 && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-500 line-through text-lg">
                  {isAdmin ? formatUSD(price) : formatPrice(price)}
                </span>
                {isAdmin && currency === 'ARS' && (
                  <span className="text-gray-500 line-through text-sm">
                    {formatPrice(price)}
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl font-bold text-green-600">
                {isAdmin ? formatUSD(finalPrice) : formatPrice(finalPrice)}
              </span>
              {isAdmin && currency === 'ARS' && (
                <span className="text-xl font-semibold text-green-700">
                  / {formatPrice(finalPrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                  -{discount}%
                </span>
              )}
            </div>
          </div>
          <p className="text-gray-700 mb-4 text-sm">{product.description}</p>
          <div className="mb-4 text-sm">
            <p className="mb-1">
              <strong>Categoría:</strong> {product.category.name}
            </p>
            <p>
              <strong>Subcategoría:</strong> {product.subcategory.name}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isPending}
            className="w-full bg-gradient-coffee text-white py-3 rounded-lg hover:opacity-90 font-semibold shadow-coffee hover:shadow-coffee-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Agregando...' : 'Agregar al Carrito'}
          </button>
        </div>
      </div>

      {relatedProducts && relatedProducts.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Productos Relacionados</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {relatedProducts.map((relatedProduct: Product) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
