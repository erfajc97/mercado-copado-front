import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface ProductGalleryProps {
  images: Array<{ id: string; url: string }>
}

export const ProductGallery = ({ images }: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(images[0]?.url || '')
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0)
  const maxVisibleThumbnails = 5

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded-lg shadow-md">
        <span className="text-gray-400">Sin imágenes</span>
      </div>
    )
  }

  const visibleThumbnails = images.slice(
    thumbnailStartIndex,
    thumbnailStartIndex + maxVisibleThumbnails,
  )
  const canScrollUp = thumbnailStartIndex > 0
  const canScrollDown =
    thumbnailStartIndex + maxVisibleThumbnails < images.length

  const handleThumbnailUp = () => {
    if (canScrollUp) {
      setThumbnailStartIndex(Math.max(0, thumbnailStartIndex - 1))
    }
  }

  const handleThumbnailDown = () => {
    if (canScrollDown) {
      setThumbnailStartIndex(
        Math.min(images.length - maxVisibleThumbnails, thumbnailStartIndex + 1),
      )
    }
  }

  return (
    <div className="flex gap-4">
      {/* Thumbnails verticales a la izquierda */}
      {images.length > 1 && (
        <div className="flex flex-col gap-2">
          {canScrollUp && (
            <button
              onClick={handleThumbnailUp}
              className="w-16 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              aria-label="Scroll thumbnails up"
            >
              <ChevronUp size={16} className="text-gray-600" />
            </button>
          )}
          <div className="flex flex-col gap-2 max-h-[500px] overflow-hidden">
            {visibleThumbnails.map((image) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(image.url)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === image.url
                    ? 'border-coffee-medium shadow-md scale-105'
                    : 'border-gray-200 hover:border-coffee-light'
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
          {canScrollDown && (
            <button
              onClick={handleThumbnailDown}
              className="w-16 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              aria-label="Scroll thumbnails down"
            >
              <ChevronDown size={16} className="text-gray-600" />
            </button>
          )}
        </div>
      )}

      {/* Imagen principal */}
      <div className="flex-1 relative">
        <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 group">
          <img
            src={selectedImage}
            alt="Producto"
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        {/* Indicador de cantidad de imágenes */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
            {images.findIndex((img) => img.url === selectedImage) + 1} /{' '}
            {images.length}
          </div>
        )}
      </div>
    </div>
  )
}
