import { createFileRoute } from '@tanstack/react-router'
import type { Product } from '@/app/features/products/types'
import { useProductQuery } from '@/app/features/products/queries/useProductQuery'
import { useRelatedProductsQuery } from '@/app/features/products/queries/useRelatedProductsQuery'
import { ProductGallery } from '@/app/features/products/components/ProductGallery'
import { ProductCard } from '@/app/features/products/components/ProductCard'
import { useAuthStore } from '@/app/store/auth/authStore'
import { useCartStore } from '@/app/store/cart/cartStore'
import { useAddToCartMutation } from '@/app/features/cart/mutations/useCartMutations'

export const Route = createFileRoute('/products/$productId')({
  component: ProductDetail,
})

function ProductDetail() {
  const { productId } = Route.useParams()
  const { data: product, isLoading } = useProductQuery(productId)
  const { data: relatedProducts } = useRelatedProductsQuery(productId, 4)
  const { token } = useAuthStore()
  const { addItem } = useCartStore()
  const { mutateAsync: addToCart, isPending } = useAddToCartMutation()

  const isAuthenticated = !!token

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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <ProductGallery images={product.images} />
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="mb-4">
            {discount > 0 && (
              <span className="text-gray-500 line-through text-xl mr-2">
                ${price.toFixed(2)}
              </span>
            )}
            <span className="text-3xl font-bold text-green-600">
              ${finalPrice.toFixed(2)}
            </span>
            {discount > 0 && (
              <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded">
                -{discount}%
              </span>
            )}
          </div>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <div className="mb-4">
            <p>
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
          <h2 className="text-2xl font-bold mb-6">Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct: Product) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
