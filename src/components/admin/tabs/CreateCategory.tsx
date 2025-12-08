import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { useCreateCategoryMutation } from '@/app/features/categories/mutations/useCreateCategoryMutation'
import { useCreateSubcategoryMutation } from '@/app/features/categories/mutations/useCreateSubcategoryMutation'

export default function CreateCategory() {
  const [form] = Form.useForm()
  const { mutateAsync: createCategory, isPending: isCreatingCategory } =
    useCreateCategoryMutation()
  const { mutateAsync: createSubcategory } = useCreateSubcategoryMutation()
  const [subcategories, setSubcategories] = useState<Array<string>>([''])

  const handleSubmit = async (values: any) => {
    try {
      // Crear la categoría primero
      const category = await createCategory(values.name)

      // Crear las subcategorías si existen
      const subcategoryNames = values.subcategories?.filter(
        (name: string) => name && name.trim() !== '',
      )

      if (subcategoryNames && subcategoryNames.length > 0) {
        await Promise.all(
          subcategoryNames.map((name: string) =>
            createSubcategory({ name: name.trim(), categoryId: category.id }),
          ),
        )
      }

      form.resetFields()
      setSubcategories([''])
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  const addSubcategory = () => {
    setSubcategories([...subcategories, ''])
  }

  const removeSubcategory = (index: number) => {
    if (subcategories.length > 1) {
      setSubcategories(subcategories.filter((_, i) => i !== index))
    }
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
          label="Nombre de la Categoría"
          rules={[
            {
              required: true,
              message: 'Por favor ingresa el nombre de la categoría',
            },
          ]}
        >
          <Input size="large" placeholder="Ej: Electrónica" />
        </Form.Item>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Subcategorías</label>
            <Button type="dashed" onClick={addSubcategory} size="small">
              + Agregar Subcategoría
            </Button>
          </div>
          {subcategories.map((_, index) => (
            <Form.Item
              key={index}
              name={['subcategories', index]}
              rules={[
                { required: true, message: 'Por favor ingresa el nombre' },
              ]}
            >
              <div className="flex gap-2">
                <Input size="large" placeholder={`Subcategoría ${index + 1}`} />
                {subcategories.length > 1 && (
                  <Button
                    danger
                    onClick={() => removeSubcategory(index)}
                    size="large"
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            </Form.Item>
          ))}
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={isCreatingCategory}
            className="bg-gradient-coffee border-none hover:opacity-90"
          >
            Crear Categoría
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
