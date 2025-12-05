// Template Library for Digitaliza
// Modern, beautiful templates for different business types

// Legacy Templates (Original)
export { default as ItalianTemplate } from './ItalianTemplate'
export { default as JapaneseTemplate } from './JapaneseTemplate'
export { default as MexicanTemplate } from './MexicanTemplate'
export { default as CoffeeTemplate } from './CoffeeTemplate'

// Premium Templates (2025)
export { default as ElegantTemplate } from './ElegantTemplate'
export { default as ModernTemplate } from './ModernTemplate'
export { default as ArtisanTemplate } from './ArtisanTemplate'
export { default as LuxuryTemplate } from './LuxuryTemplate'

// Link-in-Bio Templates (PRD Style)
export { default as BarberiaTemplate } from './BarberiaTemplate'
export { default as HamburguesaTemplate } from './HamburguesaTemplate'
export { default as SpaTemplate } from './SpaTemplate'
export { default as SalonBellezaTemplate } from './SalonBellezaTemplate'
export { default as FloreriaTemplate } from './FloreriaTemplate'
export { default as VegetarianoTemplate } from './VegetarianoTemplate'

// Professional Template with Admin Panel
export { default as UnifiedProTemplate, businessThemes } from './UnifiedProTemplate'

// Premium Template (SALVAJE Style)
export { default as PremiumTemplate, premiumThemes } from './PremiumTemplate'

// Template selector helper
export type TemplateType =
  | 'italian'
  | 'japanese'
  | 'mexican'
  | 'coffee'
  | 'elegant'
  | 'modern'
  | 'artisan'
  | 'luxury'
  // Link-in-Bio
  | 'barberia'
  | 'hamburguesa'
  | 'spa'
  | 'salon-belleza'
  | 'floreria'
  | 'vegetariano'

export const templateInfo: Record<TemplateType, { name: string; description: string; style: string }> = {
  // Legacy
  italian: {
    name: 'Italiano',
    description: 'Clásico restaurante italiano',
    style: 'classic'
  },
  japanese: {
    name: 'Japonés',
    description: 'Restaurante japonés tradicional',
    style: 'classic'
  },
  mexican: {
    name: 'Mexicano',
    description: 'Auténtica cocina mexicana',
    style: 'classic'
  },
  coffee: {
    name: 'Cafetería',
    description: 'Café y repostería',
    style: 'classic'
  },

  // Premium
  elegant: {
    name: 'Elegante',
    description: 'Minimalista y sofisticado',
    style: 'premium'
  },
  modern: {
    name: 'Moderno',
    description: 'Bold y energético, estilo app',
    style: 'premium'
  },
  artisan: {
    name: 'Artesanal',
    description: 'Cálido y orgánico',
    style: 'premium'
  },
  luxury: {
    name: 'Luxury',
    description: 'Oscuro y premium',
    style: 'premium'
  },

  // Link-in-Bio
  barberia: {
    name: 'Barbería',
    description: 'Barbería y cortes masculinos',
    style: 'link-in-bio'
  },
  hamburguesa: {
    name: 'Hamburguesas',
    description: 'Fast food y burgers',
    style: 'link-in-bio'
  },
  spa: {
    name: 'Spa',
    description: 'Spa y bienestar',
    style: 'link-in-bio'
  },
  'salon-belleza': {
    name: 'Salón de Belleza',
    description: 'Salón de belleza y estética',
    style: 'link-in-bio'
  },
  floreria: {
    name: 'Floristería',
    description: 'Flores y arreglos florales',
    style: 'link-in-bio'
  },
  vegetariano: {
    name: 'Vegetariano',
    description: 'Comida vegetariana y vegana',
    style: 'link-in-bio'
  }
}
