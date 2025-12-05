'use client'

import Link from 'next/link'

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Digitaliza<span className="text-blue-600">WEB</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/demo"
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            Ver Ejemplos
          </Link>
          <Link
            href="/register"
            className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Crear Mi Digitaliza
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
