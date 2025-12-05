'use client'

import { useState } from 'react'
import Link from 'next/link'

const templates = [
  {
    id: 'barberia-premium',
    name: 'Barbería',
    emoji: '💈',
    description: 'Estilo masculino premium. Diseño elegante y sofisticado.',
    style: 'Barberías, peluquerías masculinas',
    color: '#d4a853',
    gradient: 'from-amber-900 to-amber-950'
  },
  {
    id: 'italian-premium',
    name: 'Italiano',
    emoji: '🍝',
    description: 'Gastronomía italiana auténtica. Ambiente cálido y acogedor.',
    style: 'Restaurantes italianos, pizzerías',
    color: '#22c55e',
    gradient: 'from-green-900 to-green-950'
  },
  {
    id: 'mexican-premium',
    name: 'Mexicano',
    emoji: '🌮',
    description: 'Sabores auténticos mexicanos. Colores vibrantes y festivos.',
    style: 'Taquerías, restaurantes mexicanos',
    color: '#dc2626',
    gradient: 'from-red-900 to-red-950'
  },
  {
    id: 'hamburguesa-premium',
    name: 'Hamburguesas',
    emoji: '🍔',
    description: 'Burgers artesanales. Diseño moderno y apetitoso.',
    style: 'Hamburgueserías, fast food premium',
    color: '#f97316',
    gradient: 'from-orange-900 to-orange-950'
  },
  {
    id: 'spa-premium',
    name: 'Spa',
    emoji: '🧘',
    description: 'Bienestar y relajación. Ambiente tranquilo y sereno.',
    style: 'Spas, centros de bienestar, masajes',
    color: '#14b8a6',
    gradient: 'from-teal-900 to-teal-950'
  },
  {
    id: 'salon-premium',
    name: 'Salón',
    emoji: '💅',
    description: 'Belleza profesional. Estilo femenino y elegante.',
    style: 'Salones de belleza, estéticas, nail bars',
    color: '#ec4899',
    gradient: 'from-pink-900 to-pink-950'
  },
  {
    id: 'floreria-premium',
    name: 'Floristería',
    emoji: '🌸',
    description: 'Arte floral exclusivo. Diseño romántico y delicado.',
    style: 'Floristerías, tiendas de plantas',
    color: '#f43f5e',
    gradient: 'from-rose-900 to-rose-950'
  },
  {
    id: 'vegetariano-premium',
    name: 'Vegetariano',
    emoji: '🥗',
    description: 'Cocina saludable. Frescura y vitalidad en cada diseño.',
    style: 'Restaurantes vegetarianos, veganos, healthy',
    color: '#84cc16',
    gradient: 'from-lime-900 to-lime-950'
  }
]

export default function DemoPage() {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Templates PREMIUM</h1>
              <p className="text-slate-400 text-sm">Digitaliza - Sistema de Menús Digitales</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-sm bg-white text-slate-900 rounded-full hover:bg-slate-200 transition-colors"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          8 Templates Premium
        </h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
          Diseño SALVAJE style - Elegante, oscuro, con colores de acento por nicho.
          100% mobile-first con animaciones premium.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <span className="px-4 py-2 bg-emerald-900/50 text-emerald-400 rounded-full border border-emerald-700">
            ✓ Menú con categorías colapsables
          </span>
          <span className="px-4 py-2 bg-blue-900/50 text-blue-400 rounded-full border border-blue-700">
            ✓ Modal slide-up para detalles
          </span>
          <span className="px-4 py-2 bg-purple-900/50 text-purple-400 rounded-full border border-purple-700">
            ✓ Reservaciones con calendario
          </span>
          <span className="px-4 py-2 bg-amber-900/50 text-amber-400 rounded-full border border-amber-700">
            ✓ WhatsApp, llamadas, Instagram
          </span>
        </div>
      </section>

      {/* Template Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/demo/${template.id}`}
              className="group block"
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              <div
                className={`relative overflow-hidden rounded-2xl border transition-all duration-500 ${
                  hoveredTemplate === template.id
                    ? 'border-slate-500 shadow-2xl scale-[1.03]'
                    : 'border-slate-700 shadow-lg'
                }`}
                style={{
                  boxShadow: hoveredTemplate === template.id
                    ? `0 20px 40px -10px ${template.color}40`
                    : undefined
                }}
              >
                {/* Preview Area */}
                <div
                  className={`h-40 bg-gradient-to-br ${template.gradient} flex items-center justify-center relative overflow-hidden`}
                >
                  {/* Glow effect */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: `radial-gradient(circle at 50% 100%, ${template.color} 0%, transparent 60%)`
                    }}
                  />

                  <div className="relative text-center">
                    <div className="text-5xl mb-2">
                      {template.emoji}
                    </div>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: template.color }}
                    >
                      {template.name}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 bg-slate-900/80">
                  <p className="text-slate-300 text-sm mb-2 line-clamp-2">
                    {template.description}
                  </p>
                  <p className="text-xs text-slate-500">
                    {template.style}
                  </p>
                </div>

                {/* Hover indicator */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 transition-transform duration-300 ${
                    hoveredTemplate === template.id ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  style={{ backgroundColor: template.color }}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Legacy Templates Section */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h3 className="text-2xl font-bold text-slate-400 mb-6 text-center">
          Templates Legacy (con imágenes)
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { id: 'elegant', name: 'Elegant', color: '#1a1a1a' },
            { id: 'modern', name: 'Modern', color: '#f97316' },
            { id: 'artisan', name: 'Artisan', color: '#92400e' },
            { id: 'luxury', name: 'Luxury', color: '#d4a853' }
          ].map((t) => (
            <Link
              key={t.id}
              href={`/demo/${t.id}`}
              className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors text-center"
            >
              <div className="text-lg font-semibold text-slate-300">{t.name}</div>
              <div className="text-sm text-slate-500">Ver demo</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400">
            Templates creados con React, Next.js, Tailwind CSS y Framer Motion
          </p>
          <p className="text-slate-600 text-sm mt-2">
            Digitaliza © 2025
          </p>
        </div>
      </footer>
    </div>
  )
}
