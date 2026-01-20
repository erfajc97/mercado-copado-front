import { Link } from '@tanstack/react-router'
import { Button } from '@heroui/react'

export function EmptyCart() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold mb-4 text-coffee-darker">
        Carrito Vacío
      </h1>
      <p className="text-gray-600 mb-6">
        No tienes productos en tu carrito
      </p>
      <Button
        as={Link}
        to="/"
        color="primary"
        size="lg"
        className="bg-gradient-coffee border-none hover:opacity-90 shadow-coffee hover:shadow-coffee-md"
      >
        <p className="text-white">Seguir Comprando</p>
      </Button>
    </div>
  )
}
