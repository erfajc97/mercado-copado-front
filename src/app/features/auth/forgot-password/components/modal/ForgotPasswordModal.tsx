import React from 'react'
import ForgotPasswordForm from '../ForgotPasswordForm'
import CustomModalNextUI from '@/components/UI/customModalNextUI/CustomModalNextUI'

interface ForgotPasswordModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  onSwitchToLogin: () => void
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
  onSwitchToLogin,
}) => {
  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable
      size="2xl"
      placement="center"
      headerContent="Recuperar Contraseña"
    >
      <ForgotPasswordForm
        onSuccess={onSuccess}
        onSwitchToLogin={onSwitchToLogin}
      />
    </CustomModalNextUI>
  )
}

export default ForgotPasswordModal
