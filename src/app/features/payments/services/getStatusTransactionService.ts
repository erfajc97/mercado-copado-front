import axios, { AxiosError } from 'axios'

interface PayphoneError {
  message: string
  errorCode?: number
  errors?: Array<{
    message: string
    errorCode: number
  }>
}

interface PayphoneStatusResponse {
  statusCode: number
  [key: string]: unknown
}

export const getStatusTransactionService = async (
  transactionId: string,
  paymentId?: string,
): Promise<PayphoneStatusResponse> => {
  const payphoneToken = import.meta.env.VITE_TOKEN_PAYPHONE
  const payphoneLinkToken = import.meta.env.VITE_TOKEN_PAYPHONE_LINK

  try {
    // Si hay paymentId (y no es undefined/null/string vacío), es un pago por link - usar endpoint de confirmación
    if (paymentId && paymentId.trim() !== '') {
      // Asegurar que transactionId sea el valor completo, no cortado
      const fullTransactionId = String(transactionId).trim()
      const fullPaymentId = String(paymentId).trim()

      // El id debe ser un número (Int64) según la API de Payphone
      // Si paymentId es un string alfanumérico (como "kzLKq8Ua0ClzLSwdfQYzg"), 
      // significa que es el paymentId string, no el id numérico
      // El id numérico solo viene en la URL de respuesta después del pago
      const numericId = Number(fullPaymentId)
      
      // Si no es un número válido, no podemos verificar
      if (isNaN(numericId)) {
        throw new Error(
          `No se puede verificar el pago por link: el id debe ser un número. Se recibió: ${fullPaymentId}. El id numérico solo está disponible después de que el usuario completa el pago.`,
        )
      }

      const linkEndpoint =
        'https://pay.payphonetodoesposible.com/api/button/V2/Confirm'

      const requestBody = {
        id: numericId,
        clientTxId: fullTransactionId,
      }

      const response = await axios.post<PayphoneStatusResponse>(
        linkEndpoint,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${payphoneLinkToken || payphoneToken}`,
            'Content-Type': 'application/json',
          },
        },
      )

      return response.data
    }
    const phoneEndpoint = `https://pay.payphonetodoesposible.com/api/Sale/client/${transactionId}`
    const response = await axios.get<Array<PayphoneStatusResponse>>(
      phoneEndpoint,
      {
        headers: {
          Authorization: `Bearer ${payphoneToken}`,
          'Content-Type': 'application/json',
        },
      },
    )

    // Payphone devuelve un array, tomamos el primer elemento
    const result = response.data[0] || response.data
 

    return result
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const payphoneError = error.response?.data as PayphoneError

      // Si es un 404, puede ser que la transacción no existe (pago por link)
      if (error.response?.status === 404) {
        throw new Error(
          payphoneError.message ||
            'La transacción no existe en el sistema de pagos por teléfono. Puede ser un pago por link.',
        )
      }

      if (payphoneError.message) {
        throw new Error(payphoneError.message)
      }

      if (payphoneError.errors?.[0]?.message) {
        throw new Error(payphoneError.errors[0].message)
      }
    }

    throw new Error('Ocurrió un error al obtener el estado de la transacción')
  }
}
