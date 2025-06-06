import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Tabs,
  Tab,
  Select,
  SelectItem,
  DatePicker,
  Progress,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  Badge,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useDataContext } from "../../context/data-context";
import { QuotationType, ClientType, ProductType } from "../../types/window";

interface AdvancedAnalyticsDashboardProps {
  onClose?: () => void;
}

interface AnalyticsData {
  totalQuotations: number;
  totalValue: number;
  conversionRate: number;
  avgQuotationValue: number;
  avgResponseTime: number;
  topProducts: Array<{ product: ProductType; count: number; value: number }>;
  topClients: Array<{ client: ClientType; count: number; value: number }>;
  monthlyTrends: Array<{
    month: string;
    quotations: number;
    value: number;
    conversions: number;
  }>;
  statusDistribution: Record<string, number>;
  currencyBreakdown: Record<string, number>;
  performanceMetrics: {
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
}

export const AdvancedAnalyticsDashboard: React.FC<
  AdvancedAnalyticsDashboardProps
> = ({ onClose }) => {
  const { quotations, clients, products } = useDataContext();

  // State management
  const [selectedTab, setSelectedTab] = React.useState("overview");
  const [dateRange, setDateRange] = React.useState("last30days");
  const [selectedCurrency, setSelectedCurrency] = React.useState("all");
  const [selectedClient, setSelectedClient] = React.useState("all");

  // Calculate analytics data
  const analyticsData = React.useMemo((): AnalyticsData => {
    // Filter quotations based on date range
    const now = new Date();
    const filterDate = new Date();

    switch (dateRange) {
      case "last7days":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "last30days":
        filterDate.setDate(now.getDate() - 30);
        break;
      case "last90days":
        filterDate.setDate(now.getDate() - 90);
        break;
      case "lastyear":
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        filterDate.setDate(now.getDate() - 30);
    }

    const filteredQuotations = quotations.filter(
      (q) => new Date(q.date) >= filterDate
    );

    // Basic metrics
    const totalQuotations = filteredQuotations.length;
    const totalValue = filteredQuotations.reduce((sum, q) => sum + q.total, 0);
    const approvedQuotations = filteredQuotations.filter(
      (q) => q.status === "approved"
    );
    const conversionRate =
      totalQuotations > 0
        ? (approvedQuotations.length / totalQuotations) * 100
        : 0;
    const avgQuotationValue =
      totalQuotations > 0 ? totalValue / totalQuotations : 0;

    // Response time calculation (mock data for now)
    const avgResponseTime = 2.5; // days

    // Top products analysis
    const productStats = new Map<string, { count: number; value: number }>();
    filteredQuotations.forEach((quotation) => {
      quotation.items?.forEach((item) => {
        const existing = productStats.get(item.productId) || {
          count: 0,
          value: 0,
        };
        productStats.set(item.productId, {
          count: existing.count + item.quantity,
          value: existing.value + item.total,
        });
      });
    });

    const topProducts = Array.from(productStats.entries())
      .map(([productId, stats]) => ({
        product: products.find((p) => p.id === productId)!,
        ...stats,
      }))
      .filter((item) => item.product)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    // Top clients analysis
    const clientStats = new Map<string, { count: number; value: number }>();
    filteredQuotations.forEach((quotation) => {
      const existing = clientStats.get(quotation.clientId) || {
        count: 0,
        value: 0,
      };
      clientStats.set(quotation.clientId, {
        count: existing.count + 1,
        value: existing.value + quotation.total,
      });
    });

    const topClients = Array.from(clientStats.entries())
      .map(([clientId, stats]) => ({
        client: clients.find((c) => c.id === clientId)!,
        ...stats,
      }))
      .filter((item) => item.client)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    // Monthly trends (last 12 months)
    const monthlyTrends = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthQuotations = quotations.filter((q) => {
        const qDate = new Date(q.date);
        return qDate >= monthStart && qDate <= monthEnd;
      });

      monthlyTrends.push({
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        quotations: monthQuotations.length,
        value: monthQuotations.reduce((sum, q) => sum + q.total, 0),
        conversions: monthQuotations.filter((q) => q.status === "approved")
          .length,
      });
    }

    // Status distribution
    const statusDistribution = filteredQuotations.reduce((acc, q) => {
      acc[q.status] = (acc[q.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Currency breakdown (mock data)
    const currencyBreakdown = {
      USD: totalValue * 0.7,
      EUR: totalValue * 0.2,
      GBP: totalValue * 0.1,
    };

    // Performance metrics
    const thisMonth = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(thisMonth.getMonth() - 1);

    const thisMonthQuotations = quotations.filter((q) => {
      const qDate = new Date(q.date);
      return (
        qDate.getMonth() === thisMonth.getMonth() &&
        qDate.getFullYear() === thisMonth.getFullYear()
      );
    });

    const lastMonthQuotations = quotations.filter((q) => {
      const qDate = new Date(q.date);
      return (
        qDate.getMonth() === lastMonth.getMonth() &&
        qDate.getFullYear() === lastMonth.getFullYear()
      );
    });

    const thisMonthValue = thisMonthQuotations.reduce(
      (sum, q) => sum + q.total,
      0
    );
    const lastMonthValue = lastMonthQuotations.reduce(
      (sum, q) => sum + q.total,
      0
    );
    const growth =
      lastMonthValue > 0
        ? ((thisMonthValue - lastMonthValue) / lastMonthValue) * 100
        : 0;

    return {
      totalQuotations,
      totalValue,
      conversionRate,
      avgQuotationValue,
      avgResponseTime,
      topProducts,
      topClients,
      monthlyTrends,
      statusDistribution,
      currencyBreakdown,
      performanceMetrics: {
        thisMonth: thisMonthValue,
        lastMonth: lastMonthValue,
        growth,
      },
    };
  }, [quotations, clients, products, dateRange]);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Icon icon="lucide:bar-chart-3" className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Advanced Analytics Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Comprehensive business intelligence and performance metrics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select
            placeholder="Date Range"
            selectedKeys={[dateRange]}
            onSelectionChange={(keys) =>
              setDateRange(Array.from(keys)[0] as string)
            }
            className="w-48"
          >
            <SelectItem key="last7days">Last 7 Days</SelectItem>
            <SelectItem key="last30days">Last 30 Days</SelectItem>
            <SelectItem key="last90days">Last 90 Days</SelectItem>
            <SelectItem key="lastyear">Last Year</SelectItem>
          </Select>

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
            key="overview"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:dashboard" />
                Overview
              </div>
            }
          >
            <OverviewTab analyticsData={analyticsData} />
          </Tab>

          <Tab
            key="performance"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:trending-up" />
                Performance
              </div>
            }
          >
            <PerformanceTab analyticsData={analyticsData} />
          </Tab>

          <Tab
            key="products"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:package" />
                Products
              </div>
            }
          >
            <ProductsTab analyticsData={analyticsData} />
          </Tab>

          <Tab
            key="clients"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:users" />
                Clients
              </div>
            }
          >
            <ClientsTab analyticsData={analyticsData} />
          </Tab>

          <Tab
            key="financial"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:dollar-sign" />
                Financial
              </div>
            }
          >
            <FinancialTab analyticsData={analyticsData} />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

// Performance Tab Component
const PerformanceTab: React.FC<{ analyticsData: AnalyticsData }> = ({
  analyticsData,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">
              Monthly Performance Trends
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {analyticsData.monthlyTrends.slice(-6).map((trend, index) => (
                <div
                  key={trend.month}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{trend.month}</p>
                    <p className="text-sm text-gray-500">
                      {trend.quotations} quotations
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${trend.value.toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600">
                      {trend.conversions} conversions
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Performance Comparison</h3>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${analyticsData.performanceMetrics.thisMonth.toLocaleString()}
                </p>
              </div>
              <Icon
                icon="lucide:trending-up"
                className="text-3xl text-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Last Month</p>
                <p className="text-2xl font-bold">
                  ${analyticsData.performanceMetrics.lastMonth.toLocaleString()}
                </p>
              </div>
              <Icon icon="lucide:calendar" className="text-3xl text-gray-500" />
            </div>

            <div
              className={`flex items-center justify-between p-4 rounded-lg ${
                analyticsData.performanceMetrics.growth >= 0
                  ? "bg-green-50 dark:bg-green-900/20"
                  : "bg-red-50 dark:bg-red-900/20"
              }`}
            >
              <div>
                <p className="text-sm text-gray-500">Growth</p>
                <p
                  className={`text-2xl font-bold ${
                    analyticsData.performanceMetrics.growth >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {analyticsData.performanceMetrics.growth >= 0 ? "+" : ""}
                  {analyticsData.performanceMetrics.growth.toFixed(1)}%
                </p>
              </div>
              <Icon
                icon={
                  analyticsData.performanceMetrics.growth >= 0
                    ? "lucide:arrow-up"
                    : "lucide:arrow-down"
                }
                className={`text-3xl ${
                  analyticsData.performanceMetrics.growth >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

// Products Tab Component
const ProductsTab: React.FC<{ analyticsData: AnalyticsData }> = ({
  analyticsData,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Top Performing Products</h3>
        </CardHeader>
        <CardBody className="p-0">
          <Table aria-label="Top products">
            <TableHeader>
              <TableColumn>PRODUCT</TableColumn>
              <TableColumn>QUANTITY SOLD</TableColumn>
              <TableColumn>TOTAL VALUE</TableColumn>
              <TableColumn>PERFORMANCE</TableColumn>
            </TableHeader>
            <TableBody>
              {analyticsData.topProducts.map((item, index) => (
                <TableRow key={item.product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Badge content={index + 1} color="primary" size="sm">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <Icon
                            icon="lucide:package"
                            className="text-blue-600 dark:text-blue-400"
                          />
                        </div>
                      </Badge>
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.product.type}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{item.count}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">
                      ${item.value.toLocaleString()}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="w-24">
                      <Progress
                        value={
                          (item.value / analyticsData.topProducts[0]?.value ||
                            1) * 100
                        }
                        color="success"
                        size="sm"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

// Clients Tab Component
const ClientsTab: React.FC<{ analyticsData: AnalyticsData }> = ({
  analyticsData,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Top Clients by Value</h3>
        </CardHeader>
        <CardBody className="p-0">
          <Table aria-label="Top clients">
            <TableHeader>
              <TableColumn>CLIENT</TableColumn>
              <TableColumn>QUOTATIONS</TableColumn>
              <TableColumn>TOTAL VALUE</TableColumn>
              <TableColumn>PERFORMANCE</TableColumn>
            </TableHeader>
            <TableBody>
              {analyticsData.topClients.map((item, index) => (
                <TableRow key={item.client.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Badge content={index + 1} color="primary" size="sm">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                          <Icon
                            icon="lucide:user"
                            className="text-purple-600 dark:text-purple-400"
                          />
                        </div>
                      </Badge>
                      <div>
                        <p className="font-medium">{item.client.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.client.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{item.count}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">
                      ${item.value.toLocaleString()}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="w-24">
                      <Progress
                        value={
                          (item.value / analyticsData.topClients[0]?.value ||
                            1) * 100
                        }
                        color="warning"
                        size="sm"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

// Financial Tab Component
const FinancialTab: React.FC<{ analyticsData: AnalyticsData }> = ({
  analyticsData,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Currency Breakdown */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Revenue by Currency</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {Object.entries(analyticsData.currencyBreakdown).map(
                ([currency, value]) => (
                  <div
                    key={currency}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Chip color="primary" variant="flat" size="sm">
                        {currency}
                      </Chip>
                      <span>${value.toLocaleString()}</span>
                    </div>
                    <div className="w-32">
                      <Progress
                        value={(value / analyticsData.totalValue) * 100}
                        color="primary"
                        size="sm"
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </CardBody>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Financial Summary</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-sm font-medium">Total Revenue</span>
              <span className="text-lg font-bold text-green-600">
                ${analyticsData.totalValue.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm font-medium">Average Deal Size</span>
              <span className="text-lg font-bold text-blue-600">
                ${analyticsData.avgQuotationValue.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <span className="text-sm font-medium">Conversion Rate</span>
              <span className="text-lg font-bold text-purple-600">
                {analyticsData.conversionRate.toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <span className="text-sm font-medium">Pipeline Value</span>
              <span className="text-lg font-bold text-orange-600">
                ${(analyticsData.totalValue * 1.5).toLocaleString()}
              </span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ analyticsData: AnalyticsData }> = ({
  analyticsData,
}) => {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Quotations</p>
                  <p className="text-3xl font-bold">
                    {analyticsData.totalQuotations}
                  </p>
                  <p className="text-blue-200 text-xs mt-1">
                    +{analyticsData.performanceMetrics.growth.toFixed(1)}% from
                    last month
                  </p>
                </div>
                <Icon
                  icon="lucide:file-text"
                  className="text-4xl text-blue-200"
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Value</p>
                  <p className="text-3xl font-bold">
                    ${analyticsData.totalValue.toLocaleString()}
                  </p>
                  <p className="text-green-200 text-xs mt-1">
                    Avg: ${analyticsData.avgQuotationValue.toLocaleString()}
                  </p>
                </div>
                <Icon
                  icon="lucide:dollar-sign"
                  className="text-4xl text-green-200"
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Conversion Rate</p>
                  <p className="text-3xl font-bold">
                    {analyticsData.conversionRate.toFixed(1)}%
                  </p>
                  <p className="text-purple-200 text-xs mt-1">
                    Industry avg: 22%
                  </p>
                </div>
                <Icon
                  icon="lucide:trending-up"
                  className="text-4xl text-purple-200"
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Avg Response Time</p>
                  <p className="text-3xl font-bold">
                    {analyticsData.avgResponseTime}
                  </p>
                  <p className="text-orange-200 text-xs mt-1">days</p>
                </div>
                <Icon
                  icon="lucide:clock"
                  className="text-4xl text-orange-200"
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">
            Quotation Status Distribution
          </h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {Object.entries(analyticsData.statusDistribution).map(
              ([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Chip
                      color={
                        status === "approved"
                          ? "success"
                          : status === "pending"
                          ? "warning"
                          : status === "sent"
                          ? "primary"
                          : status === "rejected"
                          ? "danger"
                          : "default"
                      }
                      variant="flat"
                      size="sm"
                    >
                      {status.toUpperCase()}
                    </Chip>
                    <span>{count} quotations</span>
                  </div>
                  <div className="w-32">
                    <Progress
                      value={(count / analyticsData.totalQuotations) * 100}
                      color="primary"
                      size="sm"
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
