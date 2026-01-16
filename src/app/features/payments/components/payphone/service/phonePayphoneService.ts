import axios, { AxiosError } from 'axios'

interface PayphoneError {
  message: string
  errorCode: number
  errors?: Array<{
    message: string
    errorCode: number
    errorDescriptions: Array<string>
  }>
}

interface PhonePaymentData {
  addressId: string
  paymentMethodId?: string
  phoneNumber: string
  clientTransactionId: string
  amount: number
}

export const phonePayphoneService = async (data: PhonePaymentData) => {
  const endpointByPayphone = 'https://pay.payphonetodoesposible.com/api/Sale'

  const payphoneToken = import.meta.env.VITE_TOKEN_PAYPHONE
  if (!payphoneToken) {
    throw new Error(
      'VITE_TOKEN_PAYPHONE no está configurado en las variables de entorno',
    )
  }

  const payphoneData = {
    phoneNumber: data.phoneNumber,
    countryCode: '593',
    clientTransactionId: data.clientTransactionId,
    reference: `Compra en Mercado Copado - Transacción ${data.clientTransactionId.slice(0, 8)}`,
    amount: Math.round(data.amount * 100),
    amountWithoutTax: Math.round(data.amount * 100),
    storeId: import.meta.env.VITE_STORE_ID,
  }

  try {
    // 1. Llamar a Payphone /api/Sale PRIMERO

    const payphoneResponse = await axios.post(
      endpointByPayphone,
      payphoneData,
      {
        headers: {
          Authorization: `Bearer ${payphoneToken}`,
          'Content-Type': 'application/json',
        },
      },
    )

    // 2. Si Payphone responde exitosamente, retornar la respuesta
    // La creación de transacción/orden se maneja en ButtonPayPhone.tsx (como el link)
    if (payphoneResponse.status >= 200 && payphoneResponse.status < 300) {
      console.log(
        '[phonePayphoneService] Payphone respondió exitosamente para transacción',
        data.clientTransactionId,
      )
    }

    return payphoneResponse.data
  } catch (error: unknown) {
    console.error('[phonePayphoneService] Error:', error)
    if (error instanceof AxiosError) {
      const payphoneError = error.response?.data as PayphoneError
      if (payphoneError.errors?.[0]?.errorDescriptions?.[0]) {
        throw new Error(payphoneError.errors[0].errorDescriptions[0])
      }
      if (payphoneError.message) {
        throw new Error(payphoneError.message)
      }
    }
    throw new Error(
      'Ocurrió un error al procesar el pago por teléfono con Payphone',
    )
  }
}
