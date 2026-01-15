import { useEffect } from 'react'
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
} from 'antd'
import { Upload as UploadIcon } from 'lucide-react'
import { COUNTRIES } from '@/app/constants/countries'
import { useEditProductModalHook } from '../../hooks/useEditProductModalHook'
import CustomModalNextUI from '@/components/UI/customModalNextUI/CustomModalNextUI'

const { TextArea } = Input

interface EditProductModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string | null
}

export default function EditProductModal({
  isOpen,
  onClose,
  productId,
}: EditProductModalProps) {
  const [form] = Form.useForm()
  const {
    categories,
    subcategories,
    selectedCategory,
    setSelectedCategory,
    fileList,
    handleSubmit,
    handleUploadChange,
    handleRemove,
    resetForm,
    isPending,
    isLoadingProduct,
    getInitialValues,
  } = useEditProductModalHook(productId, isOpen)

  useEffect(() => {
    if (isOpen) {
      const initialValues = getInitialValues()
      if (Object.keys(initialValues).length > 0) {
        form.setFieldsValue(initialValues)
      }
    }
  }, [isOpen, form, getInitialValues])

  const handleFormSubmit = async (values: any) => {
    const success = await handleSubmit(values)
    if (success) {
      handleCancel()
    }
  }

  const handleCancel = () => {
    form.resetFields()
    resetForm()
    onClose()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCancel()
    }
  }

  if (!productId) return null

  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      isDismissable
      size="5xl"
      placement="center"
      headerContent="Editar Producto"
    >
      {isLoadingProduct ? (
        <div className="text-center py-8">Cargando producto...</div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          className="space-y-4"
        >
          {/* Información Básica y Precio en una fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              title="Información Básica"
              className="shadow-sm"
              size="small"
            >
              <div className="space-y-3">
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
              </div>
            </Card>

            <Card title="Precio y Estado" className="shadow-sm" size="small">
              <div className="space-y-3">
                <Form.Item
                  name="price"
                  label="Precio"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor ingresa el precio',
                    },
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
                >
                  <Switch
                    checkedChildren="Activo"
                    unCheckedChildren="Inactivo"
                  />
                </Form.Item>
              </div>
            </Card>
          </div>

          {/* Categorización en una fila */}
          <Card title="Categorización" className="shadow-sm" size="small">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                  onChange={(value) => setSelectedCategory(value)}
                >
                  {categories?.map((category: any) => (
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
          </Card>

          {/* Imágenes */}
          <Card
            title="Imágenes del Producto"
            className="shadow-sm"
            size="small"
          >
            <Form.Item name="images">
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
              <p className="text-xs text-gray-500 mt-2">
                Puedes agregar nuevas imágenes. Las imágenes existentes se
                mantendrán.
              </p>
            </Form.Item>
          </Card>

          <div className="flex gap-3 mt-4">
            <Button onClick={handleCancel} className="flex-1">
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              className="flex-1 bg-gradient-coffee border-none hover:opacity-90"
            >
              Guardar Cambios
            </Button>
          </div>
        </Form>
      )}
    </CustomModalNextUI>
  )
}
