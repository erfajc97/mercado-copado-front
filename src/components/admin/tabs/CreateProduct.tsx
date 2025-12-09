import { useState } from 'react'
import { Button, Card, Form, Input, InputNumber, Select, Upload } from 'antd'
import { Upload as UploadIcon } from 'lucide-react'
import type { UploadFile } from 'antd'
import { useAllCategoriesQuery } from '@/app/features/categories/queries/useCategoriesQuery'
import { useCreateProductMutation } from '@/app/features/products/mutations/useProductMutations'
import { COUNTRIES } from '@/app/constants/countries'

const { TextArea } = Input

export default function CreateProduct() {
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
        images,
      })
      form.resetFields()
      setFileList([])
      setSelectedCategory('')
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

  const handleUploadChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList)
  }

  return (
    <div className="p-4">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-3"
      >
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
                { required: true, message: 'Por favor ingresa la descripción' },
              ]}
            >
              <TextArea rows={3} placeholder="Descripción del producto..." />
            </Form.Item>
          </div>
        </Card>

        <Card title="Precio y Descuento" className="shadow-sm" size="small">
          <div className="grid grid-cols-2 gap-3">
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
                { required: true, message: 'Por favor ingresa el descuento' },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                className="w-full"
                placeholder="0"
              />
            </Form.Item>
          </div>
        </Card>

        <Card title="Categorización" className="shadow-sm" size="small">
          <div className="space-y-3">
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

        <Card title="Imágenes del Producto" className="shadow-sm" size="small">
          <Form.Item
            name="images"
            rules={[
              { required: true, message: 'Por favor sube al menos una imagen' },
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

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isPending}
            className="bg-gradient-coffee border-none hover:opacity-90"
          >
            Crear Producto
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
