import { create } from 'zustand'

interface ProfileState {
  showPaymentMethodForm: boolean
  phoneCountryCode: string

  setShowPaymentMethodForm: (show: boolean) => void
  setPhoneCountryCode: (code: string) => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  showPaymentMethodForm: false,
  phoneCountryCode: '+503',

  setShowPaymentMethodForm: (show) => set({ showPaymentMethodForm: show }),
  setPhoneCountryCode: (code) => set({ phoneCountryCode: code }),
}))
