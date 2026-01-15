import { createFileRoute } from '@tanstack/react-router'
import { ProductDetail } from '@/app/features/products/ProductDetail'

export const Route = createFileRoute('/products/$productId')({
  component: ProductDetailPage,
})

function ProductDetailPage() {
  const { productId } = Route.useParams()
  return <ProductDetail productId={productId} />
}
