import { useEffect, useState } from 'react'
import LoginModal from '../login/components/modal/LoginModal'
import RegisterModal from '../signup/components/modal/RegisterModal'
import ForgotPasswordModal from '../forgot-password/components/modal/ForgotPasswordModal'

type AuthMode = 'login' | 'register' | 'forgot-password'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: AuthMode
  onOpenChange?: (open: boolean) => void
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  onOpenChange,
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)

  // Resetear el modo cuando cambia initialMode
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
    }
  }, [isOpen, initialMode])

  const handleSuccess = () => {
    onClose()
    setMode('login')
  }

  const handleSwitchToRegister = () => {
    setMode('register')
  }

  const handleSwitchToLogin = () => {
    setMode('login')
  }

  const handleSwitchToForgotPassword = () => {
    setMode('forgot-password')
  }

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open)
    }
    if (!open) {
      onClose()
    }
  }

  return (
    <>
      {mode === 'login' && (
        <LoginModal
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
          onSuccess={handleSuccess}
          onSwitchToRegister={handleSwitchToRegister}
          onSwitchToForgotPassword={handleSwitchToForgotPassword}
        />
      )}

      {mode === 'register' && (
        <RegisterModal
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
          onSuccess={handleSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}

      {mode === 'forgot-password' && (
        <ForgotPasswordModal
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
          onSuccess={handleSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </>
  )
}
