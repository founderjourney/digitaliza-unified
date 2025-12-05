'use client'

import { motion } from 'framer-motion';

const faqData = [
  {
    question: "¿Por qué DigitalizaWEB en vez de Linktree?",
    answer: "Linktree es solo enlaces. No muestra menú con fotos, no toma reservas, no captura clientes, malo para SEO. DigitalizaWEB es un sitio web completo profesional. Nuestros clientes ven 29-35% conversión vs 12% promedio de Linktree."
  },
  {
    question: "¿Es complicado de usar?",
    answer: "Si puedes subir foto a Instagram, puedes usar DigitalizaWEB. Incluimos: videos tutoriales, configuración asistida gratis, soporte WhatsApp <2h. Tiempo para estar en vivo: 45-90 min."
  },
  {
    question: "¿Funciona bien en celulares?",
    answer: "Sí, diseñado mobile-first. Carga <2 segundos. 78% de reservas son desde móvil. Compatible iOS/Android."
  },
  {
    question: "¿Hay costos ocultos?",
    answer: "NO. 47 COP/mes incluye todo: hosting, actualizaciones, soporte, fotos ilimitadas. Único extra opcional: dominio propio ~12 COP/año."
  },
  {
    question: "¿Puedo cancelar cuando quiera?",
    answer: "Sí. Sin contrato. Sin penalidades. Cancelas con 1 clic. Plan único: es tuyo para siempre."
  },
  {
    question: "¿Qué pasa con mis códigos QR de Linktree impresos?",
    answer: "Transición fácil: Pon tu DigitalizaWEB como primer link en Linktree temporalmente. Luego imprime nuevos QR (te los diseñamos gratis). Migración sin perder clientes."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Preguntas Frecuentes
          </h2>
        </motion.div>

        <div className="mt-12 max-w-3xl mx-auto space-y-6">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="font-bold text-lg text-gray-800">{item.question}</h3>
              <p className="mt-2 text-gray-600">{item.answer}</p>
            </motion.div>
          ))}
        </div>
         <div className="text-center mt-12">
            <p className="text-lg text-gray-700">¿Eso no responde tu pregunta?</p>
            <a href="mailto:hola@digitalizaweb.com" className="font-bold text-blue-600 hover:underline">
              Escríbenos a hola@digitalizaweb.com o por WhatsApp
            </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
