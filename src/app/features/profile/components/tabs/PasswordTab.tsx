import { Card, CardBody } from '@heroui/react'
import { FormPassword } from '../FormPassword'
import { usePasswordTabHook } from '../../hooks/usePasswordTabHook'

export const PasswordTab = () => {
  const hook = usePasswordTabHook()
  
  return (
    <Card className="shadow-sm">
      <CardBody>
        <FormPassword
          form={hook.form}
          onFinish={hook.handleChangePassword}
          isLoading={hook.isChangingPassword}
        />
      </CardBody>
    </Card>
  )
}
