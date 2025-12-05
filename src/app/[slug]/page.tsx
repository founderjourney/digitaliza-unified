import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PremiumTemplate } from '@/components/templates'
import { getPremiumTheme, themes } from '@/lib/themes'
import type { Restaurant, MenuItem, Link } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getRestaurant(slug: string): Promise<{ restaurant: Restaurant; items: MenuItem[] } | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/restaurants/${slug}`, {
      cache: 'no-store',
    })

    if (!res.ok) return null

    const data = await res.json()

    // Handle API response structure
    if (data.restaurant) {
      return { restaurant: data.restaurant, items: data.items || [] }
    }

    // If direct response (legacy)
    return { restaurant: data, items: data.items || [] }
  } catch {
    return null
  }
}

async function getLinks(slug: string): Promise<Link[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/restaurants/${slug}/links`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getRestaurant(slug)

  if (!data) {
    return { title: 'Menu no encontrado' }
  }

  return {
    title: `${data.restaurant.name} | Menu Digital`,
    description: data.restaurant.description || `Ver menu de ${data.restaurant.name}`,
    openGraph: {
      title: data.restaurant.name,
      description: `Menu digital de ${data.restaurant.name}`,
      images: data.restaurant.logoUrl ? [data.restaurant.logoUrl] : [],
    },
  }
}

export default async function MenuPage({ params }: PageProps) {
  const { slug } = await params
  const [data, links] = await Promise.all([
    getRestaurant(slug),
    getLinks(slug)
  ])

  if (!data) {
    notFound()
  }

  const { restaurant, items } = data

  // Filter only active links
  const activeLinks = links.filter(link => link.isActive)

  // Filter only available items for public view
  const availableItems = items.filter((item) => item.available)

  // Get theme configuration
  const themeKey = restaurant.theme || 'general'
  const selectedTheme = getPremiumTheme(themeKey)
  const themeConfig = themes[themeKey as keyof typeof themes] || themes.general

  // Map restaurant data to business config format for PremiumTemplate
  const businessConfig = {
    name: restaurant.name,
    tagline: restaurant.description || `Bienvenido a ${restaurant.name}`,
    phone: restaurant.phone,
    whatsapp: restaurant.whatsapp,
    address: restaurant.address,
    hours: typeof restaurant.hours === 'string' ? JSON.parse(restaurant.hours || '{}') : (restaurant.hours || {}),
    instagram: '', // Can be added to restaurant model later
    logoEmoji: themeConfig.emoji || '🏪',
    rating: 4.8, // Default rating
    reviewCount: 150, // Default review count
  }

  // Map menu items to PremiumTemplate format
  const formattedMenuItems = availableItems.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description || '',
    price: typeof item.price === 'string' ? parseFloat(item.price) : Number(item.price),
    category: item.category || 'General',
    time: '15-20 min',
    emoji: getCategoryEmoji(item.category),
    image: item.imageUrl || undefined,
    available: item.available,
  }))

  return (
    <PremiumTemplate
      business={businessConfig}
      menuItems={formattedMenuItems}
      theme={selectedTheme}
      links={activeLinks}
      slug={slug}
      businessMode={restaurant.businessMode || 'restaurant'}
    />
  )
}

// Helper function to get emoji based on category
function getCategoryEmoji(category: string | undefined): string {
  if (!category) return '🍽️'

  const categoryLower = category.toLowerCase()

  const emojiMap: Record<string, string> = {
    // Food categories
    'entradas': '🥗',
    'appetizers': '🥗',
    'starters': '🥗',
    'ensaladas': '🥬',
    'salads': '🥬',
    'sopas': '🍲',
    'soups': '🍲',
    'principales': '🍽️',
    'main': '🍽️',
    'platos fuertes': '🍖',
    'carnes': '🥩',
    'meat': '🥩',
    'pollo': '🍗',
    'chicken': '🍗',
    'pescados': '🐟',
    'fish': '🐟',
    'mariscos': '🦐',
    'seafood': '🦐',
    'pastas': '🍝',
    'pasta': '🍝',
    'pizzas': '🍕',
    'pizza': '🍕',
    'hamburguesas': '🍔',
    'burgers': '🍔',
    'tacos': '🌮',
    'burritos': '🌯',
    'sushi': '🍣',
    'postres': '🍰',
    'desserts': '🍰',
    'dulces': '🍬',
    'sweets': '🍬',
    'bebidas': '🥤',
    'drinks': '🥤',
    'cocktails': '🍸',
    'cocteles': '🍸',
    'cervezas': '🍺',
    'beer': '🍺',
    'vinos': '🍷',
    'wine': '🍷',
    'cafe': '☕',
    'coffee': '☕',
    'te': '🍵',
    'tea': '🍵',
    'jugos': '🧃',
    'juice': '🧃',
    'desayunos': '🍳',
    'breakfast': '🍳',
    'almuerzos': '🥪',
    'lunch': '🥪',
    // Service categories
    'cortes': '✂️',
    'haircuts': '✂️',
    'barberia': '💈',
    'barber': '💈',
    'tratamientos': '🧴',
    'treatments': '🧴',
    'masajes': '💆',
    'massage': '💆',
    'manicure': '💅',
    'pedicure': '🦶',
    'facial': '🧖',
    'flores': '🌸',
    'flowers': '🌸',
    'arreglos': '💐',
    'arrangements': '💐',
    'plantas': '🪴',
    'plants': '🪴',
  }

  // Check if any key is included in the category
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (categoryLower.includes(key)) {
      return emoji
    }
  }

  return '🍽️'
}
