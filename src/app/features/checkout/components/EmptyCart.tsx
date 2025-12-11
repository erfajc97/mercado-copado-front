import { Link } from '@tanstack/react-router'
import { Button } from 'antd'

export const EmptyCart = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Carrito Vacío</h1>
      <p className="text-gray-600 mb-6">No tienes productos en tu carrito</p>
      <Link to="/">
        <Button
          type="primary"
          size="large"
          className="bg-gradient-coffee border-none hover:opacity-90 shadow-coffee hover:shadow-coffee-md"
        >
          Continuar Comprando
        </Button>
      </Link>
    </div>
  )
}
