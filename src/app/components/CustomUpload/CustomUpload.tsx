import React from 'react'
import { InboxOutlined } from '@ant-design/icons'
import type { FormInstance, UploadProps } from 'antd'
import { message, Upload } from 'antd'

const { Dragger } = Upload

interface CustomUploadProps extends UploadProps {
  uploadText?: React.ReactNode
  uploadHint?: React.ReactNode
  uploadIcon?: React.ReactNode
  form?: FormInstance<any>
  allowedTypes?: string[]
  maxSizeMB?: number
}

const CustomUpload: React.FC<CustomUploadProps> = ({
  multiple = false,
  form,
  uploadText = 'Haga clic o arrastre el archivo a esta área para cargarlo',
  uploadHint = 'Soporte para carga individual o múltiple. Está prohibido cargar datos de la empresa u otros archivos prohibidos.',
  uploadIcon = <InboxOutlined />,
  allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'],
  maxSizeMB = 10,
  ...restProps
}) => {
  const handleChange: UploadProps['onChange'] = (info) => {
    form?.setFieldsValue({ [restProps.name as string]: info.fileList })
    const { status } = info.file

    if (status === 'done') {
      message.success(`${info.file.name} se ha cargado exitosamente.`)
    } else if (status === 'error') {
      message.error(`${info.file.name} falló al cargar.`)
    }
  }

  const dummyRequest = async ({
    file,
    onSuccess,
  }: {
    file: any
    onSuccess: any
  }) => {
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }

  const beforeUpload = (file: File) => {
    const isAllowedType = allowedTypes.includes(file.type)
    if (!isAllowedType) {
      message.error(
        `Solo se permiten archivos de tipo: ${allowedTypes.join(', ')}`,
      )
      form?.setFields([
        {
          name: restProps.name as string,
          errors: [`Tipo de archivo no permitido: ${file.name}`],
        },
      ])
      return Upload.LIST_IGNORE
    }

    const isLtMaxSize = file.size / 1024 / 1024 < maxSizeMB
    if (!isLtMaxSize) {
      message.error(`El archivo debe pesar menos de ${maxSizeMB}MB`)
      form?.setFields([
        {
          name: restProps.name as string,
          errors: [`Archivo demasiado grande: ${file.name}`],
        },
      ])
      return Upload.LIST_IGNORE
    }

    return true
  }

  return (
    <Dragger
      multiple={multiple}
      customRequest={dummyRequest as UploadProps['customRequest']}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      {...restProps}
    >
      <div className="ant-upload-drag-icon mb-2 flex justify-center">
        {uploadIcon}
      </div>
      <p className="ant-upload-text">{uploadText}</p>
      <p className="ant-upload-hint">{uploadHint}</p>
    </Dragger>
  )
}

export default CustomUpload

