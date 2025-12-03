import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Digitaliza | Menu Digital con QR para tu Negocio',
  description:
    'Crea tu menu digital con codigo QR en 5 minutos. Perfecto para restaurantes, cafeterias y barberias.',
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 sm:px-6">
        <span className="text-xl font-bold text-blue-600">Digitaliza</span>
        <Link
          href="/register"
          className="min-h-[44px] rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Crear Menu Gratis
        </Link>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center px-4 pt-12 text-center sm:pt-20">
        <h1 className="max-w-md text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
          Tu menu digital en 5 minutos
        </h1>
        <p className="mt-4 max-w-sm text-lg text-gray-600">
          Crea un menu con codigo QR para tu negocio. Sin conocimientos tecnicos.
        </p>
        <Link
          href="/register"
          className="mt-8 min-h-[44px] rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
        >
          Crear Mi Menu Gratis
        </Link>

        {/* Benefits */}
        <section className="mt-16 grid w-full max-w-3xl gap-6 px-4 sm:mt-24 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-3 text-4xl">QR</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Codigo QR</h3>
            <p className="text-sm text-gray-600">
              Genera un QR unico para las mesas de tu negocio
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-3 text-4xl">WA</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">WhatsApp</h3>
            <p className="text-sm text-gray-600">
              Tus clientes piden directo por WhatsApp con un click
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-3 text-4xl">5m</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Super Facil</h3>
            <p className="text-sm text-gray-600">
              Crea tu menu en minutos, sin conocimientos tecnicos
            </p>
          </div>
        </section>

        {/* Demo Showcase */}
        <section className="mt-16 w-full max-w-4xl px-4 sm:mt-24">
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Ver Demostraciones
          </h2>
          <p className="mb-8 text-center text-gray-600">
            Explora nuestros restaurantes demo para ver como se ve tu menu:
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Italian Demo */}
            <Link href="/ristorante-demo" className="group">
              <div className="rounded-xl bg-gradient-to-br from-red-50 to-white p-6 shadow-md transition-all hover:shadow-lg">
                <div className="mb-3 text-4xl">🇮🇹</div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-red-600">
                  Ristorante Italiano
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  Menu clásico italiano con antipasti, pastas, carnes y postres
                </p>
                <span className="inline-block text-blue-600 group-hover:underline">
                  Ver demo →
                </span>
              </div>
            </Link>

            {/* Japanese Demo */}
            <Link href="/sakura-sushi-demo" className="group">
              <div className="rounded-xl bg-gradient-to-br from-red-50 to-white p-6 shadow-md transition-all hover:shadow-lg">
                <div className="mb-3 text-4xl">🇯🇵</div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-red-600">
                  Sakura Sushi Bar
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  Sushi, ramen y especialidades japonesas frescas
                </p>
                <span className="inline-block text-blue-600 group-hover:underline">
                  Ver demo →
                </span>
              </div>
            </Link>

            {/* Mexican Demo */}
            <Link href="/el-mexicano-feliz-demo" className="group">
              <div className="rounded-xl bg-gradient-to-br from-amber-50 to-white p-6 shadow-md transition-all hover:shadow-lg">
                <div className="mb-3 text-4xl">🇲🇽</div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-amber-600">
                  El Mexicano Feliz
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  Tacos, burritos, ceviches y bebidas tradicionales
                </p>
                <span className="inline-block text-blue-600 group-hover:underline">
                  Ver demo →
                </span>
              </div>
            </Link>

            {/* Coffee Demo */}
            <Link href="/coffee-house-demo" className="group">
              <div className="rounded-xl bg-gradient-to-br from-amber-100 to-white p-6 shadow-md transition-all hover:shadow-lg">
                <div className="mb-3 text-4xl">☕</div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-amber-800">
                  The Coffee House
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  Cafés especiales, tés y pasteles artesanales
                </p>
                <span className="inline-block text-blue-600 group-hover:underline">
                  Ver demo →
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* CTA Final */}
        <section className="mt-16 w-full max-w-md px-4 pb-12 text-center sm:mt-24">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Listo para digitalizar tu negocio?
          </h2>
          <Link
            href="/register"
            className="mt-6 inline-block min-h-[44px] rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
          >
            Empezar Ahora
          </Link>
          <p className="mt-4 text-sm text-gray-600">
            O <Link href="/ristorante-demo" className="text-blue-600 hover:underline">
              prueba una demo
            </Link> primero
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        2025 Digitaliza. Todos los derechos reservados.
      </footer>
    </div>
  )
}
