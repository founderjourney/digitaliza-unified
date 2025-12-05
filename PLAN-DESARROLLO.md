# Plan de Desarrollo - Digitaliza Admin Panel

## Resumen del Proyecto
Mejorar el panel de administración para que sea mobile-first, más profesional, y corregir bugs de UX relacionados con la terminología de tipos de negocio.

---

## FASE 1: Corrección de Terminología (Bug UX)

### Problema
El sistema usa "restaurante" para todos los tipos de negocio, incluso cuando el usuario selecciona Salón, Barbería, Spa, etc.

### Solución
Crear un sistema de configuración por tipo de negocio:

```typescript
// src/lib/business-config.ts
export const businessTypeConfig = {
  // RESTAURANTES
  general: {
    type: 'restaurant',
    label: 'Negocio',
    itemLabel: 'Producto',
    itemsLabel: 'Productos',
    emoji: '📋'
  },
  italian: {
    type: 'restaurant',
    label: 'Restaurante Italiano',
    itemLabel: 'Plato',
    itemsLabel: 'Menú',
    emoji: '🍝'
  },
  mexican: {
    type: 'restaurant',
    label: 'Restaurante Mexicano',
    itemLabel: 'Plato',
    itemsLabel: 'Menú',
    emoji: '🌮'
  },
  japanese: {
    type: 'restaurant',
    label: 'Restaurante Japonés',
    itemLabel: 'Plato',
    itemsLabel: 'Menú',
    emoji: '🍣'
  },
  hamburguesa: {
    type: 'restaurant',
    label: 'Hamburguesería',
    itemLabel: 'Producto',
    itemsLabel: 'Menú',
    emoji: '🍔'
  },
  coffee: {
    type: 'restaurant',
    label: 'Cafetería',
    itemLabel: 'Producto',
    itemsLabel: 'Menú',
    emoji: '☕'
  },
  vegetariano: {
    type: 'restaurant',
    label: 'Restaurante Vegetariano',
    itemLabel: 'Plato',
    itemsLabel: 'Menú',
    emoji: '🥗'
  },

  // SERVICIOS
  barber: {
    type: 'service',
    label: 'Barbería',
    itemLabel: 'Servicio',
    itemsLabel: 'Servicios',
    emoji: '💈'
  },
  spa: {
    type: 'service',
    label: 'Spa & Bienestar',
    itemLabel: 'Servicio',
    itemsLabel: 'Servicios',
    emoji: '🧘'
  },
  salon: {
    type: 'service',
    label: 'Salón de Belleza',
    itemLabel: 'Servicio',
    itemsLabel: 'Servicios',
    emoji: '💅'
  },

  // TIENDAS
  floreria: {
    type: 'store',
    label: 'Floristería',
    itemLabel: 'Producto',
    itemsLabel: 'Catálogo',
    emoji: '🌸'
  }
}
```

### Archivos a Modificar
- [ ] `src/lib/business-config.ts` (NUEVO)
- [ ] `src/app/[slug]/admin/page.tsx` - Usar config para labels
- [ ] `src/app/register/page.tsx` - Mostrar tipo de negocio correcto
- [ ] `src/components/templates/PremiumTemplate.tsx` - Adaptar textos

---

## FASE 2: Rediseño Admin Panel (Mobile-First)

### Características del Nuevo Admin
Basado en el diseño de referencia proporcionado:

1. **Header Sticky**
   - Logo del negocio + emoji del tema
   - Nombre del negocio
   - Botón de usuario/logout

2. **Stats Cards** (Solo si aplica)
   - Para restaurantes: Reservas hoy, Clientes, Calificación, Ingresos
   - Para servicios: Citas hoy, Clientes nuevos, Calificación
   - Para tiendas: Pedidos, Productos vendidos

3. **Sistema de Tabs**
   - Tab 1: Gestionar Menú/Servicios/Catálogo
   - Tab 2: Reservas/Citas (si aplica)
   - Tab 3: Configuración
   - Tab 4: QR Code

4. **Cards de Items Mejoradas**
   - Edición inline (sin modal)
   - Estado disponible/no disponible con toggle
   - Botones de guardar/eliminar
   - Campos: nombre, descripción, precio, categoría, estado

5. **Responsive Design**
   - Mobile: Stack vertical, full width
   - Tablet: Grid 2 columnas
   - Desktop: Grid 3+ columnas

### Componentes a Crear
- [ ] `src/components/admin/AdminHeader.tsx`
- [ ] `src/components/admin/StatsGrid.tsx`
- [ ] `src/components/admin/TabNavigation.tsx`
- [ ] `src/components/admin/MenuItemCard.tsx`
- [ ] `src/components/admin/ReservationCard.tsx`
- [ ] `src/components/admin/SettingsForm.tsx`

### Estructura de Archivos
```
src/
├── components/
│   └── admin/
│       ├── AdminHeader.tsx
│       ├── AdminTabs.tsx
│       ├── StatsGrid.tsx
│       ├── MenuItemCard.tsx
│       ├── AddItemForm.tsx
│       ├── ReservationCard.tsx
│       └── SettingsForm.tsx
└── app/
    └── [slug]/
        └── admin/
            └── page.tsx (refactorizado)
```

---

## FASE 3: Arreglar Bug de Agregar Items

### Problema Actual
El usuario reporta "Error al agregar item X" pero no ve el error específico.

### Ya Implementado
- Mejorado el manejo de errores para mostrar el mensaje del servidor

### Pendiente
- [ ] Verificar validación del formulario antes de enviar
- [ ] Agregar feedback visual de éxito/error
- [ ] Agregar loading state en botones
- [ ] Validar campos requeridos en frontend

---

## FASE 4: Mejoras Adicionales

### Funcionalidades Futuras
- [ ] Drag & drop para reordenar items
- [ ] Upload de imágenes para productos
- [ ] Notificaciones push para reservas
- [ ] Dashboard de analytics
- [ ] Exportar menú a PDF
- [ ] Modo preview del menú público

---

## Prioridades de Implementación

| Prioridad | Tarea | Impacto |
|-----------|-------|---------|
| 🔴 Alta | Arreglar bug agregar items | Crítico |
| 🔴 Alta | Corregir terminología (restaurante → tipo correcto) | UX |
| 🟡 Media | Rediseñar admin mobile-first | UX |
| 🟡 Media | Implementar tabs | UX |
| 🟢 Baja | Stats cards | Nice to have |
| 🟢 Baja | Drag & drop | Nice to have |

---

## Notas Técnicas

### Stack Actual
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS (disponible)
- Neon PostgreSQL (Serverless)
- Zod (validaciones)

### Convenciones
- Mobile-first CSS
- Server Components donde sea posible
- Client Components solo donde se necesite interactividad
- Componentes pequeños y reutilizables
