import React from 'react'
import LoginForm from '../LoginForm'
import CustomModalNextUI from '@/components/UI/customModalNextUI/CustomModalNextUI'

interface LoginModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  onSwitchToRegister: () => void
  onSwitchToForgotPassword: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
  onSwitchToRegister,
  onSwitchToForgotPassword,
}) => {
  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable
      size="2xl"
      placement="center"
      headerContent="Iniciar Sesión"
    >
      <LoginForm
        onSuccess={onSuccess}
        onSwitchToRegister={onSwitchToRegister}
        onSwitchToForgotPassword={onSwitchToForgotPassword}
      />
    </CustomModalNextUI>
  )
}

export default LoginModal
