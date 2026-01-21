import axiosInstance from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'

interface CryptoDepositData {
  addressId: string
  clientTransactionId: string
  depositImage: File
  orderId?: string // Para retry de pagos en órdenes existentes
}

export const cryptoDepositService = async (data: CryptoDepositData) => {
  const formData = new FormData()
  formData.append('addressId', data.addressId)
  formData.append('clientTransactionId', data.clientTransactionId)
  formData.append('depositImage', data.depositImage)
  if (data.orderId) {
    formData.append('orderId', data.orderId)
  }

  const response = await axiosInstance.post(
    API_ENDPOINTS.CRYPTO_DEPOSIT,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
  return response.data.content
}
