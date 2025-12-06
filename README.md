# Digitaliza - Plataforma Link-in-Bio con Menu Digital

Sistema SaaS para crear paginas web tipo Link-in-Bio con menu digital, gestion de citas, pedidos y enlaces personalizados para negocios locales.

## URLs de Produccion

| Ambiente | URL |
|----------|-----|
| **Produccion** | https://digitaliza-unified-mosaiko-labs-projects.vercel.app |
| **Repositorio** | https://github.com/founderjourney/digitaliza-unified |

## Estado del Proyecto

| Aspecto | Estado |
|---------|--------|
| **Version** | 3.0.0 |
| **Ultima actualizacion** | 2024-12-06 |
| **Estado** | Produccion - Sistema Completo |
| **Templates** | 8+ nichos implementados |
| **Hosting** | Vercel |
| **Database** | Neon PostgreSQL |

## Funcionalidades Principales

### Para Clientes (Pagina Publica)
- **Menu/Catalogo digital** interactivo con categorias
- **Carrito de compras** con drawer y checkout
- **Sistema de citas** para servicios (barberia, spa, salon)
- **Reservas de mesa** para restaurantes
- **Pedidos online** con pickup/delivery
- **Integracion WhatsApp** para confirmaciones
- **Enlaces personalizados** (Instagram, Uber Eats, Rappi, etc.)
- **Codigo QR** escaneable

### Panel de Administracion (Mobile-First)
- **Gestion de Menu/Productos/Servicios** - CRUD completo
- **Gestion de Citas** - Ver, confirmar, completar, cancelar
- **Gestion de Pedidos** - Workflow completo de estados
- **Gestion de Enlaces** - Redes sociales y delivery
- **Gestion de Reservas** - Para restaurantes
- **Codigo QR** - Generar y descargar
- **Configuracion** - Ver informacion del negocio

### Branding Personalizado
- **Logo custom** - Subida de imagen
- **Colores personalizados** - Primario, secundario, acento
- **Override de tema** - Los colores custom tienen prioridad

## Modos de Negocio

El sistema se adapta automaticamente segun el tipo de negocio:

| Modo | Ejemplo | Carrito | Citas | Reservas | Pedidos |
|------|---------|---------|-------|----------|---------|
| `restaurant` | Restaurante, Cafe | Si | No | Si | Si |
| `services` | Barberia, Spa | No | Si | No | No |
| `store` | Floreria, Tienda | Si | No | No | Si |
| `mixed` | Negocio mixto | Si | Si | Si | Si |

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
| **Estado** | React Context (CartContext) |

## Estructura del Proyecto

```
digitaliza-unified/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/              # Login/Logout
│   │   │   ├── appointments/      # CRUD Citas
│   │   │   │   ├── [id]/          # Operaciones individuales
│   │   │   │   └── availability/  # Verificar disponibilidad
│   │   │   ├── orders/            # CRUD Pedidos
│   │   │   │   └── [id]/          # Operaciones + estados
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
│   │       └── admin/
│   │           ├── page.tsx       # Panel de administracion
│   │           └── qr/page.tsx    # Generador QR
│   ├── components/
│   │   ├── templates/             # Templates de negocios
│   │   ├── client/                # Componentes cliente
│   │   │   ├── CartDrawer.tsx     # Carrito lateral
│   │   │   ├── AppointmentModal.tsx # Modal de citas
│   │   │   └── CheckoutModal.tsx  # Modal de checkout
│   │   ├── admin/                 # Componentes admin
│   │   │   ├── AppointmentsList.tsx # Lista de citas
│   │   │   └── OrdersList.tsx     # Lista de pedidos
│   │   ├── landing/               # Componentes de landing
│   │   ├── QRGenerator.tsx        # Generador de QR
│   │   └── ui/                    # Componentes reutilizables
│   ├── contexts/
│   │   └── CartContext.tsx        # Estado global del carrito
│   ├── lib/
│   │   ├── db.ts                  # Conexion a Neon
│   │   ├── prisma.ts              # Cliente Prisma singleton
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
  id                   String        @id
  slug                 String        @unique
  name                 String
  phone                String
  whatsapp             String
  email                String?
  address              String
  description          String?
  logoUrl              String?
  theme                String        @default("general")
  businessMode         String        @default("restaurant")
  hours                String        @default("{}")
  // Branding personalizado
  customPrimaryColor   String?
  customSecondaryColor String?
  customAccentColor    String?
  password             String
  isActive             Boolean       @default(true)
  // Relaciones
  items                MenuItem[]
  links                Link[]
  reservations         Reservation[]
  appointments         Appointment[]
  orders               Order[]
  sessions             Session[]
}

model MenuItem {
  id           String        @id
  name         String
  description  String?
  price        Decimal
  imageUrl     String?
  category     String
  available    Boolean       @default(true)
  order        Int           @default(0)
  duration     Int?          // Para servicios (minutos)
  restaurantId String
  appointments Appointment[]
  orderItems   OrderItem[]
}

model Appointment {
  id            String   @id
  customerName  String
  customerPhone String
  customerEmail String?
  date          DateTime
  startTime     String
  endTime       String
  duration      Int
  status        String   @default("pending")
  notes         String?
  adminNotes    String?
  menuItemId    String
  restaurantId  String
}

model Order {
  id              String      @id
  orderNumber     String
  customerName    String
  customerPhone   String
  customerEmail   String?
  deliveryAddress String?
  deliveryNotes   String?
  orderType       String      @default("pickup")
  subtotal        Decimal
  deliveryFee     Decimal     @default(0)
  tax             Decimal     @default(0)
  total           Decimal
  status          String      @default("pending")
  estimatedTime   Int?
  notes           String?
  adminNotes      String?
  paymentMethod   String?
  restaurantId    String
  items           OrderItem[]
}

model OrderItem {
  id           String  @id
  quantity     Int
  unitPrice    Decimal
  totalPrice   Decimal
  notes        String?
  orderId      String
  menuItemId   String
  itemName     String
  itemCategory String?
}

model Link {
  id           String  @id
  title        String
  url          String
  icon         String  @default("link")
  isActive     Boolean @default(true)
  order        Int     @default(0)
  clicks       Int     @default(0)
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
  status       String   @default("pending")
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
| GET | `/api/appointments/availability` | Verificar disponibilidad de citas |
| POST | `/api/appointments` | Crear cita |
| POST | `/api/orders` | Crear pedido |

### Protegidos (requieren sesion)
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | `/api/restaurants` | Registrar negocio |
| PUT | `/api/restaurants/[slug]` | Actualizar negocio |
| POST/PUT/DELETE | `/api/restaurants/[slug]/menu/[id]` | CRUD items |
| POST/PUT/DELETE | `/api/restaurants/[slug]/links/[id]` | CRUD enlaces |
| GET/PUT/DELETE | `/api/restaurants/[slug]/reservations/[id]` | CRUD reservas |
| GET | `/api/appointments?restaurantId=xxx` | Listar citas |
| PUT/DELETE | `/api/appointments/[id]` | Gestionar cita |
| GET | `/api/orders?restaurantId=xxx` | Listar pedidos |
| PUT | `/api/orders/[id]` | Actualizar estado pedido |

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

## Flujos de Usuario

### Flujo de Cita (Servicios)
1. Cliente ve catalogo de servicios
2. Hace clic en un servicio
3. Abre modal de cita
4. Selecciona fecha y hora disponible
5. Ingresa datos de contacto
6. Confirma cita
7. Recibe notificacion por WhatsApp

### Flujo de Pedido (Restaurant/Store)
1. Cliente navega el menu/catalogo
2. Agrega items al carrito
3. Abre carrito y ajusta cantidades
4. Procede al checkout
5. Selecciona pickup o delivery
6. Ingresa datos de contacto
7. Confirma pedido
8. Recibe notificacion por WhatsApp

### Flujo de Reserva (Restaurant)
1. Cliente navega a seccion de reservas
2. Selecciona fecha y hora
3. Indica numero de personas
4. Ingresa datos de contacto
5. Confirma reserva
6. Recibe notificacion por WhatsApp

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

## Changelog v3.0.0

### Nuevas Funcionalidades
- Sistema completo de citas (Appointments)
- Sistema completo de pedidos (Orders)
- Carrito de compras con Context API
- Checkout con pickup/delivery
- Verificacion de disponibilidad en tiempo real
- Branding personalizado (logo + colores)
- Modales interactivos para citas y checkout
- Panel admin con tabs por funcionalidad

### Mejoras
- API mejorada con campos de branding
- Templates actualizados con soporte de carrito
- Mejor UX en mobile
- Integracion WhatsApp en todos los flujos

---

**Desarrollado por:** Pathfinders Labs
**Version:** 3.0.0
**Licencia:** Privada
