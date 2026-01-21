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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-2">
        <Form.Item
          name="name"
          label={<span className="text-xs sm:text-sm">Nombre del Producto</span>}
          rules={[
            {
              required: true,
              message: 'Ingresa el nombre',
            },
          ]}
          className="mb-0"
        >
          <Input placeholder="Ej: iPhone 15 Pro" />
        </Form.Item>

        <Form.Item
          name="country"
          label={<span className="text-xs sm:text-sm">País</span>}
          rules={[
            { required: true, message: 'Selecciona un país' },
          ]}
          className="mb-0"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-2">
        <Form.Item
          name="categoryId"
          label={<span className="text-xs sm:text-sm">Categoría</span>}
          rules={[
            {
              required: true,
              message: 'Selecciona una categoría',
            },
          ]}
          className="mb-0"
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
          label={<span className="text-xs sm:text-sm">Subcategoría</span>}
          rules={[
            {
              required: true,
              message: 'Selecciona una subcategoría',
            },
          ]}
          className="mb-0"
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

      {/* Fila 3: Precio, Descuento y Switch */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-2">
        <Form.Item
          name="price"
          label={<span className="text-xs sm:text-sm">Precio</span>}
          rules={[
            { required: true, message: 'Ingresa el precio' },
          ]}
          className="mb-0"
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
          label={<span className="text-xs sm:text-sm">Descuento</span>}
          rules={[
            {
              required: true,
              message: 'Ingresa descuento',
            },
          ]}
          className="mb-0"
        >
          <InputNumber
            min={0}
            max={100}
            className="w-full"
            placeholder="0"
            suffix="%"
          />
        </Form.Item>

        <Form.Item
          name="isActive"
          label={<span className="text-xs sm:text-sm">Activo</span>}
          valuePropName="checked"
          initialValue={!isEditMode ? true : undefined}
          className="mb-0"
        >
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#D4A574',
              },
            }}
          >
            <Switch
              checkedChildren="Sí"
              unCheckedChildren="No"
              size="small"
            />
          </ConfigProvider>
        </Form.Item>
      </div>

      {/* Fila 4: Descripción e Imágenes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-0">
        <Form.Item
          name="description"
          label={<span className="text-xs sm:text-sm">Descripción</span>}
          rules={[
            {
              required: true,
              message: 'Ingresa la descripción',
            },
          ]}
          className="mb-0"
        >
          <TextArea rows={3} placeholder="Descripción del producto..." />
        </Form.Item>

        <Form.Item
          name="images"
          label={<span className="text-xs sm:text-sm">Imágenes</span>}
          rules={
            !isEditMode
              ? [
                  {
                    required: true,
                    message: 'Sube al menos una imagen',
                  },
                ]
              : []
          }
          className="mb-0"
        >
          <div className="border border-gray-300 rounded-lg p-2 max-h-[120px] overflow-y-auto">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              onRemove={handleRemove}
              beforeUpload={() => false}
              accept="image/*"
              multiple
              className="[&_.ant-upload-select]:w-14! [&_.ant-upload-select]:h-14! [&_.ant-upload-list-item]:w-14! [&_.ant-upload-list-item]:h-14! [&_.ant-upload-list]:gap-1!"
            >
              {fileList.length < 5 && (
                <div className="text-center">
                  <UploadIcon size={12} />
                  <div className="text-[10px]">Subir</div>
                </div>
              )}
            </Upload>
          </div>
        </Form.Item>
      </div>
    </Form>
  )
}
