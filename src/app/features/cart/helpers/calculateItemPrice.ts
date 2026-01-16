/**
 * Calcula el precio final de un item del carrito aplicando el descuento
 */
export const calculateItemPrice = (
  price: number | string,
  discount: number | string,
): number => {
  const numPrice = Number(price)
  const numDiscount = Number(discount)
  return numPrice * (1 - numDiscount / 100)
}
