# Digitaliza - Plataforma de Menus Digitales

Sistema SaaS para crear paginas web tipo Link-in-Bio y menus digitales para restaurantes y negocios locales.

## Estado del Proyecto

| Aspecto | Estado |
|---------|--------|
| **Version** | 2.0.0-beta |
| **Ultima actualizacion** | 2024-12-04 |
| **Estado** | En desarrollo activo |
| **Templates PREMIUM** | 8 nichos implementados |
| **Templates PRO** | 8 nichos con admin panel |

## Stack Tecnologico

| Tecnologia | Version/Descripcion |
|------------|---------------------|
| **Framework** | Next.js 14 (App Router) |
| **Lenguaje** | TypeScript |
| **Estilos** | Tailwind CSS |
| **Animaciones** | Framer Motion |
| **Base de Datos** | PostgreSQL (Neon) |
| **ORM** | Prisma |
| **Autenticacion** | NextAuth.js |

## Estructura del Proyecto

```
digitaliza-unified/
├── src/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── (auth)/             # Rutas de autenticacion
│   │   ├── admin/              # Panel de administracion
│   │   ├── api/                # API Routes
│   │   ├── demo/               # Demos de templates
│   │   │   └── [template]/     # Ruta dinamica para templates
│   │   └── [slug]/             # Paginas publicas de negocios
│   ├── components/
│   │   ├── landing/            # Componentes de landing page
│   │   ├── templates/          # Templates de negocios (19 templates)
│   │   └── ui/                 # Componentes UI reutilizables
│   ├── lib/                    # Utilidades y configuracion
│   └── types/                  # Tipos TypeScript
├── prisma/                     # Schema de base de datos
├── public/                     # Assets estaticos
└── docs/                       # Documentacion adicional
```

---

## Templates Disponibles

### 1. Templates PREMIUM (Recomendados)
Basados en el diseno "SALVAJE MEDELLIN" - Elegante, oscuro, con colores de acento variables.

| Nicho | Ruta | Color Acento |
|-------|------|--------------|
| Barberia | `/demo/barberia-premium` | Dorado (#d4a853) |
| Italiano | `/demo/italian-premium` | Verde (#22c55e) |
| Mexicano | `/demo/mexican-premium` | Rojo (#dc2626) |
| Hamburguesas | `/demo/hamburguesa-premium` | Naranja (#f97316) |
| Spa | `/demo/spa-premium` | Teal (#14b8a6) |
| Salon | `/demo/salon-premium` | Rosa (#ec4899) |
| Floreria | `/demo/floreria-premium` | Rose (#f43f5e) |
| Vegetariano | `/demo/vegetariano-premium` | Lima (#84cc16) |

**Caracteristicas:**
- Header sticky con logo (emoji) y navegacion
- Categorias de menu colapsables con animacion
- Modal de detalle de platos (slide-up desde abajo)
- Formulario de reservaciones con calendario de 14 dias
- Botones CTA: WhatsApp, Llamar, Instagram
- Animaciones CSS elegantes (slideDown, slideUp, fadeIn)
- Hover effects premium en cards
- 100% Mobile-first responsive
- Scrollbar personalizado

### 2. Templates PRO (Con Panel Admin)
Templates con vista de cliente + panel de administracion integrado (split-view en desktop).

| Nicho | Ruta |
|-------|------|
| Barberia | `/demo/barberia-pro` |
| Italiano | `/demo/italian-pro` |
| Mexicano | `/demo/mexican-pro` |
| Hamburguesas | `/demo/hamburguesa-pro` |
| Spa | `/demo/spa-pro` |
| Salon | `/demo/salon-pro` |
| Floreria | `/demo/floreria-pro` |
| Vegetariano | `/demo/vegetariano-pro` |

**Caracteristicas Admin Panel:**
- Tab Menu: Agregar, editar, eliminar items
- Tab Reservaciones: Ver y gestionar reservas
- Tab Configuracion: Editar datos del negocio

### 3. Templates Link-in-Bio (Simples)
Templates estilo Linktree para negocios.

| Nicho | Ruta |
|-------|------|
| Barberia | `/demo/barberia` |
| Italiano | `/demo/italian` |
| Mexicano | `/demo/mexican` |
| Hamburguesas | `/demo/hamburguesa` |
| Spa | `/demo/spa` |
| Salon de Belleza | `/demo/salon-belleza` |
| Floreria | `/demo/floreria` |
| Vegetariano | `/demo/vegetariano` |

### 4. Templates Legacy (Menu con imagenes)
Templates clasicos estilo menu de restaurante con imagenes de platos.

| Template | Ruta |
|----------|------|
| Elegant | `/demo/elegant` |
| Modern | `/demo/modern` |
| Artisan | `/demo/artisan` |
| Luxury | `/demo/luxury` |

---

## Instalacion

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales de Neon

# 3. Generar cliente Prisma
npx prisma generate

# 4. Ejecutar migraciones
npx prisma migrate dev

# 5. Iniciar servidor de desarrollo
npm run dev
```

## Variables de Entorno

```env
# Base de datos (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# URL base de la aplicacion
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## Scripts Disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm run start` | Iniciar servidor produccion |
| `npm run lint` | Ejecutar linter |
| `npx prisma studio` | GUI de base de datos |
| `npx prisma db push` | Sincronizar schema |

---

## Arquitectura de Templates

### PremiumTemplate (Recomendado)

```typescript
interface PremiumTemplateProps {
  business: {
    name: string
    tagline?: string
    phone: string
    whatsapp: string
    address: string
    hours?: string
    instagram?: string
    logoEmoji?: string
    rating?: number
    reviewCount?: number
  }
  menuItems?: MenuItem[]
  theme?: Partial<ThemeColors>
}

interface ThemeColors {
  primaryDark: string      // Fondo principal (#0a0a0a)
  secondaryDark: string    // Fondo secundario (#1a1a1a)
  accentGold: string       // Color de acento
  accentLight: string      // Acento claro
  textLight: string        // Texto principal (#e8e8e8)
  textMuted: string        // Texto secundario (#9ca3af)
  border: string           // Bordes (rgba)
}
```

### Uso de Temas Predefinidos

```typescript
import { premiumThemes } from '@/components/templates'

// Temas disponibles
premiumThemes.default      // Dorado clasico
premiumThemes.italian      // Verde
premiumThemes.mexican      // Rojo
premiumThemes.hamburguesa  // Naranja
premiumThemes.barberia     // Dorado oscuro
premiumThemes.spa          // Teal
premiumThemes.salon        // Rosa
premiumThemes.floreria     // Rose
premiumThemes.vegetariano  // Lima
```

---

## API Endpoints

### Publicos
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/api/restaurants/[slug]` | Obtener restaurante y menu |

### Protegidos (requieren sesion)
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | `/api/restaurants` | Crear restaurante |
| PUT | `/api/restaurants/[slug]` | Actualizar restaurante |
| POST | `/api/restaurants/[slug]/menu` | Crear item de menu |
| PUT | `/api/restaurants/[slug]/menu/[id]` | Actualizar item |
| DELETE | `/api/restaurants/[slug]/menu/[id]` | Eliminar item |

### Auth
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | `/api/auth/login` | Iniciar sesion |
| POST | `/api/auth/logout` | Cerrar sesion |

---

## Modelo de Datos

```prisma
model Restaurant {
  id          String     @id @default(cuid())
  slug        String     @unique
  name        String
  phone       String
  whatsapp    String
  email       String?
  address     String
  description String?
  logoUrl     String?
  theme       String     @default("general")
  hours       String     @default("{}")
  password    String     // bcrypt hash
  isActive    Boolean    @default(true)
  items       MenuItem[]
  sessions    Session[]
}

model MenuItem {
  id           String     @id @default(cuid())
  name         String
  description  String?
  price        Decimal
  imageUrl     String?
  category     String
  available    Boolean    @default(true)
  order        Int        @default(0)
  restaurantId String
  restaurant   Restaurant @relation(...)
}
```

---

## Archivos de Templates

```
src/components/templates/
├── index.ts                    # Exportaciones y tipos
├── PremiumTemplate.tsx         # Template PREMIUM (recomendado)
├── UnifiedProTemplate.tsx      # Template PRO con admin
├── BarberiaTemplate.tsx        # Link-in-Bio Barberia
├── ItalianTemplate.tsx         # Link-in-Bio Italiano
├── MexicanTemplate.tsx         # Link-in-Bio Mexicano
├── HamburguesaTemplate.tsx     # Link-in-Bio Hamburguesas
├── SpaTemplate.tsx             # Link-in-Bio Spa
├── SalonBellezaTemplate.tsx    # Link-in-Bio Salon
├── FloreriaTemplate.tsx        # Link-in-Bio Floreria
├── VegetarianoTemplate.tsx     # Link-in-Bio Vegetariano
├── ElegantTemplate.tsx         # Legacy - Elegant
├── ModernTemplate.tsx          # Legacy - Modern
├── ArtisanTemplate.tsx         # Legacy - Artisan
├── LuxuryTemplate.tsx          # Legacy - Luxury
├── CoffeeTemplate.tsx          # Legacy - Coffee
├── JapaneseTemplate.tsx        # Legacy - Japanese
└── NailsTemplate.tsx           # Legacy - Nails
```

---

## Documentacion Adicional

Ver carpeta `../docs/` para:
- `PRD_PATHFINDERS_LABS.md` - Documento de requerimientos del producto
- `BACKLOG-KISS-FINAL.md` - Backlog de desarrollo
- `EVALUACION-ARQUITECTURA-KISS.md` - Evaluacion de arquitectura
- `PLAN-DESARROLLO-DIGITALIZA.md` - Plan de desarrollo

---

## Licencia

Privado - Todos los derechos reservados

---

**Desarrollado por:** Pathfinders Labs
**Ultima actualizacion:** 2024-12-04
**Version:** 2.0.0-beta
