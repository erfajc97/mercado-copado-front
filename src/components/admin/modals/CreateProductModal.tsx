import { useState } from 'react'
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  Upload,
} from 'antd'
import { Upload as UploadIcon } from 'lucide-react'
import type { UploadFile } from 'antd'
import { useAllCategoriesQuery } from '@/app/features/categories/queries/useCategoriesQuery'
import { useCreateProductMutation } from '@/app/features/products/mutations/useProductMutations'
import { COUNTRIES } from '@/app/constants/countries'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

const { TextArea } = Input

interface CreateProductModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateProductModal({
  isOpen,
  onClose,
}: CreateProductModalProps) {
  const [form] = Form.useForm()
  const { data: categories } = useAllCategoriesQuery()
  const { mutateAsync: createProduct, isPending } = useCreateProductMutation()
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [fileList, setFileList] = useState<Array<UploadFile>>([])

  const subcategories =
    categories?.find((cat: any) => cat.id === selectedCategory)
      ?.subcategories || []

  const handleSubmit = async (values: any) => {
    try {
      const images = fileList
        .map((file) => file.originFileObj)
        .filter((file) => file !== undefined) as Array<File>

      await createProduct({
        name: values.name,
        description: values.description,
        price: Number(values.price),
        discount: values.discount ? Number(values.discount) : 0,
        categoryId: values.categoryId,
        subcategoryId: values.subcategoryId,
        country: values.country,
        isActive: values.isActive !== undefined ? values.isActive : true,
        images,
      })
      form.resetFields()
      setFileList([])
      setSelectedCategory('')
      sonnerResponse('Producto creado exitosamente', 'success')
      onClose()
    } catch (error) {
      console.error('Error creating product:', error)
      sonnerResponse('Error al crear el producto', 'error')
    }
  }

  const handleUploadChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList)
  }

  const handleCancel = () => {
    form.resetFields()
    setFileList([])
    setSelectedCategory('')
    onClose()
  }

  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={700}
      centered
      styles={{
        body: {
          borderRadius: '12px',
          maxHeight: '90vh',
          overflowY: 'auto',
        },
      }}
    >
      <div className="py-2">
        <h2 className="text-xl font-bold text-coffee-darker mb-4 text-center">
          Nuevo Producto
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
        >
          {/* Información Básica y Precio en una fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card title="Información Básica" className="shadow-sm" size="small">
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
                  <TextArea
                    rows={4}
                    placeholder="Descripción del producto..."
                  />
                </Form.Item>
              </div>
            </Card>

            <Card title="Precio y Estado" className="shadow-sm" size="small">
              <div className="space-y-3">
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
                  initialValue={true}
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
            <Form.Item
              name="images"
              rules={[
                {
                  required: true,
                  message: 'Por favor sube al menos una imagen',
                },
              ]}
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleUploadChange}
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
              Crear Producto
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  )
}
