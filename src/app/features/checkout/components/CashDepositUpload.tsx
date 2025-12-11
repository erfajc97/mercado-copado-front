import { useRef, useState } from 'react'
import { Button, message } from 'antd'
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import { Image as ImageIcon } from 'lucide-react'

interface CashDepositUploadProps {
  onImageSelect: (file: File | null) => void
  selectedImage: File | null
}

export const CashDepositUpload = ({
  onImageSelect,
  selectedImage,
}: CashDepositUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      message.error('Por favor, selecciona un archivo de imagen')
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error('La imagen debe ser menor a 5MB')
      return
    }

    onImageSelect(file)

    // Crear preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
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
      <div className="bg-gradient-to-r from-coffee-light/20 to-coffee-medium/20 p-4 rounded-lg border-2 border-coffee-medium">
        <p className="text-sm text-coffee-darker font-semibold mb-2">
          Sube una foto del comprobante de depósito
        </p>
        <p className="text-xs text-gray-600">
          Asegúrate de que la imagen sea clara y muestre todos los detalles del
          comprobante. Formatos aceptados: JPG, PNG, WEBP (máx. 5MB)
        </p>
      </div>

      {!preview && !selectedImage ? (
        <div className="border-2 border-dashed border-coffee-medium rounded-lg p-8 text-center hover:border-coffee-dark transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="deposit-image-upload"
          />
          <label
            htmlFor="deposit-image-upload"
            className="cursor-pointer flex flex-col items-center gap-3"
          >
            <ImageIcon className="text-coffee-medium" size={48} />
            <div>
              <p className="text-coffee-darker font-semibold mb-1">
                Haz clic para subir el comprobante
              </p>
              <p className="text-xs text-gray-500">
                o arrastra y suelta la imagen aquí
              </p>
            </div>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              className="bg-gradient-coffee border-none hover:opacity-90"
            >
              Seleccionar Imagen
            </Button>
          </label>
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
