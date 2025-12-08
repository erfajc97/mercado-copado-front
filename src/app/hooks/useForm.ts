import { useState } from 'react'
import type { FormInstance } from 'antd'

interface useFormProps {
  form?: FormInstance
}

export const useForm = ({ form }: useFormProps) => {
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({})

  const handleFieldsChange = () => {
    if (form) {
      const errors = form.getFieldsError().reduce(
        (acc, { name, errors }) => {
          if (name.length > 0) {
            acc[name[0]] = errors.length > 0
          }
          return acc
        },
        {} as { [key: string]: boolean },
      )

      setFieldErrors(errors)
    }
  }

  const handleSelectionChange = (
    fieldName: string,
    keys: any,
    error: string,
  ) => {
    const selectedKey = keys ? keys : null
    form?.setFieldsValue({ [fieldName]: selectedKey })

    if (selectedKey) {
      form
        ?.validateFields([fieldName])
        .then(() => {
          form.setFields([{ name: fieldName, errors: [] }])
          setFieldErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: false,
          }))
        })
        .catch(() => {})
    } else {
      form?.setFields([{ name: fieldName, errors: [`${error}`] }])
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: true,
      }))
    }
  }

  const preventInvalidChars = (e: any) => {
    if (/^[a-zA-Z]$/.test(e.key) || ['+', '-', '.', ','].includes(e.key)) {
      e.preventDefault()
    }
  }

  const normFile = (e: any) => {
    return e && e.fileList.length > 0 ? e.fileList : null
  }

  return {
    handleFieldsChange,
    fieldErrors,
    setFieldErrors,
    handleSelectionChange,
    preventInvalidChars,
    normFile,
  }
}

