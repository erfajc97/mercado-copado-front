import { useState, useEffect } from 'react'

type DeviceType = 'mobile' | 'tablet' | 'desktop' | undefined

const getDeviceType = (): DeviceType => {
  if (typeof window === 'undefined') return undefined

  const width = window.innerWidth

  if (width < 768) {
    return 'mobile'
  } else if (width < 1024) {
    return 'tablet'
  } else {
    return 'desktop'
  }
}

const useDeviceType = (): DeviceType => {
  const [deviceType, setDeviceType] = useState<DeviceType>(() => getDeviceType())

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceType())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return deviceType
}

export default useDeviceType
