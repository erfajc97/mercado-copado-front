import type { FormInstance, FormProps } from 'antd'
import { useCreateProductMutation } from '@/app/features/products/mutations/useCreateProductMutation'
import { useForm } from '@/app/hooks/useForm'

type UseFormHookProps = {
  form?: FormInstance
  onSuccess?: () => void
}

const useFormHook = ({ form, onSuccess }: UseFormHookProps) => {
  const { handleFieldsChange, fieldErrors } = useForm({ form })
  const { mutateAsync: createProduct, isPending } = useCreateProductMutation()

  const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const handleSubmit = async ({ values, id }: { values: any; id?: string }) => {
    try {
      // Extraer archivos de las imágenes
      const images: Array<File> = []
      if (values.images && values.images.length > 0) {
        values.images.forEach((fileItem: any) => {
          if (fileItem.originFileObj) {
            images.push(fileItem.originFileObj)
          } else if (fileItem instanceof File) {
            images.push(fileItem)
          }
        })
      }

      const formattedValues = {
        name: values.name,
        description: values.description || '',
        price: Number(values.price),
        discount: values.discount ? Number(values.discount) : 0,
        categoryId: values.categoryId,
        subcategoryId: values.subcategoryId,
        images: images.length > 0 ? images : undefined,
      }

      await createProduct(formattedValues)
      form?.resetFields()
      onSuccess?.()
    } catch (error) {
      console.error('Failed to create product:', error)
    }
  }

  return {
    handleSubmit,
    onFinishFailed,
    handleFieldsChange,
    fieldErrors,
    isPending,
  }
}

export default useFormHook
