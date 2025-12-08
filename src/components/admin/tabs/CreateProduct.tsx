import { useState } from 'react'
import { Button, Form, Input, InputNumber, Select, Upload } from 'antd'
import { Upload as UploadIcon } from 'lucide-react'
import type { UploadFile } from 'antd'
import { useAllCategoriesQuery } from '@/app/features/categories/queries/useCategoriesQuery'
import { useCreateProductMutation } from '@/app/features/products/mutations/useProductMutations'

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
    <div className="p-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-4"
      >
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
          <Input size="large" placeholder="Ej: iPhone 15 Pro" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Descripción"
          rules={[
            { required: true, message: 'Por favor ingresa la descripción' },
          ]}
        >
          <TextArea rows={4} placeholder="Descripción del producto..." />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="price"
            label="Precio"
            rules={[{ required: true, message: 'Por favor ingresa el precio' }]}
          >
            <InputNumber
              size="large"
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
              size="large"
              min={0}
              max={100}
              className="w-full"
              placeholder="0"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="categoryId"
          label="Categoría"
          rules={[
            { required: true, message: 'Por favor selecciona una categoría' },
          ]}
        >
          <Select
            size="large"
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
            size="large"
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
          name="images"
          label="Imágenes del Producto"
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
                <div className="mt-2">Subir</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
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
