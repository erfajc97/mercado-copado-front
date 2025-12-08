import { Link } from '@tanstack/react-router'
import { ShoppingCart } from 'lucide-react'
import { Button } from 'antd'
import type { Product } from '../types'
import { useAuthStore } from '@/app/store/auth/authStore'
import { useCartStore } from '@/app/store/cart/cartStore'
import { useAddToCartMutation } from '@/app/features/cart/mutations/useCartMutations'

interface ProductCardProps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { token } = useAuthStore()
  const { addItem } = useCartStore()
  const { mutateAsync: addToCart, isPending } = useAddToCartMutation()

  const isAuthenticated = !!token
  const price = Number(product.price)
  const discount = Number(product.discount)
  const finalPrice = price * (1 - discount / 100)
  const mainImage = product.images[0].url

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

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

  return (
    <>
      <div className="bg-white rounded-lg shadow-coffee overflow-hidden hover:shadow-coffee-lg transition-all duration-300 transform hover:-translate-y-1 group">
        <Link
          to="/products/$productId"
          params={{ productId: product.id }}
          className="block"
        >
          <div className="aspect-square bg-gray-100 overflow-hidden relative">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-coffee-light">
                <span>Sin imagen</span>
              </div>
            )}
            {discount > 0 && (
              <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-coffee">
                -{discount}%
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-coffee-darker group-hover:text-coffee-medium transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mb-4">
              {discount > 0 && (
                <span className="text-gray-400 line-through text-sm">
                  ${price.toFixed(2)}
                </span>
              )}
              <span className="text-2xl font-bold text-coffee-dark">
                ${finalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </Link>

        {/* Botón de acción */}
        <div className="px-4 pb-4">
          <Button
            type="primary"
            icon={<ShoppingCart size={18} />}
            onClick={handleAddToCart}
            loading={isPending && isAuthenticated}
            block
            className="bg-gradient-coffee border-none hover:opacity-90 rounded-lg h-10 font-semibold"
          >
            Agregar al Carrito
          </Button>
        </div>
      </div>
    </>
  )
}
