# Digitaliza - Sistema de Menus Digitales SaaS

Sistema unificado para la creacion y gestion de menus digitales para restaurantes, cafeterias, barberias, spas y otros negocios.

## Estado del Proyecto

```
PROGRESO: 97% (28/29 tareas completadas)

DEV1 - Backend Core:    8/8  (100%)
DEV2 - Backend APIs:    6/6  (100%)
DEV3 - Frontend Core:   9/9  (100%)
DEV4 - Pages + Deploy:  5/6  (83%)

PENDIENTE: Deploy a produccion (Vercel + Neon)
```

## Tecnologias

- **Framework:** Next.js 14 (App Router)
- **Base de datos:** PostgreSQL (Neon) con Prisma ORM
- **Estilos:** Tailwind CSS (Mobile-first)
- **Lenguaje:** TypeScript (strict mode)
- **Auth:** bcryptjs + cookies httpOnly
- **Validacion:** Zod

## Estructura del Proyecto

```
src/
├── app/                    # Rutas Next.js (App Router)
│   ├── page.tsx            # Landing page
│   ├── register/           # Registro de negocios
│   ├── [slug]/             # Menu publico
│   │   └── admin/          # Panel de administracion
│   └── api/
│       ├── auth/           # Login / Logout
│       └── restaurants/    # CRUD restaurantes y menu
├── components/
│   ├── ui/                 # Button, Input, Modal, Toast, Spinner
│   ├── templates/          # Italian, Japanese, Mexican, Coffee
│   └── *.tsx               # AdminPanel, MenuTemplate, QR, Forms
├── lib/
│   ├── db.ts               # Prisma client
│   ├── auth.ts             # Sistema autenticacion
│   ├── themes.ts           # 6 temas de negocio
│   ├── utils.ts            # Helpers
│   └── validations.ts      # Schemas Zod
├── hooks/                  # Custom hooks de React
├── types/                  # Interfaces TypeScript
└── middleware.ts           # Proteccion de rutas
```

## Requisitos Previos

- Node.js 18+
- Cuenta en [Neon](https://neon.tech) (PostgreSQL serverless)
- npm o yarn

## Instalacion

1. Clonar el repositorio

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   ```

4. Editar `.env` con tu URL de Neon:
   ```
   DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

5. Sincronizar base de datos:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

6. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

7. Abrir [http://localhost:3000](http://localhost:3000)

## Scripts Disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm run start` | Servidor de produccion |
| `npm run lint` | Ejecutar ESLint |
| `npx prisma studio` | Abrir Prisma Studio (GUI de BD) |
| `npx prisma db push` | Sincronizar schema con BD |
| `npx prisma generate` | Regenerar cliente Prisma |

## Tipos de Negocio Soportados

| Tipo | Tema | Emoji |
|------|------|-------|
| General | `general` | - |
| Restaurante Italiano | `italian` | - |
| Restaurante Japones | `japanese` | - |
| Restaurante Mexicano | `mexican` | - |
| Cafeteria | `coffee` | - |
| Barberia | `barber` | - |

## Funcionalidades Implementadas

- [x] Registro de negocios
- [x] Login seguro (bcrypt + sessions en BD)
- [x] CRUD de items del menu
- [x] Menu publico responsive (mobile-first)
- [x] 4 templates tematicos (Italian, Japanese, Mexican, Coffee)
- [x] Integracion WhatsApp (pedidos y reservas)
- [x] Generador de QR con descarga PNG
- [x] Panel de administracion completo
- [ ] Deploy en produccion

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

model Session {
  id           String     @id @default(cuid())
  token        String     @unique
  expiresAt    DateTime
  restaurantId String
  restaurant   Restaurant @relation(...)
}
```

## API Endpoints

### Publicos
- `GET /api/restaurants/[slug]` - Obtener restaurante y menu

### Protegidos (requieren sesion)
- `POST /api/restaurants` - Crear restaurante
- `PUT /api/restaurants/[slug]` - Actualizar restaurante
- `POST /api/restaurants/[slug]/menu` - Crear item
- `PUT /api/restaurants/[slug]/menu/[id]` - Actualizar item
- `DELETE /api/restaurants/[slug]/menu/[id]` - Eliminar item

### Auth
- `POST /api/auth/login` - Iniciar sesion
- `POST /api/auth/logout` - Cerrar sesion

## Variables de Entorno

```bash
# Base de datos (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# URL base de la aplicacion
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## Deploy en Vercel

1. Conectar repositorio a Vercel
2. Configurar variables de entorno:
   - `DATABASE_URL` (URL de Neon)
   - `NEXT_PUBLIC_BASE_URL` (URL de produccion)
3. Build command: `prisma generate && next build`
4. Deploy

## Documentacion Adicional

Ver `BACKLOG-KISS-FINAL.md` en el directorio padre para:
- Detalle de todas las tareas por desarrollador
- Auditoria tecnica del codigo
- Bugs conocidos y soluciones
- Plan de migracion a Neon

## Licencia

Privado - Todos los derechos reservados

---

**Ultima actualizacion:** 2025-11-30
**Version:** MVP 1.0
