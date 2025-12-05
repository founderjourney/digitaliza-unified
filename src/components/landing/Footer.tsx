'use client'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-10">
        <div className="md:flex md:justify-between items-center text-center md:text-left">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold">
              Digitaliza<span className="text-blue-500">WEB</span>
            </h2>
            <p className="text-gray-400 mt-2">Toma el control de tu presencia digital.</p>
          </div>
          <div className="flex flex-col items-center md:items-end space-y-2">
             <a href="mailto:hola@digitalizaweb.com" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300">
              <span>📧</span>
              <span>hola@digitalizaweb.com</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300">
              <span>📱</span>
              <span>+52 XXX XXX XXXX</span>
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-500">
          <p>&copy; {year} DigitalizaWEB. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
