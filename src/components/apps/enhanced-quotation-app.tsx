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
  Progress,
  Badge,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useDataContext } from "../../context/data-context";
import { QuotationType, ClientType, ProductType } from "../../types/window";
import { CommunicationService } from "../../services/communication";

interface EnhancedQuotationAppProps {
  onClose?: () => void;
}

export const EnhancedQuotationApp: React.FC<EnhancedQuotationAppProps> = ({
  onClose,
}) => {
  const {
    quotations,
    clients,
    products,
    addQuotation,
    updateQuotation,
    deleteQuotation,
  } = useDataContext();

  // State management
  const [selectedTab, setSelectedTab] = React.useState("dashboard");
  const [selectedQuotation, setSelectedQuotation] =
    React.useState<QuotationType | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [dateRange, setDateRange] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("date");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  // Modal states
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const {
    isOpen: isApprovalOpen,
    onOpen: onApprovalOpen,
    onClose: onApprovalClose,
  } = useDisclosure();

  // Analytics calculations
  const analytics = React.useMemo(() => {
    const totalQuotations = quotations.length;
    const totalValue = quotations.reduce((sum, q) => sum + q.total, 0);
    const wonQuotations = quotations.filter(
      (q) => q.status === "approved"
    ).length;
    const conversionRate =
      totalQuotations > 0 ? (wonQuotations / totalQuotations) * 100 : 0;
    const avgQuotationValue =
      totalQuotations > 0 ? totalValue / totalQuotations : 0;

    const statusCounts = quotations.reduce((acc, q) => {
      acc[q.status] = (acc[q.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalQuotations,
      totalValue,
      wonQuotations,
      conversionRate,
      avgQuotationValue,
      statusCounts,
    };
  }, [quotations]);

  // Filter and sort quotations
  const filteredQuotations = React.useMemo(() => {
    let filtered = quotations.filter((quotation) => {
      const client = clients.find((c) => c.id === quotation.clientId);
      const matchesSearch =
        quotation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client?.name.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false);

      const matchesStatus =
        statusFilter === "all" || quotation.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort quotations
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case "total":
          aValue = a.total;
          bValue = b.total;
          break;
        case "client":
          const clientA = clients.find((c) => c.id === a.clientId);
          const clientB = clients.find((c) => c.id === b.clientId);
          aValue = clientA?.name || "";
          bValue = clientB?.name || "";
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [quotations, clients, searchQuery, statusFilter, sortBy, sortOrder]);

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "default";
      case "pending":
        return "warning";
      case "sent":
        return "primary";
      case "approved":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "default";
    }
  };

  // Handle quotation actions
  const handleSendQuotation = async (quotation: QuotationType) => {
    const client = clients.find((c) => c.id === quotation.clientId);
    if (!client) {
      alert("Client not found");
      return;
    }

    const action = await new Promise<string>((resolve) => {
      const choice = window.confirm(
        `Send quotation to ${client.name}?\n\nClick OK for Email + WhatsApp\nClick Cancel to choose method`
      );
      if (choice) {
        resolve("both");
      } else {
        const method = prompt(
          "Choose method:\n1. Email only\n2. WhatsApp only\n3. Both",
          "1"
        );
        resolve(
          method === "2" ? "whatsapp" : method === "3" ? "both" : "email"
        );
      }
    });

    try {
      switch (action) {
        case "email":
          CommunicationService.sendQuotationByEmail(quotation, client);
          break;
        case "whatsapp":
          CommunicationService.sendQuotationByWhatsApp(quotation, client);
          break;
        case "both":
          CommunicationService.sendQuotationBoth(quotation, client);
          break;
      }

      // Update quotation status
      await updateQuotation(quotation.id, {
        status: "sent",
        sentAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to send quotation:", error);
      alert("Failed to send quotation. Please try again.");
    }
  };

  const handleDuplicateQuotation = async (quotation: QuotationType) => {
    try {
      const duplicatedQuotation = {
        ...quotation,
        id: undefined,
        referenceNumber: `${quotation.id}-COPY-${Date.now()}`,
        status: "draft",
        date: new Date().toISOString(),
        expiryDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(), // 30 days from now
        sentAt: undefined,
        approvedAt: undefined,
      };

      await addQuotation(duplicatedQuotation);
      alert("Quotation duplicated successfully!");
    } catch (error) {
      console.error("Failed to duplicate quotation:", error);
      alert("Failed to duplicate quotation. Please try again.");
    }
  };

  const handleDeleteQuotation = async (quotationId: string) => {
    if (window.confirm("Are you sure you want to delete this quotation?")) {
      try {
        await deleteQuotation(quotationId);
        alert("Quotation deleted successfully!");
      } catch (error) {
        console.error("Failed to delete quotation:", error);
        alert("Failed to delete quotation. Please try again.");
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Icon icon="lucide:file-text" className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Enhanced Quotation Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Comprehensive quotation system with advanced features
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            color="primary"
            startContent={<Icon icon="lucide:plus" />}
            onPress={onCreateOpen}
          >
            New Quotation
          </Button>
          {onClose && (
            <Button isIconOnly variant="light" onPress={onClose}>
              <Icon icon="lucide:x" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          className="w-full"
        >
          <Tab
            key="dashboard"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:bar-chart-3" />
                Dashboard
              </div>
            }
          >
            <DashboardTab
              analytics={analytics}
              quotations={quotations}
              clients={clients}
            />
          </Tab>

          <Tab
            key="quotations"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:file-text" />
                Quotations
                <Badge content={quotations.length} color="primary" size="sm" />
              </div>
            }
          >
            <QuotationsTab
              quotations={filteredQuotations}
              clients={clients}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              onSend={handleSendQuotation}
              onDuplicate={handleDuplicateQuotation}
              onDelete={handleDeleteQuotation}
              onView={(quotation) => {
                setSelectedQuotation(quotation);
                onViewOpen();
              }}
              getStatusColor={getStatusColor}
            />
          </Tab>

          <Tab
            key="analytics"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:trending-up" />
                Analytics
              </div>
            }
          >
            <AnalyticsTab
              analytics={analytics}
              quotations={quotations}
              clients={clients}
            />
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
            <WorkflowTab quotations={quotations} onApproval={onApprovalOpen} />
          </Tab>
        </Tabs>
      </div>

      {/* Modals */}
      <CreateQuotationModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        clients={clients}
        products={products}
        onSave={addQuotation}
      />

      <ViewQuotationModal
        isOpen={isViewOpen}
        onClose={onViewClose}
        quotation={selectedQuotation}
        client={
          selectedQuotation
            ? clients.find((c) => c.id === selectedQuotation.clientId)
            : null
        }
      />
    </div>
  );
};

// Quotations Tab Component
const QuotationsTab: React.FC<{
  quotations: QuotationType[];
  clients: ClientType[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  onSend: (quotation: QuotationType) => void;
  onDuplicate: (quotation: QuotationType) => void;
  onDelete: (quotationId: string) => void;
  onView: (quotation: QuotationType) => void;
  getStatusColor: (status: string) => any;
}> = ({
  quotations,
  clients,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onSend,
  onDuplicate,
  onDelete,
  onView,
  getStatusColor,
}) => {
  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search quotations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Icon icon="lucide:search" />}
              className="flex-1"
            />

            <Select
              placeholder="Filter by status"
              selectedKeys={[statusFilter]}
              onSelectionChange={(keys) =>
                setStatusFilter(Array.from(keys)[0] as string)
              }
              className="w-48"
            >
              <SelectItem key="all">All Status</SelectItem>
              <SelectItem key="draft">Draft</SelectItem>
              <SelectItem key="pending">Pending</SelectItem>
              <SelectItem key="sent">Sent</SelectItem>
              <SelectItem key="approved">Approved</SelectItem>
              <SelectItem key="rejected">Rejected</SelectItem>
            </Select>

            <Select
              placeholder="Sort by"
              selectedKeys={[sortBy]}
              onSelectionChange={(keys) =>
                setSortBy(Array.from(keys)[0] as string)
              }
              className="w-48"
            >
              <SelectItem key="date">Date</SelectItem>
              <SelectItem key="total">Total Value</SelectItem>
              <SelectItem key="client">Client Name</SelectItem>
              <SelectItem key="status">Status</SelectItem>
            </Select>

            <Button
              isIconOnly
              variant="flat"
              onPress={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              <Icon
                icon={
                  sortOrder === "asc" ? "lucide:arrow-up" : "lucide:arrow-down"
                }
              />
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Quotations Table */}
      <Card>
        <CardBody className="p-0">
          <Table aria-label="Quotations table">
            <TableHeader>
              <TableColumn>QUOTATION</TableColumn>
              <TableColumn>CLIENT</TableColumn>
              <TableColumn>DATE</TableColumn>
              <TableColumn>EXPIRY</TableColumn>
              <TableColumn>TOTAL</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {quotations.map((quotation) => {
                const client = clients.find((c) => c.id === quotation.clientId);
                return (
                  <TableRow key={quotation.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{quotation.id}</p>
                        <p className="text-sm text-gray-500">
                          {quotation.items?.length || 0} items
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{client?.name}</p>
                        <p className="text-sm text-gray-500">{client?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(quotation.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`${
                          new Date(quotation.expiryDate) < new Date()
                            ? "text-red-500"
                            : ""
                        }`}
                      >
                        {new Date(quotation.expiryDate).toLocaleDateString()}
                        {new Date(quotation.expiryDate) < new Date() && (
                          <p className="text-xs text-red-500">Expired</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">
                        ${quotation.total.toLocaleString()}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={getStatusColor(quotation.status)}
                        variant="flat"
                        size="sm"
                      >
                        {quotation.status.toUpperCase()}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => onView(quotation)}
                          title="View"
                        >
                          <Icon icon="lucide:eye" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => onSend(quotation)}
                          title="Send"
                          color="primary"
                        >
                          <Icon icon="lucide:send" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => onDuplicate(quotation)}
                          title="Duplicate"
                        >
                          <Icon icon="lucide:copy" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => onDelete(quotation.id)}
                          title="Delete"
                          color="danger"
                        >
                          <Icon icon="lucide:trash" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab: React.FC<{
  analytics: any;
  quotations: QuotationType[];
  clients: ClientType[];
}> = ({ analytics, quotations, clients }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Status Distribution</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {Object.entries(analytics.statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Chip color="primary" variant="flat" size="sm">
                      {status.toUpperCase()}
                    </Chip>
                    <span>{count} quotations</span>
                  </div>
                  <div className="w-32">
                    <Progress
                      value={
                        ((count as number) / analytics.totalQuotations) * 100
                      }
                      color="primary"
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Top Clients */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Top Clients by Value</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {clients
                .map((client) => ({
                  ...client,
                  totalValue: quotations
                    .filter((q) => q.clientId === client.id)
                    .reduce((sum, q) => sum + q.total, 0),
                }))
                .sort((a, b) => b.totalValue - a.totalValue)
                .slice(0, 5)
                .map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                    <p className="font-medium">
                      ${client.totalValue.toLocaleString()}
                    </p>
                  </div>
                ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

// Workflow Tab Component
const WorkflowTab: React.FC<{
  quotations: QuotationType[];
  onApproval: () => void;
}> = ({ quotations, onApproval }) => {
  const pendingApprovals = quotations.filter((q) => q.status === "pending");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Pending Approvals</h3>
        </CardHeader>
        <CardBody>
          {pendingApprovals.length === 0 ? (
            <div className="text-center py-8">
              <Icon
                icon="lucide:check-circle"
                className="text-6xl text-green-500 mx-auto mb-4"
              />
              <p className="text-gray-500">No pending approvals</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingApprovals.map((quotation) => (
                <div
                  key={quotation.id}
                  className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{quotation.id}</p>
                    <p className="text-sm text-gray-500">
                      ${quotation.total.toLocaleString()}
                    </p>
                  </div>
                  <Button color="primary" size="sm" onPress={onApproval}>
                    Review
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

// Create Quotation Modal (Placeholder)
const CreateQuotationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  clients: ClientType[];
  products: ProductType[];
  onSave: (quotation: any) => Promise<any>;
}> = ({ isOpen, onClose, clients, products, onSave }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalContent>
        <ModalHeader>Create New Quotation</ModalHeader>
        <ModalBody>
          <p>Create quotation form will be implemented here...</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={onClose}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// View Quotation Modal (Placeholder)
const ViewQuotationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  quotation: QuotationType | null;
  client: ClientType | null;
}> = ({ isOpen, onClose, quotation, client }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalContent>
        <ModalHeader>View Quotation</ModalHeader>
        <ModalBody>
          {quotation && (
            <div className="space-y-4">
              <p>
                <strong>ID:</strong> {quotation.id}
              </p>
              <p>
                <strong>Client:</strong> {client?.name}
              </p>
              <p>
                <strong>Total:</strong> ${quotation.total.toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {quotation.status}
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onPress={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Dashboard Tab Component
const DashboardTab: React.FC<{
  analytics: any;
  quotations: QuotationType[];
  clients: ClientType[];
}> = ({ analytics, quotations, clients }) => {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Quotations</p>
                <p className="text-3xl font-bold">
                  {analytics.totalQuotations}
                </p>
              </div>
              <Icon
                icon="lucide:file-text"
                className="text-4xl text-blue-200"
              />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Value</p>
                <p className="text-3xl font-bold">
                  ${analytics.totalValue.toLocaleString()}
                </p>
              </div>
              <Icon
                icon="lucide:dollar-sign"
                className="text-4xl text-green-200"
              />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Conversion Rate</p>
                <p className="text-3xl font-bold">
                  {analytics.conversionRate.toFixed(1)}%
                </p>
              </div>
              <Icon
                icon="lucide:trending-up"
                className="text-4xl text-purple-200"
              />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Avg. Value</p>
                <p className="text-3xl font-bold">
                  ${analytics.avgQuotationValue.toLocaleString()}
                </p>
              </div>
              <Icon
                icon="lucide:calculator"
                className="text-4xl text-orange-200"
              />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Recent Quotations</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {quotations.slice(0, 5).map((quotation) => {
              const client = clients.find((c) => c.id === quotation.clientId);
              return (
                <div
                  key={quotation.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Icon
                        icon="lucide:file-text"
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{quotation.id}</p>
                      <p className="text-sm text-gray-500">{client?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${quotation.total.toLocaleString()}
                    </p>
                    <Chip size="sm" color="primary" variant="flat">
                      {quotation.status}
                    </Chip>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
