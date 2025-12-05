// Theme configuration for Digitaliza - All business types
// Mobile-first design system

export const themes = {
  general: {
    name: 'General',
    colors: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#1F2937',
      textMuted: '#6B7280',
    },
    emoji: '📋',
    messages: {
      reservation: 'Hola! Quisiera hacer una reserva.',
      order: 'Hola! Me gustaria ordenar:',
    },
    categories: ['General'],
  },

  italian: {
    name: 'Italiano',
    colors: {
      primary: '#22c55e',
      secondary: '#15803d',
      background: '#0a0f0a',
      surface: '#1a251a',
      text: '#e8e8e8',
      textMuted: '#9ca3af',
    },
    emoji: '🍝',
    messages: {
      reservation: 'Ciao! Vorrei prenotare un tavolo.',
      order: 'Ciao! Vorrei ordinare:',
    },
    categories: ['Antipasti', 'Primi', 'Secondi', 'Dolci', 'Bevande'],
  },

  mexican: {
    name: 'Mexicano',
    colors: {
      primary: '#dc2626',
      secondary: '#b91c1c',
      background: '#0f0a0a',
      surface: '#251a1a',
      text: '#e8e8e8',
      textMuted: '#9ca3af',
    },
    emoji: '🌮',
    messages: {
      reservation: 'Hola! Quisiera reservar una mesa.',
      order: 'Hola! Me gustaria ordenar:',
    },
    categories: ['Tacos', 'Burritos', 'Quesadillas', 'Postres', 'Bebidas'],
  },

  hamburguesa: {
    name: 'Hamburguesas',
    colors: {
      primary: '#f97316',
      secondary: '#ea580c',
      background: '#0f0c0a',
      surface: '#251f1a',
      text: '#e8e8e8',
      textMuted: '#9ca3af',
    },
    emoji: '🍔',
    messages: {
      reservation: 'Hola! Quisiera reservar una mesa.',
      order: 'Hola! Me gustaria ordenar:',
    },
    categories: ['Burgers', 'Combos', 'Extras', 'Bebidas', 'Postres'],
  },

  barber: {
    name: 'Barberia',
    colors: {
      primary: '#d4a853',
      secondary: '#b8942f',
      background: '#0a0a0a',
      surface: '#1a1a1a',
      text: '#e8e8e8',
      textMuted: '#9ca3af',
    },
    emoji: '💈',
    messages: {
      reservation: 'Hola! Quisiera agendar una cita.',
      order: 'Hola! Me interesa:',
    },
    categories: ['Cortes', 'Barba', 'Tratamientos', 'Productos'],
  },

  spa: {
    name: 'Spa & Bienestar',
    colors: {
      primary: '#14b8a6',
      secondary: '#0d9488',
      background: '#0a0f0f',
      surface: '#1a2525',
      text: '#e8e8e8',
      textMuted: '#9ca3af',
    },
    emoji: '🧘',
    messages: {
      reservation: 'Hola! Quisiera agendar una cita.',
      order: 'Hola! Me interesa el servicio de:',
    },
    categories: ['Masajes', 'Faciales', 'Corporales', 'Paquetes', 'Productos'],
  },

  salon: {
    name: 'Salon de Belleza',
    colors: {
      primary: '#ec4899',
      secondary: '#db2777',
      background: '#0f0a0d',
      surface: '#251a20',
      text: '#e8e8e8',
      textMuted: '#9ca3af',
    },
    emoji: '💅',
    messages: {
      reservation: 'Hola! Quisiera agendar una cita.',
      order: 'Hola! Me interesa el servicio de:',
    },
    categories: ['Cabello', 'Unas', 'Maquillaje', 'Tratamientos', 'Paquetes'],
  },

  floreria: {
    name: 'Floristeria',
    colors: {
      primary: '#f43f5e',
      secondary: '#e11d48',
      background: '#0f0a0b',
      surface: '#251a1d',
      text: '#e8e8e8',
      textMuted: '#9ca3af',
    },
    emoji: '🌸',
    messages: {
      reservation: 'Hola! Quisiera hacer un pedido.',
      order: 'Hola! Me interesa:',
    },
    categories: ['Ramos', 'Arreglos', 'Plantas', 'Ocasiones', 'Accesorios'],
  },

  vegetariano: {
    name: 'Vegetariano/Vegano',
    colors: {
      primary: '#84cc16',
      secondary: '#65a30d',
      background: '#0a0f0a',
      surface: '#1a251a',
      text: '#e8e8e8',
      textMuted: '#9ca3af',
    },
    emoji: '🥗',
    messages: {
      reservation: 'Hola! Quisiera reservar una mesa.',
      order: 'Hola! Me gustaria ordenar:',
    },
    categories: ['Entradas', 'Platos Fuertes', 'Bowls', 'Jugos', 'Postres'],
  },

  coffee: {
    name: 'Cafeteria',
    colors: {
      primary: '#92400E',
      secondary: '#D97706',
      background: '#FDF5E6',
      surface: '#FFFFFF',
      text: '#1F2937',
      textMuted: '#6B7280',
    },
    emoji: '☕',
    messages: {
      reservation: 'Hola! Quisiera reservar una mesa.',
      order: 'Hola! Quisiera ordenar:',
    },
    categories: ['Cafe', 'Te', 'Pasteles', 'Snacks', 'Bebidas Frias'],
  },

  japanese: {
    name: 'Japones',
    colors: {
      primary: '#C41E3A',
      secondary: '#1A1A1A',
      background: '#FFF5F5',
      surface: '#FFFFFF',
      text: '#1F2937',
      textMuted: '#6B7280',
    },
    emoji: '🍣',
    messages: {
      reservation: 'Hola! Quisiera reservar una mesa.',
      order: 'Hola! Quisiera ordenar:',
    },
    categories: ['Sushi', 'Ramen', 'Tempura', 'Postres', 'Bebidas'],
  },
} as const

export type ThemeKey = keyof typeof themes
export type Theme = typeof themes[ThemeKey]

// Helper to get theme safely
export function getTheme(key: string): Theme {
  if (key in themes) {
    return themes[key as ThemeKey]
  }
  return themes.general
}

// Get all theme keys for forms
export function getThemeKeys(): ThemeKey[] {
  return Object.keys(themes) as ThemeKey[]
}

// Get theme options for select dropdown
export function getThemeOptions(): { value: ThemeKey; label: string; emoji: string }[] {
  return getThemeKeys().map((key) => ({
    value: key,
    label: themes[key].name,
    emoji: themes[key].emoji,
  }))
}

// Premium theme colors for PremiumTemplate component
// These are designed for dark mode premium layouts
export interface PremiumThemeColors {
  primaryDark: string
  secondaryDark: string
  accentGold: string
  accentLight: string
  textLight: string
  textMuted: string
  border: string
}

export const premiumThemes: Record<string, PremiumThemeColors> = {
  default: {
    primaryDark: '#0a0a0a',
    secondaryDark: '#1a1a1a',
    accentGold: '#d4af37',
    accentLight: '#f5e6d3',
    textLight: '#e8e8e8',
    textMuted: '#9ca3af',
    border: 'rgba(212, 175, 55, 0.2)'
  },
  italian: {
    primaryDark: '#0a0f0a',
    secondaryDark: '#1a251a',
    accentGold: '#22c55e',
    accentLight: '#dcfce7',
    textLight: '#e8e8e8',
    textMuted: '#9ca3af',
    border: 'rgba(34, 197, 94, 0.2)'
  },
  mexican: {
    primaryDark: '#0f0a0a',
    secondaryDark: '#251a1a',
    accentGold: '#dc2626',
    accentLight: '#fecaca',
    textLight: '#e8e8e8',
    textMuted: '#9ca3af',
    border: 'rgba(220, 38, 38, 0.2)'
  },
  hamburguesa: {
    primaryDark: '#0f0c0a',
    secondaryDark: '#251f1a',
    accentGold: '#f97316',
    accentLight: '#fed7aa',
    textLight: '#e8e8e8',
    textMuted: '#9ca3af',
    border: 'rgba(249, 115, 22, 0.2)'
  },
  barberia: {
    primaryDark: '#0a0a0a',
    secondaryDark: '#1a1a1a',
    accentGold: '#d4a853',
    accentLight: '#fef3c7',
    textLight: '#e8e8e8',
    textMuted: '#9ca3af',
    border: 'rgba(212, 168, 83, 0.2)'
  },
  spa: {
    primaryDark: '#0a0f0f',
    secondaryDark: '#1a2525',
    accentGold: '#14b8a6',
    accentLight: '#ccfbf1',
    textLight: '#e8e8e8',
    textMuted: '#9ca3af',
    border: 'rgba(20, 184, 166, 0.2)'
  },
  salon: {
    primaryDark: '#0f0a0f',
    secondaryDark: '#251a25',
    accentGold: '#ec4899',
    accentLight: '#fce7f3',
    textLight: '#e8e8e8',
    textMuted: '#9ca3af',
    border: 'rgba(236, 72, 153, 0.2)'
  },
  floreria: {
    primaryDark: '#0f0a0c',
    secondaryDark: '#251a1f',
    accentGold: '#f43f5e',
    accentLight: '#ffe4e6',
    textLight: '#e8e8e8',
    textMuted: '#9ca3af',
    border: 'rgba(244, 63, 94, 0.2)'
  },
  vegetariano: {
    primaryDark: '#0a0f0a',
    secondaryDark: '#1a251a',
    accentGold: '#84cc16',
    accentLight: '#ecfccb',
    textLight: '#e8e8e8',
    textMuted: '#9ca3af',
    border: 'rgba(132, 204, 22, 0.2)'
  }
}

// Map theme names to premiumThemes keys
export const premiumThemeMap: Record<string, keyof typeof premiumThemes> = {
  general: 'default',
  italian: 'italian',
  mexican: 'mexican',
  japanese: 'default',
  coffee: 'default',
  hamburguesa: 'hamburguesa',
  barberia: 'barberia',
  barber: 'barberia',
  spa: 'spa',
  salon: 'salon',
  floreria: 'floreria',
  vegetariano: 'vegetariano',
}

// Get premium theme by name with fallback to default
export function getPremiumTheme(themeName: string): PremiumThemeColors {
  const themeKey = premiumThemeMap[themeName] || 'default'
  return premiumThemes[themeKey] || premiumThemes.default
}
