import React from "react";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Card,
  CardBody,
  CardHeader,
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Switch,
  Slider,
  DatePicker,
  Autocomplete,
  AutocompleteItem,
  Divider,
  Progress,
  Badge,
  Avatar,
  Tooltip,
  Checkbox,
  CheckboxGroup,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useDataContext } from "../../context/data-context";
import {
  QuotationType,
  ClientType,
  ProductType,
  QuotationItemType,
} from "../../types/window";

interface ComprehensiveQuotationCreatorProps {
  onClose?: () => void;
  quotation?: QuotationType | null;
  mode?: "create" | "edit" | "duplicate" | "template";
}

interface QuotationFormData {
  clientId: string;
  templateId?: string;
  currency: string;
  exchangeRate: number;
  validityDays: number;
  items: QuotationItemType[];
  discountType: "percentage" | "fixed";
  discountValue: number;
  taxRates: TaxRate[];
  terms: string;
  notes: string;
  internalNotes: string;
  priority: "low" | "medium" | "high" | "urgent";
  tags: string[];
  customFields: Record<string, any>;
  approvalRequired: boolean;
  autoSend: boolean;
  followUpDays: number;
}

interface TaxRate {
  id: string;
  name: string;
  rate: number;
  type: "percentage" | "fixed";
  isDefault: boolean;
}

interface PricingTier {
  minQty: number;
  maxQty?: number;
  price: number;
  discount: number;
}

export const ComprehensiveQuotationCreator: React.FC<
  ComprehensiveQuotationCreatorProps
> = ({ onClose, quotation, mode = "create" }) => {
  const { clients, products, addQuotation, updateQuotation } = useDataContext();

  // Form state
  const [formData, setFormData] = React.useState<QuotationFormData>({
    clientId: "",
    currency: "USD",
    exchangeRate: 1.0,
    validityDays: 30,
    items: [],
    discountType: "percentage",
    discountValue: 0,
    taxRates: [
      {
        id: "1",
        name: "Standard VAT",
        rate: 20,
        type: "percentage",
        isDefault: true,
      },
    ],
    terms: "Payment due within 30 days of invoice date.",
    notes: "",
    internalNotes: "",
    priority: "medium",
    tags: [],
    customFields: {},
    approvalRequired: false,
    autoSend: false,
    followUpDays: 7,
  });

  // UI state
  const [selectedTab, setSelectedTab] = React.useState("basic");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);

  // Modal states
  const {
    isOpen: isProductModalOpen,
    onOpen: onProductModalOpen,
    onClose: onProductModalClose,
  } = useDisclosure();
  const {
    isOpen: isPreviewModalOpen,
    onOpen: onPreviewModalOpen,
    onClose: onPreviewModalClose,
  } = useDisclosure();
  const {
    isOpen: isTemplateModalOpen,
    onOpen: onTemplateModalOpen,
    onClose: onTemplateModalClose,
  } = useDisclosure();

  // Available currencies
  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", rate: 1.0 },
    { code: "EUR", name: "Euro", symbol: "€", rate: 0.85 },
    { code: "GBP", name: "British Pound", symbol: "£", rate: 0.73 },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 110.0 },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.25 },
  ];

  // Available templates
  const templates = [
    { id: "1", name: "Standard Service Quote", category: "service" },
    { id: "2", name: "Product Sales Quote", category: "product" },
    { id: "3", name: "Subscription Package", category: "subscription" },
    { id: "4", name: "Custom Project Quote", category: "project" },
  ];

  // Priority options
  const priorityOptions = [
    { key: "low", label: "Low", color: "default", icon: "lucide:arrow-down" },
    { key: "medium", label: "Medium", color: "primary", icon: "lucide:minus" },
    { key: "high", label: "High", color: "warning", icon: "lucide:arrow-up" },
    {
      key: "urgent",
      label: "Urgent",
      color: "danger",
      icon: "lucide:alert-triangle",
    },
  ];

  // Initialize form data
  React.useEffect(() => {
    if (quotation && mode !== "create") {
      setFormData({
        clientId: quotation.clientId,
        currency: "USD", // quotation.currency || "USD",
        exchangeRate: 1.0, // quotation.exchangeRate || 1.0,
        validityDays: 30,
        items: quotation.items || [],
        discountType: "percentage",
        discountValue: quotation.discount || 0,
        taxRates: [
          {
            id: "1",
            name: "Standard VAT",
            rate: 20,
            type: "percentage",
            isDefault: true,
          },
        ],
        terms: quotation.terms || "Payment due within 30 days of invoice date.",
        notes: quotation.notes || "",
        internalNotes: "",
        priority: "medium",
        tags: [],
        customFields: {},
        approvalRequired: false,
        autoSend: false,
        followUpDays: 7,
      });
    }
  }, [quotation, mode]);

  // Calculate totals
  const calculations = React.useMemo(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount =
      formData.discountType === "percentage"
        ? (subtotal * formData.discountValue) / 100
        : formData.discountValue;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = formData.taxRates.reduce((sum, tax) => {
      return (
        sum +
        (tax.type === "percentage"
          ? (afterDiscount * tax.rate) / 100
          : tax.rate)
      );
    }, 0);
    const total = afterDiscount + taxAmount;

    return {
      subtotal,
      discountAmount,
      afterDiscount,
      taxAmount,
      total,
      currency: currencies.find((c) => c.code === formData.currency),
    };
  }, [
    formData.items,
    formData.discountType,
    formData.discountValue,
    formData.taxRates,
    formData.currency,
  ]);

  // Add product to quotation
  const addProductToQuotation = (
    product: ProductType,
    quantity: number = 1
  ) => {
    const existingItemIndex = formData.items.findIndex(
      (item) => item.productId === product.id
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...formData.items];
      updatedItems[existingItemIndex].quantity += quantity;
      updatedItems[existingItemIndex].total =
        updatedItems[existingItemIndex].quantity *
        updatedItems[existingItemIndex].unitPrice;
      setFormData({ ...formData, items: updatedItems });
    } else {
      // Add new item
      const newItem: QuotationItemType = {
        id: `item-${Date.now()}`,
        quotationId: "",
        productId: product.id,
        name: product.name,
        description: product.description,
        quantity,
        unitPrice: product.price,
        tax: product.tax || 0,
        discount: 0,
        total: quantity * product.price,
      };
      setFormData({ ...formData, items: [...formData.items, newItem] });
    }
  };

  // Remove item from quotation
  const removeItem = (itemId: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter((item) => item.id !== itemId),
    });
  };

  // Update item quantity
  const updateItemQuantity = (itemId: string, quantity: number) => {
    const updatedItems = formData.items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity,
          total: quantity * item.unitPrice,
        };
      }
      return item;
    });
    setFormData({ ...formData, items: updatedItems });
  };

  // Update item price
  const updateItemPrice = (itemId: string, unitPrice: number) => {
    const updatedItems = formData.items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          unitPrice,
          total: item.quantity * unitPrice,
        };
      }
      return item;
    });
    setFormData({ ...formData, items: updatedItems });
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) {
      newErrors.clientId = "Please select a client";
    }

    if (formData.items.length === 0) {
      newErrors.items = "Please add at least one item";
    }

    if (formData.validityDays < 1) {
      newErrors.validityDays = "Validity must be at least 1 day";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save quotation
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const selectedClient = clients.find((c) => c.id === formData.clientId);
      if (!selectedClient) throw new Error("Client not found");

      const quotationData = {
        clientId: formData.clientId,
        clientName: selectedClient.name,
        date: new Date().toISOString(),
        expiryDate: new Date(
          Date.now() + formData.validityDays * 24 * 60 * 60 * 1000
        ).toISOString(),
        items: formData.items,
        subtotal: calculations.subtotal,
        tax: calculations.taxAmount,
        discount: calculations.discountAmount,
        total: calculations.total,
        notes: formData.notes,
        terms: formData.terms,
        status: formData.autoSend ? "sent" : "draft",
      };

      if (mode === "edit" && quotation) {
        await updateQuotation(quotation.id, quotationData);
      } else {
        await addQuotation(quotationData);
      }

      onClose?.();
    } catch (error) {
      console.error("Failed to save quotation:", error);
      alert("Failed to save quotation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Icon icon="lucide:file-plus" className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {mode === "create"
                ? "Create New Quotation"
                : mode === "edit"
                ? "Edit Quotation"
                : mode === "duplicate"
                ? "Duplicate Quotation"
                : "Create from Template"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Comprehensive quotation creation with advanced features
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="light"
            startContent={<Icon icon="lucide:eye" />}
            onPress={onPreviewModalOpen}
          >
            Preview
          </Button>
          <Button
            color="primary"
            startContent={<Icon icon="lucide:save" />}
            onPress={handleSave}
            isLoading={isLoading}
          >
            {mode === "edit" ? "Update" : "Save"} Quotation
          </Button>
          {onClose && (
            <Button isIconOnly variant="light" onPress={onClose}>
              <Icon icon="lucide:x" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          className="w-full"
        >
          <Tab
            key="basic"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:file-text" />
                Basic Info
              </div>
            }
          >
            <BasicInfoTab
              formData={formData}
              setFormData={setFormData}
              clients={clients}
              currencies={currencies}
              templates={templates}
              priorityOptions={priorityOptions}
              errors={errors}
            />
          </Tab>

          <Tab
            key="items"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:package" />
                Items
                <Badge
                  content={formData.items.length}
                  color="primary"
                  size="sm"
                />
              </div>
            }
          >
            <ItemsTab
              formData={formData}
              setFormData={setFormData}
              products={products}
              onAddProduct={addProductToQuotation}
              onRemoveItem={removeItem}
              onUpdateQuantity={updateItemQuantity}
              onUpdatePrice={updateItemPrice}
              calculations={calculations}
            />
          </Tab>

          <Tab
            key="pricing"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:calculator" />
                Pricing & Tax
              </div>
            }
          >
            <PricingTab
              formData={formData}
              setFormData={setFormData}
              calculations={calculations}
            />
          </Tab>

          <Tab
            key="terms"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:scroll-text" />
                Terms & Notes
              </div>
            }
          >
            <TermsTab formData={formData} setFormData={setFormData} />
          </Tab>

          <Tab
            key="workflow"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:workflow" />
                Workflow
              </div>
            }
          >
            <WorkflowTab formData={formData} setFormData={setFormData} />
          </Tab>
        </Tabs>
      </div>

      {/* Summary Footer */}
      <div className="p-6 bg-white dark:bg-gray-800 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm text-gray-500">Subtotal</p>
              <p className="font-medium">
                {calculations.currency?.symbol}
                {calculations.subtotal.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Discount</p>
              <p className="font-medium text-green-600">
                -{calculations.currency?.symbol}
                {calculations.discountAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tax</p>
              <p className="font-medium">
                {calculations.currency?.symbol}
                {calculations.taxAmount.toFixed(2)}
              </p>
            </div>
            <div className="pl-6 border-l">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-blue-600">
                {calculations.currency?.symbol}
                {calculations.total.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Chip
              color={
                priorityOptions.find((p) => p.key === formData.priority)
                  ?.color as any
              }
              variant="flat"
              startContent={
                <Icon
                  icon={
                    priorityOptions.find((p) => p.key === formData.priority)
                      ?.icon || "lucide:minus"
                  }
                />
              }
            >
              {priorityOptions.find((p) => p.key === formData.priority)?.label}{" "}
              Priority
            </Chip>
            <Chip color="primary" variant="flat">
              {formData.items.length} Items
            </Chip>
          </div>
        </div>
      </div>
    </div>
  );
};

// Basic Info Tab Component
const BasicInfoTab: React.FC<{
  formData: QuotationFormData;
  setFormData: (data: QuotationFormData) => void;
  clients: ClientType[];
  currencies: any[];
  templates: any[];
  priorityOptions: any[];
  errors: Record<string, string>;
}> = ({
  formData,
  setFormData,
  clients,
  currencies,
  templates,
  priorityOptions,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Client Information</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Select Client"
              placeholder="Choose a client"
              selectedKeys={formData.clientId ? [formData.clientId] : []}
              onSelectionChange={(keys) =>
                setFormData({
                  ...formData,
                  clientId: Array.from(keys)[0] as string,
                })
              }
              isInvalid={!!errors.clientId}
              errorMessage={errors.clientId}
              isRequired
            >
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  <div className="flex items-center gap-3">
                    <Avatar name={client.name} size="sm" />
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Template (Optional)"
              placeholder="Choose a template"
              selectedKeys={formData.templateId ? [formData.templateId] : []}
              onSelectionChange={(keys) =>
                setFormData({
                  ...formData,
                  templateId: Array.from(keys)[0] as string,
                })
              }
            >
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Currency"
              selectedKeys={[formData.currency]}
              onSelectionChange={(keys) => {
                const currency = Array.from(keys)[0] as string;
                const rate =
                  currencies.find((c) => c.code === currency)?.rate || 1.0;
                setFormData({ ...formData, currency, exchangeRate: rate });
              }}
            >
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  <div className="flex items-center gap-2">
                    <span>{currency.symbol}</span>
                    <span>{currency.name}</span>
                  </div>
                </SelectItem>
              ))}
            </Select>

            <Input
              label="Exchange Rate"
              type="number"
              value={formData.exchangeRate.toString()}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  exchangeRate: parseFloat(e.target.value) || 1.0,
                })
              }
              step="0.01"
              min="0.01"
            />

            <Input
              label="Validity (Days)"
              type="number"
              value={formData.validityDays.toString()}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  validityDays: parseInt(e.target.value) || 30,
                })
              }
              min="1"
              isInvalid={!!errors.validityDays}
              errorMessage={errors.validityDays}
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Quotation Settings</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Priority"
              selectedKeys={[formData.priority]}
              onSelectionChange={(keys) =>
                setFormData({
                  ...formData,
                  priority: Array.from(keys)[0] as any,
                })
              }
            >
              {priorityOptions.map((option: any) => (
                <SelectItem key={option.key} value={option.key}>
                  <div className="flex items-center gap-2">
                    <Icon icon={option.icon} />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </Select>

            <Input
              label="Follow-up Days"
              type="number"
              value={formData.followUpDays.toString()}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  followUpDays: parseInt(e.target.value) || 7,
                })
              }
              min="1"
              description="Days after which to follow up if no response"
            />
          </div>

          <div className="flex flex-col gap-4">
            <Switch
              isSelected={formData.approvalRequired}
              onValueChange={(value) =>
                setFormData({ ...formData, approvalRequired: value })
              }
            >
              Requires Approval
            </Switch>

            <Switch
              isSelected={formData.autoSend}
              onValueChange={(value) =>
                setFormData({ ...formData, autoSend: value })
              }
            >
              Auto-send after creation
            </Switch>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

// Items Tab Component (Placeholder)
const ItemsTab: React.FC<any> = ({ formData, calculations }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Product/Service Selection</h3>
        </CardHeader>
        <CardBody>
          <p>Items management will be implemented here...</p>
          <p>Current items: {formData.items.length}</p>
          <p>
            Total: {calculations.currency?.symbol}
            {calculations.total.toFixed(2)}
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

// Pricing Tab Component (Placeholder)
const PricingTab: React.FC<any> = ({ formData, setFormData, calculations }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Discount & Tax Settings</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Discount Type"
              selectedKeys={[formData.discountType]}
              onSelectionChange={(keys) =>
                setFormData({
                  ...formData,
                  discountType: Array.from(keys)[0] as any,
                })
              }
            >
              <SelectItem key="percentage">Percentage (%)</SelectItem>
              <SelectItem key="fixed">Fixed Amount</SelectItem>
            </Select>

            <Input
              label={`Discount ${
                formData.discountType === "percentage"
                  ? "(%)"
                  : `(${calculations.currency?.symbol})`
              }`}
              type="number"
              value={formData.discountValue.toString()}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discountValue: parseFloat(e.target.value) || 0,
                })
              }
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Tax Rates</h4>
            {formData.taxRates.map((tax, index) => (
              <div
                key={tax.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
              >
                <span className="flex-1">{tax.name}</span>
                <span>{tax.rate}%</span>
                <Chip size="sm" color="primary" variant="flat">
                  {tax.type}
                </Chip>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

// Terms Tab Component (Placeholder)
const TermsTab: React.FC<any> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Terms & Conditions</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <Textarea
            label="Terms & Conditions"
            value={formData.terms}
            onChange={(e) =>
              setFormData({ ...formData, terms: e.target.value })
            }
            minRows={4}
            placeholder="Enter terms and conditions..."
          />

          <Textarea
            label="Notes (Visible to Client)"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            minRows={3}
            placeholder="Additional notes for the client..."
          />

          <Textarea
            label="Internal Notes (Private)"
            value={formData.internalNotes}
            onChange={(e) =>
              setFormData({ ...formData, internalNotes: e.target.value })
            }
            minRows={3}
            placeholder="Internal notes (not visible to client)..."
          />
        </CardBody>
      </Card>
    </div>
  );
};

// Workflow Tab Component (Placeholder)
const WorkflowTab: React.FC<any> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">
            Approval & Workflow Settings
          </h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="space-y-4">
            <Switch
              isSelected={formData.approvalRequired}
              onValueChange={(value) =>
                setFormData({ ...formData, approvalRequired: value })
              }
            >
              Requires Management Approval
            </Switch>

            <Switch
              isSelected={formData.autoSend}
              onValueChange={(value) =>
                setFormData({ ...formData, autoSend: value })
              }
            >
              Auto-send to Client After Approval
            </Switch>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Follow-up Reminder (Days)"
                type="number"
                value={formData.followUpDays.toString()}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    followUpDays: parseInt(e.target.value) || 7,
                  })
                }
                min="1"
              />

              <Select
                label="Priority Level"
                selectedKeys={[formData.priority]}
                onSelectionChange={(keys) =>
                  setFormData({
                    ...formData,
                    priority: Array.from(keys)[0] as any,
                  })
                }
              >
                <SelectItem key="low">Low Priority</SelectItem>
                <SelectItem key="medium">Medium Priority</SelectItem>
                <SelectItem key="high">High Priority</SelectItem>
                <SelectItem key="urgent">Urgent</SelectItem>
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
