import { Button, Card, CardBody } from '@heroui/react'
import { AlertTriangle, CheckCircle, Mail } from 'lucide-react'
import { FormProfile } from '../FormProfile'
import { usePersonalInfoTabHook } from '../../hooks/usePersonalInfoTabHook'

export const PersonalInfoTab = () => {
  const hook = usePersonalInfoTabHook()

  return (
    <Card className="shadow-sm">
      <CardBody>
        {/* Verification Status Banner */}
        <VerificationStatusBanner
          isVerified={hook.isVerified}
          resendState={hook.resendState}
          onResend={hook.handleResendVerification}
          onResetResendState={hook.resetResendState}
        />

        <FormProfile
          form={hook.form}
          phoneCountryCode={hook.phoneCountryCode}
          onPhoneCountryCodeChange={hook.setPhoneCountryCode}
          onFinish={hook.handleUpdateProfile}
          isLoading={hook.isUpdatingProfile}
        />
      </CardBody>
    </Card>
  )
}

interface VerificationStatusBannerProps {
  isVerified: boolean
  resendState: 'idle' | 'sending' | 'sent' | 'error'
  onResend: () => void
  onResetResendState: () => void
}

const VerificationStatusBanner = ({
  isVerified,
  resendState,
  onResend,
  onResetResendState,
}: VerificationStatusBannerProps) => {
  if (isVerified) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-lg bg-green-50 p-4 border border-green-200">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <span className="text-green-700 font-medium">Email verificado</span>
      </div>
    )
  }

  return (
    <div className="mb-6 rounded-lg bg-amber-50 p-4 border border-amber-200">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-3 flex-1">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-amber-800 font-medium">
              Tu email no ha sido verificado
            </p>
            <p className="text-amber-600 text-sm">
              Verifica tu cuenta para acceder a todas las funcionalidades
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {resendState === 'idle' && (
            <Button
              color="warning"
              variant="solid"
              size="sm"
              startContent={<Mail className="h-4 w-4" />}
              onPress={onResend}
            >
              Reenviar verificación
            </Button>
          )}

          {resendState === 'sending' && (
            <Button color="warning" variant="solid" size="sm" isLoading disabled>
              Enviando...
            </Button>
          )}

          {resendState === 'sent' && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Email enviado</span>
            </div>
          )}

          {resendState === 'error' && (
            <div className="flex items-center gap-2">
              <span className="text-red-600 text-sm">Error al enviar</span>
              <Button
                color="warning"
                variant="bordered"
                size="sm"
                onPress={onResetResendState}
              >
                Reintentar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
