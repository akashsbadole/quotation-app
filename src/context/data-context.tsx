import React from "react";
import {
  ClientType,
  ProductType,
  QuotationType,
  QuotationItemType,
  TemplateType,
} from "../types/window";
import {
  clientsApi,
  productsApi,
  quotationsApi,
  templatesApi,
} from "../services/api";

interface DataContextType {
  // Loading states
  loading: boolean;
  error: string | null;

  // Quotations
  quotations: QuotationType[];
  getQuotation: (id: string) => QuotationType | undefined;
  addQuotation: (quotation: {
    clientId: string;
    date: string;
    expiryDate: string;
    items: QuotationItemType[];
    notes?: string;
    terms?: string;
    status?: "draft" | "pending" | "sent" | "approved" | "rejected";
  }) => Promise<QuotationType>;
  updateQuotation: (
    id: string,
    quotation: Partial<QuotationType>
  ) => Promise<QuotationType | undefined>;
  deleteQuotation: (id: string) => Promise<void>;
  duplicateQuotation: (id: string) => Promise<QuotationType>;

  // Clients
  clients: ClientType[];
  getClient: (id: string) => ClientType | undefined;
  addClient: (
    client: Omit<ClientType, "id" | "createdAt" | "updatedAt">
  ) => Promise<ClientType>;
  updateClient: (
    id: string,
    client: Partial<ClientType>
  ) => Promise<ClientType | undefined>;
  deleteClient: (id: string) => Promise<void>;

  // Products
  products: ProductType[];
  getProduct: (id: string) => ProductType | undefined;
  addProduct: (
    product: Omit<ProductType, "id" | "createdAt" | "updatedAt">
  ) => Promise<ProductType>;
  updateProduct: (
    id: string,
    product: Partial<ProductType>
  ) => Promise<ProductType | undefined>;
  deleteProduct: (id: string) => Promise<void>;

  // Templates
  templates: TemplateType[];
  getTemplate: (id: string) => TemplateType | undefined;
  addTemplate: (
    template: Omit<TemplateType, "id" | "createdAt" | "updatedAt">
  ) => Promise<TemplateType>;
  updateTemplate: (
    id: string,
    template: Partial<TemplateType>
  ) => Promise<TemplateType | undefined>;
  deleteTemplate: (id: string) => Promise<void>;

  // Calculations
  calculateQuotationTotals: (items: QuotationItemType[]) => {
    subtotal: number;
    tax: number;
    total: number;
  };

  // Data refresh
  refreshData: () => Promise<void>;
}

export const DataContext = React.createContext<DataContextType>({
  // Loading states
  loading: false,
  error: null,

  // Quotations
  quotations: [],
  getQuotation: () => undefined,
  addQuotation: async () => ({} as QuotationType),
  updateQuotation: async () => undefined,
  deleteQuotation: async () => {},
  duplicateQuotation: async () => ({} as QuotationType),

  // Clients
  clients: [],
  getClient: () => undefined,
  addClient: async () => ({} as ClientType),
  updateClient: async () => undefined,
  deleteClient: async () => {},

  // Products
  products: [],
  getProduct: () => undefined,
  addProduct: async () => ({} as ProductType),
  updateProduct: async () => undefined,
  deleteProduct: async () => {},

  // Templates
  templates: [],
  getTemplate: () => undefined,
  addTemplate: async () => ({} as TemplateType),
  updateTemplate: async () => undefined,
  deleteTemplate: async () => {},

  // Calculations
  calculateQuotationTotals: () => ({ subtotal: 0, tax: 0, total: 0 }),

  // Data refresh
  refreshData: async () => {},
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [quotations, setQuotations] = React.useState<QuotationType[]>([]);
  const [clients, setClients] = React.useState<ClientType[]>([]);
  const [products, setProducts] = React.useState<ProductType[]>([]);
  const [templates, setTemplates] = React.useState<TemplateType[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Load initial data
  React.useEffect(() => {
    refreshData();
  }, []);

  // Data refresh function
  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [quotationsData, clientsData, productsData, templatesData] =
        await Promise.all([
          quotationsApi.getAll(),
          clientsApi.getAll(),
          productsApi.getAll(),
          templatesApi.getAll(),
        ]);

      setQuotations(quotationsData);
      setClients(clientsData);
      setProducts(productsData);
      setTemplates(templatesData);
    } catch (err: any) {
      console.error("Failed to load data:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Quotation functions
  const getQuotation = (id: string) => {
    return quotations.find((q) => q.id === id);
  };

  const addQuotation = async (quotation: {
    clientId: string;
    date: string;
    expiryDate: string;
    items: QuotationItemType[];
    notes?: string;
    terms?: string;
    status?: "draft" | "pending" | "sent" | "approved" | "rejected";
  }) => {
    try {
      const newQuotation = await quotationsApi.create(quotation);
      setQuotations([...quotations, newQuotation]);
      return newQuotation;
    } catch (err: any) {
      console.error("Failed to create quotation:", err);
      setError(err.message || "Failed to create quotation");
      throw err;
    }
  };

  const updateQuotation = async (
    id: string,
    quotation: Partial<QuotationType>
  ) => {
    try {
      const updatedQuotation = await quotationsApi.update(id, quotation);
      if (updatedQuotation) {
        const index = quotations.findIndex((q) => q.id === id);
        if (index !== -1) {
          const newQuotations = [...quotations];
          newQuotations[index] = updatedQuotation;
          setQuotations(newQuotations);
        }
      }
      return updatedQuotation;
    } catch (err: any) {
      console.error("Failed to update quotation:", err);
      setError(err.message || "Failed to update quotation");
      throw err;
    }
  };

  const deleteQuotation = async (id: string) => {
    try {
      await quotationsApi.delete(id);
      setQuotations(quotations.filter((q) => q.id !== id));
    } catch (err: any) {
      console.error("Failed to delete quotation:", err);
      setError(err.message || "Failed to delete quotation");
      throw err;
    }
  };

  const duplicateQuotation = async (id: string) => {
    try {
      const duplicatedQuotation = await quotationsApi.duplicate(id);
      setQuotations([...quotations, duplicatedQuotation]);
      return duplicatedQuotation;
    } catch (err: any) {
      console.error("Failed to duplicate quotation:", err);
      setError(err.message || "Failed to duplicate quotation");
      throw err;
    }
  };

  // Client functions
  const getClient = (id: string) => {
    return clients.find((c) => c.id === id);
  };

  const addClient = async (
    client: Omit<ClientType, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newClient = await clientsApi.create(client);
      setClients([...clients, newClient]);
      return newClient;
    } catch (err: any) {
      console.error("Failed to create client:", err);
      setError(err.message || "Failed to create client");
      throw err;
    }
  };

  const updateClient = async (id: string, client: Partial<ClientType>) => {
    try {
      const updatedClient = await clientsApi.update(id, client);
      if (updatedClient) {
        const index = clients.findIndex((c) => c.id === id);
        if (index !== -1) {
          const newClients = [...clients];
          newClients[index] = updatedClient;
          setClients(newClients);
        }
      }
      return updatedClient;
    } catch (err: any) {
      console.error("Failed to update client:", err);
      setError(err.message || "Failed to update client");
      throw err;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      await clientsApi.delete(id);
      setClients(clients.filter((c) => c.id !== id));
    } catch (err: any) {
      console.error("Failed to delete client:", err);
      setError(err.message || "Failed to delete client");
      throw err;
    }
  };

  // Product functions
  const getProduct = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const addProduct = async (
    product: Omit<ProductType, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newProduct = await productsApi.create(product);
      setProducts([...products, newProduct]);
      return newProduct;
    } catch (err: any) {
      console.error("Failed to create product:", err);
      setError(err.message || "Failed to create product");
      throw err;
    }
  };

  const updateProduct = async (id: string, product: Partial<ProductType>) => {
    try {
      const updatedProduct = await productsApi.update(id, product);
      if (updatedProduct) {
        const index = products.findIndex((p) => p.id === id);
        if (index !== -1) {
          const newProducts = [...products];
          newProducts[index] = updatedProduct;
          setProducts(newProducts);
        }
      }
      return updatedProduct;
    } catch (err: any) {
      console.error("Failed to update product:", err);
      setError(err.message || "Failed to update product");
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productsApi.delete(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error("Failed to delete product:", err);
      setError(err.message || "Failed to delete product");
      throw err;
    }
  };

  // Template functions
  const getTemplate = (id: string) => {
    return templates.find((t) => t.id === id);
  };

  const addTemplate = async (
    template: Omit<TemplateType, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newTemplate = await templatesApi.create(template);
      setTemplates([...templates, newTemplate]);
      return newTemplate;
    } catch (err: any) {
      console.error("Failed to create template:", err);
      setError(err.message || "Failed to create template");
      throw err;
    }
  };

  const updateTemplate = async (
    id: string,
    template: Partial<TemplateType>
  ) => {
    try {
      const updatedTemplate = await templatesApi.update(id, template);
      if (updatedTemplate) {
        const index = templates.findIndex((t) => t.id === id);
        if (index !== -1) {
          const newTemplates = [...templates];
          newTemplates[index] = updatedTemplate;
          setTemplates(newTemplates);
        }
      }
      return updatedTemplate;
    } catch (err: any) {
      console.error("Failed to update template:", err);
      setError(err.message || "Failed to update template");
      throw err;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await templatesApi.delete(id);
      setTemplates(templates.filter((t) => t.id !== id));
    } catch (err: any) {
      console.error("Failed to delete template:", err);
      setError(err.message || "Failed to delete template");
      throw err;
    }
  };

  // Calculation functions
  const calculateQuotationTotals = (items: QuotationItemType[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = items.reduce(
      (sum, item) => sum + (item.tax / 100) * item.unitPrice * item.quantity,
      0
    );
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  return (
    <DataContext.Provider
      value={{
        // Loading states
        loading,
        error,

        // Quotations
        quotations,
        getQuotation,
        addQuotation,
        updateQuotation,
        deleteQuotation,
        duplicateQuotation,

        // Clients
        clients,
        getClient,
        addClient,
        updateClient,
        deleteClient,

        // Products
        products,
        getProduct,
        addProduct,
        updateProduct,
        deleteProduct,

        // Templates
        templates,
        getTemplate,
        addTemplate,
        updateTemplate,
        deleteTemplate,

        // Calculations
        calculateQuotationTotals,

        // Data refresh
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => React.useContext(DataContext);
