import { Form, Input, Select, Space } from 'antd'
import type { FormInstance } from 'antd'
import { COUNTRIES } from '@/app/constants/countries'
import { PHONE_COUNTRY_CODES } from '@/app/constants/phoneCountryCodes'

interface FormProfileProps {
  form: FormInstance
  phoneCountryCode: string
  onPhoneCountryCodeChange: (code: string) => void
  onFinish: (values: any) => Promise<void>
  isLoading: boolean
}

export const FormProfile = ({
  form,
  phoneCountryCode,
  onPhoneCountryCodeChange,
  onFinish,
  isLoading,
}: FormProfileProps) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="space-y-4 mt-2"
    >
      <div className="grid grid-cols-2 gap-4 mb-3">
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

      <div className="mb-3">
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
              onChange={onPhoneCountryCodeChange}
              options={PHONE_COUNTRY_CODES}
            />
            <Input
              style={{ width: '65%' }}
              size="large"
              placeholder="71234567"
            />
          </Space.Compact>
        </Form.Item>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
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
      </div>

      <Form.Item>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-linear-to-r from-coffee-medium to-coffee-dark text-white py-2 px-4 rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </Form.Item>
    </Form>
  )
}
