import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { UploadFile, UploadProps } from 'antd'
import CustomUpload from '@/app/components/CustomUpload/CustomUpload'

interface CashDepositUploadProps {
  onImageSelect: (file: File | null) => void
  selectedImage: File | null
  disabled?: boolean
}

export const CashDepositUpload = ({
  onImageSelect,
  selectedImage,
  disabled = false,
}: CashDepositUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage)
      setPreviewUrl(url)

      return () => {
        URL.revokeObjectURL(url)
      }
    } else {
      setPreviewUrl(null)
    }
  }, [selectedImage])

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.fileList.length === 0) {
      onImageSelect(null)
      return
    }
    const file = info.fileList[0]?.originFileObj
    if (file) {
      onImageSelect(file)
    }
  }

  const handleRemovePreview = () => {
    onImageSelect(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  const fileList: Array<UploadFile> = selectedImage
    ? [
        {
          uid: '-1',
          name: selectedImage.name,
          status: 'done',
          originFileObj: selectedImage as any,
        },
      ]
    : []

  return (
    <div className="space-y-4">
      <div className="bg-linear-to-r from-coffee-light/20 to-coffee-medium/20 p-4 rounded-lg border-2 border-coffee-medium">
        <p className="text-sm text-coffee-darker font-semibold mb-2">
          Sube una foto del comprobante de depósito
        </p>
        <p className="text-xs text-gray-600">
          Asegúrate de que la imagen sea clara y muestre todos los detalles del
          comprobante. Formatos aceptados: JPG, PNG, WEBP (máx. 5MB)
        </p>
      </div>

      {previewUrl && (
        <div className="relative">
          <div className="bg-white rounded-lg border-2 border-coffee-medium p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-coffee-darker">
                Vista previa del comprobante
              </p>
              <button
                type="button"
                onClick={handleRemovePreview}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Eliminar imagen"
              >
                <X size={18} className="text-gray-600" />
              </button>
            </div>
            <div className="relative w-full h-64 bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={previewUrl}
                alt="Preview del comprobante"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{selectedImage?.name}</p>
          </div>
        </div>
      )}

      <CustomUpload
        name="depositImage"
        onChange={handleChange}
        fileList={fileList}
        disabled={disabled}
        maxCount={1}
        allowedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
        maxSizeMB={5}
        uploadText={
          disabled
            ? 'Selecciona una dirección primero'
            : previewUrl
              ? 'Cambiar imagen'
              : 'Haz clic para subir el comprobante'
        }
        uploadHint={
          disabled
            ? 'La dirección de envío es requerida'
            : 'o arrastra y suelta la imagen aquí'
        }
      />
    </div>
  )
}
