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

      const linkEndpoint =
        'https://pay.payphonetodoesposible.com/api/button/V2/Confirm'

      const requestBody = {
        id: fullPaymentId,
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

    // Si no hay paymentId, es un pago por teléfono - usar endpoint de Sale
    console.log(
      `[getStatusTransactionService] Verificando pago por teléfono con clientTransactionId: ${transactionId}`,
    )
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
    return response.data[0] || response.data
  } catch (error: unknown) {
    console.error('Error en getStatusTransactionService:', error)

    if (error instanceof AxiosError) {
      const payphoneError = error.response?.data as PayphoneError

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
