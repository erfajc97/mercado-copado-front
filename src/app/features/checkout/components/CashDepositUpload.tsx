import { useRef, useState } from 'react'
import { Button, message } from 'antd'
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import { Image as ImageIcon } from 'lucide-react'

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
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateAndSetFile = (file: File) => {
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      message.error('Por favor, selecciona un archivo de imagen')
      return false
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error('La imagen debe ser menor a 5MB')
      return false
    }

    onImageSelect(file)

    // Crear preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    validateAndSetFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleRemove = () => {
    onImageSelect(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

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

      {!preview && !selectedImage ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            disabled
              ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
              : isDragging
                ? 'border-coffee-dark bg-coffee-light/20'
                : 'border-coffee-medium hover:border-coffee-dark'
          }`}
          onDragOver={disabled ? undefined : handleDragOver}
          onDragLeave={disabled ? undefined : handleDragLeave}
          onDrop={disabled ? undefined : handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
            id="deposit-image-upload"
            disabled={disabled}
          />
          <div className="flex flex-col items-center gap-3">
            <ImageIcon
              className={disabled ? 'text-gray-400' : 'text-coffee-medium'}
              size={48}
            />
            <div>
              <p
                className={`font-semibold mb-1 ${
                  disabled ? 'text-gray-400' : 'text-coffee-darker'
                }`}
              >
                {disabled
                  ? 'Selecciona una dirección primero'
                  : isDragging
                    ? 'Suelta la imagen aquí'
                    : 'Haz clic para subir el comprobante'}
              </p>
              <p className="text-xs text-gray-500">
                {disabled
                  ? 'La dirección de envío es requerida'
                  : 'o arrastra y suelta la imagen aquí'}
              </p>
            </div>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              className="bg-gradient-coffee border-none hover:opacity-90"
              disabled={disabled}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (!disabled) {
                  fileInputRef.current?.click()
                }
              }}
            >
              Seleccionar Imagen
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="border-2 border-coffee-medium rounded-lg p-4 bg-white">
            <div className="flex items-start gap-4">
              <img
                src={
                  preview ||
                  (selectedImage ? URL.createObjectURL(selectedImage) : '')
                }
                alt="Preview del comprobante"
                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-coffee-darker mb-1">
                  Comprobante seleccionado
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  {selectedImage?.name || 'Imagen cargada'}
                </p>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleRemove}
                  size="small"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
