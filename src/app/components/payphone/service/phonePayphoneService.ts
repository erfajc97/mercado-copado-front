import axiosInstance from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'

interface PhonePaymentData {
  addressId: string
  paymentMethodId: string
  phoneNumber: string
  clientTransactionId: string
}

export const phonePayphoneService = async (data: PhonePaymentData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.PHONE_PAYMENT, data)
  return response.data.content
}
