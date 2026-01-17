import {
  ConfigProvider,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
} from 'antd'
import { Upload as UploadIcon } from 'lucide-react'
import type { FormInstance } from 'antd'
import { COUNTRIES } from '@/app/constants/countries'

const { TextArea } = Input

interface FormProductProps {
  form: FormInstance
  categories: Array<{ id: string; name: string }>
  subcategories: Array<{ id: string; name: string }>
  selectedCategory: string
  setSelectedCategory: (categoryId: string) => void
  fileList: Array<any>
  handleUploadChange: (info: any) => void
  handleRemove?: (file: any) => void
  isEditMode?: boolean
  onFinish?: (values: any) => void
}

export const FormProduct = ({
  form,
  categories,
  subcategories,
  selectedCategory,
  setSelectedCategory,
  fileList,
  handleUploadChange,
  handleRemove,
  isEditMode = false,
  onFinish,
}: FormProductProps) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="mt-1"
    >
      {/* Fila 1: Nombre del Producto y País */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Form.Item
          name="name"
          label="Nombre del Producto"
          rules={[
            {
              required: true,
              message: 'Por favor ingresa el nombre del producto',
            },
          ]}
        >
          <Input placeholder="Ej: iPhone 15 Pro" />
        </Form.Item>

        <Form.Item
          name="country"
          label="País"
          rules={[
            { required: true, message: 'Por favor selecciona un país' },
          ]}
        >
          <Select
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
      </div>

      {/* Fila 2: Categoría y Subcategoría */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Form.Item
          name="categoryId"
          label="Categoría"
          rules={[
            {
              required: true,
              message: 'Por favor selecciona una categoría',
            },
          ]}
        >
          <Select
            placeholder="Selecciona una categoría"
            onChange={(value) => {
              setSelectedCategory(value)
              form.setFieldsValue({ subcategoryId: null })
            }}
          >
            {categories.map((category: any) => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="subcategoryId"
          label="Subcategoría"
          rules={[
            {
              required: true,
              message: 'Por favor selecciona una subcategoría',
            },
          ]}
        >
          <Select
            placeholder="Selecciona una subcategoría"
            disabled={!selectedCategory || subcategories.length === 0}
          >
            {subcategories.map((subcat: any) => (
              <Select.Option key={subcat.id} value={subcat.id}>
                {subcat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      {/* Fila 3: Precio, Descuento y Switch (3 columnas iguales) */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <Form.Item
          name="price"
          label="Precio"
          rules={[
            { required: true, message: 'Por favor ingresa el precio' },
          ]}
        >
          <InputNumber
            min={0}
            step={0.01}
            prefix="$"
            className="w-full"
            placeholder="0.00"
          />
        </Form.Item>

        <Form.Item
          name="discount"
          label="Descuento (%)"
          rules={[
            {
              required: true,
              message: 'Por favor ingresa el descuento',
            },
          ]}
        >
          <InputNumber
            min={0}
            max={100}
            className="w-full"
            placeholder="0"
          />
        </Form.Item>

        <Form.Item
          name="isActive"
          label="Producto Activo"
          valuePropName="checked"
          initialValue={!isEditMode ? true : undefined}
        >
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#D4A574',
              },
            }}
          >
            <Switch
              checkedChildren="Activo"
              unCheckedChildren="Inactivo"
            />
          </ConfigProvider>
        </Form.Item>
      </div>

      {/* Fila 4: Descripción e Imágenes (mismo espacio) */}
      <div className="grid grid-cols-2 gap-3 mb-0">
        <Form.Item
          name="description"
          label="Descripción"
          rules={[
            {
              required: true,
              message: 'Por favor ingresa la descripción',
            },
          ]}
        >
          <TextArea rows={4} placeholder="Descripción del producto..." />
        </Form.Item>

        <Form.Item
          name="images"
          label="Imágenes del Producto"
          rules={
            !isEditMode
              ? [
                  {
                    required: true,
                    message: 'Por favor sube al menos una imagen',
                  },
                ]
              : []
          }
        >
          <div className="h-full flex flex-col">
            <div className="border border-gray-300 rounded-lg p-2">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleUploadChange}
                onRemove={handleRemove}
                beforeUpload={() => false}
                accept="image/*"
                multiple
                className="[&_.ant-upload-select]:w-16! [&_.ant-upload-select]:h-16! [&_.ant-upload-list-item]:w-16! [&_.ant-upload-list-item]:h-16! [&_.ant-upload-list]:gap-1!"
              >
                {fileList.length < 5 && (
                  <div>
                    <UploadIcon size={14} />
                    <div className="mt-1 text-xs">Subir</div>
                  </div>
                )}
              </Upload>
            </div>
            {isEditMode && (
              <p className="text-xs text-gray-500 mt-1">
                Puedes agregar nuevas imágenes
              </p>
            )}
          </div>
        </Form.Item>
      </div>
    </Form>
  )
}
