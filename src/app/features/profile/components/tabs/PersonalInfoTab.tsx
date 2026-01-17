import { Card, CardBody } from '@heroui/react'
import { FormProfile } from '../FormProfile'
import { usePersonalInfoTabHook } from '../../hooks/usePersonalInfoTabHook'

export const PersonalInfoTab = () => {
  const hook = usePersonalInfoTabHook()
  
  return (
    <Card className="shadow-sm">
      <CardBody>
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
