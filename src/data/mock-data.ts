import { ClientType, ProductType, QuotationType, TemplateType } from "../types/window";

// Mock Clients Data
export const clients: ClientType[] = [
  { 
    id: "c1", 
    name: "Acme Corp", 
    contact: "John Smith", 
    email: "john@acmecorp.com", 
    phone: "555-123-4567",
    address: "123 Business Ave",
    city: "Metropolis",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    notes: "Key client for enterprise solutions",
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-05-20T14:45:00Z"
  },
  { 
    id: "c2", 
    name: "Globex Inc", 
    contact: "Jane Doe", 
    email: "jane@globexinc.com", 
    phone: "555-234-5678",
    address: "456 Corporate Blvd",
    city: "Business City",
    state: "CA",
    zipCode: "90210",
    country: "United States",
    notes: "Interested in expanding services",
    createdAt: "2023-02-10T09:15:00Z",
    updatedAt: "2023-06-05T11:20:00Z"
  },
  { 
    id: "c3", 
    name: "Stark Industries", 
    contact: "Tony Stark", 
    email: "tony@starkindustries.com", 
    phone: "555-345-6789",
    address: "789 Innovation Way",
    city: "Tech Valley",
    state: "CA",
    zipCode: "94025",
    country: "United States",
    notes: "High-value client, requires premium support",
    createdAt: "2023-02-22T14:30:00Z",
    updatedAt: "2023-06-18T16:40:00Z"
  },
  { 
    id: "c4", 
    name: "Wayne Enterprises", 
    contact: "Bruce Wayne", 
    email: "bruce@wayneenterprises.com", 
    phone: "555-456-7890",
    address: "1007 Mountain Drive",
    city: "Gotham",
    state: "NJ",
    zipCode: "08701",
    country: "United States",
    notes: "Interested in security solutions",
    createdAt: "2023-03-05T11:45:00Z",
    updatedAt: "2023-07-12T09:30:00Z"
  },
  { 
    id: "c5", 
    name: "Umbrella Corp", 
    contact: "Alice Smith", 
    email: "alice@umbrellacorp.com", 
    phone: "555-567-8901",
    address: "101 Research Park",
    city: "Raccoon City",
    state: "WA",
    zipCode: "98101",
    country: "United States",
    notes: "Pharmaceutical division expansion planned",
    createdAt: "2023-03-18T16:20:00Z",
    updatedAt: "2023-07-25T13:15:00Z"
  },
  { 
    id: "c6", 
    name: "Cyberdyne Systems", 
    contact: "Miles Dyson", 
    email: "miles@cyberdyne.com", 
    phone: "555-678-9012",
    address: "2144 AI Boulevard",
    city: "Silicon Valley",
    state: "CA",
    zipCode: "94304",
    country: "United States",
    notes: "AI and robotics focus",
    createdAt: "2023-04-02T10:10:00Z",
    updatedAt: "2023-08-08T15:50:00Z"
  }
];

// Mock Products Data
export const products: ProductType[] = [
  { 
    id: "p1", 
    name: "Business Consultation", 
    description: "Expert business strategy consultation services",
    type: "service", 
    price: 150.00, 
    unit: "hour",
    tax: 0,
    stock: null,
    image: "https://img.heroui.chat/image/ai?w=200&h=200&u=1",
    createdAt: "2023-01-10T08:30:00Z",
    updatedAt: "2023-01-10T08:30:00Z"
  },
  { 
    id: "p2", 
    name: "Web Development", 
    description: "Professional web development and design services",
    type: "service", 
    price: 95.00, 
    unit: "hour",
    tax: 0,
    stock: null,
    image: "https://img.heroui.chat/image/ai?w=200&h=200&u=2",
    createdAt: "2023-01-12T09:45:00Z",
    updatedAt: "2023-01-12T09:45:00Z"
  },
  { 
    id: "p3", 
    name: "Office Chair", 
    description: "Ergonomic office chair with lumbar support",
    type: "product", 
    price: 299.99, 
    unit: "piece",
    tax: 8.5,
    stock: 24,
    image: "https://img.heroui.chat/image/furniture?w=200&h=200&u=1",
    createdAt: "2023-01-15T11:20:00Z",
    updatedAt: "2023-06-20T14:30:00Z"
  },
  { 
    id: "p4", 
    name: "Laptop Computer", 
    description: "High-performance business laptop with SSD",
    type: "product", 
    price: 1299.99, 
    unit: "piece",
    tax: 8.5,
    stock: 12,
    image: "https://img.heroui.chat/image/ai?w=200&h=200&u=3",
    createdAt: "2023-01-18T13:15:00Z",
    updatedAt: "2023-06-25T10:45:00Z"
  },
  { 
    id: "p5", 
    name: "Cloud Storage", 
    description: "Secure cloud storage solution with backup",
    type: "subscription", 
    price: 49.99, 
    unit: "month",
    tax: 0,
    stock: null,
    image: "https://img.heroui.chat/image/ai?w=200&h=200&u=4",
    createdAt: "2023-01-20T15:30:00Z",
    updatedAt: "2023-01-20T15:30:00Z"
  },
  { 
    id: "p6", 
    name: "Office Desk", 
    description: "Spacious office desk with cable management",
    type: "product", 
    price: 449.99, 
    unit: "piece",
    tax: 8.5,
    stock: 8,
    image: "https://img.heroui.chat/image/furniture?w=200&h=200&u=2",
    createdAt: "2023-01-25T09:10:00Z",
    updatedAt: "2023-07-02T11:25:00Z"
  }
];

// Mock Quotations Data
export const quotations: QuotationType[] = [
  { 
    id: "Q-2023-001", 
    clientId: "c1",
    clientName: "Acme Corp", 
    date: "2023-05-15", 
    expiryDate: "2023-06-15",
    items: [
      {
        id: "qi1",
        productId: "p1",
        name: "Business Consultation",
        description: "Strategic planning sessions",
        quantity: 20,
        unitPrice: 150.00,
        tax: 0,
        discount: 0,
        total: 3000.00
      },
      {
        id: "qi2",
        productId: "p3",
        name: "Office Chair",
        description: "Ergonomic office chairs for executive team",
        quantity: 8,
        unitPrice: 299.99,
        tax: 8.5,
        discount: 5,
        total: 2250.00
      }
    ],
    subtotal: 5250.00,
    tax: 204.00,
    discount: 250.00,
    total: 5204.00,
    notes: "Quotation for Q2 business strategy planning and office equipment",
    terms: "Payment due within 30 days of acceptance",
    status: "approved",
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2023-05-20T14:45:00Z"
  },
  { 
    id: "Q-2023-002", 
    clientId: "c2",
    clientName: "Globex Inc", 
    date: "2023-05-18", 
    expiryDate: "2023-06-18",
    items: [
      {
        id: "qi3",
        productId: "p2",
        name: "Web Development",
        description: "Corporate website redesign",
        quantity: 30,
        unitPrice: 95.00,
        tax: 0,
        discount: 0,
        total: 2850.00
      },
      {
        id: "qi4",
        productId: "p5",
        name: "Cloud Storage",
        description: "Annual cloud storage subscription",
        quantity: 12,
        unitPrice: 49.99,
        tax: 0,
        discount: 10,
        total: 539.89
      }
    ],
    subtotal: 3389.89,
    tax: 0,
    discount: 269.14,
    total: 3120.75,
    notes: "Website redesign project with cloud storage solution",
    terms: "50% payment upfront, remainder upon completion",
    status: "pending",
    createdAt: "2023-05-18T09:15:00Z",
    updatedAt: "2023-05-18T09:15:00Z"
  },
  { 
    id: "Q-2023-003", 
    clientId: "c3",
    clientName: "Stark Industries", 
    date: "2023-05-20", 
    expiryDate: "2023-06-20",
    items: [
      {
        id: "qi5",
        productId: "p1",
        name: "Business Consultation",
        description: "Innovation strategy workshops",
        quantity: 25,
        unitPrice: 150.00,
        tax: 0,
        discount: 0,
        total: 3750.00
      },
      {
        id: "qi6",
        productId: "p4",
        name: "Laptop Computer",
        description: "High-performance laptops for R&D team",
        quantity: 5,
        unitPrice: 1299.99,
        tax: 8.5,
        discount: 8,
        total: 5980.00
      }
    ],
    subtotal: 9730.00,
    tax: 508.30,
    discount: 1487.80,
    total: 8750.50,
    notes: "Innovation strategy and equipment for R&D department",
    terms: "Net 15 payment terms",
    status: "draft",
    createdAt: "2023-05-20T14:30:00Z",
    updatedAt: "2023-05-20T14:30:00Z"
  },
  { 
    id: "Q-2023-004", 
    clientId: "c4",
    clientName: "Wayne Enterprises", 
    date: "2023-05-22", 
    expiryDate: "2023-06-22",
    items: [
      {
        id: "qi7",
        productId: "p2",
        name: "Web Development",
        description: "Security portal development",
        quantity: 40,
        unitPrice: 95.00,
        tax: 0,
        discount: 5,
        total: 3610.00
      },
      {
        id: "qi8",
        productId: "p5",
        name: "Cloud Storage",
        description: "Secure cloud storage with encryption",
        quantity: 24,
        unitPrice: 49.99,
        tax: 0,
        discount: 15,
        total: 1019.80
      }
    ],
    subtotal: 4629.80,
    tax: 0,
    discount: 309.55,
    total: 4320.25,
    notes: "Security portal development with encrypted storage solution",
    terms: "Payment due within 30 days of delivery",
    status: "sent",
    createdAt: "2023-05-22T11:45:00Z",
    updatedAt: "2023-05-25T09:30:00Z"
  },
  { 
    id: "Q-2023-005", 
    clientId: "c5",
    clientName: "Umbrella Corp", 
    date: "2023-05-25", 
    expiryDate: "2023-06-25",
    items: [
      {
        id: "qi9",
        productId: "p1",
        name: "Business Consultation",
        description: "Expansion strategy planning",
        quantity: 15,
        unitPrice: 150.00,
        tax: 0,
        discount: 0,
        total: 2250.00
      },
      {
        id: "qi10",
        productId: "p3",
        name: "Office Chair",
        description: "Ergonomic chairs for new office",
        quantity: 15,
        unitPrice: 299.99,
        tax: 8.5,
        discount: 10,
        total: 4050.00
      }
    ],
    subtotal: 6300.00,
    tax: 344.25,
    discount: 494.25,
    total: 6150.00,
    notes: "Expansion planning and office equipment for new location",
    terms: "Net 30 payment terms",
    status: "approved",
    createdAt: "2023-05-25T16:20:00Z",
    updatedAt: "2023-06-02T13:15:00Z"
  },
  { 
    id: "Q-2023-006", 
    clientId: "c6",
    clientName: "Cyberdyne Systems", 
    date: "2023-05-28", 
    expiryDate: "2023-06-28",
    items: [
      {
        id: "qi11",
        productId: "p2",
        name: "Web Development",
        description: "AI interface development",
        quantity: 25,
        unitPrice: 95.00,
        tax: 0,
        discount: 0,
        total: 2375.00
      },
      {
        id: "qi12",
        productId: "p4",
        name: "Laptop Computer",
        description: "Development laptops",
        quantity: 1,
        unitPrice: 1299.99,
        tax: 8.5,
        discount: 20,
        total: 1040.00
      }
    ],
    subtotal: 3415.00,
    tax: 88.40,
    discount: 612.65,
    total: 2890.75,
    notes: "AI interface development project with equipment",
    terms: "Payment due within 15 days of acceptance",
    status: "rejected",
    createdAt: "2023-05-28T10:10:00Z",
    updatedAt: "2023-06-05T15:50:00Z"
  }
];

// Mock Templates Data
export const templates: TemplateType[] = [
  { 
    id: "T001", 
    name: "Professional", 
    description: "Clean and professional template for corporate clients", 
    category: "business",
    content: "<div>Professional template content</div>",
    thumbnail: "https://img.heroui.chat/image/ai?w=400&h=300&u=10",
    createdAt: "2023-01-05T10:30:00Z",
    updatedAt: "2023-01-05T10:30:00Z"
  },
  { 
    id: "T002", 
    name: "Creative", 
    description: "Modern design for creative agencies and startups", 
    category: "creative",
    content: "<div>Creative template content</div>",
    thumbnail: "https://img.heroui.chat/image/ai?w=400&h=300&u=11",
    createdAt: "2023-01-10T11:45:00Z",
    updatedAt: "2023-01-10T11:45:00Z"
  },
  { 
    id: "T003", 
    name: "Technical", 
    description: "Detailed template for technical specifications and IT services", 
    category: "technical",
    content: "<div>Technical template content</div>",
    thumbnail: "https://img.heroui.chat/image/ai?w=400&h=300&u=12",
    createdAt: "2023-01-15T09:20:00Z",
    updatedAt: "2023-01-15T09:20:00Z"
  },
  { 
    id: "T004", 
    name: "Consulting", 
    description: "Specialized template for consulting services", 
    category: "business",
    content: "<div>Consulting template content</div>",
    thumbnail: "https://img.heroui.chat/image/ai?w=400&h=300&u=13",
    createdAt: "2023-01-20T14:30:00Z",
    updatedAt: "2023-01-20T14:30:00Z"
  },
  { 
    id: "T005", 
    name: "Construction", 
    description: "Template for construction and contracting services", 
    category: "industry",
    content: "<div>Construction template content</div>",
    thumbnail: "https://img.heroui.chat/image/ai?w=400&h=300&u=14",
    createdAt: "2023-01-25T16:15:00Z",
    updatedAt: "2023-01-25T16:15:00Z"
  },
  { 
    id: "T006", 
    name: "Healthcare", 
    description: "Template designed for healthcare services", 
    category: "healthcare",
    content: "<div>Healthcare template content</div>",
    thumbnail: "https://img.heroui.chat/image/ai?w=400&h=300&u=15",
    createdAt: "2023-01-30T10:45:00Z",
    updatedAt: "2023-01-30T10:45:00Z"
  }
];
