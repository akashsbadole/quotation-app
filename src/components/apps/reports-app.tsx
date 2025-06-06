import React from "react";
import { 
  Button, 
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useDataContext } from "../../context/data-context";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from "recharts";

export const ReportsApp: React.FC = () => {
  const { quotations, clients } = useDataContext();
  const [timeRange, setTimeRange] = React.useState("This Month");
  
  // Calculate summary data
  const totalQuotations = quotations.length;
  const approvedQuotations = quotations.filter(q => q.status === "approved").length;
  const conversionRate = totalQuotations > 0 ? (approvedQuotations / totalQuotations) * 100 : 0;
  const totalRevenue = quotations
    .filter(q => q.status === "approved")
    .reduce((sum, q) => sum + q.total, 0);
  const averageValue = totalQuotations > 0 
    ? quotations.reduce((sum, q) => sum + q.total, 0) / totalQuotations 
    : 0;
  
  const summaryData = [
    { 
      title: "Total Quotations", 
      value: totalQuotations, 
      change: 12.5, 
      icon: "lucide:file-text" 
    },
    { 
      title: "Conversion Rate", 
      value: `${conversionRate.toFixed(1)}%`, 
      change: -2.3, 
      icon: "lucide:percent" 
    },
    { 
      title: "Average Value", 
      value: `$${averageValue.toFixed(2)}`, 
      change: 8.1, 
      icon: "lucide:dollar-sign" 
    },
    { 
      title: "Total Revenue", 
      value: `$${totalRevenue.toFixed(2)}`, 
      change: 15.2, 
      icon: "lucide:trending-up" 
    }
  ];
  
  // Generate monthly data for charts
  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.map((month, index) => {
      // Generate some realistic-looking data
      const baseValue = 10000 + Math.random() * 5000;
      const trend = index <= currentMonth ? 1 : 0.7; // Current and past months have full values
      
      return {
        month,
        value: Math.round(baseValue * trend * (1 + (index / 12))), // Slight upward trend
        count: Math.round((5 + Math.random() * 10) * trend)
      };
    });
  };
  
  const monthlyData = generateMonthlyData();
  
  // Status distribution data for pie chart
  const statusData = [
    { name: "Approved", value: quotations.filter(q => q.status === "approved").length },
    { name: "Pending", value: quotations.filter(q => q.status === "pending").length },
    { name: "Sent", value: quotations.filter(q => q.status === "sent").length },
    { name: "Draft", value: quotations.filter(q => q.status === "draft").length },
    { name: "Rejected", value: quotations.filter(q => q.status === "rejected").length }
  ];
  
  const COLORS = ['#0088FE', '#FFBB28', '#00C49F', '#999999', '#FF8042'];
  
  // Top clients by quotation value
  const topClients = clients.map(client => {
    const clientQuotations = quotations.filter(q => q.clientId === client.id);
    const totalValue = clientQuotations.reduce((sum, q) => sum + q.total, 0);
    const approvedQuotations = clientQuotations.filter(q => q.status === "approved").length;
    const conversionRate = clientQuotations.length > 0 
      ? (approvedQuotations / clientQuotations.length) * 100 
      : 0;
    
    return {
      id: client.id,
      name: client.name,
      quotations: clientQuotations.length,
      value: totalValue,
      conversion: `${conversionRate.toFixed(0)}%`
    };
  })
  .sort((a, b) => b.value - a.value)
  .slice(0, 5);
  
  // Recent activity
  const recentActivity = quotations
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4)
    .map(quotation => {
      let actionText = "";
      let icon = "";
      let colorClass = "";
      
      switch (quotation.status) {
        case "approved":
          actionText = "approved";
          icon = "lucide:check";
          colorClass = "bg-success-100 text-success-500";
          break;
        case "sent":
          actionText = "sent to client";
          icon = "lucide:send";
          colorClass = "bg-primary-100 text-primary-500";
          break;
        case "draft":
          actionText = "created";
          icon = "lucide:edit";
          colorClass = "bg-warning-100 text-warning-500";
          break;
        case "rejected":
          actionText = "rejected";
          icon = "lucide:x";
          colorClass = "bg-danger-100 text-danger-500";
          break;
        default:
          actionText = "updated";
          icon = "lucide:refresh-cw";
          colorClass = "bg-default-100 text-default-500";
      }
      
      return {
        id: quotation.id,
        action: actionText,
        client: quotation.clientName,
        amount: quotation.total,
        date: quotation.updatedAt,
        icon,
        colorClass
      };
    });
  
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value.toFixed(0)}`;
  };
  
  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Reports & Analytics</h1>
        
        <div className="flex items-center gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button 
                variant="flat" 
                endContent={<Icon icon="lucide:chevron-down" className="text-small" />}
              >
                {timeRange}
              </Button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Time range options"
              onAction={(key) => setTimeRange(key as string)}
            >
              <DropdownItem key="Today">Today</DropdownItem>
              <DropdownItem key="This Week">This Week</DropdownItem>
              <DropdownItem key="This Month">This Month</DropdownItem>
              <DropdownItem key="This Quarter">This Quarter</DropdownItem>
              <DropdownItem key="This Year">This Year</DropdownItem>
              <DropdownItem key="Custom Range">Custom Range</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          
          <Button color="primary" startContent={<Icon icon="lucide:download" />}>
            Export
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryData.map((item, index) => (
          <Card key={index}>
            <CardBody className="flex items-center p-4">
              <div className="mr-4 p-2 rounded-full bg-primary-100">
                <Icon icon={item.icon} className="text-primary-500 text-xl" />
              </div>
              <div>
                <p className="text-default-500 text-sm">{item.title}</p>
                <h3 className="text-xl font-semibold">{item.value}</h3>
                <p className={`text-xs ${item.change >= 0 ? 'text-success-500' : 'text-danger-500'}`}>
                  <Icon 
                    icon={item.change >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'} 
                    className="inline mr-1" 
                  />
                  {item.change >= 0 ? '+' : ''}{item.change}% vs last period
                </p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-0 pt-4 px-4 flex justify-between items-center">
            <h3 className="text-lg font-medium">Quotation Status</h3>
            <Button variant="light" size="sm">
              <Icon icon="lucide:more-horizontal" />
            </Button>
          </CardHeader>
          <CardBody className="py-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => [`${value} quotations`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader className="pb-0 pt-4 px-4 flex justify-between items-center">
            <h3 className="text-lg font-medium">Monthly Trends</h3>
            <Button variant="light" size="sm">
              <Icon icon="lucide:more-horizontal" />
            </Button>
          </CardHeader>
          <CardBody className="py-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0070F3" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0070F3" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatCurrency} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0070F3" 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Clients Chart */}
        <Card>
          <CardHeader className="pb-0 pt-4 px-4 flex justify-between items-center">
            <h3 className="text-lg font-medium">Top Clients by Revenue</h3>
            <Button variant="light" size="sm">
              <Icon icon="lucide:more-horizontal" />
            </Button>
          </CardHeader>
          <CardBody className="py-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topClients}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={formatCurrency} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                  <Bar dataKey="value" fill="#0070F3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
        
        {/* Top Clients Table */}
        <Card>
          <CardHeader className="pb-0 pt-4 px-4">
            <h3 className="text-lg font-medium">Top Performing Clients</h3>
          </CardHeader>
          <CardBody>
            <Table removeWrapper>
              <TableHeader>
                <TableColumn>CLIENT</TableColumn>
                <TableColumn>QUOTATIONS</TableColumn>
                <TableColumn>TOTAL VALUE</TableColumn>
                <TableColumn>CONVERSION RATE</TableColumn>
              </TableHeader>
              <TableBody>
                {topClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.quotations}</TableCell>
                    <TableCell>${client.value.toFixed(2)}</TableCell>
                    <TableCell>{client.conversion}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-0 pt-4 px-4">
          <h3 className="text-lg font-medium">Recent Activity</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className={`p-2 rounded-full mr-3 ${activity.colorClass}`}>
                  <Icon icon={activity.icon} />
                </div>
                <div>
                  <p className="font-medium">Quotation #{activity.id} {activity.action}</p>
                  <p className="text-default-500 text-sm">{activity.client} - ${activity.amount.toFixed(2)}</p>
                  <p className="text-xs text-default-400">
                    {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
