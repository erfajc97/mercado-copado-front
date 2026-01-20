import axios, { AxiosError } from 'axios'

interface PayphoneError {
  errors?: Array<{
    message: string
    errorDescriptions: Array<string>
  }>
}

export const paymentConfirmationByPayphoneService = async (data: any) => {
  const endpointByPayphone =
    'https://pay.payphonetodoesposible.com/api/button/V2/Confirm'
  
  // Normalizar clientTxId (asegurar que sea string, no array)
  const clientTxId = Array.isArray(data.clientTxId)
    ? data.clientTxId[0]
    : Array.isArray(data.clientTransactionId)
      ? data.clientTransactionId[0]
      : String(data.clientTxId || data.clientTransactionId || '')

  try {
    // El id debe ser un número (Int64) según la API de Payphone
    const numericId = Number(data.id)

    if (isNaN(numericId)) {
      throw new Error(`El id debe ser un número válido. Se recibió: ${data.id}`)
    }

    if (!clientTxId || clientTxId.trim() === '') {
      throw new Error(`El clientTxId es requerido`)
    }

    const response = await axios.post(
      endpointByPayphone,
      {
        id: numericId,
        clientTxId: clientTxId,
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TOKEN_PAYPHONE_LINK}`,
          'Content-Type': 'application/json',
        },
      },
    )

    return response.data
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const payphoneError = error.response?.data as PayphoneError
      if (payphoneError.errors?.[0]?.message) {
        const errorMessage = payphoneError.errors[0].errorDescriptions[0]
        throw new Error(errorMessage)
      }
    }

    const genericError = error instanceof Error ? error.message : 'Ocurrió un error al confirmar el pago por payphone'
    throw new Error(genericError)
  }
}

