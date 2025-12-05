'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { MenuItem } from '@/types'
import { businessThemes, premiumThemes } from '@/components/templates'

// Dynamic imports for templates
const ElegantTemplate = dynamic(() => import('@/components/templates/ElegantTemplate'), { ssr: false })
const ModernTemplate = dynamic(() => import('@/components/templates/ModernTemplate'), { ssr: false })
const ArtisanTemplate = dynamic(() => import('@/components/templates/ArtisanTemplate'), { ssr: false })
const LuxuryTemplate = dynamic(() => import('@/components/templates/LuxuryTemplate'), { ssr: false })

// Link-in-Bio Templates (Legacy)
const BarberiaTemplate = dynamic(() => import('@/components/templates/BarberiaTemplate'), { ssr: false })
const ItalianTemplate = dynamic(() => import('@/components/templates/ItalianTemplate'), { ssr: false })
const MexicanTemplate = dynamic(() => import('@/components/templates/MexicanTemplate'), { ssr: false })
const HamburguesaTemplate = dynamic(() => import('@/components/templates/HamburguesaTemplate'), { ssr: false })
const SpaTemplate = dynamic(() => import('@/components/templates/SpaTemplate'), { ssr: false })
const SalonBellezaTemplate = dynamic(() => import('@/components/templates/SalonBellezaTemplate'), { ssr: false })
const FloreriaTemplate = dynamic(() => import('@/components/templates/FloreriaTemplate'), { ssr: false })
const VegetarianoTemplate = dynamic(() => import('@/components/templates/VegetarianoTemplate'), { ssr: false })

// Professional Template with Admin Panel
const UnifiedProTemplate = dynamic(() => import('@/components/templates/UnifiedProTemplate'), { ssr: false })

// Premium Template (SALVAJE Style)
const PremiumTemplate = dynamic(() => import('@/components/templates/PremiumTemplate'), { ssr: false })

// Sample restaurant data
const sampleRestaurant = {
  id: 'demo-1',
  slug: 'demo',
  name: 'La Bella Italia',
  phone: '+34 612 345 678',
  whatsapp: '+34612345678',
  address: 'Calle Mayor 123, Madrid, España',
  description: 'Auténtica cocina italiana con ingredientes frescos importados directamente de Italia',
  theme: 'italian' as const,
  logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop',
  hours: { 'Lun-Vie': '12:00-23:00', 'Sáb-Dom': '13:00-00:00' },
  isActive: true
}

// Sample menu items with real food images
const sampleMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Bruschetta Clásica',
    description: 'Pan tostado con tomates frescos, albahaca, ajo y aceite de oliva extra virgen',
    price: '8.50',
    category: 'Entrantes',
    available: true,
    order: 1,
    restaurantId: 'demo-1',
    imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=400&fit=crop'
  },
  {
    id: '2',
    name: 'Carpaccio Especial',
    description: 'Finas láminas de res con rúcula, parmesano y reducción balsámica. Nuestro plato más popular.',
    price: '14.90',
    category: 'Entrantes',
    available: true,
    order: 2,
    restaurantId: 'demo-1',
    imageUrl: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&h=400&fit=crop'
  },
  {
    id: '3',
    name: 'Burrata con Prosciutto',
    description: 'Cremosa burrata italiana con jamón de Parma y tomates cherry',
    price: '16.50',
    category: 'Entrantes',
    available: true,
    order: 3,
    restaurantId: 'demo-1',
    imageUrl: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=400&fit=crop'
  },
  {
    id: '4',
    name: 'Spaghetti Carbonara',
    description: 'Pasta fresca con huevo, guanciale, pecorino romano y pimienta negra',
    price: '16.50',
    category: 'Pasta',
    available: true,
    order: 1,
    restaurantId: 'demo-1',
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=400&fit=crop'
  },
  {
    id: '5',
    name: 'Risotto ai Funghi Porcini',
    description: 'Arroz arborio cremoso con hongos porcini, mantequilla y parmigiano reggiano',
    price: '18.90',
    category: 'Pasta',
    available: true,
    order: 2,
    restaurantId: 'demo-1',
    imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=400&fit=crop'
  },
  {
    id: '6',
    name: 'Tagliatelle al Tartufo',
    description: 'Pasta casera con crema de trufa negra y parmesano. Edición limitada.',
    price: '24.90',
    category: 'Pasta',
    available: true,
    order: 3,
    restaurantId: 'demo-1',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop'
  },
  {
    id: '7',
    name: 'Pizza Margherita D.O.P.',
    description: 'Tomate San Marzano, mozzarella di bufala, albahaca fresca y aceite de oliva',
    price: '14.50',
    category: 'Pizza',
    available: true,
    order: 1,
    restaurantId: 'demo-1',
    imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=400&fit=crop'
  },
  {
    id: '8',
    name: 'Pizza Diavola Picante',
    description: 'Salsa de tomate, mozzarella, salami picante y chile calabrés',
    price: '16.50',
    category: 'Pizza',
    available: true,
    order: 2,
    restaurantId: 'demo-1',
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop'
  },
  {
    id: '9',
    name: 'Ossobuco alla Milanese',
    description: 'Jarrete de ternera braseado con gremolata, servido con risotto de azafrán',
    price: '28.90',
    category: 'Carnes',
    available: true,
    order: 1,
    restaurantId: 'demo-1',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop'
  },
  {
    id: '10',
    name: 'Filetto di Manzo',
    description: 'Filete de res a la parrilla con reducción de vino tinto y vegetales asados',
    price: '32.90',
    category: 'Carnes',
    available: true,
    order: 2,
    restaurantId: 'demo-1',
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=400&fit=crop'
  },
  {
    id: '11',
    name: 'Tiramisù della Casa',
    description: 'Clásico postre italiano con mascarpone, café espresso y cacao amargo',
    price: '8.90',
    category: 'Postres',
    available: true,
    order: 1,
    restaurantId: 'demo-1',
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop'
  },
  {
    id: '12',
    name: 'Panna Cotta ai Frutti',
    description: 'Crema italiana sedosa con coulis de frutos rojos frescos',
    price: '7.50',
    category: 'Postres',
    available: false,
    order: 2,
    restaurantId: 'demo-1',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop'
  },
  {
    id: '13',
    name: 'Cannoli Siciliani',
    description: 'Tubos crujientes rellenos de ricotta dulce con chips de chocolate',
    price: '6.90',
    category: 'Postres',
    available: true,
    order: 3,
    restaurantId: 'demo-1',
    imageUrl: 'https://images.unsplash.com/photo-1628191139360-4083564d03fd?w=400&h=400&fit=crop'
  }
]

// Sample data for Link-in-Bio templates
const sampleBarberia = {
  name: 'The Classic Barber',
  description: 'Barbería Premium - Estilo y Tradición',
  phone: '+57 312 345 6789',
  whatsapp: '+573123456789',
  address: 'Cra 45 #23, Medellín',
  hours: 'Lun-Sáb: 9:00am - 8:00pm',
  instagram: 'https://instagram.com/theclassicbarber',
  rating: 4.9,
  reviewCount: 127
}

const sampleItalian = {
  name: 'Trattoria Bella',
  description: 'Auténtica Cocina Italiana',
  phone: '+57 315 678 1234',
  whatsapp: '+573156781234',
  address: 'Calle 10 #43-12, Bogotá',
  hours: 'Mar-Dom: 12:00pm - 10:00pm',
  instagram: 'https://instagram.com/trattoriabella',
  rating: 4.8,
  reviewCount: 89
}

const sampleMexican = {
  name: 'El Rincón Mexicano',
  description: 'Sabores Auténticos de México',
  phone: '+57 310 987 6543',
  whatsapp: '+573109876543',
  address: 'Av 68 #24-50, Bogotá',
  hours: 'Lun-Dom: 11:00am - 11:00pm',
  instagram: 'https://instagram.com/elrinconmex',
  rating: 4.7,
  reviewCount: 156
}

const sampleHamburguesa = {
  name: 'Burger Bros',
  description: 'Las Mejores Hamburguesas Artesanales',
  phone: '+57 317 456 7890',
  whatsapp: '+573174567890',
  address: 'Cra 7 #72-15, Bogotá',
  hours: 'Lun-Dom: 11:00am - 10:00pm',
  instagram: 'https://instagram.com/burgerbros',
  rating: 4.6,
  reviewCount: 203
}

const sampleSpa = {
  name: 'Zen Spa & Wellness',
  description: 'Tu Oasis de Relajación',
  phone: '+57 318 765 4321',
  whatsapp: '+573187654321',
  address: 'Calle 93 #12-45, Bogotá',
  hours: 'Lun-Sáb: 9:00am - 8:00pm',
  instagram: 'https://instagram.com/zenspa',
  rating: 4.9,
  reviewCount: 78
}

const sampleSalon = {
  name: 'Glamour Studio',
  description: 'Belleza y Estilo Profesional',
  phone: '+57 319 234 5678',
  whatsapp: '+573192345678',
  address: 'Cra 15 #85-20, Bogotá',
  hours: 'Lun-Sáb: 8:00am - 7:00pm',
  instagram: 'https://instagram.com/glamourstudio',
  rating: 4.8,
  reviewCount: 145
}

const sampleFloreria = {
  name: 'Flores del Valle',
  description: 'Arte Floral para Cada Ocasión',
  phone: '+57 320 345 6789',
  whatsapp: '+573203456789',
  address: 'Calle 72 #9-30, Bogotá',
  hours: 'Lun-Sáb: 8:00am - 6:00pm',
  instagram: 'https://instagram.com/floresdelvalle',
  rating: 4.9,
  reviewCount: 67
}

const sampleVegetariano = {
  name: 'Green Kitchen',
  description: 'Comida Saludable y Deliciosa',
  phone: '+57 321 456 7890',
  whatsapp: '+573214567890',
  address: 'Cra 11 #93-45, Bogotá',
  hours: 'Lun-Sáb: 10:00am - 8:00pm',
  instagram: 'https://instagram.com/greenkitchen',
  rating: 4.7,
  reviewCount: 112
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const templateConfig: Record<string, { component: React.ComponentType<any>; accentColor: string; name: string; props?: any }> = {
  // Premium Templates (Legacy)
  elegant: { component: ElegantTemplate, accentColor: '#1a1a1a', name: 'Elegant' },
  modern: { component: ModernTemplate, accentColor: '#f97316', name: 'Modern' },
  artisan: { component: ArtisanTemplate, accentColor: '#92400e', name: 'Artisan' },
  luxury: { component: LuxuryTemplate, accentColor: '#d4a853', name: 'Luxury' },

  // Link-in-Bio Templates (Legacy)
  barberia: { component: BarberiaTemplate, accentColor: '#f59e0b', name: 'Barbería', props: { business: sampleBarberia } },
  italian: { component: ItalianTemplate, accentColor: '#16a34a', name: 'Italiano', props: { restaurant: sampleItalian } },
  mexican: { component: MexicanTemplate, accentColor: '#dc2626', name: 'Mexicano', props: { restaurant: sampleMexican } },
  hamburguesa: { component: HamburguesaTemplate, accentColor: '#ea580c', name: 'Hamburguesas', props: { restaurant: sampleHamburguesa } },
  spa: { component: SpaTemplate, accentColor: '#0d9488', name: 'Spa', props: { business: sampleSpa } },
  'salon-belleza': { component: SalonBellezaTemplate, accentColor: '#db2777', name: 'Salón de Belleza', props: { business: sampleSalon } },
  floreria: { component: FloreriaTemplate, accentColor: '#ec4899', name: 'Floristería', props: { business: sampleFloreria } },
  vegetariano: { component: VegetarianoTemplate, accentColor: '#84cc16', name: 'Vegetariano', props: { restaurant: sampleVegetariano } },

  // PRO Templates with Admin Panel (New)
  'barberia-pro': {
    component: UnifiedProTemplate,
    accentColor: '#d4a853',
    name: 'Barbería PRO',
    props: {
      business: { ...sampleBarberia, tagline: 'Estilo Masculino Premium' },
      theme: businessThemes.barberia,
      businessType: 'barberia',
      showAdmin: true
    }
  },
  'italian-pro': {
    component: UnifiedProTemplate,
    accentColor: '#22c55e',
    name: 'Italiano PRO',
    props: {
      business: { ...sampleItalian, tagline: 'Autentica Cocina Italiana' },
      theme: businessThemes.italian,
      businessType: 'restaurant',
      showAdmin: true
    }
  },
  'mexican-pro': {
    component: UnifiedProTemplate,
    accentColor: '#dc2626',
    name: 'Mexicano PRO',
    props: {
      business: { ...sampleMexican, tagline: 'Sabores Autenticos de Mexico' },
      theme: businessThemes.mexican,
      businessType: 'restaurant',
      showAdmin: true
    }
  },
  'hamburguesa-pro': {
    component: UnifiedProTemplate,
    accentColor: '#f97316',
    name: 'Hamburguesas PRO',
    props: {
      business: { ...sampleHamburguesa, tagline: 'Hamburguesas Artesanales' },
      theme: businessThemes.hamburguesa,
      businessType: 'restaurant',
      showAdmin: true
    }
  },
  'spa-pro': {
    component: UnifiedProTemplate,
    accentColor: '#14b8a6',
    name: 'Spa PRO',
    props: {
      business: { ...sampleSpa, tagline: 'Tu Oasis de Bienestar' },
      theme: businessThemes.spa,
      businessType: 'spa',
      showAdmin: true
    }
  },
  'salon-pro': {
    component: UnifiedProTemplate,
    accentColor: '#ec4899',
    name: 'Salon PRO',
    props: {
      business: { ...sampleSalon, tagline: 'Belleza y Estilo Profesional' },
      theme: businessThemes.salon,
      businessType: 'salon',
      showAdmin: true
    }
  },
  'floreria-pro': {
    component: UnifiedProTemplate,
    accentColor: '#f43f5e',
    name: 'Floristeria PRO',
    props: {
      business: { ...sampleFloreria, tagline: 'Arte Floral para Cada Ocasion' },
      theme: businessThemes.floreria,
      businessType: 'floreria',
      showAdmin: true
    }
  },
  'vegetariano-pro': {
    component: UnifiedProTemplate,
    accentColor: '#84cc16',
    name: 'Vegetariano PRO',
    props: {
      business: { ...sampleVegetariano, tagline: 'Comida Saludable y Deliciosa' },
      theme: businessThemes.vegetariano,
      businessType: 'restaurant',
      showAdmin: true
    }
  },

  // PREMIUM Templates (SALVAJE Style) - The Perfect Template
  'barberia-premium': {
    component: PremiumTemplate,
    accentColor: '#d4a853',
    name: 'Barberia PREMIUM',
    props: {
      business: { ...sampleBarberia, logoEmoji: '💈', tagline: 'Estilo Masculino Premium' },
      theme: premiumThemes.barberia
    }
  },
  'italian-premium': {
    component: PremiumTemplate,
    accentColor: '#22c55e',
    name: 'Italiano PREMIUM',
    props: {
      business: { ...sampleItalian, logoEmoji: '🍝', tagline: 'Gastronomia Italiana Premium' },
      theme: premiumThemes.italian
    }
  },
  'mexican-premium': {
    component: PremiumTemplate,
    accentColor: '#dc2626',
    name: 'Mexicano PREMIUM',
    props: {
      business: { ...sampleMexican, logoEmoji: '🌮', tagline: 'Sabores Autenticos de Mexico' },
      theme: premiumThemes.mexican
    }
  },
  'hamburguesa-premium': {
    component: PremiumTemplate,
    accentColor: '#f97316',
    name: 'Hamburguesas PREMIUM',
    props: {
      business: { ...sampleHamburguesa, logoEmoji: '🍔', tagline: 'Hamburguesas Artesanales Premium' },
      theme: premiumThemes.hamburguesa
    }
  },
  'spa-premium': {
    component: PremiumTemplate,
    accentColor: '#14b8a6',
    name: 'Spa PREMIUM',
    props: {
      business: { ...sampleSpa, logoEmoji: '🧘', tagline: 'Tu Oasis de Bienestar' },
      theme: premiumThemes.spa
    }
  },
  'salon-premium': {
    component: PremiumTemplate,
    accentColor: '#ec4899',
    name: 'Salon PREMIUM',
    props: {
      business: { ...sampleSalon, logoEmoji: '💅', tagline: 'Belleza y Estilo Profesional' },
      theme: premiumThemes.salon
    }
  },
  'floreria-premium': {
    component: PremiumTemplate,
    accentColor: '#f43f5e',
    name: 'Floreria PREMIUM',
    props: {
      business: { ...sampleFloreria, logoEmoji: '🌸', tagline: 'Arte Floral Exclusivo' },
      theme: premiumThemes.floreria
    }
  },
  'vegetariano-premium': {
    component: PremiumTemplate,
    accentColor: '#84cc16',
    name: 'Vegetariano PREMIUM',
    props: {
      business: { ...sampleVegetariano, logoEmoji: '🥗', tagline: 'Cocina Saludable Premium' },
      theme: premiumThemes.vegetariano
    }
  }
}

export default function TemplateDemoPage({ params }: { params: { template: string } }) {
  const templateKey = params.template

  const config = templateConfig[templateKey]

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Template no encontrado</h1>
          <p className="text-slate-600 mb-4">Template: {templateKey}</p>
          <p className="text-slate-500 text-sm mb-6">
            Templates disponibles: {Object.keys(templateConfig).join(', ')}
          </p>
          <Link href="/demo" className="text-blue-600 hover:underline">
            Volver a la lista de templates
          </Link>
        </div>
      </div>
    )
  }

  const TemplateComponent = config.component

  return (
    <div className="relative">
      {/* Floating back button */}
      <Link
        href="/demo"
        className="fixed top-4 left-4 z-[100] flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-slate-200 text-slate-700 hover:bg-white hover:shadow-xl transition-all text-sm font-medium"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Volver
      </Link>

      {/* Template name badge */}
      <div
        className="fixed top-4 right-4 z-[100] px-4 py-2 rounded-full shadow-lg text-white text-sm font-medium"
        style={{ backgroundColor: config.accentColor }}
      >
        Template: {config.name}
      </div>

      {/* Render the template */}
      {config.props ? (
        <TemplateComponent {...config.props} />
      ) : (
        <TemplateComponent
          restaurant={sampleRestaurant}
          menuItems={sampleMenuItems}
          accentColor={config.accentColor}
        />
      )}
    </div>
  )
}
