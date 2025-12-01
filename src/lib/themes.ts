// Theme configuration for Digitaliza - 6 business types
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
      order: 'Hola! Me gustaría ordenar:',
    },
    categories: ['General'],
  },

  italian: {
    name: 'Italiano',
    colors: {
      primary: '#2D5A3D',
      secondary: '#C41E3A',
      background: '#FFF8F0',
      surface: '#FFFFFF',
      text: '#1F2937',
      textMuted: '#6B7280',
    },
    emoji: '🇮🇹',
    messages: {
      reservation: 'Ciao! Vorrei prenotare un tavolo.',
      order: 'Ciao! Vorrei ordinare:',
    },
    categories: ['Antipasti', 'Primi', 'Secondi', 'Dolci', 'Bevande'],
  },

  japanese: {
    name: 'Japonés',
    colors: {
      primary: '#C41E3A',
      secondary: '#1A1A1A',
      background: '#FFF5F5',
      surface: '#FFFFFF',
      text: '#1F2937',
      textMuted: '#6B7280',
    },
    emoji: '🇯🇵',
    messages: {
      reservation: 'こんにちは! Quisiera reservar una mesa.',
      order: 'こんにちは! Quisiera ordenar:',
    },
    categories: ['Sushi', 'Ramen', 'Tempura', 'Postres', 'Bebidas'],
  },

  mexican: {
    name: 'Mexicano',
    colors: {
      primary: '#D97706',
      secondary: '#DC2626',
      background: '#FFFBEB',
      surface: '#FFFFFF',
      text: '#1F2937',
      textMuted: '#6B7280',
    },
    emoji: '🇲🇽',
    messages: {
      reservation: '¡Hola! Quisiera reservar una mesa.',
      order: '¡Hola! Me gustaría ordenar:',
    },
    categories: ['Tacos', 'Burritos', 'Quesadillas', 'Postres', 'Bebidas'],
  },

  coffee: {
    name: 'Cafetería',
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
    categories: ['Café', 'Té', 'Pasteles', 'Snacks', 'Bebidas Frías'],
  },

  barber: {
    name: 'Barbería',
    colors: {
      primary: '#1F2937',
      secondary: '#D97706',
      background: '#F3F4F6',
      surface: '#FFFFFF',
      text: '#1F2937',
      textMuted: '#6B7280',
    },
    emoji: '💈',
    messages: {
      reservation: 'Hola! Quisiera agendar una cita.',
      order: 'Hola! Me interesa:',
    },
    categories: ['Cortes', 'Barba', 'Tratamientos', 'Productos'],
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
