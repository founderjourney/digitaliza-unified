'use client'

import { motion } from 'framer-motion'

const comparisonData = [
  {
    feature: "Diseño",
    oldWay: { text: "Genérico, lista blanca" },
    newWay: { text: "100% personalizado con tu marca" }
  },
  {
    feature: "Menú Digital",
    oldWay: { text: "Solo enlaces a PDF" },
    newWay: { text: "Menú completo con fotos HD organizadas" }
  },
  {
    feature: "Reservas 24/7",
    oldWay: { text: "Llamadas manuales" },
    newWay: { text: "Sistema automatizado inteligente" }
  },
  {
    feature: "Captura de Clientes",
    oldWay: { text: "No disponible" },
    newWay: { text: "Base de datos completa" }
  },
  {
    feature: "Actualización",
    oldWay: { text: "Lento (re-subir PDF)" },
    newWay: { text: "Instantánea (30 segundos)" }
  },
  {
    feature: "SEO Google",
    oldWay: { text: "Malo" },
    newWay: { text: "Optimizado" }
  },
  {
    feature: "Dominio Propio",
    oldWay: { text: "linktr.ee/negocio" },
    newWay: { text: "tunegocio.com" }
  },
  {
    feature: "Soporte",
    oldWay: { text: "Tickets (3-5 días)" },
    newWay: { text: "WhatsApp/Email (<2 horas)" }
  },
  {
    feature: "Costo Total",
    oldWay: { text: "80-120 COP/mes (todo separado)" },
    newWay: { text: "47 COP/mes TODO incluido" }
  }
]

const Comparison = () => {
  return (
    <section id="comparison" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            La Diferencia es Obvia
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-3 font-bold text-lg text-center bg-gray-100">
              <div className="p-4">Característica</div>
              <div className="p-4 border-l border-gray-200">Linktree + Herramientas</div>
              <div className="p-4 bg-blue-600 text-white">DigitalizaWEB</div>
            </div>
            {comparisonData.map((item, index) => (
              <div key={index} className="grid grid-cols-3 text-center border-t border-gray-200 items-center">
                <div className="p-4 text-left font-semibold text-gray-700">{item.feature}</div>
                <div className="p-4 border-l border-gray-200">
                  <span className="text-red-500 text-2xl mb-1 block">✗</span>
                  <p className="text-sm text-gray-500">{item.oldWay.text}</p>
                </div>
                <div className="p-4 bg-blue-50">
                  <span className="text-green-500 text-2xl mb-1 block">✓</span>
                  <p className="text-sm text-gray-800 font-medium">{item.newWay.text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Comparison
