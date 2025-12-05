# Digitaliza - Plataforma Link-in-Bio con Menu Digital

Sistema SaaS para crear paginas web tipo Link-in-Bio con menu digital, gestion de reservas/citas y enlaces personalizados para negocios locales.

## URLs de Produccion

| Ambiente | URL |
|----------|-----|
| **Produccion** | https://digitaliza-unified-mosaiko-labs-projects.vercel.app |
| **Repositorio** | https://github.com/founderjourney/digitaliza-unified |

## Estado del Proyecto

| Aspecto | Estado |
|---------|--------|
| **Version** | 2.1.0 |
| **Ultima actualizacion** | 2024-12-05 |
| **Estado** | MVP Completo - Deployed |
| **Templates** | 8+ nichos implementados |
| **Hosting** | Vercel |
| **Database** | Neon PostgreSQL |

## Funcionalidades Principales

### Para Negocios
- **Pagina publica** con menu/catalogo digital
- **Enlaces personalizados** (Instagram, WhatsApp, Uber Eats, etc.)
- **Formulario de reservas/citas** integrado
- **Codigo QR** descargable
- **Temas premium** por nicho de negocio

### Panel de Administracion (Mobile-First)
- **Gestion de Menu/Productos/Servicios** - CRUD completo
- **Gestion de Enlaces** - Agregar redes sociales y delivery
- **Gestion de Reservas** - Ver, confirmar, cancelar, contactar por WhatsApp
- **Codigo QR** - Generar y descargar
- **Configuracion** - Ver informacion del negocio

## Modos de Negocio

El sistema se adapta automaticamente segun el tipo de negocio:

| Modo | Ejemplo | Tab Items | Tab Reservas |
|------|---------|-----------|--------------|
| `restaurant` | Restaurante, Cafe | Menu | Reservas |
| `services` | Barberia, Spa | Servicios | Citas |
| `store` | Floreria, Tienda | Productos | *(No aplica)* |
| `mixed` | Negocio mixto | Catalogo | Reservas/Citas |

## Stack Tecnologico

| Tecnologia | Version/Descripcion |
|------------|---------------------|
| **Framework** | Next.js 14 (App Router) |
| **Lenguaje** | TypeScript |
| **Estilos** | Tailwind CSS |
| **Animaciones** | Framer Motion |
| **Base de Datos** | PostgreSQL (Neon) |
| **ORM** | Prisma + @neondatabase/serverless |
| **Autenticacion** | Custom (bcrypt + cookies) |

## Estructura del Proyecto

```
digitaliza-unified/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/              # Login/Logout
│   │   │   ├── restaurants/       # CRUD Restaurantes
│   │   │   │   └── [slug]/
│   │   │   │       ├── menu/      # CRUD Items
│   │   │   │       ├── links/     # CRUD Enlaces
│   │   │   │       └── reservations/ # CRUD Reservas
│   │   │   └── upload/            # Subida de imagenes
│   │   ├── demo/                  # Demos de templates
│   │   ├── register/              # Registro de negocios
│   │   ├── login/                 # Login page
│   │   └── [slug]/
│   │       ├── page.tsx           # Pagina publica del negocio
│   │       └── admin/page.tsx     # Panel de administracion
│   ├── components/
│   │   ├── templates/             # Templates de negocios
│   │   ├── landing/               # Componentes de landing
│   │   ├── QRGenerator.tsx        # Generador de QR
│   │   └── ui/                    # Componentes reutilizables
│   ├── lib/
│   │   ├── db.ts                  # Conexion a Neon
│   │   ├── auth.ts                # Funciones de autenticacion
│   │   ├── themes.ts              # Configuracion de temas
│   │   ├── business-config.ts     # Config por tipo de negocio
│   │   ├── sample-menu-items.ts   # Items de ejemplo por tema
│   │   └── validations.ts         # Schemas Zod
│   └── types/                     # Tipos TypeScript
├── prisma/
│   └── schema.prisma              # Modelo de datos
└── public/                        # Assets estaticos
```

## Modelo de Datos

```prisma
model Restaurant {
  id           String        @id
  slug         String        @unique
  name         String
  phone        String
  whatsapp     String
  email        String?
  address      String
  description  String?
  logoUrl      String?
  theme        String        @default("general")
  businessMode String        @default("restaurant")  // restaurant|services|store|mixed
  hours        String        @default("{}")
  password     String        // bcrypt hash
  isActive     Boolean       @default(true)
  items        MenuItem[]
  links        Link[]
  reservations Reservation[]
  sessions     Session[]
}

model MenuItem {
  id           String     @id
  name         String
  description  String?
  price        Decimal
  imageUrl     String?
  category     String
  available    Boolean    @default(true)
  order        Int        @default(0)
  restaurantId String
}

model Link {
  id           String     @id
  title        String
  url          String
  icon         String     @default("link")
  isActive     Boolean    @default(true)
  order        Int        @default(0)
  clicks       Int        @default(0)
  restaurantId String
}

model Reservation {
  id           String   @id
  name         String
  phone        String
  email        String?
  date         DateTime
  time         String
  guests       Int
  notes        String?
  status       String   @default("pending")  // pending|confirmed|completed|cancelled
  restaurantId String
}
```

## API Endpoints

### Publicos
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/api/restaurants/[slug]` | Obtener negocio y menu |
| GET | `/api/restaurants/[slug]/links` | Obtener enlaces |
| POST | `/api/restaurants/[slug]/reservations` | Crear reserva |

### Protegidos (requieren sesion)
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | `/api/restaurants` | Registrar negocio |
| PUT | `/api/restaurants/[slug]` | Actualizar negocio |
| POST/PUT/DELETE | `/api/restaurants/[slug]/menu/[id]` | CRUD items |
| POST/PUT/DELETE | `/api/restaurants/[slug]/links/[id]` | CRUD enlaces |
| GET/PUT/DELETE | `/api/restaurants/[slug]/reservations/[id]` | CRUD reservas |

### Auth
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | `/api/auth/login` | Iniciar sesion (slug + password) |
| POST | `/api/auth/logout` | Cerrar sesion |

## Instalacion

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales de Neon

# 3. Sincronizar base de datos
npx prisma db push

# 4. Iniciar servidor de desarrollo
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
| `npx prisma studio` | GUI de base de datos |
| `npx prisma db push` | Sincronizar schema |

## Temas Disponibles

| Tema | Nicho | Color Acento |
|------|-------|--------------|
| `general` | General | Azul |
| `coffee` | Cafeteria | Ambar |
| `italian` | Italiano | Verde |
| `mexican` | Mexicano | Rojo |
| `japanese` | Japones | Indigo |
| `hamburguesa` | Hamburguesas | Naranja |
| `barber` | Barberia | Dorado |
| `spa` | Spa | Teal |
| `salon` | Salon de Belleza | Rosa |
| `floreria` | Floreria | Rose |
| `vegetariano` | Vegetariano | Lima |

---

## Flujo de Usuario

### Registro
1. Usuario llena formulario en `/register`
2. Selecciona tipo de negocio y tema
3. Sistema crea negocio con items de ejemplo
4. Usuario recibe su `slug` unico

### Administracion
1. Usuario accede a `/{slug}/admin`
2. Ingresa contrasena
3. Panel muestra tabs segun modo de negocio:
   - **Menu/Servicios/Productos**: Gestionar items
   - **Enlaces**: Agregar redes sociales y delivery
   - **Reservas/Citas**: Ver y gestionar reservaciones
   - **QR**: Descargar codigo QR
   - **Config**: Ver informacion del negocio

### Pagina Publica
1. Clientes acceden a `/{slug}`
2. Ven menu/catalogo con categorias
3. Pueden hacer reservas o contactar por WhatsApp
4. Acceden a enlaces del negocio

---

## Deploy a Vercel

### Variables de Entorno Requeridas

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
NEXT_PUBLIC_BASE_URL=https://tu-dominio.vercel.app
```

### Comandos de Deploy

```bash
# Deploy a produccion
vercel --prod --yes

# Ver estado de deployments
vercel ls

# Ver variables de entorno
vercel env ls
```

### Notas Importantes

- Si el sitio muestra "Authentication Required", desactiva Vercel Authentication en:
  **Settings → Deployment Protection → Production → No Protection**

---

**Desarrollado por:** Pathfinders Labs
**Version:** 2.1.0
**Licencia:** Privada
