import {
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
      className="mt-2"
    >
      {/* Grupo 1: Nombre (ancho completo) - campo principal */}
      <div className="mb-4">
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
          <Input placeholder="Ej: iPhone 15 Pro" size="large" />
        </Form.Item>
      </div>

      {/* Grupo 2: Precio y Descuento (lado a lado) - relacionados con precio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            size="large"
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
            size="large"
          />
        </Form.Item>
      </div>

      {/* Grupo 3: Descripción (campo largo) */}
      <div className="mb-4">
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
          <TextArea rows={3} placeholder="Descripción del producto..." />
        </Form.Item>
      </div>

      {/* Grupo 4: Categorización (3 columnas) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
            size="large"
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
            size="large"
          >
            {subcategories.map((subcat: any) => (
              <Select.Option key={subcat.id} value={subcat.id}>
                {subcat.name}
              </Select.Option>
            ))}
          </Select>
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
            size="large"
          />
        </Form.Item>
      </div>

      {/* Grupo 5: Estado (Producto Activo) - switch solo */}
      <div className="mb-4">
        <Form.Item
          name="isActive"
          label="Producto Activo"
          valuePropName="checked"
          initialValue={!isEditMode ? true : undefined}
        >
          <Switch
            checkedChildren="Activo"
            unCheckedChildren="Inactivo"
          />
        </Form.Item>
      </div>

      {/* Grupo 6: Imágenes */}
      <div className="mb-4">
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
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            onRemove={handleRemove}
            beforeUpload={() => false}
            accept="image/*"
            multiple
          >
            {fileList.length < 5 && (
              <div>
                <UploadIcon size={20} />
                <div className="mt-2 text-xs">Subir</div>
              </div>
            )}
          </Upload>
          {isEditMode && (
            <p className="text-xs text-gray-500 mt-2">
              Puedes agregar nuevas imágenes. Las imágenes existentes se
              mantendrán.
            </p>
          )}
        </Form.Item>
      </div>
    </Form>
  )
}
