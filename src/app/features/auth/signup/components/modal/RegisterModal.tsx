import React from 'react'
import RegisterForm from '../RegisterForm'
import CustomModalNextUI from '@/components/UI/customModalNextUI/CustomModalNextUI'

interface RegisterModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  onSwitchToLogin: () => void
}

const RegisterModal: React.FC<RegisterModalProps> = ({
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
      headerContent="Registrarse"
    >
      <RegisterForm onSuccess={onSuccess} onSwitchToLogin={onSwitchToLogin} />
    </CustomModalNextUI>
  )
}

export default RegisterModal
