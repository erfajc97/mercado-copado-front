import { Link } from '@tanstack/react-router'
import { Facebook, Instagram, Mail, Phone, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-coffee-dark text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src="/box.png"
                  alt="Mercado Copado"
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <span className="font-bold text-xl">Mercado Copado</span>
            </div>
            <p className="text-white/80 text-sm mb-4">
              Tu tienda en línea de confianza. Encuentra los mejores productos
              con la mejor calidad y al mejor precio.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-bold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Carrito
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Mis Pedidos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-white/80">
                <Mail size={16} />
                <a
                  href="mailto:contacto@mercadocopado.com"
                  className="hover:text-white transition-colors"
                >
                  contacto@mercadocopado.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/80">
                <Phone size={16} />
                <a
                  href="tel:+1234567890"
                  className="hover:text-white transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm text-white/60">
          <p>
            © {new Date().getFullYear()} Mercado Copado. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
