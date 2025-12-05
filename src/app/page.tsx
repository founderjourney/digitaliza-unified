import type { Metadata } from 'next'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import Problem from '@/components/landing/Problem'
import Solution from '@/components/landing/Solution'
import Comparison from '@/components/landing/Comparison'
import Proof from '@/components/landing/Proof'
import Portfolio from '@/components/landing/Portfolio'
import Pricing from '@/components/landing/Pricing'
import Bonus from '@/components/landing/Bonus'
import Guarantee from '@/components/landing/Guarantee'
import Offer from '@/components/landing/Offer'
import FAQ from '@/components/landing/FAQ'
import Footer from '@/components/landing/Footer'

export const metadata: Metadata = {
  title: 'DigitalizaWEB | Menú Digital Profesional con QR para tu Negocio',
  description:
    'Crea tu menú digital profesional con código QR en minutos. Reemplaza Linktree + menú PDF con una plataforma que automatiza reservas. Perfecto para restaurantes, cafeterías y barberías.',
}

export default function Home() {
  return (
    <div className="bg-white text-gray-800">
      <Header />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Comparison />
        <Proof />
        <Portfolio />
        <Pricing />
        <Bonus />
        <Guarantee />
        <Offer />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
