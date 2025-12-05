// Configuración de tipos de negocio
// Esto determina la terminología correcta según el tipo de negocio

export interface BusinessTypeConfig {
  type: 'restaurant' | 'service' | 'store'
  label: string
  labelPlural: string
  itemLabel: string
  itemsLabel: string
  addItemLabel: string
  emoji: string
  defaultCategories: string[]
}

export const businessTypeConfig: Record<string, BusinessTypeConfig> = {
  // RESTAURANTES
  general: {
    type: 'restaurant',
    label: 'Negocio',
    labelPlural: 'Negocios',
    itemLabel: 'Producto',
    itemsLabel: 'Productos',
    addItemLabel: 'Agregar Producto',
    emoji: '📋',
    defaultCategories: ['General']
  },
  italian: {
    type: 'restaurant',
    label: 'Restaurante Italiano',
    labelPlural: 'Restaurantes',
    itemLabel: 'Plato',
    itemsLabel: 'Menú',
    addItemLabel: 'Agregar Plato',
    emoji: '🍝',
    defaultCategories: ['Antipasti', 'Primi', 'Secondi', 'Pizza', 'Dolci', 'Bevande']
  },
  mexican: {
    type: 'restaurant',
    label: 'Restaurante Mexicano',
    labelPlural: 'Restaurantes',
    itemLabel: 'Plato',
    itemsLabel: 'Menú',
    addItemLabel: 'Agregar Plato',
    emoji: '🌮',
    defaultCategories: ['Tacos', 'Burritos', 'Quesadillas', 'Enchiladas', 'Bebidas', 'Postres']
  },
  japanese: {
    type: 'restaurant',
    label: 'Restaurante Japonés',
    labelPlural: 'Restaurantes',
    itemLabel: 'Plato',
    itemsLabel: 'Menú',
    addItemLabel: 'Agregar Plato',
    emoji: '🍣',
    defaultCategories: ['Sushi', 'Sashimi', 'Ramen', 'Tempura', 'Bebidas', 'Postres']
  },
  hamburguesa: {
    type: 'restaurant',
    label: 'Hamburguesería',
    labelPlural: 'Hamburgueserías',
    itemLabel: 'Producto',
    itemsLabel: 'Menú',
    addItemLabel: 'Agregar Producto',
    emoji: '🍔',
    defaultCategories: ['Hamburguesas', 'Combos', 'Papas', 'Bebidas', 'Postres']
  },
  coffee: {
    type: 'restaurant',
    label: 'Cafetería',
    labelPlural: 'Cafeterías',
    itemLabel: 'Producto',
    itemsLabel: 'Menú',
    addItemLabel: 'Agregar Producto',
    emoji: '☕',
    defaultCategories: ['Café', 'Té', 'Pasteles', 'Snacks', 'Bebidas Frías']
  },
  vegetariano: {
    type: 'restaurant',
    label: 'Restaurante Vegetariano',
    labelPlural: 'Restaurantes',
    itemLabel: 'Plato',
    itemsLabel: 'Menú',
    addItemLabel: 'Agregar Plato',
    emoji: '🥗',
    defaultCategories: ['Ensaladas', 'Bowls', 'Platos Fuertes', 'Jugos', 'Postres']
  },

  // SERVICIOS
  barber: {
    type: 'service',
    label: 'Barbería',
    labelPlural: 'Barberías',
    itemLabel: 'Servicio',
    itemsLabel: 'Servicios',
    addItemLabel: 'Agregar Servicio',
    emoji: '💈',
    defaultCategories: ['Cortes', 'Barba', 'Tratamientos', 'Combos']
  },
  spa: {
    type: 'service',
    label: 'Spa & Bienestar',
    labelPlural: 'Spas',
    itemLabel: 'Servicio',
    itemsLabel: 'Servicios',
    addItemLabel: 'Agregar Servicio',
    emoji: '🧘',
    defaultCategories: ['Masajes', 'Faciales', 'Corporales', 'Paquetes']
  },
  salon: {
    type: 'service',
    label: 'Salón de Belleza',
    labelPlural: 'Salones',
    itemLabel: 'Servicio',
    itemsLabel: 'Servicios',
    addItemLabel: 'Agregar Servicio',
    emoji: '💅',
    defaultCategories: ['Cabello', 'Uñas', 'Maquillaje', 'Tratamientos', 'Paquetes']
  },

  // TIENDAS
  floreria: {
    type: 'store',
    label: 'Floristería',
    labelPlural: 'Floristerías',
    itemLabel: 'Producto',
    itemsLabel: 'Catálogo',
    addItemLabel: 'Agregar Producto',
    emoji: '🌸',
    defaultCategories: ['Ramos', 'Arreglos', 'Plantas', 'Ocasiones', 'Accesorios']
  }
}

// Helper para obtener config con fallback a general
export function getBusinessConfig(theme: string): BusinessTypeConfig {
  return businessTypeConfig[theme] || businessTypeConfig.general
}

// Helper para obtener el label correcto del negocio
export function getBusinessLabel(theme: string): string {
  return getBusinessConfig(theme).label
}

// Helper para obtener categorías por defecto
export function getDefaultCategories(theme: string): string[] {
  return getBusinessConfig(theme).defaultCategories
}
