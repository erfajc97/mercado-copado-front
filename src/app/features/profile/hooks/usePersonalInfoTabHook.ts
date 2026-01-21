import { useRef, useState } from 'react'
import { Form } from 'antd'
import { useProfileQuery } from '../queries/useProfileQuery'
import { useUpdateUserProfileMutation } from '../mutations/useProfileMutations'
import { useProfileStore } from '@/app/store/profile/profileStore'
import { PHONE_COUNTRY_CODES } from '@/app/constants/phoneCountryCodes'
import { useResendVerificationMutation } from '@/app/features/auth/verify-email/mutations/useResendVerificationMutation'

export type ResendState = 'idle' | 'sending' | 'sent' | 'error'

export const usePersonalInfoTabHook = () => {
  const [form] = Form.useForm()
  const { data: userInfo, refetch: refetchUserInfo } = useProfileQuery()
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } =
    useUpdateUserProfileMutation()
  const { phoneCountryCode, setPhoneCountryCode } = useProfileStore()
  const previousUserInfoRef = useRef<unknown>(null)
  
  // Resend verification state
  const [resendState, setResendState] = useState<ResendState>('idle')
  const resendMutation = useResendVerificationMutation()

  // Inicializar formulario cuando userInfo cambia
  if (userInfo && previousUserInfoRef.current && (previousUserInfoRef.current as any).id !== userInfo.id) {
    form.setFieldsValue({
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      country: userInfo.country,
      documentId: userInfo.documentId,
    })
    if (userInfo.phoneNumber) {
      const code = PHONE_COUNTRY_CODES.find((c) =>
        userInfo.phoneNumber?.startsWith(c.value),
      )
      if (code) {
        setPhoneCountryCode(code.value)
        form.setFieldsValue({
          phoneNumber: userInfo.phoneNumber.replace(code.value, ''),
        })
      } else {
        form.setFieldsValue({ phoneNumber: userInfo.phoneNumber })
      }
    }
    previousUserInfoRef.current = userInfo
  }

  const handleUpdateProfile = async (values: {
    firstName: string
    lastName?: string
    phoneNumber?: string
    country?: string
    documentId?: string
  }) => {
    try {
      const fullPhoneNumber = values.phoneNumber
        ? `${phoneCountryCode}${values.phoneNumber}`
        : undefined
      await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: fullPhoneNumber,
        country: values.country,
        documentId: values.documentId,
      })
      await refetchUserInfo()
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleResendVerification = () => {
    if (!userInfo?.email) return

    setResendState('sending')
    resendMutation.mutate(userInfo.email, {
      onSuccess: () => {
        setResendState('sent')
      },
      onError: () => {
        setResendState('error')
      },
    })
  }

  return {
    form,
    userInfo,
    phoneCountryCode,
    setPhoneCountryCode,
    handleUpdateProfile,
    isUpdatingProfile,
    // Verification
    isVerified: userInfo?.isVerified ?? false,
    email: userInfo?.email,
    resendState,
    handleResendVerification,
    resetResendState: () => setResendState('idle'),
  }
}
