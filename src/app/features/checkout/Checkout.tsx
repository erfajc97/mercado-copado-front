import { useNavigate } from '@tanstack/react-router'
import { useCheckoutHook } from './hooks/useCheckoutHook'
import { CheckoutSummary } from './components/CheckoutSummary'
import { CheckoutForm } from './components/CheckoutForm'
import { EmptyCart } from '@/app/features/cart/components/EmptyCart'

export const Checkout = () => {
  const navigate = useNavigate()
  const checkout = useCheckoutHook()

  if (!checkout.cartItems || checkout.cartItems.length === 0) {
    return <EmptyCart />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-coffee-darker">
        Finalizar Compra
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm checkout={checkout} />
        </div>
        <div className="lg:col-span-1">
          <CheckoutSummary
            checkout={checkout}
            onSuccess={() => navigate({ to: '/orders' })}
          />
        </div>
      </div>
    </div>
  )
}
