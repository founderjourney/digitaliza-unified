'use client'

import { motion } from 'framer-motion';

const Offer = () => {
  return (
    <section id="offer" className="py-20 bg-blue-700 text-white">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold">
            OFERTA DE LANZAMIENTO
          </h2>
          <p className="mt-4 text-lg text-blue-200 max-w-2xl mx-auto">
            Solo para los primeros 50 negocios, el precio especial es <span className="font-bold">497 COP (pago único)</span> o <span className="font-bold">47 COP/mes</span>. Una vez que lleguemos a 50, el precio subirá automáticamente a 697 COP y 67 COP/mes.
          </p>
          <div className="mt-6 bg-yellow-400 text-gray-900 font-bold text-xl p-3 rounded-lg inline-block">
            Lugares restantes: 17 / 50
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-10 max-w-2xl mx-auto"
        >
          <div className="space-y-4">
            <a
              href="/register"
              className="w-full block bg-green-500 text-white font-bold text-xl px-10 py-5 rounded-lg shadow-lg hover:bg-green-600 transform hover:-translate-y-1 transition-all duration-300"
            >
              → CREAR MI DIGITALIZA - 497 COP (PAGO ÚNICO)
            </a>
            <a
              href="/register"
              className="w-full block bg-gray-200 text-gray-800 font-bold text-lg px-10 py-4 rounded-lg shadow-md hover:bg-gray-300 transition-all duration-300"
            >
              → Prefiero Mensual - 47 COP/mes
            </a>
          </div>
           <a href="#faq" className="mt-6 inline-block text-sm text-blue-200 hover:text-white underline">
            ¿Tienes preguntas? Ver FAQ Completo
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Offer;
