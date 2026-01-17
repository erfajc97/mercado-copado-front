import { usePersonalInfoTabHook } from './usePersonalInfoTabHook'
import { usePasswordTabHook } from './usePasswordTabHook'
import { usePaymentMethodsTabHook } from './usePaymentMethodsTabHook'

export const useProfileHook = () => {
  const personalInfoTab = usePersonalInfoTabHook()
  const passwordTab = usePasswordTabHook()
  const paymentMethodsTab = usePaymentMethodsTabHook()

  return {
    personalInfoTab,
    passwordTab,
    paymentMethodsTab,
  }
}
