import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ItalianTemplate from '@/components/templates/ItalianTemplate'
import JapaneseTemplate from '@/components/templates/JapaneseTemplate'
import MexicanTemplate from '@/components/templates/MexicanTemplate'
import CoffeeTemplate from '@/components/templates/CoffeeTemplate'
import type { Restaurant, MenuItem } from '@/types'

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
  const data = await getRestaurant(slug)

  if (!data) {
    notFound()
  }

  const { restaurant, items } = data

  // Filter only available items for public view
  const availableItems = items.filter((item) => item.available)

  // Select template based on theme
  const theme = restaurant.theme || 'general'

  const templateProps = {
    restaurant,
    menuItems: availableItems,
    isAdmin: false,
  }

  switch (theme) {
    case 'italian':
      return <ItalianTemplate {...templateProps} />
    case 'japanese':
      return <JapaneseTemplate {...templateProps} />
    case 'mexican':
      return <MexicanTemplate {...templateProps} />
    case 'coffee':
      return <CoffeeTemplate {...templateProps} />
    default:
      // For general, barber, and other themes - use a simple template
      return <GeneralTemplate {...templateProps} />
  }
}

// Simple general template for themes without specific templates
function GeneralTemplate({
  restaurant,
  menuItems,
}: {
  restaurant: Restaurant
  menuItems: MenuItem[]
}) {
  const groupedItems = menuItems.reduce(
    (acc, item) => {
      const cat = item.category || 'General'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(item)
      return acc
    },
    {} as Record<string, MenuItem[]>
  )

  const whatsappUrl = `https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hola! Me gustaria hacer un pedido.')}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white px-4 py-4 shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{restaurant.name}</h1>
            <p className="text-sm text-gray-600">{restaurant.address}</p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-green-500 text-white"
          >
            WA
          </a>
        </div>
      </header>

      {/* Menu */}
      <main className="mx-auto max-w-2xl px-4 py-6">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <section key={category} className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">{category}</h2>
            <div className="space-y-3">
              {categoryItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between rounded-lg bg-white p-4 shadow-sm"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    {item.description && (
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 text-right">
                    <span className="font-semibold text-blue-600">${item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {menuItems.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            Este menu esta vacio por ahora.
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-lg">
        <div className="mx-auto flex max-w-2xl gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 min-h-[44px] items-center justify-center rounded-lg bg-green-500 font-medium text-white"
          >
            Hacer Pedido
          </a>
          <a
            href={`tel:${restaurant.phone}`}
            className="flex min-h-[44px] min-w-[100px] items-center justify-center rounded-lg bg-gray-200 font-medium text-gray-700"
          >
            Llamar
          </a>
        </div>
      </footer>

      {/* Spacer for fixed footer */}
      <div className="h-24" />
    </div>
  )
}
