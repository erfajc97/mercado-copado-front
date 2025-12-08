import { useState } from 'react'
import { useLoginHook } from '../hooks/useLoginHook'
import type { FieldType } from '../types'

export const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [formData, setFormData] = useState<FieldType>({
    email: '',
    password: '',
  })
  const { handleLogin, isPending } = useLoginHook({ onSuccess })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) return

    try {
      await handleLogin({
        email: formData.email,
        password: formData.password,
      })
    } catch (error) {
      // Error ya manejado en el hook
    }
  }

  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'
    window.location.href = `${apiUrl}/auth/google`
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
      >
        Iniciar sesión con Google
      </button>
    </form>
  )
}

