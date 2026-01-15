import axios, { AxiosError } from 'axios'

interface PayphoneError {
  errors?: Array<{
    message: string
    errorDescriptions: Array<string>
  }>
}

export const linkPayphoneService = async (data: any) => {
  const endpointByPayphone =
    'https://pay.payphonetodoesposible.com/api/button/Prepare'

  // Validar que el token esté configurado
  const payphoneToken = import.meta.env.VITE_TOKEN_PAYPHONE_LINK
  if (!payphoneToken) {
    console.error(
      '[linkPayphoneService] VITE_TOKEN_PAYPHONE_LINK no está configurado',
    )
    throw new Error(
      'Error de configuración: VITE_TOKEN_PAYPHONE_LINK no está configurado. Por favor, contacta al soporte técnico.',
    )
  }

  try {
    console.log(
      '[linkPayphoneService] Generando link de pago para transacción',
      data.clientTransactionId,
    )
    const response = await axios.post(endpointByPayphone, data, {
      headers: {
        Authorization: `Bearer ${payphoneToken}`,
        'Content-Type': 'application/json',
      },
    })

    // Validar que la respuesta contiene los datos esperados
    if (!response.data || !response.data.paymentId || !response.data.payWithCard) {
      console.error(
        '[linkPayphoneService] Respuesta inválida de Payphone:',
        response.data,
      )
      throw new Error(
        'La respuesta de Payphone no contiene los datos esperados. Por favor, intenta nuevamente.',
      )
    }

    console.log(
      '[linkPayphoneService] Link de pago generado exitosamente para transacción',
      data.clientTransactionId,
    )
    return response.data
  } catch (error: unknown) {
    console.error('[linkPayphoneService] Error al generar link de pago:', error)
    if (error instanceof AxiosError) {
      // Detectar errores de autenticación
      if (error.response?.status === 401) {
        console.error(
          '[linkPayphoneService] Error de autenticación con Payphone',
        )
        throw new Error(
          'Error de autenticación con Payphone. Por favor, contacta al soporte técnico.',
        )
      }

      const payphoneError = error.response?.data as PayphoneError
      if (payphoneError.errors?.[0]?.errorDescriptions?.[0]) {
        const errorMessage = payphoneError.errors[0].errorDescriptions[0]
        throw new Error(errorMessage)
      }
      if (payphoneError.errors?.[0]?.message) {
        throw new Error(payphoneError.errors[0].message)
      }

      // Si hay un mensaje de error en la respuesta
      if (error.response?.data && typeof error.response.data === 'object') {
        const errorData = error.response.data as { message?: string }
        if (errorData.message) {
          throw new Error(errorData.message)
        }
      }
    }

    // Si el error ya es una instancia de Error, lanzarlo directamente
    if (error instanceof Error) {
      throw error
    }

    throw new Error(
      'Ocurrió un error al generar el link de pago. Por favor, intenta nuevamente.',
    )
  }
}

