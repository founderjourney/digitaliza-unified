# 📋 PLAN DE DESARROLLO EJECUTIVO
## Sistema de Digitalización de Negocios - Fase 2.0

**Documento:** Plan de Desarrollo
**Versión:** 1.0
**Fecha:** 06 de Diciembre 2025
**Proyecto:** Digitaliza Unified - Sistema Interactivo de Reservas y Pedidos

---

## 📊 RESUMEN EJECUTIVO

### Objetivo
Transformar el sistema actual de menús digitales estáticos en una **plataforma interactiva completa** donde los clientes finales pueden:
- Agendar citas (servicios)
- Realizar pedidos (tiendas/restaurantes)
- Hacer reservas de mesa (restaurantes)
- Personalizar la identidad visual del negocio (logo + colores)

### Alcance
| Módulo | Descripción |
|--------|-------------|
| **Branding Personalizado** | Logo upload + colores custom con fallback a tema |
| **Sistema de Citas** | Agendamiento para barberías, spas, salones |
| **Sistema de Pedidos** | Carrito + checkout para tiendas y restaurantes |
| **Reservas Mejoradas** | Reservas de mesa con fecha/hora/personas |
| **Panel Admin Expandido** | Gestión unificada de citas, pedidos, reservas |
| **Notificaciones** | WhatsApp automático al dueño del negocio |

### Métricas Clave
```
┌─────────────────────────────────────────────────────────┐
│  INDICADORES DEL PROYECTO                               │
├─────────────────────────────────────────────────────────┤
│  Duración Total Estimada:     4 Sprints (8 semanas)     │
│  Desarrolladores:             4 DEVs en paralelo        │
│  Nuevos Modelos de Datos:     4 (Appointment, Order,    │
│                               OrderItem, CartState)     │
│  Nuevas Pantallas:            12+                       │
│  Nuevos Endpoints API:        20+                       │
│  Complejidad General:         MEDIA-ALTA                │
└─────────────────────────────────────────────────────────┘
```

---

## 👥 ASIGNACIÓN DE DESARROLLADORES

```
┌──────────────────────────────────────────────────────────────────────┐
│                    MATRIZ DE RESPONSABILIDADES                        │
├──────────┬───────────────────────────────────────────────────────────┤
│  DEV1    │  BACKEND & DATABASE                                       │
│          │  Schema Prisma, APIs, lógica de negocio                   │
├──────────┼───────────────────────────────────────────────────────────┤
│  DEV2    │  FRONTEND - CLIENTE FINAL                                 │
│          │  UI pública, carrito, modales, flujos de usuario          │
├──────────┼───────────────────────────────────────────────────────────┤
│  DEV3    │  FRONTEND - PANEL ADMIN                                   │
│          │  Dashboard, gestión de citas/pedidos/reservas             │
├──────────┼───────────────────────────────────────────────────────────┤
│  DEV4    │  INTEGRACIONES & BRANDING                                 │
│          │  WhatsApp, upload de archivos, colores, notificaciones    │
└──────────┴───────────────────────────────────────────────────────────┘
```

---

## 📅 CRONOGRAMA POR SPRINTS

### SPRINT 1: FUNDAMENTOS (Semanas 1-2)
**Objetivo:** Establecer la base de datos y APIs core

```
                    SEMANA 1                      SEMANA 2
              L   M   M   J   V            L   M   M   J   V
DEV1 ████████████████████████████████████████████████████████
     │← Schema Prisma →│← APIs CRUD Appointment/Order →│

DEV2 ░░░░░░░░████████████████████████████████████████████████
     │ Espera │← Modal detalle item →│← Estructura carrito →│

DEV3 ░░░░░░░░████████████████████████████████████████████████
     │ Espera │← Tabs Admin expandidos →│← Vista lista base →│

DEV4 ████████████████████████████████████████████████████████
     │← Setup Vercel Blob →│← Campos color en schema →│← API upload →│
```

#### DEV1 - Backend & Database (Sprint 1)
| Día | Tarea | Entregable |
|-----|-------|------------|
| 1-2 | Diseño de schema expandido | `schema.prisma` actualizado |
| 3 | Migraciones Prisma | BD actualizada en Neon |
| 4-5 | API `/api/appointments` CRUD | Endpoints funcionando |
| 6-7 | API `/api/orders` CRUD | Endpoints funcionando |
| 8-9 | API `/api/orders/[id]/items` | Gestión de items |
| 10 | Testing APIs + documentación | Postman collection |

**Entregables Sprint 1 - DEV1:**
```
/prisma/schema.prisma          (actualizado)
/src/app/api/appointments/     (nuevo)
/src/app/api/orders/           (nuevo)
/src/app/api/orders/[id]/items (nuevo)
```

#### DEV2 - Frontend Cliente (Sprint 1)
| Día | Tarea | Entregable |
|-----|-------|------------|
| 1-2 | Análisis de templates actuales | Documento de gaps |
| 3-4 | Componente `ItemDetailModal` | Modal reutilizable |
| 5-6 | Contexto de carrito (CartContext) | State management |
| 7-8 | Componente `CartDrawer` | UI carrito flotante |
| 9-10 | Integración básica en templates | Items clickeables |

**Entregables Sprint 1 - DEV2:**
```
/src/components/ItemDetailModal.tsx    (nuevo)
/src/contexts/CartContext.tsx          (nuevo)
/src/components/CartDrawer.tsx         (nuevo)
/src/components/CartButton.tsx         (nuevo)
```

#### DEV3 - Panel Admin (Sprint 1)
| Día | Tarea | Entregable |
|-----|-------|------------|
| 1-2 | Análisis AdminPanel actual | Documento de expansión |
| 3-4 | Nuevos tabs: Citas, Pedidos | Estructura de tabs |
| 5-6 | Componente `AppointmentsList` | Lista con estados |
| 7-8 | Componente `OrdersList` | Lista con estados |
| 9-10 | Acciones básicas (confirmar/rechazar) | Botones funcionales |

**Entregables Sprint 1 - DEV3:**
```
/src/components/admin/AppointmentsList.tsx  (nuevo)
/src/components/admin/OrdersList.tsx        (nuevo)
/src/components/admin/StatusBadge.tsx       (nuevo)
```

#### DEV4 - Integraciones & Branding (Sprint 1)
| Día | Tarea | Entregable |
|-----|-------|------------|
| 1-2 | Setup Vercel Blob Storage | Cuenta configurada |
| 3-4 | API `/api/upload` para logos | Endpoint funcional |
| 5-6 | Campos de color en schema | Migración aplicada |
| 7-8 | Color pickers en registro | UI implementada |
| 9-10 | Lógica de fallback en templates | Colores dinámicos |

**Entregables Sprint 1 - DEV4:**
```
/src/app/api/upload/route.ts           (nuevo)
/src/components/ColorPicker.tsx        (nuevo)
/src/components/LogoUpload.tsx         (nuevo)
/src/app/register/page.tsx             (actualizado)
```

---

### SPRINT 2: SISTEMA DE CITAS (Semanas 3-4)
**Objetivo:** Flujo completo de agendamiento para servicios

```
                    SEMANA 3                      SEMANA 4
              L   M   M   J   V            L   M   M   J   V
DEV1 ████████████████████████████████████████████████████████
     │← Disponibilidad horaria →│← Validaciones + conflictos →│

DEV2 ████████████████████████████████████████████████████████
     │← AppointmentModal →│← Calendario selector →│← Confirmación →│

DEV3 ████████████████████████████████████████████████████████
     │← Detalle de cita →│← Acciones completas →│← Calendario admin →│

DEV4 ████████████████████████████████████████████████████████
     │← WhatsApp notification →│← Template mensajes →│← Testing E2E →│
```

#### DEV1 - Backend (Sprint 2)
| Tarea | Descripción |
|-------|-------------|
| API disponibilidad | `GET /api/appointments/availability?date=X&serviceId=Y` |
| Validación de conflictos | No permitir citas superpuestas |
| Duración dinámica | Calcular basado en servicio seleccionado |
| Horarios del negocio | Respetar `hours` del Restaurant |

#### DEV2 - Frontend Cliente (Sprint 2)
| Tarea | Descripción |
|-------|-------------|
| `AppointmentModal` | Modal completo de agendamiento |
| `DatePicker` | Selector de fecha con días disponibles |
| `TimeSlotPicker` | Horarios disponibles en grid |
| Formulario cliente | Nombre, teléfono, notas |
| Confirmación | Pantalla de éxito con resumen |

#### DEV3 - Panel Admin (Sprint 2)
| Tarea | Descripción |
|-------|-------------|
| `AppointmentDetail` | Vista detallada de una cita |
| Acciones completas | Confirmar, Rechazar, Completar, Cancelar |
| `CalendarView` | Vista calendario de citas |
| Filtros | Por fecha, estado, servicio |

#### DEV4 - Integraciones (Sprint 2)
| Tarea | Descripción |
|-------|-------------|
| WhatsApp al dueño | Notificación de nueva cita |
| WhatsApp al cliente | Confirmación de cita |
| Templates de mensaje | Mensajes personalizados por tipo |
| Testing E2E | Flujo completo cita |

---

### SPRINT 3: SISTEMA DE PEDIDOS (Semanas 5-6)
**Objetivo:** Carrito y checkout para tiendas/restaurantes

```
                    SEMANA 5                      SEMANA 6
              L   M   M   J   V            L   M   M   J   V
DEV1 ████████████████████████████████████████████████████████
     │← API Order items →│← Cálculo totales →│← Estados pedido →│

DEV2 ████████████████████████████████████████████████████████
     │← Carrito completo →│← Checkout flow →│← Confirmación →│

DEV3 ████████████████████████████████████████████████████████
     │← Lista pedidos →│← Detalle pedido →│← Cambio estados →│

DEV4 ████████████████████████████████████████████████████████
     │← WhatsApp pedido →│← Mensaje con items →│← Logo en templates →│
```

#### DEV1 - Backend (Sprint 3)
| Tarea | Descripción |
|-------|-------------|
| OrderItems management | Agregar/quitar/actualizar items |
| Cálculo de totales | Subtotal, impuestos si aplica |
| Estados de pedido | pending → confirmed → preparing → ready → delivered |
| Tipos de entrega | pickup, delivery, dine-in |

#### DEV2 - Frontend Cliente (Sprint 3)
| Tarea | Descripción |
|-------|-------------|
| Carrito persistente | LocalStorage + Context |
| `CheckoutModal` | Formulario de checkout |
| Selector de entrega | Pickup vs Delivery |
| Dirección de entrega | Campo condicional |
| Resumen de pedido | Antes de confirmar |

#### DEV3 - Panel Admin (Sprint 3)
| Tarea | Descripción |
|-------|-------------|
| `OrderDetail` | Vista detallada con items |
| Timeline de estados | Visualización del progreso |
| Acciones rápidas | Botones de cambio de estado |
| Impresión/Export | Ticket de pedido |

#### DEV4 - Integraciones (Sprint 3)
| Tarea | Descripción |
|-------|-------------|
| WhatsApp con pedido | Mensaje con lista de items |
| Formato de mensaje | Limpio y legible |
| Logo en templates | Usar logoUrl del restaurant |
| Colores en emails | Si se implementan |

---

### SPRINT 4: INTEGRACIÓN & POLISH (Semanas 7-8)
**Objetivo:** Unificar todo, testing, optimización

```
                    SEMANA 7                      SEMANA 8
              L   M   M   J   V            L   M   M   J   V
DEV1 ████████████████████████████████████████████████████████
     │← Optimización queries →│← Seguridad →│← Documentación →│

DEV2 ████████████████████████████████████████████████████████
     │← Responsive fixes →│← Animaciones →│← Accesibilidad →│

DEV3 ████████████████████████████████████████████████████████
     │← Dashboard stats →│← Reportes →│← UX improvements →│

DEV4 ████████████████████████████████████████████████████████
     │← Testing E2E completo →│← Bug fixes →│← Deploy final →│
```

#### Todos los DEVs (Sprint 4)
| Área | Tareas |
|------|--------|
| **Testing** | Unit tests, integration tests, E2E |
| **Performance** | Optimización de queries, lazy loading |
| **Seguridad** | Validaciones, sanitización, rate limiting |
| **UX** | Animaciones, feedback visual, loading states |
| **Responsive** | Mobile-first verification |
| **Documentación** | README, API docs, guías de usuario |
| **Deploy** | Staging → Production |

---

## 📊 DIAGRAMA DE GANTT SIMPLIFICADO

```
SEMANA        1    2    3    4    5    6    7    8
            ├────┼────┼────┼────┼────┼────┼────┼────┤
SPRINT 1    ████████████
Fundamentos │▓▓▓▓▓▓▓▓▓▓▓▓│

SPRINT 2              ████████████
Citas                 │▓▓▓▓▓▓▓▓▓▓▓▓│

SPRINT 3                        ████████████
Pedidos                         │▓▓▓▓▓▓▓▓▓▓▓▓│

SPRINT 4                                    ████████████
Integración                                 │▓▓▓▓▓▓▓▓▓▓▓▓│

BRANDING    ████████░░░░░░░░░░░░░░░░████████
(Paralelo)  │ Setup │              │ Polish │

            ├────┼────┼────┼────┼────┼────┼────┼────┤
            S1   S2   S3   S4   S5   S6   S7   S8
```

---

## 🔗 DEPENDENCIAS ENTRE EQUIPOS

```
┌─────────────────────────────────────────────────────────────────┐
│                    MAPA DE DEPENDENCIAS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  DEV1 (Backend)                                                 │
│     │                                                           │
│     ├──→ DEV2 necesita APIs para conectar UI                    │
│     │         (Bloqueante: días 1-3 Sprint 1)                   │
│     │                                                           │
│     ├──→ DEV3 necesita APIs para panel admin                    │
│     │         (Bloqueante: días 1-3 Sprint 1)                   │
│     │                                                           │
│     └──→ DEV4 necesita schema para campos de branding           │
│               (Bloqueante: días 1-2 Sprint 1)                   │
│                                                                 │
│  DEV4 (Branding)                                                │
│     │                                                           │
│     └──→ DEV2 necesita componentes de color/logo                │
│               para integrar en templates                        │
│               (Bloqueante: días 5-6 Sprint 1)                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Mitigación de Bloqueos
| Bloqueo | Mitigación |
|---------|------------|
| DEV2/DEV3 esperan APIs | DEV1 prioriza endpoints básicos días 1-3 |
| DEV2 espera componentes branding | DEV4 entrega componentes semana 1 |
| Testing necesita todo | Testing continuo, no solo al final |

---

## 📁 ESTRUCTURA DE ARCHIVOS FINAL

```
/src
├── /app
│   ├── /api
│   │   ├── /appointments          # NUEVO - DEV1
│   │   │   ├── route.ts           # GET (list), POST (create)
│   │   │   ├── /[id]
│   │   │   │   └── route.ts       # GET, PUT, DELETE
│   │   │   └── /availability
│   │   │       └── route.ts       # GET disponibilidad
│   │   │
│   │   ├── /orders                # NUEVO - DEV1
│   │   │   ├── route.ts           # GET, POST
│   │   │   └── /[id]
│   │   │       ├── route.ts       # GET, PUT, DELETE
│   │   │       └── /items
│   │   │           └── route.ts   # POST, DELETE items
│   │   │
│   │   ├── /upload                # NUEVO - DEV4
│   │   │   └── route.ts           # POST logo upload
│   │   │
│   │   └── /restaurants           # EXISTENTE (expandir)
│   │
│   ├── /[slug]
│   │   ├── page.tsx               # MODIFICAR - DEV2
│   │   └── /admin
│   │       └── page.tsx           # MODIFICAR - DEV3
│   │
│   └── /register
│       └── page.tsx               # MODIFICAR - DEV4
│
├── /components
│   ├── /client                    # NUEVO - DEV2
│   │   ├── ItemDetailModal.tsx
│   │   ├── AppointmentModal.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── CartButton.tsx
│   │   ├── CheckoutModal.tsx
│   │   ├── DatePicker.tsx
│   │   └── TimeSlotPicker.tsx
│   │
│   ├── /admin                     # NUEVO - DEV3
│   │   ├── AppointmentsList.tsx
│   │   ├── AppointmentDetail.tsx
│   │   ├── OrdersList.tsx
│   │   ├── OrderDetail.tsx
│   │   ├── CalendarView.tsx
│   │   ├── StatusBadge.tsx
│   │   └── StatsCards.tsx
│   │
│   ├── /branding                  # NUEVO - DEV4
│   │   ├── ColorPicker.tsx
│   │   ├── LogoUpload.tsx
│   │   └── LogoPreview.tsx
│   │
│   └── /templates                 # MODIFICAR - DEV2
│       └── PremiumTemplate.tsx    # Agregar logo + colores custom
│
├── /contexts                      # NUEVO - DEV2
│   └── CartContext.tsx
│
├── /lib
│   ├── themes.ts                  # MODIFICAR - DEV4
│   ├── whatsapp.ts                # NUEVO - DEV4
│   └── notifications.ts           # NUEVO - DEV4
│
└── /prisma
    └── schema.prisma              # MODIFICAR - DEV1
```

---

## 💰 ESTIMACIÓN DE RECURSOS

### Horas por Desarrollador
| DEV | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 | Total |
|-----|----------|----------|----------|----------|-------|
| DEV1 | 40h | 40h | 40h | 30h | **150h** |
| DEV2 | 40h | 40h | 40h | 35h | **155h** |
| DEV3 | 40h | 40h | 40h | 35h | **155h** |
| DEV4 | 40h | 35h | 30h | 35h | **140h** |
| **Total** | 160h | 155h | 150h | 135h | **600h** |

### Costo Estimado (Referencial)
```
┌─────────────────────────────────────────────────────────┐
│  PRESUPUESTO REFERENCIAL                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Desarrollo (600h × $50/h promedio):      $30,000 USD   │
│  Infraestructura (2 meses):               $200 USD      │
│  Servicios terceros (Vercel Blob, etc):   $100 USD      │
│  Testing/QA adicional:                    $2,000 USD    │
│  Buffer contingencia (15%):               $4,845 USD    │
│  ─────────────────────────────────────────────────────  │
│  TOTAL ESTIMADO:                          $37,145 USD   │
│                                                         │
│  * Costos pueden variar según ubicación del equipo      │
│  * Considera equipo mid-level                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ⚠️ RIESGOS Y MITIGACIONES

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|--------|--------------|---------|------------|
| 1 | Retrasos en APIs backend | Media | Alto | DEV1 prioriza endpoints críticos primero |
| 2 | Complejidad de disponibilidad horaria | Alta | Medio | MVP simple, iterar después |
| 3 | Problemas con upload de archivos | Media | Medio | Usar servicio establecido (Vercel Blob) |
| 4 | Scope creep (nuevos requerimientos) | Alta | Alto | Freeze de scope después de Sprint 1 |
| 5 | Problemas de integración | Media | Alto | Integración continua, no al final |
| 6 | Performance con muchos pedidos | Baja | Medio | Paginación desde el inicio |

---

## ✅ CRITERIOS DE ACEPTACIÓN POR SPRINT

### Sprint 1 - Definition of Done
- [ ] Schema Prisma actualizado y migrado
- [ ] APIs de Appointment y Order funcionando (CRUD básico)
- [ ] Modal de detalle de item implementado
- [ ] Carrito básico funcionando (agregar/quitar)
- [ ] Tabs de Citas y Pedidos en Admin Panel
- [ ] Upload de logo funcional
- [ ] Color pickers en formulario de registro
- [ ] Colores custom aplicándose en templates

### Sprint 2 - Definition of Done
- [ ] Flujo completo de agendar cita (cliente)
- [ ] Calendario de disponibilidad funcionando
- [ ] Validación de conflictos de horarios
- [ ] Gestión completa de citas (admin)
- [ ] Notificación WhatsApp al agendar cita
- [ ] Vista calendario en admin

### Sprint 3 - Definition of Done
- [ ] Carrito completo con persistencia
- [ ] Checkout funcional
- [ ] Opciones pickup/delivery
- [ ] Gestión de pedidos (admin)
- [ ] Estados de pedido (workflow completo)
- [ ] Notificación WhatsApp de pedidos

### Sprint 4 - Definition of Done
- [ ] Todos los flujos E2E funcionando
- [ ] Tests unitarios > 70% coverage
- [ ] Performance optimizada (< 3s load time)
- [ ] Mobile responsive verificado
- [ ] Documentación completa
- [ ] Deploy a producción exitoso

---

## 🚀 QUICK START PARA CADA DEV

### DEV1 - Primer Día
```bash
# 1. Actualizar schema.prisma con nuevos modelos
# 2. Ejecutar migración
npx prisma migrate dev --name add_appointments_orders

# 3. Crear estructura de carpetas API
mkdir -p src/app/api/appointments
mkdir -p src/app/api/orders
```

### DEV2 - Primer Día
```bash
# 1. Crear estructura de componentes
mkdir -p src/components/client
mkdir -p src/contexts

# 2. Analizar PremiumTemplate.tsx actual
# 3. Diseñar ItemDetailModal
```

### DEV3 - Primer Día
```bash
# 1. Crear estructura admin
mkdir -p src/components/admin

# 2. Analizar AdminPanel.tsx actual
# 3. Planificar expansión de tabs
```

### DEV4 - Primer Día
```bash
# 1. Configurar Vercel Blob en proyecto
npm install @vercel/blob

# 2. Crear estructura branding
mkdir -p src/components/branding

# 3. Setup API de upload
```

---

## 📞 COMUNICACIÓN Y SINCRONIZACIÓN

### Daily Standups
- **Horario:** 9:00 AM (15 min máx)
- **Formato:** ¿Qué hice? ¿Qué haré? ¿Bloqueos?

### Sincronización de Integraciones
- **Frecuencia:** Cada 2 días
- **Participantes:** DEV1 + DEV2/DEV3 según necesidad

### Sprint Review
- **Cuándo:** Último día de cada sprint
- **Duración:** 1 hora
- **Demo:** Funcionalidades completadas

### Sprint Retrospective
- **Cuándo:** Después del review
- **Duración:** 30 min
- **Objetivo:** Mejora continua

---

## 📋 CHECKLIST PRE-DESARROLLO

- [ ] Acceso a repositorio para todos los DEVs
- [ ] Ambiente de desarrollo local configurado
- [ ] Base de datos de desarrollo individual
- [ ] Vercel project access
- [ ] Neon database access
- [ ] Documentación de APIs existentes revisada
- [ ] Diseños/wireframes aprobados (si aplica)
- [ ] Canales de comunicación establecidos (Slack/Discord)

---

**Documento preparado para revisión ejecutiva**
**Próximo paso:** Aprobación del plan y asignación de equipo

---

*Última actualización: 06/12/2025*
