'use client'

import { motion } from 'framer-motion'

const Guarantee = () => {
  return (
    <section id="guarantee" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto bg-gray-100 rounded-2xl shadow-xl p-10 text-center border border-gray-200"
        >
          <span className="text-green-500 text-6xl block mb-4">🛡️</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Garantía de 30 Días - 100% Sin Riesgo
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Prueba DigitalizaWEB durante 30 días completos. Explora todas las características, configura tu sitio y mira cómo funciona para tu negocio. Si por cualquier motivo no estás completamente satisfecho, te devolvemos el 100% de tu dinero. Sin preguntas, sin complicaciones.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Guarantee
