interface UserAvatarProps {
  firstName?: string
  lastName?: string
  size?: number
  className?: string
}

export default function UserAvatar({
  firstName,
  lastName,
  size = 40,
  className = '',
}: UserAvatarProps) {
  // Obtener iniciales del nombre y apellido
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0).toUpperCase() || ''
    const lastInitial = lastName?.charAt(0).toUpperCase() || ''
    return `${firstInitial}${lastInitial}` || 'U'
  }

  const initials = getInitials()

  return (
    <div
      className={`bg-white text-coffee-dark rounded-full flex items-center justify-center font-bold shadow-coffee ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size * 0.4}px`,
      }}
    >
      {initials}
    </div>
  )
}
