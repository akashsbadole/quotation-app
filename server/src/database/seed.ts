import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.quotationItem.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.client.deleteMany();
  await prisma.product.deleteMany();
  await prisma.template.deleteMany();

  // Seed Clients
  console.log('📝 Seeding clients...');
  const clients = await prisma.client.createMany({
    data: [
      {
        id: 'c1',
        name: 'Acme Corp',
        contact: 'John Smith',
        email: 'john@acmecorp.com',
        phone: '+1 (555) 123-4567',
        address: '123 Business Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        notes: 'Large enterprise client with multiple locations'
      },
      {
        id: 'c2',
        name: 'Tech Innovations LLC',
        contact: 'Sarah Johnson',
        email: 'sarah@techinnovations.com',
        phone: '+1 (555) 987-6543',
        address: '456 Innovation Drive',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'USA',
        notes: 'Startup focused on AI and machine learning'
      },
      {
        id: 'c3',
        name: 'Global Manufacturing Inc',
        contact: 'Michael Brown',
        email: 'michael@globalmanufacturing.com',
        phone: '+1 (555) 456-7890',
        address: '789 Industrial Blvd',
        city: 'Detroit',
        state: 'MI',
        zipCode: '48201',
        country: 'USA',
        notes: 'Manufacturing company specializing in automotive parts'
      }
    ]
  });

  // Seed Products
  console.log('📦 Seeding products...');
  const products = await prisma.product.createMany({
    data: [
      {
        id: 'p1',
        name: 'Business Consultation',
        description: 'Expert business strategy consultation services',
        type: 'SERVICE',
        price: 150.00,
        unit: 'hour',
        tax: 0,
        stock: null,
        image: 'https://img.heroui.chat/image/ai?w=200&h=200&u=1'
      },
      {
        id: 'p2',
        name: 'Web Development',
        description: 'Professional web development and design services',
        type: 'SERVICE',
        price: 95.00,
        unit: 'hour',
        tax: 0,
        stock: null,
        image: 'https://img.heroui.chat/image/ai?w=200&h=200&u=2'
      },
      {
        id: 'p3',
        name: 'Office Chair',
        description: 'Ergonomic office chair with lumbar support',
        type: 'PRODUCT',
        price: 299.99,
        unit: 'piece',
        tax: 8.5,
        stock: 50,
        image: 'https://img.heroui.chat/image/ai?w=200&h=200&u=3'
      },
      {
        id: 'p4',
        name: 'Software License',
        description: 'Annual software license for productivity suite',
        type: 'SUBSCRIPTION',
        price: 99.99,
        unit: 'license',
        tax: 0,
        stock: null,
        image: 'https://img.heroui.chat/image/ai?w=200&h=200&u=4'
      },
      {
        id: 'p5',
        name: 'Marketing Campaign',
        description: 'Comprehensive digital marketing campaign management',
        type: 'SERVICE',
        price: 2500.00,
        unit: 'campaign',
        tax: 0,
        stock: null,
        image: 'https://img.heroui.chat/image/ai?w=200&h=200&u=5'
      }
    ]
  });

  // Seed Templates
  console.log('🎨 Seeding templates...');
  const templates = await prisma.template.createMany({
    data: [
      {
        id: 'T001',
        name: 'Professional',
        description: 'Clean and professional template for corporate clients',
        category: 'business',
        content: '<div class="professional-template">Professional template content</div>',
        thumbnail: 'https://img.heroui.chat/image/ai?w=400&h=300&u=10'
      },
      {
        id: 'T002',
        name: 'Creative',
        description: 'Modern design for creative agencies and startups',
        category: 'creative',
        content: '<div class="creative-template">Creative template content</div>',
        thumbnail: 'https://img.heroui.chat/image/ai?w=400&h=300&u=11'
      },
      {
        id: 'T003',
        name: 'Minimal',
        description: 'Simple and clean design focusing on content',
        category: 'minimal',
        content: '<div class="minimal-template">Minimal template content</div>',
        thumbnail: 'https://img.heroui.chat/image/ai?w=400&h=300&u=12'
      }
    ]
  });

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created ${clients.count} clients`);
  console.log(`📦 Created ${products.count} products`);
  console.log(`🎨 Created ${templates.count} templates`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
