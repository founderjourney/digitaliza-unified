'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const valueStack = [
  { tool: "Linktree Premium", cost: "288 COP /año" },
  { tool: "Sistema de Reservas (Calendly/Booksy)", cost: "600 COP /año" },
  { tool: "Constructor de Sitios (Wix/Squarespace)", cost: "360 COP /año" },
  { tool: "Email Marketing básico", cost: "180 COP /año" },
]
const totalValue = "1,428 COP /año"

const Pricing = () => {
  return (
    <section id="pricing" className="relative py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-green-400/10 to-cyan-400/10 rounded-full filter blur-3xl"></div>

      <div className="relative container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full px-6 py-2 mb-8 shadow-lg"
          >
            <span className="text-lg">⭐</span>
            <span className="text-sm font-bold">Precio de Lanzamiento</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight max-w-4xl mx-auto">
            Una <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Inversión Inteligente</span>, No un Gasto Más
          </h2>
        </motion.div>

        {/* Value Anchor */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <h3 className="font-bold text-2xl text-center text-gray-900 mb-8">
            💰 Si pagaras por separado:
          </h3>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <table className="w-full">
                <tbody>
                  {valueStack.map((item, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="border-b border-gray-200 last:border-none"
                    >
                      <td className="py-4 text-gray-700 text-lg">{item.tool}</td>
                      <td className="py-4 font-bold text-gray-900 text-right text-lg">{item.cost}</td>
                    </motion.tr>
                  ))}
                  <tr className="border-t-4 border-red-200">
                    <td className="py-6 font-black text-2xl text-gray-900">TOTAL</td>
                    <td className="py-6 font-black text-2xl text-red-600 line-through text-right">{totalValue}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Pricing Options */}
        <div className="mt-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-black text-center text-gray-900 mb-12"
          >
            🎯 TU PRECIO HOY:
          </motion.h2>

          <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Monthly Option */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-3xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>

              <div className="relative bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-10 flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-2">OPCIÓN 1: Pago Mensual</h3>
                  <p className="text-gray-500">Flexibilidad total</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-7xl font-black text-gray-900">47</span>
                    <span className="text-2xl font-bold text-gray-500 ml-2">COP/mes</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {['Sin contrato', 'Cancela cuando quieras', 'Soporte incluido'].map((benefit, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-bold">✓</span>
                      </div>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className="w-full inline-block bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold text-xl px-8 py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                >
                  Crear Mi Digitaliza (Mensual)
                </Link>
              </div>
            </motion.div>

            {/* One-Time Option - RECOMMENDED */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              {/* Glowing effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 animate-glow"></div>

              {/* Popular badge */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full shadow-lg font-bold text-sm flex items-center space-x-2">
                  <span>⭐</span>
                  <span>MÁS POPULAR</span>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-3xl shadow-2xl p-10 flex flex-col h-full text-white">
                <div className="mb-6">
                  <h3 className="text-2xl font-black mb-2">OPCIÓN 2: Pago Único</h3>
                  <div className="inline-block bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    ⚡ Ahorra 58%
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-7xl font-black">497</span>
                    <span className="text-2xl font-bold text-blue-200 ml-2">COP</span>
                  </div>
                  <p className="text-center text-blue-200 text-lg mt-2">Una sola vez - Para siempre</p>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {[
                    'Acceso de por vida',
                    'Actualizaciones gratis siempre',
                    'Soporte prioritario',
                    'Nuevas funciones incluidas',
                    'Sin pagos recurrentes'
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <span className="text-white font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className="w-full inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-xl px-8 py-6 rounded-2xl shadow-2xl hover:shadow-green-500/50 transition-all duration-300 text-center transform hover:-translate-y-1"
                >
                  Crear Mi Digitaliza (Pago Unico)
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 mb-4">✓ Garantía de 30 días | ✓ Soporte en español | ✓ Sin costos ocultos</p>
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing
