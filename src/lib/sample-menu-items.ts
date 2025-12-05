// Items de ejemplo por tipo de negocio
// Se crean automáticamente al registrar un nuevo negocio

export interface SampleMenuItem {
  name: string
  description: string
  price: number
  category: string
  available: boolean
}

export const sampleMenuByTheme: Record<string, SampleMenuItem[]> = {
  // ITALIANO
  italian: [
    { name: 'Bruschetta Clásica', description: 'Pan tostado con tomates frescos, albahaca y aceite de oliva', price: 12000, category: 'Antipasti', available: true },
    { name: 'Carpaccio de Res', description: 'Finas láminas de res con rúcula y parmesano', price: 24000, category: 'Antipasti', available: true },
    { name: 'Spaghetti Carbonara', description: 'Pasta con huevo, guanciale y pecorino romano', price: 28000, category: 'Primi', available: true },
    { name: 'Risotto ai Funghi', description: 'Arroz cremoso con hongos porcini', price: 32000, category: 'Primi', available: true },
    { name: 'Pizza Margherita', description: 'Tomate San Marzano, mozzarella y albahaca', price: 25000, category: 'Pizza', available: true },
    { name: 'Tiramisú', description: 'Clásico postre italiano con mascarpone y café', price: 15000, category: 'Dolci', available: true },
  ],

  // MEXICANO
  mexican: [
    { name: 'Tacos al Pastor', description: '3 tacos con carne marinada, piña y cilantro', price: 18000, category: 'Tacos', available: true },
    { name: 'Tacos de Carnitas', description: '3 tacos de cerdo confitado con cebolla', price: 17000, category: 'Tacos', available: true },
    { name: 'Burrito Supreme', description: 'Tortilla grande con carne, frijoles, arroz y guacamole', price: 28000, category: 'Burritos', available: true },
    { name: 'Quesadilla de Pollo', description: 'Tortilla con queso fundido y pollo desmenuzado', price: 22000, category: 'Quesadillas', available: true },
    { name: 'Enchiladas Verdes', description: '3 enchiladas bañadas en salsa verde con crema', price: 25000, category: 'Enchiladas', available: true },
    { name: 'Churros con Chocolate', description: '5 churros con salsa de chocolate', price: 12000, category: 'Postres', available: true },
  ],

  // JAPONÉS
  japanese: [
    { name: 'Edamame', description: 'Vainas de soja al vapor con sal marina', price: 10000, category: 'Entradas', available: true },
    { name: 'Gyozas', description: '6 empanadillas japonesas con cerdo', price: 16000, category: 'Entradas', available: true },
    { name: 'Combo Sushi 12 piezas', description: 'Selección de nigiris y makis del chef', price: 45000, category: 'Sushi', available: true },
    { name: 'Roll California', description: '8 piezas con cangrejo, aguacate y pepino', price: 28000, category: 'Sushi', available: true },
    { name: 'Ramen Tonkotsu', description: 'Caldo de cerdo con fideos, huevo y chashu', price: 32000, category: 'Ramen', available: true },
    { name: 'Mochi Ice Cream', description: '3 mochis de diferentes sabores', price: 14000, category: 'Postres', available: true },
  ],

  // HAMBURGUESAS
  hamburguesa: [
    { name: 'Classic Burger', description: 'Carne 150g, queso cheddar, lechuga, tomate y salsa especial', price: 22000, category: 'Hamburguesas', available: true },
    { name: 'BBQ Bacon Burger', description: 'Doble carne, tocino crujiente, cebolla caramelizada y BBQ', price: 32000, category: 'Hamburguesas', available: true },
    { name: 'Mushroom Swiss', description: 'Carne 150g, champiñones salteados y queso suizo', price: 28000, category: 'Hamburguesas', available: true },
    { name: 'Combo Clásico', description: 'Hamburguesa clásica + papas + bebida', price: 32000, category: 'Combos', available: true },
    { name: 'Papas Fritas', description: 'Porción grande de papas crujientes', price: 10000, category: 'Papas', available: true },
    { name: 'Milkshake', description: 'Batido cremoso (vainilla, chocolate o fresa)', price: 12000, category: 'Bebidas', available: true },
  ],

  // CAFETERÍA
  coffee: [
    { name: 'Espresso', description: 'Shot doble de café premium', price: 5000, category: 'Café', available: true },
    { name: 'Cappuccino', description: 'Espresso con leche vaporizada y espuma', price: 8000, category: 'Café', available: true },
    { name: 'Latte', description: 'Espresso con leche cremosa', price: 9000, category: 'Café', available: true },
    { name: 'Croissant de Almendras', description: 'Croissant relleno de crema de almendras', price: 8000, category: 'Pasteles', available: true },
    { name: 'Cheesecake', description: 'Tarta de queso estilo New York', price: 12000, category: 'Pasteles', available: true },
    { name: 'Smoothie Verde', description: 'Espinaca, manzana, pepino y jengibre', price: 14000, category: 'Bebidas Frías', available: true },
  ],

  // VEGETARIANO
  vegetariano: [
    { name: 'Buddha Bowl', description: 'Quinoa, garbanzos, aguacate, hummus y vegetales', price: 28000, category: 'Bowls', available: true },
    { name: 'Ensalada Mediterránea', description: 'Mix de verdes, feta, aceitunas y vinagreta', price: 22000, category: 'Ensaladas', available: true },
    { name: 'Wrap de Falafel', description: 'Tortilla con falafel, hummus y vegetales', price: 24000, category: 'Platos Fuertes', available: true },
    { name: 'Curry de Vegetales', description: 'Vegetales en salsa curry con arroz basmati', price: 26000, category: 'Platos Fuertes', available: true },
    { name: 'Jugo Verde', description: 'Apio, espinaca, manzana y limón', price: 12000, category: 'Jugos', available: true },
    { name: 'Açaí Bowl', description: 'Bowl de açaí con granola y frutas frescas', price: 22000, category: 'Postres', available: true },
  ],

  // BARBERÍA
  barber: [
    { name: 'Corte Clásico', description: 'Corte tradicional con tijera y máquina', price: 25000, category: 'Cortes', available: true },
    { name: 'Corte + Barba', description: 'Corte completo más perfilado de barba', price: 40000, category: 'Combos', available: true },
    { name: 'Fade Premium', description: 'Degradado profesional con diseño', price: 35000, category: 'Cortes', available: true },
    { name: 'Afeitado Clásico', description: 'Afeitado con navaja y toalla caliente', price: 20000, category: 'Barba', available: true },
    { name: 'Perfilado de Barba', description: 'Diseño y perfilado de barba', price: 18000, category: 'Barba', available: true },
    { name: 'Tratamiento Capilar', description: 'Hidratación y masaje capilar', price: 30000, category: 'Tratamientos', available: true },
  ],

  // SPA
  spa: [
    { name: 'Masaje Relajante', description: '60 minutos de masaje sueco relajante', price: 120000, category: 'Masajes', available: true },
    { name: 'Masaje Descontracturante', description: '60 minutos enfocado en nudos musculares', price: 140000, category: 'Masajes', available: true },
    { name: 'Masaje con Piedras Calientes', description: '90 minutos con piedras volcánicas', price: 180000, category: 'Masajes', available: true },
    { name: 'Facial Hidratante', description: 'Limpieza profunda e hidratación', price: 90000, category: 'Faciales', available: true },
    { name: 'Exfoliación Corporal', description: 'Exfoliación completa con productos naturales', price: 100000, category: 'Corporales', available: true },
    { name: 'Día de Spa', description: 'Masaje + Facial + Exfoliación', price: 280000, category: 'Paquetes', available: true },
  ],

  // SALÓN DE BELLEZA
  salon: [
    { name: 'Corte de Cabello', description: 'Corte personalizado con lavado y secado', price: 45000, category: 'Cabello', available: true },
    { name: 'Tinte Completo', description: 'Coloración completa con productos premium', price: 120000, category: 'Cabello', available: true },
    { name: 'Mechas/Balayage', description: 'Técnica de iluminación personalizada', price: 180000, category: 'Cabello', available: true },
    { name: 'Manicure Semipermanente', description: 'Manicure con esmalte semipermanente', price: 45000, category: 'Uñas', available: true },
    { name: 'Pedicure Spa', description: 'Pedicure completo con masaje', price: 55000, category: 'Uñas', available: true },
    { name: 'Maquillaje Social', description: 'Maquillaje para eventos especiales', price: 80000, category: 'Maquillaje', available: true },
  ],

  // FLORISTERÍA
  floreria: [
    { name: 'Ramo Clásico', description: '12 rosas rojas con follaje', price: 85000, category: 'Ramos', available: true },
    { name: 'Ramo Mixto', description: 'Flores de temporada variadas', price: 75000, category: 'Ramos', available: true },
    { name: 'Arreglo de Mesa', description: 'Centro de mesa con flores frescas', price: 95000, category: 'Arreglos', available: true },
    { name: 'Arreglo Romántico', description: 'Corazón de rosas con peluche', price: 150000, category: 'Ocasiones', available: true },
    { name: 'Suculenta en Maceta', description: 'Planta suculenta decorativa', price: 35000, category: 'Plantas', available: true },
    { name: 'Orquídea Phalaenopsis', description: 'Orquídea en maceta elegante', price: 120000, category: 'Plantas', available: true },
  ],

  // GENERAL (fallback)
  general: [
    { name: 'Producto 1', description: 'Descripción del producto', price: 10000, category: 'General', available: true },
    { name: 'Producto 2', description: 'Descripción del producto', price: 15000, category: 'General', available: true },
    { name: 'Producto 3', description: 'Descripción del producto', price: 20000, category: 'General', available: true },
  ],
}

// Helper para obtener items de ejemplo por tema
export function getSampleMenuItems(theme: string): SampleMenuItem[] {
  return sampleMenuByTheme[theme] || sampleMenuByTheme.general
}
