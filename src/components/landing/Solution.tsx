'use client'

import { motion } from 'framer-motion'

const features = [
  {
    icon: "📋",
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-500/10",
    title: "Menú Digital / Catálogo Profesional",
    description: "Actualiza precios, fotos y descripciones en 30 segundos. Fotos HD que aumentan ticket promedio 25-40%."
  },
  {
    icon: "📅",
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-500/10",
    title: "Sistema de Reservas 24/7 Automatizado",
    description: "Clientes reservan automáticamente. Bloqueo inteligente evita doble-reservas. Recordatorios automáticos reducen no-shows 70%."
  },
  {
    icon: "🎨",
    color: "from-indigo-500 to-purple-600",
    bgColor: "bg-indigo-500/10",
    title: "Sitio Web Personalizado con Tu Marca",
    description: "Tu logo, colores, estilo. Dominio propio opcional (mirestaurante.com). Showcase de equipo y testimonios."
  },
  {
    icon: "⚡",
    color: "from-yellow-500 to-orange-600",
    bgColor: "bg-yellow-500/10",
    title: "Carga Instantánea en Móvil",
    description: "Menos de 2 segundos. El 78% de tus clientes usa celular. No pierdas ventas por lentitud."
  },
  {
    icon: "📧",
    color: "from-red-500 to-rose-600",
    bgColor: "bg-red-500/10",
    title: "Captura de Datos de Clientes",
    description: "Construye TU base de datos (emails, teléfonos, preferencias) para marketing directo. No de Uber Eats, no de Linktree."
  },
  {
    icon: "📱",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-500/10",
    title: "Código QR Inteligente",
    description: "Diseñado gratis con tu marca. Imprime en mesas, tarjetas, escaparate. Cliente escanea → Ve menú → Reserva instantáneamente."
  }
]

const Solution = () => {
  return (
    <section id="solution" className="relative py-24 bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(139,92,246,0.1),transparent_50%)]"></div>

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full filter blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full filter blur-3xl animate-float" style={{animationDelay: '1s'}}></div>

      <div className="relative container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full px-6 py-2 mb-8 shadow-lg"
          >
            <span className="text-lg">✓</span>
            <span className="text-sm font-bold">La Solución que Necesitas</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight max-w-4xl mx-auto">
            Presentamos <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">DigitalizaWEB</span>
              <span className="absolute bottom-2 left-0 w-full h-4 bg-blue-200/50 -rotate-1"></span>
            </span>
            : Todo-en-Uno Profesional
          </h2>
          <p className="mt-6 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            La plataforma diseñada para Restaurantes, Salones, Spas y Negocios de Servicio que quieren automatizar reservas y verse profesionales.
          </p>
        </motion.div>

        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              {/* Glowing border effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-3xl opacity-0 group-hover:opacity-100 blur transition duration-500`}></div>

              {/* Glass card */}
              <div className="relative h-full bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                {/* Icon container with gradient */}
                <div className="relative mb-6">
                  <div className={`absolute inset-0 ${feature.bgColor} rounded-2xl blur-md group-hover:blur-lg transition-all duration-300`}></div>
                  <div className={`relative bg-gradient-to-br ${feature.color} p-4 rounded-2xl inline-block`}>
                    <div className="text-white text-3xl">
                      {feature.icon}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative corner */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-2xl"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-25"></div>
            <div className="relative bg-white border border-blue-100 rounded-2xl px-8 py-6 shadow-xl">
              <p className="text-2xl md:text-3xl font-bold text-gray-900">
                Todo esto en <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">una sola plataforma</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Solution
