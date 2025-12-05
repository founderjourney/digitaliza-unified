'use client'

import Link from 'next/link'

const Portfolio = () => {
  const demos = [
    { href: "/demo/barberia-premium", text: "💈 Barberia", description: "Estilo masculino premium", color: "bg-amber-800 hover:bg-amber-700" },
    { href: "/demo/italian-premium", text: "🍝 Italiano", description: "Gastronomia italiana", color: "bg-green-700 hover:bg-green-600" },
    { href: "/demo/mexican-premium", text: "🌮 Mexicano", description: "Sabores autenticos", color: "bg-red-600 hover:bg-red-500" },
    { href: "/demo/hamburguesa-premium", text: "🍔 Hamburguesas", description: "Burgers artesanales", color: "bg-orange-600 hover:bg-orange-500" },
    { href: "/demo/spa-premium", text: "🧘 Spa", description: "Bienestar y relajacion", color: "bg-teal-600 hover:bg-teal-500" },
    { href: "/demo/salon-premium", text: "💅 Salon", description: "Belleza profesional", color: "bg-pink-600 hover:bg-pink-500" },
    { href: "/demo/floreria-premium", text: "🌸 Floreria", description: "Arte floral exclusivo", color: "bg-rose-600 hover:bg-rose-500" },
    { href: "/demo/vegetariano-premium", text: "🥗 Vegetariano", description: "Cocina saludable", color: "bg-lime-600 hover:bg-lime-500" },
  ]

  return (
    <section id="portfolio" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Nuestros Templates</h2>
        <p className="text-center text-gray-600 mb-12">
          8 diseños Link-in-Bio para diferentes tipos de negocios. ¡Haz clic para ver una demostración en vivo!
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {demos.map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              className={`text-white text-center font-bold py-5 px-4 rounded-xl shadow-lg transition-all transform hover:scale-105 hover:shadow-xl ${demo.color}`}
            >
              <span className="text-xl block mb-1">{demo.text}</span>
              <span className="text-xs font-normal opacity-80">{demo.description}</span>
            </Link>
          ))}
        </div>
        <p className="text-center text-gray-500 mt-8 text-sm">
          Todos los templates incluyen WhatsApp, llamadas, Instagram y más
        </p>
      </div>
    </section>
  )
}

export default Portfolio
