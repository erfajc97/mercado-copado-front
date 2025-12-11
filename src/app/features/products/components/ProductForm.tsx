import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Select, InputNumber } from 'antd'
import type { FormInstance } from 'antd'
import { IoImagesOutline } from 'react-icons/io5'
import { HiOutlinePencil } from 'react-icons/hi2'
import { FaPlus, FaRegTrashCan } from 'react-icons/fa6'
import useFormHook from '../hooks/useFormHook'
import CustomUpload from '@/app/components/CustomUpload/CustomUpload'
import { getAllCategoriesService } from '@/app/features/categories/services/getAllCategoriesService'
import { getSubcategoriesByCategoryService } from '@/app/features/categories/services/getSubcategoriesByCategoryService'

const { TextArea } = Input

interface ProductFormProps {
  form: FormInstance
  productId?: string
  onSuccess?: () => void
  onDelete?: () => void
}

const ProductForm: React.FC<ProductFormProps> = ({
  form,
  productId,
  onSuccess,
  onDelete,
}) => {
  const [categories, setCategories] = useState<any[]>([])
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>()

  const { handleSubmit, handleFieldsChange, fieldErrors, isPending } =
    useFormHook({
      form,
      onSuccess,
    })

  const initialValues = {
    name: '',
    description: '',
    price: null,
    discount: 0,
    categoryId: null,
    subcategoryId: null,
    images: null,
  }

  const handleFinish = async (values: any) => {
    await handleSubmit({ values, id: productId })
  }

  const normFile = (e: any) => {
    return e && e.fileList.length > 0 ? e.fileList : null
  }

  const preventInvalidChars = (e: any) => {
    if (/^[a-zA-Z]$/.test(e.key) || ['+', '-'].includes(e.key)) {
      e.preventDefault()
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategoriesService()
        setCategories(response || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    if (selectedCategoryId) {
      const fetchSubcategories = async () => {
        try {
          const response = await getSubcategoriesByCategoryService(
            selectedCategoryId,
          )
          setSubcategories(response || [])
        } catch (error) {
          console.error('Error fetching subcategories:', error)
        }
      }
      fetchSubcategories()
    } else {
      setSubcategories([])
    }
  }, [selectedCategoryId])

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      onFieldsChange={handleFieldsChange}
      initialValues={initialValues}
      className="flex flex-col py-2 sm:py-4"
      variant="filled"
      noValidate
    >
      <h3 className="text-xl font-semibold pb-6">
        {productId ? 'Editar producto' : 'Crear nuevo producto'}
      </h3>

      {/* Nombre del producto */}
      <Form.Item
        name="name"
        label="Nombre del Producto"
        rules={[{ required: true, message: 'Ingresar el nombre' }]}
      >
        <Input
          placeholder="Ingresa el nombre"
          status={fieldErrors['name'] ? 'error' : ''}
          required
          maxLength={50}
        />
      </Form.Item>

      {/* Categoría y Subcategoría lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="categoryId"
          label="Categoría"
          rules={[
            { required: true, message: 'Seleccionar la categoría' },
          ]}
        >
          <Select
            placeholder="Seleccione la categoría"
            status={fieldErrors['categoryId'] ? 'error' : ''}
            onChange={(value) => {
              setSelectedCategoryId(value)
              form.setFieldsValue({ subcategoryId: null })
            }}
          >
            {categories.map((category) => (
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
            { required: true, message: 'Seleccionar la subcategoría' },
          ]}
        >
          <Select
            placeholder="Seleccione la subcategoría"
            status={fieldErrors['subcategoryId'] ? 'error' : ''}
            disabled={!selectedCategoryId}
          >
            {subcategories.map((subcategory) => (
              <Select.Option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      {/* Precio y Descuento lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="price"
          label="Precio"
          rules={[
            { required: true, message: 'Ingresar el precio' },
            {
              validator: (_, value) => {
                if (isNaN(value) || value < 0) {
                  return Promise.reject('Ingresar números positivos')
                }
                return Promise.resolve()
              },
            },
          ]}
        >
          <InputNumber
            placeholder="Ingresa el precio"
            status={fieldErrors['price'] ? 'error' : ''}
            prefix="$"
            style={{ width: '100%' }}
            min={0}
            maxLength={40}
            onKeyDown={preventInvalidChars}
          />
        </Form.Item>

        <Form.Item
          name="discount"
          label="Descuento (%)"
          rules={[
            {
              validator: (_, value) => {
                if (value && (isNaN(value) || value < 0 || value > 100)) {
                  return Promise.reject(
                    'El descuento debe estar entre 0 y 100',
                  )
                }
                return Promise.resolve()
              },
            },
          ]}
        >
          <InputNumber
            placeholder="Ingresa el descuento (0-100)"
            status={fieldErrors['discount'] ? 'error' : ''}
            style={{ width: '100%' }}
            min={0}
            max={100}
            onKeyDown={preventInvalidChars}
          />
        </Form.Item>
      </div>

      {/* Descripción */}
      <Form.Item
        name="description"
        label="Descripción"
      >
        <TextArea
          placeholder="Ingresa la descripción"
          status={fieldErrors['description'] ? 'error' : ''}
          rows={4}
          maxLength={500}
        />
      </Form.Item>

      {/* Imágenes */}
      <Form.Item
        label="Imágenes del producto"
        name="images"
        getValueFromEvent={normFile}
        rules={[
          {
            required: productId ? false : true,
            message: 'Insertar al menos una imagen del producto',
          },
        ]}
      >
        <CustomUpload
          uploadIcon={
            <IoImagesOutline fontSize={35} color="#a1a1aa" />
          }
          uploadText="Inserte las imágenes"
          uploadHint="Formatos permitidos: PNG, JPG, JPEG. Máximo 10MB por imagen"
          allowedTypes={['image/png', 'image/jpeg', 'image/jpg']}
          maxSizeMB={10}
          form={form}
          multiple
          name="images"
        />
      </Form.Item>

      <div className="flex flex-col sm:flex-row gap-x-4 sm:items-center mt-4">
        <div className="flex gap-x-2 ml-auto">
          {productId && (
            <Button
              danger
              onClick={onDelete}
              icon={<FaRegTrashCan />}
            >
              Eliminar producto
            </Button>
          )}
          <Button
            type="primary"
            htmlType="submit"
            loading={isPending}
            icon={productId ? <HiOutlinePencil /> : <FaPlus />}
          >
            {productId ? 'Editar' : 'Crear'} producto
          </Button>
        </div>
      </div>
    </Form>
  )
}

export default ProductForm

