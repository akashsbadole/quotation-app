export interface WindowType {
  id: string;
  title: string;
  content: React.ReactNode;
  width: number;
  height: number;
  x: number;
  y: number;
  minimized?: boolean;
  maximized?: boolean;
  resizable?: boolean;
  zIndex?: number;
}

export interface DesktopIconType {
  id: string;
  name: string;
  icon: string;
  onClick: () => void;
}

export interface DesktopItemType {
  id: string;
  name: string;
  type: "folder" | "shortcut" | "document" | "app";
  icon: string;
  position: { x: number; y: number };
  target?: string; // For shortcuts
  content?: string; // For documents
  createdAt: string;
}

export interface AppType {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<any>;
  description?: string;
  category?: string;
}

// Add new interfaces for data models
export interface QuotationType {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  expiryDate: string;
  items: QuotationItemType[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes: string;
  terms: string;
  status: "draft" | "pending" | "sent" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface QuotationItemType {
  id: string;
  productId: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  discount: number;
  total: number;
}

export interface ClientType {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  notes: string;

  // Enhanced CRM fields
  category?: string; // "premium", "standard", "basic"
  segment?: string; // "enterprise", "sme", "individual"
  creditLimit?: number;
  paymentTerms?: number; // days
  taxId?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  preferredCurrency?: string;

  // Status and tracking
  status: string; // "active", "inactive", "suspended"
  lastContactDate?: string;
  nextFollowUp?: string;

  createdAt: string;
  updatedAt: string;
}

export interface ProductType {
  id: string;
  name: string;
  description: string;
  type: "product" | "service" | "subscription";
  price: number;
  unit: string;
  tax: number;
  stock: number | null;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateType {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}
