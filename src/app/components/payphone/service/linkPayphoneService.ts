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
  try {
    const response = await axios.post(endpointByPayphone, data, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TOKEN_PAYPHONE_LINK}`,
        'Content-Type': 'application/json',
      },
    })
    return response.data
  } catch (error: unknown) {
    console.error('Error en linkPayphoneService:', error)
    if (error instanceof AxiosError) {
      const payphoneError = error.response?.data as PayphoneError
      if (payphoneError.errors?.[0]?.message) {
        throw new Error(payphoneError.errors[0].errorDescriptions[0])
      }
    }

    throw new Error('Ocurrió un error al debitar por payphone')
  }
}

