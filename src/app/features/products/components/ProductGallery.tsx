import { useState } from 'react'

interface ProductGalleryProps {
  images: Array<{ id: string; url: string }>
}

export const ProductGallery = ({ images }: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(images[0]?.url || '')

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400">Sin imágenes</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-gray-100 overflow-hidden rounded-lg">
        <img
          src={selectedImage}
          alt="Producto"
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image.url)}
              className={`aspect-square rounded overflow-hidden border-2 ${
                selectedImage === image.url
                  ? 'border-blue-500'
                  : 'border-transparent'
              }`}
            >
              <img
                src={image.url}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

