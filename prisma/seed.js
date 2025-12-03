const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos de demostración...\n');

  // Limpiar datos existentes (opcional - comentar si quieres preservar)
  console.log('🗑️  Limpiando datos existentes...');
  await prisma.session.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();

  // Hash de contraseña "demo123"
  const hashedPassword = await bcrypt.hash('demo123', 12);

  // ═══════════════════════════════════════════════════════════════
  // 🇮🇹 RESTAURANTE ITALIANO DEMO
  // ═══════════════════════════════════════════════════════════════
  console.log('📍 Creando Ristorante Italiano Demo...');

  const italianRestaurant = await prisma.restaurant.create({
    data: {
      slug: 'ristorante-demo',
      name: 'Ristorante La Dolce Vita',
      phone: '+34 91 123 4567',
      whatsapp: '+34 644 123 456',
      email: 'info@dolcevita.es',
      address: 'Via Roma 123, Madrid, España',
      description: 'Auténtica cocina italiana en el corazón de Madrid. Desde 1995.',
      theme: 'italian',
      password: hashedPassword,
      hours: JSON.stringify({
        mon: '12:00-23:00',
        tue: '12:00-23:00',
        wed: '12:00-23:00',
        thu: '12:00-23:00',
        fri: '12:00-00:00',
        sat: '12:00-00:00',
        sun: '12:00-23:00',
      }),
      items: {
        create: [
          // Antipasti
          {
            name: 'Bruschetta al Pomodoro',
            description: 'Pan tostado con tomate fresco, ajo y albahaca',
            price: 8.99,
            category: 'Antipasti',
            order: 1,
          },
          {
            name: 'Tabla de Quesos y Jamones',
            description: 'Selección de quesos italianos y jamón serrano',
            price: 14.99,
            category: 'Antipasti',
            order: 2,
          },
          {
            name: 'Calamares Fritos',
            description: 'Calamares crujientes con limón',
            price: 9.99,
            category: 'Antipasti',
            order: 3,
          },
          // Primi
          {
            name: 'Spaghetti Carbonara',
            description: 'Pasta con queso pecorino, guanciale y huevo',
            price: 12.99,
            category: 'Primi',
            order: 4,
          },
          {
            name: 'Lasaña de la Casa',
            description: 'Capas de pasta, ragù de carne y bechamel',
            price: 13.99,
            category: 'Primi',
            order: 5,
          },
          {
            name: 'Risotto ai Funghi',
            description: 'Risotto cremoso con setas porcini',
            price: 14.99,
            category: 'Primi',
            order: 6,
          },
          // Secondi
          {
            name: 'Ossobuco alla Milanese',
            description: 'Caña de ternera guisada con verduras y vino blanco',
            price: 22.99,
            category: 'Secondi',
            order: 7,
          },
          {
            name: 'Branzino a la Sal',
            description: 'Lubina fresca cocinada en sal con hierbas',
            price: 19.99,
            category: 'Secondi',
            order: 8,
          },
          // Dolci
          {
            name: 'Tiramisu Casero',
            description: 'Clásico postre italiano con café y mascarpone',
            price: 6.99,
            category: 'Dolci',
            order: 9,
          },
          {
            name: 'Panna Cotta de Frutos Rojos',
            description: 'Cremoso postre italiano con salsa de frutos rojos',
            price: 7.99,
            category: 'Dolci',
            order: 10,
          },
          // Bevande
          {
            name: 'Vino Tinto (Copa)',
            description: 'Selección de vinos tintos italianos',
            price: 5.99,
            category: 'Bevande',
            order: 11,
          },
          {
            name: 'Prosecco',
            description: 'Espumante italiano fresco',
            price: 6.99,
            category: 'Bevande',
            order: 12,
          },
        ],
      },
    },
  });

  // ═══════════════════════════════════════════════════════════════
  // 🇯🇵 RESTAURANTE JAPONÉS DEMO
  // ═══════════════════════════════════════════════════════════════
  console.log('📍 Creando Sakura Sushi Bar Demo...');

  const japaneseRestaurant = await prisma.restaurant.create({
    data: {
      slug: 'sakura-sushi-demo',
      name: 'Sakura Sushi Bar',
      phone: '+34 91 234 5678',
      whatsapp: '+34 644 234 567',
      email: 'reservas@sakura-sushi.es',
      address: 'Calle Goya 45, Madrid, España',
      description: 'Sushi fresco preparado diariamente. Experiencia culinaria japonesa auténtica.',
      theme: 'japanese',
      password: hashedPassword,
      hours: JSON.stringify({
        mon: 'Cerrado',
        tue: '13:00-23:30',
        wed: '13:00-23:30',
        thu: '13:00-23:30',
        fri: '13:00-00:30',
        sat: '13:00-00:30',
        sun: '13:00-23:30',
      }),
      items: {
        create: [
          // Zensai (Aperitivos)
          {
            name: 'Edamame',
            description: 'Habas de soja cocidas con sal',
            price: 5.99,
            category: 'Zensai',
            order: 1,
          },
          {
            name: 'Gyoza (6 piezas)',
            description: 'Dumplings de cerdo al vapor o fritos',
            price: 6.99,
            category: 'Zensai',
            order: 2,
          },
          {
            name: 'Tori Karaage',
            description: 'Pollo frito crujiente estilo japonés',
            price: 7.99,
            category: 'Zensai',
            order: 3,
          },
          // Sushi
          {
            name: 'Roll California',
            description: 'Aguacate, cangrejo, pepino y tobiko',
            price: 8.99,
            category: 'Sushi',
            order: 4,
          },
          {
            name: 'Roll Philadelphia',
            description: 'Salmón fresco, aguacate y queso crema',
            price: 9.99,
            category: 'Sushi',
            order: 5,
          },
          {
            name: 'Nigiri Mixto (8 piezas)',
            description: 'Salmón, atún, pez mantequilla y camarones',
            price: 12.99,
            category: 'Sushi',
            order: 6,
          },
          {
            name: 'Dragon Roll',
            description: 'Anguila, aguacate, tobiko y huevo',
            price: 10.99,
            category: 'Sushi',
            order: 7,
          },
          // Ramen
          {
            name: 'Tonkotsu Ramen',
            description: 'Caldo de hueso de cerdo con fideos, cerdo y huevo',
            price: 11.99,
            category: 'Ramen',
            order: 8,
          },
          {
            name: 'Miso Ramen',
            description: 'Ramen tradicional con caldo de miso',
            price: 10.99,
            category: 'Ramen',
            order: 9,
          },
          // Tempura
          {
            name: 'Tempura Mixta',
            description: 'Gambas y verduras rebozadas y fritas',
            price: 10.99,
            category: 'Tempura',
            order: 10,
          },
          // Postres
          {
            name: 'Mochi de Helado',
            description: 'Bolas de arroz con helado matcha o fresa',
            price: 5.99,
            category: 'Postres',
            order: 11,
          },
          {
            name: 'Fruta Fresca Japonesa',
            description: 'Sandía, melón o frutas de temporada',
            price: 6.99,
            category: 'Postres',
            order: 12,
          },
          // Bebidas
          {
            name: 'Té Matcha',
            description: 'Té verde en polvo tradicional',
            price: 4.99,
            category: 'Bebidas',
            order: 13,
          },
          {
            name: 'Sake Premium',
            description: 'Bebida alcohólica de arroz fermentado',
            price: 7.99,
            category: 'Bebidas',
            order: 14,
          },
        ],
      },
    },
  });

  // ═══════════════════════════════════════════════════════════════
  // 🇲🇽 RESTAURANTE MEXICANO DEMO
  // ═══════════════════════════════════════════════════════════════
  console.log('📍 Creando El Mexicano Feliz Demo...');

  const mexicanRestaurant = await prisma.restaurant.create({
    data: {
      slug: 'el-mexicano-feliz-demo',
      name: 'El Mexicano Feliz',
      phone: '+34 91 345 6789',
      whatsapp: '+34 644 345 678',
      email: 'hola@elmexicanofeliz.es',
      address: 'Paseo de la Castellana 200, Madrid, España',
      description: 'Auténtica gastronomía mexicana. Salsas caseras y ingredientes frescos.',
      theme: 'mexican',
      password: hashedPassword,
      hours: JSON.stringify({
        mon: '12:30-23:00',
        tue: '12:30-23:00',
        wed: '12:30-23:00',
        thu: '12:30-23:00',
        fri: '12:30-00:00',
        sat: '12:30-00:00',
        sun: '12:30-23:00',
      }),
      items: {
        create: [
          // Tacos
          {
            name: 'Tacos al Pastor (3)',
            description: 'Carne marinada con piña y verduras',
            price: 8.99,
            category: 'Tacos',
            order: 1,
          },
          {
            name: 'Tacos Carnitas (3)',
            description: 'Cerdo desmenuzado con cebolla y cilantro',
            price: 8.99,
            category: 'Tacos',
            order: 2,
          },
          {
            name: 'Tacos de Pescado (3)',
            description: 'Pescado frito con slaw de col',
            price: 9.99,
            category: 'Tacos',
            order: 3,
          },
          // Burritos
          {
            name: 'Burrito Clásico',
            description: 'Tortilla grande con carne, arroz, frijoles y queso',
            price: 10.99,
            category: 'Burritos',
            order: 4,
          },
          {
            name: 'Burrito Vegetariano',
            description: 'Tofu, verduras, arroz y frijoles',
            price: 9.99,
            category: 'Burritos',
            order: 5,
          },
          // Quesadillas
          {
            name: 'Quesadilla de Pollo',
            description: 'Tortilla de maíz rellena de pollo y queso Oaxaca',
            price: 8.99,
            category: 'Quesadillas',
            order: 6,
          },
          {
            name: 'Quesadilla de Hongos',
            description: 'Hongos silvestres, queso y epazote',
            price: 8.99,
            category: 'Quesadillas',
            order: 7,
          },
          // Ceviches
          {
            name: 'Ceviche Mixto',
            description: 'Pescado y camarones en jugo de limón',
            price: 12.99,
            category: 'Ceviches',
            order: 8,
          },
          {
            name: 'Ceviche de Camarones',
            description: 'Camarones frescos marinados en limón',
            price: 12.99,
            category: 'Ceviches',
            order: 9,
          },
          // Enchiladas
          {
            name: 'Enchiladas Verdes',
            description: 'Con salsa verde, queso y crema',
            price: 10.99,
            category: 'Enchiladas',
            order: 10,
          },
          // Postres
          {
            name: 'Churros con Chocolate',
            description: 'Churros caseros con chocolate derretido',
            price: 5.99,
            category: 'Postres',
            order: 11,
          },
          {
            name: 'Flan Mexicano',
            description: 'Postre de leche condensada con caramelo',
            price: 5.99,
            category: 'Postres',
            order: 12,
          },
          // Bebidas
          {
            name: 'Agua Fresca de Jamaica',
            description: 'Bebida refrescante de flores de Jamaica',
            price: 3.99,
            category: 'Bebidas',
            order: 13,
          },
          {
            name: 'Margarita Tradicional',
            description: 'Tequila, triple sec y jugo de limón',
            price: 7.99,
            category: 'Bebidas',
            order: 14,
          },
        ],
      },
    },
  });

  // ═══════════════════════════════════════════════════════════════
  // ☕ CAFETERÍA DEMO
  // ═══════════════════════════════════════════════════════════════
  console.log('📍 Creando The Coffee House Demo...');

  const coffeeRestaurant = await prisma.restaurant.create({
    data: {
      slug: 'coffee-house-demo',
      name: 'The Coffee House',
      phone: '+34 91 456 7890',
      whatsapp: '+34 644 456 789',
      email: 'hello@coffeehouse.es',
      address: 'Plaza Mayor 50, Madrid, España',
      description: 'Café artesanal con granos seleccionados. Desayunos gourmet.',
      theme: 'coffee',
      password: hashedPassword,
      hours: JSON.stringify({
        mon: '07:00-20:00',
        tue: '07:00-20:00',
        wed: '07:00-20:00',
        thu: '07:00-20:00',
        fri: '07:00-21:00',
        sat: '08:00-21:00',
        sun: '09:00-20:00',
      }),
      items: {
        create: [
          // Cafés
          {
            name: 'Espresso',
            description: 'Café espresso puro intenso',
            price: 2.49,
            category: 'Café',
            order: 1,
          },
          {
            name: 'Americano',
            description: 'Espresso con agua caliente',
            price: 2.99,
            category: 'Café',
            order: 2,
          },
          {
            name: 'Cortado',
            description: 'Espresso con leche al 50%',
            price: 2.79,
            category: 'Café',
            order: 3,
          },
          {
            name: 'Cappuccino',
            description: 'Espresso con leche espumada',
            price: 3.49,
            category: 'Café',
            order: 4,
          },
          {
            name: 'Latte',
            description: 'Espresso con mucha leche vaporizada',
            price: 3.49,
            category: 'Café',
            order: 5,
          },
          {
            name: 'Flat White',
            description: 'Espresso con leche cremosa sin espuma',
            price: 3.99,
            category: 'Café',
            order: 6,
          },
          // Especialidades
          {
            name: 'Café con Caramelo',
            description: 'Espresso con sirope de caramelo y leche',
            price: 4.49,
            category: 'Especialidades',
            order: 7,
          },
          {
            name: 'Mocha Chocolate',
            description: 'Espresso, chocolate y leche',
            price: 4.49,
            category: 'Especialidades',
            order: 8,
          },
          // Tés
          {
            name: 'Té Earl Grey',
            description: 'Té negro con bergamota',
            price: 2.99,
            category: 'Té',
            order: 9,
          },
          {
            name: 'Té Verde Matcha',
            description: 'Té verde en polvo tradicional japonés',
            price: 4.99,
            category: 'Té',
            order: 10,
          },
          // Pasteles
          {
            name: 'Croissant Mantequilla',
            description: 'Croissant francés recién hecho',
            price: 3.49,
            category: 'Pasteles',
            order: 11,
          },
          {
            name: 'Tarta de Queso',
            description: 'Clásica tarta de queso casera',
            price: 4.99,
            category: 'Pasteles',
            order: 12,
          },
          {
            name: 'Brownie de Chocolate',
            description: 'Brownie crujiente por fuera, tierno por dentro',
            price: 3.99,
            category: 'Pasteles',
            order: 13,
          },
          // Snacks
          {
            name: 'Sándwich de Jamón y Queso',
            description: 'Pan tostado con jamón ibérico y queso',
            price: 6.99,
            category: 'Snacks',
            order: 14,
          },
          {
            name: 'Ensalada Fresca',
            description: 'Ensalada de temporada con aderezo casero',
            price: 7.99,
            category: 'Snacks',
            order: 15,
          },
          // Bebidas Frías
          {
            name: 'Iced Coffee',
            description: 'Café helado refrescante',
            price: 3.99,
            category: 'Bebidas Frías',
            order: 16,
          },
          {
            name: 'Frappuccino',
            description: 'Bebida helada de café con nata',
            price: 4.99,
            category: 'Bebidas Frías',
            order: 17,
          },
        ],
      },
    },
  });

  console.log('\n✅ Seed completado exitosamente!\n');
  console.log('📱 Restaurantes disponibles:\n');
  console.log(`🇮🇹 Ristorante Italiano: https://digitaliza-unified.vercel.app/ristorante-demo`);
  console.log(`🇯🇵 Sakura Sushi Bar: https://digitaliza-unified.vercel.app/sakura-sushi-demo`);
  console.log(`🇲🇽 El Mexicano Feliz: https://digitaliza-unified.vercel.app/el-mexicano-feliz-demo`);
  console.log(`☕ The Coffee House: https://digitaliza-unified.vercel.app/coffee-house-demo`);
  console.log('\n🔑 Credenciales Admin: password: "demo123"\n');
  console.log('📝 Panel Admin:\n');
  console.log(`🇮🇹 https://digitaliza-unified.vercel.app/ristorante-demo/admin`);
  console.log(`🇯🇵 https://digitaliza-unified.vercel.app/sakura-sushi-demo/admin`);
  console.log(`🇲🇽 https://digitaliza-unified.vercel.app/el-mexicano-feliz-demo/admin`);
  console.log(`☕ https://digitaliza-unified.vercel.app/coffee-house-demo/admin\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
