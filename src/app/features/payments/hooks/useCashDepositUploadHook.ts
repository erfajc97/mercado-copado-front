import { useState } from 'react'
import { message } from 'antd'

export const useCashDepositUploadHook = () => {
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const validateAndSetFile = (
    file: File,
    onImageSelect: (file: File | null) => void,
  ): boolean => {
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

  const handleFileSelect = (
    file: File,
    onImageSelect: (file: File | null) => void,
  ) => {
    validateAndSetFile(file, onImageSelect)
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

  const handleDrop = (
    e: React.DragEvent,
    onImageSelect: (file: File | null) => void,
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0], onImageSelect)
    }
  }

  const handleRemove = (
    onImageSelect: (file: File | null) => void,
    fileInputRef: React.RefObject<HTMLInputElement | null>,
  ) => {
    onImageSelect(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return {
    preview,
    isDragging,
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemove,
  }
}
