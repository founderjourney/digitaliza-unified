'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    name: "Ricardo López",
    business: "Tacos El Fuego (CDMX)",
    quote: "Desde que cambiamos de Linktree a DigitalizaWEB, nuestras reservas aumentaron 43%. Ahora capturamos reservas a las 2am y domingos. Esas eran ventas que NUNCA hubiéramos tenido antes. ROI recuperado en 18 días."
  },
  {
    name: "Sofía Hernández",
    business: "Belleza Urbana (Monterrey)",
    quote: "Mi recepcionista pasaba 3 horas diarias solo gestionando citas. Ahora el 80% se agenda automáticamente. Aumentamos capacidad 31% sin contratar más personal. Son 1,840 COP extra al mes."
  },
  {
    name: "Kenji Tanaka",
    business: "Sakura Sushi (Guadalajara)",
    quote: "Construimos una base de 287 clientes con emails en 6 semanas. Cada viernes enviamos el especial. Entre 35-50 personas ordenan directo por ese email. Son 400-600 COP semanales que antes no existían."
  }
]

const Proof = () => {
  return (
    <section id="proof" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Mira la Diferencia: Lo Amateur vs Lo Profesional
          </h2>
        </motion.div>

        {/* Before vs After */}
        <div className="mt-12 grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-center text-xl font-bold text-red-600 mb-4">ANTES - Linktree</h3>
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="aspect-w-9 aspect-h-16 bg-gray-200 rounded-lg flex items-center justify-center p-4">
                <p className="text-gray-500 text-center italic">&ldquo;¿Esto inspira confianza? Cliente ve esto y busca otra opción...&rdquo;</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-center text-xl font-bold text-green-600 mb-4">DESPUÉS - DigitalizaWEB</h3>
            <div className="bg-white rounded-xl shadow-2xl p-4 border-4 border-green-500">
              <div className="aspect-w-9 aspect-h-16 bg-gray-200 rounded-lg flex items-center justify-center p-4">
                <p className="text-gray-500 text-center font-semibold">&ldquo;Esto SÍ vende. Profesional, organizado, genera confianza.&rdquo;</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Testimonials */}
        <div className="mt-20">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-12">Resultados Reales de Negocios Como el Tuyo</h2>
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-blue-600 text-white rounded-xl shadow-xl p-8 relative flex flex-col"
              >
                <span className="absolute top-6 left-6 text-blue-500 text-5xl opacity-50">&ldquo;</span>
                <p className="text-lg italic leading-relaxed z-10 relative flex-grow">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-6 font-bold text-right z-10 relative">
                  <p className="text-lg">{testimonial.name}</p>
                  <p className="text-sm text-blue-200">{testimonial.business}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Proof
