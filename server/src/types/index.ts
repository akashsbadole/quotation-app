import { z } from 'zod';

// Enums
export const ProductTypeSchema = z.enum(['PRODUCT', 'SERVICE', 'SUBSCRIPTION']);
export const QuotationStatusSchema = z.enum(['DRAFT', 'PENDING', 'SENT', 'APPROVED', 'REJECTED']);

// Client schemas
export const CreateClientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contact: z.string().min(1, 'Contact is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required'),
  notes: z.string().optional()
});

export const UpdateClientSchema = CreateClientSchema.partial();

// Product schemas
export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  type: ProductTypeSchema,
  price: z.number().min(0, 'Price must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  tax: z.number().min(0).default(0),
  stock: z.number().int().min(0).optional(),
  image: z.string().url().optional()
});

export const UpdateProductSchema = CreateProductSchema.partial();

// Quotation Item schemas
export const QuotationItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be positive'),
  tax: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  total: z.number().min(0)
});

// Quotation schemas
export const CreateQuotationSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  date: z.string().datetime(),
  expiryDate: z.string().datetime(),
  items: z.array(QuotationItemSchema).min(1, 'At least one item is required'),
  notes: z.string().optional(),
  terms: z.string().optional(),
  status: QuotationStatusSchema.default('DRAFT')
});

export const UpdateQuotationSchema = CreateQuotationSchema.partial();

// Template schemas
export const CreateTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  content: z.string().min(1, 'Content is required'),
  thumbnail: z.string().url().optional()
});

export const UpdateTemplateSchema = CreateTemplateSchema.partial();

// Export types
export type CreateClientInput = z.infer<typeof CreateClientSchema>;
export type UpdateClientInput = z.infer<typeof UpdateClientSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type QuotationItemInput = z.infer<typeof QuotationItemSchema>;
export type CreateQuotationInput = z.infer<typeof CreateQuotationSchema>;
export type UpdateQuotationInput = z.infer<typeof UpdateQuotationSchema>;
export type CreateTemplateInput = z.infer<typeof CreateTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof UpdateTemplateSchema>;
export type ProductType = z.infer<typeof ProductTypeSchema>;
export type QuotationStatus = z.infer<typeof QuotationStatusSchema>;
