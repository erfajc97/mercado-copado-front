import { transformPaymentMethodData } from '../helpers/transformPaymentMethodData'

export const usePaymentMethodFormHook = () => {
  const transformFormData = (values: any) => {
    return transformPaymentMethodData(values)
  }

  return {
    transformFormData,
  }
}
