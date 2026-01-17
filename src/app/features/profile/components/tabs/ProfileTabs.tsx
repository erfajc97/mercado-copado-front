import { Tabs } from 'antd'
import { CreditCard, Lock, MapPin, User } from 'lucide-react'
import { PersonalInfoTab } from './PersonalInfoTab'
import { PasswordTab } from './PasswordTab'
import { PaymentMethodsTab } from './PaymentMethodsTab'
import { Addresses } from '@/app/features/addresses/Addresses'

interface ProfileTabsProps {
  defaultActiveKey?: string
}

export const ProfileTabs = ({ defaultActiveKey = 'personal' }: ProfileTabsProps) => {
  const tabItems = [
    {
      key: 'personal',
      label: (
        <span className="flex items-center gap-2">
          <User size={18} />
          Información Personal
        </span>
      ),
      children: <PersonalInfoTab />,
    },
    {
      key: 'password',
      label: (
        <span className="flex items-center gap-2">
          <Lock size={18} />
          Cambiar Contraseña
        </span>
      ),
      children: <PasswordTab />,
    },
    {
      key: 'addresses',
      label: (
        <span className="flex items-center gap-2">
          <MapPin size={18} />
          Mis Direcciones
        </span>
      ),
      children: <Addresses />,
    },
    {
      key: 'payment-cards',
      label: (
        <span className="flex items-center gap-2">
          <CreditCard size={18} />
          Métodos de Pago
        </span>
      ),
      children: <PaymentMethodsTab />,
    },
  ]

  return (
    <Tabs
      defaultActiveKey={defaultActiveKey}
      items={tabItems}
      className="profile-tabs"
    />
  )
}
