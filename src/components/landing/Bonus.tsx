'use client'

import { motion } from 'framer-motion'

const bonuses = [
  { name: "Configuración asistida completa", value: "297 COP" },
  { name: "3 códigos QR personalizados con tu marca", value: "150 COP" },
  { name: "Guía de migración desde Linktree", value: "97 COP" },
  { name: "30 min consultoría 1-on-1", value: "150 COP" },
  { name: "Plantillas de marketing listas", value: "197 COP" },
  { name: "Acceso a comunidad privada", value: "97 COP/año" },
]

const Bonus = () => {
  return (
    <section id="bonuses" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Y eso no es todo... Recibe <span className="text-yellow-500">Bonos de Acción Rápida</span> (Valor 935 COP)
          </h2>
        </motion.div>

        <div className="mt-12 max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
          {bonuses.map((bonus, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow"
            >
              <span className="text-yellow-500 text-3xl flex-shrink-0">🎁</span>
              <div>
                <p className="font-semibold text-gray-800">{bonus.name}</p>
                <p className="text-sm text-gray-500">Valor: {bonus.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Bonus
