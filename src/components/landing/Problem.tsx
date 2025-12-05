'use client'

import { motion } from 'framer-motion'

const problems = [
  "Linktree genérico: Los clientes ven 8 enlaces y no saben cuál elegir. El 60% se va sin hacer nada.",
  "Menú en PDF o Instagram: Difícil de navegar, imposible de actualizar rápido, sin fotos apetitosas organizadas.",
  "Reservas por WhatsApp/Llamadas: Tu equipo pierde 2-3 horas diarias. Errores de doble-reserva. Pierdes el 40% de reservas fuera de horario.",
  "Sin profesionalismo: Tu competencia tiene sitios elegantes. Tú tienes una lista blanca con fuente Arial.",
  "Pagas 3-4 suscripciones: Linktree + Sistema de reservas + Constructor de sitios = 80-120 COP/mes separados."
]

const Problem = () => {
  return (
    <section id="problem" className="relative py-24 bg-gradient-to-b from-white via-red-50/30 to-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-red-200/20 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-200/20 rounded-full filter blur-3xl"></div>

      <div className="relative container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Alert badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-red-100 border border-red-200 rounded-full px-5 py-2 mb-6"
          >
            <span className="text-red-600 text-lg">⚠️</span>
            <span className="text-red-800 text-sm font-semibold">Alerta: Estás perdiendo dinero cada día</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight max-w-4xl mx-auto">
            ¿Tu Negocio Está Atrapado con Herramientas <span className="relative inline-block">
              <span className="relative z-10 text-red-600">Baratas</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-red-200/50 -rotate-1"></span>
            </span> que te Cuestan <span className="relative inline-block">
              <span className="relative z-10 text-red-600">Ventas</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-red-200/50 rotate-1"></span>
            </span>?
          </h2>
        </motion.div>

        <div className="mt-16 max-w-5xl mx-auto grid gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="group relative"
            >
              {/* Gradient border on hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>

              <div className="relative flex items-start space-x-5 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 group-hover:border-red-100 transition-all duration-300">
                {/* Animated icon container */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-md group-hover:bg-red-500/40 transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-br from-red-500 to-rose-600 p-4 rounded-full">
                      <span className="text-white text-2xl">✗</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-gray-800 text-lg md:text-xl leading-relaxed font-medium">
                    {problem}
                  </p>
                </div>

                {/* Decorative number */}
                <div className="hidden md:block flex-shrink-0">
                  <span className="text-6xl font-black text-gray-100 group-hover:text-red-100 transition-colors duration-300">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-2xl md:text-3xl font-bold text-gray-900">
            Hay una <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">mejor forma</span> de hacer esto...
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Problem
