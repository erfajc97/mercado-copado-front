import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, Modal, Select, Space, Tabs } from 'antd'
import {
  CreditCard,
  Edit,
  Home,
  Lock,
  MapPin,
  Plus,
  Trash2,
  User,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import type { PaymentMethod } from '@/app/features/payment-methods/types'
import { userInfoService } from '@/app/features/auth/login/services/userInfoService'
import { useAddressesQuery } from '@/app/features/addresses/queries/useAddressesQuery'
import { useCreateAddressMutation } from '@/app/features/addresses/mutations/useCreateAddressMutation'
import { useDeleteAddressMutation } from '@/app/features/addresses/mutations/useDeleteAddressMutation'
import { useSetDefaultAddressMutation } from '@/app/features/addresses/mutations/useSetDefaultAddressMutation'
import { useUpdateAddressMutation } from '@/app/features/addresses/mutations/useUpdateAddressMutation'
import { useUpdateUserProfileMutation } from '@/app/features/users/mutations/useUpdateUserProfileMutation'
import { useChangePasswordMutation } from '@/app/features/users/mutations/useChangePasswordMutation'
import {
  useCreatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
} from '@/app/features/payment-methods/mutations/usePaymentMethodMutations'
import { usePaymentMethodsQuery } from '@/app/features/payment-methods/queries/usePaymentMethodsQuery'
import { COUNTRIES } from '@/app/constants/countries'
import { PHONE_COUNTRY_CODES } from '@/app/constants/phoneCountryCodes'

export const Route = createFileRoute('/profile')({
  component: Profile,
})

function Profile() {
  const { data: userInfo, refetch: refetchUserInfo } = useQuery({
    queryKey: ['userInfo'],
    queryFn: userInfoService,
    enabled: true,
  })

  const { data: addresses, refetch: refetchAddresses } = useAddressesQuery()
  const { mutateAsync: createAddress, isPending: isCreatingAddress } =
    useCreateAddressMutation()
  const { mutateAsync: deleteAddress } = useDeleteAddressMutation()
  const { mutateAsync: setDefaultAddress } = useSetDefaultAddressMutation()
  const { mutateAsync: updateAddress, isPending: isUpdatingAddress } =
    useUpdateAddressMutation()
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } =
    useUpdateUserProfileMutation()
  const { mutateAsync: changePassword, isPending: isChangingPassword } =
    useChangePasswordMutation()

  const { data: paymentMethods, refetch: refetchPaymentMethods } =
    usePaymentMethodsQuery()
  const {
    mutateAsync: createPaymentMethod,
    isPending: isCreatingPaymentMethod,
  } = useCreatePaymentMethodMutation()
  const { mutateAsync: setDefaultPaymentMethod } =
    useSetDefaultPaymentMethodMutation()
  const { mutateAsync: deletePaymentMethod } = useDeletePaymentMethodMutation()

  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)
  const [showPaymentMethodForm, setShowPaymentMethodForm] = useState(false)
  const [addressForm] = Form.useForm()
  const [profileForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [paymentMethodForm] = Form.useForm()
  const [phoneCountryCode, setPhoneCountryCode] = useState('+503')

  useEffect(() => {
    if (userInfo) {
      profileForm.setFieldsValue({
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
          profileForm.setFieldsValue({
            phoneNumber: userInfo.phoneNumber.replace(code.value, ''),
          })
        } else {
          profileForm.setFieldsValue({ phoneNumber: userInfo.phoneNumber })
        }
      }
    }
  }, [userInfo, profileForm])

  const handleCreateAddress = async (values: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    reference?: string
    isDefault?: boolean
  }) => {
    try {
      if (editingAddress) {
        await updateAddress({
          addressId: editingAddress.id,
          data: values,
        })
      } else {
        await createAddress({
          ...values,
          isDefault:
            addresses && addresses.length === 0 ? true : values.isDefault,
        })
      }
      await refetchAddresses()
      setShowAddressForm(false)
      setEditingAddress(null)
      addressForm.resetFields()
    } catch (error) {
      console.error('Error saving address:', error)
    }
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

  const handleChangePassword = async (values: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      passwordForm.setFields([
        {
          name: 'confirmPassword',
          errors: ['Las contraseñas no coinciden'],
        },
      ])
      return
    }
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      passwordForm.resetFields()
    } catch (error) {
      console.error('Error changing password:', error)
    }
  }

  const handleEditAddress = (address: any) => {
    setEditingAddress(address)
    addressForm.setFieldsValue(address)
    setShowAddressForm(true)
  }

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteAddress(addressId)
      await refetchAddresses()
    } catch (error) {
      console.error('Error deleting address:', error)
    }
  }

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await setDefaultAddress(addressId)
      await refetchAddresses()
    } catch (error) {
      console.error('Error setting default address:', error)
    }
  }

  const handleCreatePaymentMethod = async (values: {
    gatewayToken: string
    cardBrand: string
    last4Digits: string
    expirationMonth: number
    expirationYear: number
    isDefault?: boolean
  }) => {
    try {
      await createPaymentMethod({
        gatewayToken: values.gatewayToken,
        cardBrand: values.cardBrand,
        last4Digits: values.last4Digits,
        expirationMonth: values.expirationMonth,
        expirationYear: values.expirationYear,
        isDefault:
          paymentMethods && paymentMethods.length === 0
            ? true
            : values.isDefault,
      })
      await refetchPaymentMethods()
      setShowPaymentMethodForm(false)
      paymentMethodForm.resetFields()
    } catch (error) {
      console.error('Error saving payment method:', error)
    }
  }

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      await setDefaultPaymentMethod(paymentMethodId)
      await refetchPaymentMethods()
    } catch (error) {
      console.error('Error setting default payment method:', error)
    }
  }

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      await deletePaymentMethod(paymentMethodId)
      await refetchPaymentMethods()
    } catch (error) {
      console.error('Error deleting payment method:', error)
    }
  }

  const tabItems = [
    {
      key: 'personal',
      label: (
        <span className="flex items-center gap-2">
          <User size={18} />
          Información Personal
        </span>
      ),
      children: (
        <Card className="shadow-sm">
          <Form
            form={profileForm}
            layout="vertical"
            onFinish={handleUpdateProfile}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="firstName"
                label="Nombre"
                rules={[
                  { required: true, message: 'Por favor ingresa tu nombre' },
                ]}
              >
                <Input size="large" placeholder="Juan" />
              </Form.Item>

              <Form.Item name="lastName" label="Apellido">
                <Input size="large" placeholder="Pérez" />
              </Form.Item>
            </div>

            <Form.Item
              name="phoneNumber"
              label="Número de Teléfono"
              rules={[
                {
                  pattern: /^[0-9]{8,15}$/,
                  message: 'Ingresa un número válido (8-15 dígitos)',
                },
              ]}
            >
              <Space.Compact style={{ width: '100%' }}>
                <Select
                  style={{ width: '35%' }}
                  size="large"
                  value={phoneCountryCode}
                  onChange={setPhoneCountryCode}
                  options={PHONE_COUNTRY_CODES}
                />
                <Input
                  style={{ width: '65%' }}
                  size="large"
                  placeholder="71234567"
                />
              </Space.Compact>
            </Form.Item>

            <Form.Item name="country" label="País" initialValue="Argentina">
              <Select
                size="large"
                placeholder="Selecciona un país"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={COUNTRIES}
              />
            </Form.Item>

            <Form.Item
              name="documentId"
              label="Documento de Identidad"
              rules={[
                {
                  pattern: /^[0-9A-Za-z-]+$/,
                  message: 'Solo se permiten números, letras y guiones',
                },
              ]}
            >
              <Input size="large" placeholder="Ej: 12345678-9" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isUpdatingProfile}
                className="bg-gradient-coffee border-none hover:opacity-90"
              >
                Guardar Cambios
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'password',
      label: (
        <span className="flex items-center gap-2">
          <Lock size={18} />
          Cambiar Contraseña
        </span>
      ),
      children: (
        <Card className="shadow-sm">
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handleChangePassword}
            className="space-y-4"
          >
            <Form.Item
              name="currentPassword"
              label="Contraseña Actual"
              rules={[
                {
                  required: true,
                  message: 'Por favor ingresa tu contraseña actual',
                },
              ]}
            >
              <Input.Password size="large" placeholder="••••••••" />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="Nueva Contraseña"
              rules={[
                {
                  required: true,
                  message: 'Por favor ingresa una nueva contraseña',
                },
                {
                  min: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres',
                },
              ]}
            >
              <Input.Password size="large" placeholder="••••••••" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirmar Nueva Contraseña"
              rules={[
                {
                  required: true,
                  message: 'Por favor confirma tu nueva contraseña',
                },
              ]}
            >
              <Input.Password size="large" placeholder="••••••••" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isChangingPassword}
                className="bg-gradient-coffee border-none hover:opacity-90"
              >
                Cambiar Contraseña
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'addresses',
      label: (
        <span className="flex items-center gap-2">
          <MapPin size={18} />
          Mis Direcciones
        </span>
      ),
      children: (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-coffee-darker">
              Direcciones Guardadas
            </h2>
            <Button
              type="primary"
              icon={<Plus size={18} />}
              onClick={() => {
                setEditingAddress(null)
                addressForm.resetFields()
                setShowAddressForm(true)
              }}
              className="bg-gradient-coffee border-none hover:opacity-90"
            >
              Agregar Dirección
            </Button>
          </div>

          {addresses && addresses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address: any) => (
                <Card
                  key={address.id}
                  className={`shadow-coffee ${
                    address.isDefault ? 'border-2 border-coffee-medium' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-coffee-darker mb-2">
                        {address.street}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {address.city}, {address.state}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        {address.zipCode}, {address.country}
                      </p>
                      {address.reference && (
                        <p className="text-xs text-gray-500 mt-2">
                          <strong>Referencia:</strong> {address.reference}
                        </p>
                      )}
                      {address.isDefault && (
                        <span className="mt-2 bg-coffee-medium text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                          <Home size={12} />
                          Por defecto
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(address.id)}
                          className="p-2 text-coffee-medium hover:bg-coffee-light rounded-lg transition-colors text-xs"
                          aria-label="Establecer como predeterminada"
                          title="Establecer como predeterminada"
                        >
                          <Home size={16} />
                        </button>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditAddress(address)}
                          className="p-2 text-coffee-medium hover:bg-coffee-light rounded-lg transition-colors"
                          aria-label="Editar dirección"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Eliminar dirección"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-coffee">
              <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">
                No tienes direcciones guardadas
              </p>
              <Button
                type="primary"
                icon={<Plus size={18} />}
                onClick={() => {
                  setEditingAddress(null)
                  addressForm.resetFields()
                  setShowAddressForm(true)
                }}
                className="bg-gradient-coffee border-none hover:opacity-90"
              >
                Agregar Primera Dirección
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'payment-methods',
      label: (
        <span className="flex items-center gap-2">
          <CreditCard size={18} />
          Métodos de Pago
        </span>
      ),
      children: (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-coffee-darker">
              Tarjetas Guardadas
            </h2>
            <Button
              type="primary"
              icon={<Plus size={18} />}
              onClick={() => {
                paymentMethodForm.resetFields()
                setShowPaymentMethodForm(true)
              }}
              className="bg-gradient-coffee border-none hover:opacity-90"
            >
              Agregar Tarjeta
            </Button>
          </div>

          {paymentMethods && paymentMethods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method: PaymentMethod) => (
                <Card
                  key={method.id}
                  className={`shadow-coffee ${
                    method.isDefault ? 'border-2 border-coffee-medium' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard size={20} className="text-coffee-medium" />
                        <h3 className="font-semibold text-coffee-darker">
                          {method.cardBrand}
                        </h3>
                      </div>
                      <p className="text-lg font-mono text-coffee-darker mb-1">
                        **** **** **** {method.last4Digits}
                      </p>
                      <p className="text-sm text-gray-600">
                        Exp:{' '}
                        {method.expirationMonth.toString().padStart(2, '0')}/
                        {method.expirationYear}
                      </p>
                      {method.isDefault && (
                        <span className="mt-2 bg-coffee-medium text-white text-xs px-2 py-1 rounded flex items-center gap-1 w-fit">
                          <Home size={12} />
                          Predeterminada
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {!method.isDefault && (
                        <button
                          onClick={() =>
                            handleSetDefaultPaymentMethod(method.id)
                          }
                          className="p-2 text-coffee-medium hover:bg-coffee-light rounded-lg transition-colors text-xs"
                          aria-label="Establecer como predeterminada"
                          title="Establecer como predeterminada"
                        >
                          <Home size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePaymentMethod(method.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Eliminar tarjeta"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-coffee">
              <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">No tienes tarjetas guardadas</p>
              <Button
                type="primary"
                icon={<Plus size={18} />}
                onClick={() => {
                  paymentMethodForm.resetFields()
                  setShowPaymentMethodForm(true)
                }}
                className="bg-gradient-coffee border-none hover:opacity-90"
              >
                Agregar Primera Tarjeta
              </Button>
            </div>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-coffee-darker">Mi Perfil</h1>

      <Tabs
        defaultActiveKey="personal"
        items={tabItems}
        className="profile-tabs"
      />

      {/* Modal de Direcciones */}
      <Modal
        title={editingAddress ? 'Editar Dirección' : 'Agregar Nueva Dirección'}
        open={showAddressForm}
        onCancel={() => {
          setShowAddressForm(false)
          setEditingAddress(null)
          addressForm.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={addressForm}
          layout="vertical"
          onFinish={handleCreateAddress}
          className="mt-4"
        >
          <Form.Item
            name="country"
            label="País"
            rules={[{ required: true, message: 'Por favor ingresa el país' }]}
          >
            <Select
              size="large"
              placeholder="Selecciona un país"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={COUNTRIES}
            />
          </Form.Item>
          <Form.Item
            name="city"
            label="Ciudad"
            rules={[{ required: true, message: 'Por favor ingresa la ciudad' }]}
          >
            <Input size="large" placeholder="Ej: San Salvador" />
          </Form.Item>
          <Form.Item
            name="state"
            label="Estado/Departamento"
            rules={[{ required: true, message: 'Por favor ingresa el estado' }]}
          >
            <Input size="large" placeholder="Ej: San Salvador" />
          </Form.Item>
          <Form.Item
            name="zipCode"
            label="Código Postal"
            rules={[
              { required: true, message: 'Por favor ingresa el código postal' },
            ]}
          >
            <Input size="large" placeholder="Ej: 1101" />
          </Form.Item>
          <Form.Item
            name="street"
            label="Dirección"
            rules={[
              { required: true, message: 'Por favor ingresa la dirección' },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Ej: Calle Principal #123, Colonia Centro"
            />
          </Form.Item>
          <Form.Item name="reference" label="Referencia o más detalles">
            <Input.TextArea
              rows={2}
              placeholder="Ej: Casa azul, portón negro, cerca del parque"
            />
          </Form.Item>
          {addresses && addresses.length > 0 && (
            <Form.Item name="isDefault" valuePropName="checked">
              <input type="checkbox" className="mr-2" />
              <span>Establecer como dirección por defecto</span>
            </Form.Item>
          )}
          <Form.Item>
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => {
                  setShowAddressForm(false)
                  setEditingAddress(null)
                  addressForm.resetFields()
                }}
              >
                Cancelar
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isCreatingAddress || isUpdatingAddress}
                className="bg-gradient-coffee border-none hover:opacity-90"
              >
                {editingAddress ? 'Actualizar Dirección' : 'Guardar Dirección'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de Métodos de Pago */}
      <Modal
        title="Agregar Nueva Tarjeta"
        open={showPaymentMethodForm}
        onCancel={() => {
          setShowPaymentMethodForm(false)
          paymentMethodForm.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={paymentMethodForm}
          layout="vertical"
          onFinish={handleCreatePaymentMethod}
          className="mt-4"
        >
          <Form.Item
            name="gatewayToken"
            label="Token del Gateway"
            rules={[
              {
                required: true,
                message: 'El token del gateway es requerido',
              },
            ]}
            tooltip="Este token será generado por el gateway de pago (Payphone, Stripe, etc.)"
          >
            <Input size="large" placeholder="Token generado por el gateway" />
          </Form.Item>

          <Form.Item
            name="cardBrand"
            label="Marca de la Tarjeta"
            rules={[
              {
                required: true,
                message: 'La marca de la tarjeta es requerida',
              },
            ]}
          >
            <Select
              size="large"
              placeholder="Selecciona la marca"
              options={[
                { value: 'Visa', label: 'Visa' },
                { value: 'Mastercard', label: 'Mastercard' },
                { value: 'American Express', label: 'American Express' },
                { value: 'Discover', label: 'Discover' },
                { value: 'Diners Club', label: 'Diners Club' },
                { value: 'JCB', label: 'JCB' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="last4Digits"
            label="Últimos 4 Dígitos"
            rules={[
              {
                required: true,
                message: 'Los últimos 4 dígitos son requeridos',
              },
              {
                pattern: /^[0-9]{4}$/,
                message: 'Debe contener exactamente 4 dígitos',
              },
            ]}
          >
            <Input size="large" placeholder="1234" maxLength={4} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="expirationMonth"
              label="Mes de Expiración"
              rules={[
                {
                  required: true,
                  message: 'El mes de expiración es requerido',
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Mes"
                options={Array.from({ length: 12 }, (_, i) => ({
                  value: i + 1,
                  label: (i + 1).toString().padStart(2, '0'),
                }))}
              />
            </Form.Item>

            <Form.Item
              name="expirationYear"
              label="Año de Expiración"
              rules={[
                {
                  required: true,
                  message: 'El año de expiración es requerido',
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Año"
                options={Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() + i
                  return { value: year, label: year.toString() }
                })}
              />
            </Form.Item>
          </div>

          {paymentMethods && paymentMethods.length > 0 && (
            <Form.Item name="isDefault" valuePropName="checked">
              <input type="checkbox" className="mr-2" />
              <span>Establecer como tarjeta predeterminada</span>
            </Form.Item>
          )}

          <Form.Item>
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => {
                  setShowPaymentMethodForm(false)
                  paymentMethodForm.resetFields()
                }}
              >
                Cancelar
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isCreatingPaymentMethod}
                className="bg-gradient-coffee border-none hover:opacity-90"
              >
                Guardar Tarjeta
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
