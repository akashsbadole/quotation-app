import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

interface FinancialData {
  revenue: {
    current: number;
    previous: number;
    target: number;
    trend: 'up' | 'down' | 'stable';
  };
  profit: {
    gross: number;
    net: number;
    margin: number;
  };
  quotations: {
    total: number;
    converted: number;
    pending: number;
    value: number;
  };
  expenses: {
    operational: number;
    marketing: number;
    personnel: number;
    other: number;
  };
}

interface MonthlyData {
  month: string;
  revenue: number;
  profit: number;
  quotations: number;
  conversions: number;
  expenses: number;
}

interface FinancialReportsProps {
  onNavigate?: (section: string) => void;
}

export const FinancialReports: React.FC<FinancialReportsProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'profit' | 'expenses'>('overview');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    const mockFinancialData: FinancialData = {
      revenue: {
        current: 1250000,
        previous: 1100000,
        target: 1300000,
        trend: 'up',
      },
      profit: {
        gross: 750000,
        net: 450000,
        margin: 36,
      },
      quotations: {
        total: 247,
        converted: 169,
        pending: 45,
        value: 2850000,
      },
      expenses: {
        operational: 180000,
        marketing: 85000,
        personnel: 320000,
        other: 65000,
      },
    };

    const mockMonthlyData: MonthlyData[] = [
      { month: 'Jan', revenue: 980000, profit: 350000, quotations: 45, conversions: 28, expenses: 580000 },
      { month: 'Feb', revenue: 1120000, profit: 420000, quotations: 52, conversions: 34, expenses: 620000 },
      { month: 'Mar', revenue: 1050000, profit: 380000, quotations: 48, conversions: 31, expenses: 590000 },
      { month: 'Apr', revenue: 1280000, profit: 480000, quotations: 61, conversions: 42, expenses: 650000 },
      { month: 'May', revenue: 1180000, profit: 440000, quotations: 58, conversions: 39, expenses: 630000 },
      { month: 'Jun', revenue: 1350000, profit: 520000, quotations: 67, conversions: 46, expenses: 680000 },
      { month: 'Jul', revenue: 1420000, profit: 560000, quotations: 72, conversions: 51, expenses: 720000 },
      { month: 'Aug', revenue: 1380000, profit: 540000, quotations: 69, conversions: 48, expenses: 700000 },
      { month: 'Sep', revenue: 1480000, profit: 590000, quotations: 74, conversions: 52, expenses: 750000 },
      { month: 'Oct', revenue: 1560000, profit: 630000, quotations: 78, conversions: 55, expenses: 780000 },
      { month: 'Nov', revenue: 1650000, profit: 670000, quotations: 82, conversions: 58, expenses: 820000 },
      { month: 'Dec', revenue: 1720000, profit: 720000, quotations: 85, conversions: 61, expenses: 850000 },
    ];

    setFinancialData(mockFinancialData);
    setMonthlyData(mockMonthlyData);
  }, [dateRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'lucide:trending-up';
      case 'down':
        return 'lucide:trending-down';
      default:
        return 'lucide:minus';
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  if (!financialData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <motion.button
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onNavigate?.('analytics-financial')}
              >
                <Icon icon="lucide:arrow-left" className="text-xl" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
                <p className="text-sm text-gray-600">Comprehensive financial analysis and insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <motion.button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon icon="lucide:download" className="text-lg" />
                <span>Export Report</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: 'lucide:bar-chart-3' },
              { id: 'revenue', name: 'Revenue Analysis', icon: 'lucide:dollar-sign' },
              { id: 'profit', name: 'Profit & Loss', icon: 'lucide:trending-up' },
              { id: 'expenses', name: 'Expense Breakdown', icon: 'lucide:pie-chart' },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as any)}
              >
                <Icon icon={tab.icon} className="text-sm" />
                <span>{tab.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
                    <Icon 
                      icon={getTrendIcon(financialData.revenue.trend)} 
                      className={`text-lg ${getTrendColor(financialData.revenue.trend)}`} 
                    />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(financialData.revenue.current)}
                    </p>
                    <p className={`text-sm ${getTrendColor(financialData.revenue.trend)}`}>
                      {calculateChange(financialData.revenue.current, financialData.revenue.previous) > 0 ? '+' : ''}
                      {calculateChange(financialData.revenue.current, financialData.revenue.previous).toFixed(1)}%
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">vs previous period</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Net Profit</h3>
                    <Icon icon="lucide:trending-up" className="text-lg text-green-600" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(financialData.profit.net)}
                    </p>
                    <p className="text-sm text-green-600">
                      {formatPercentage(financialData.profit.margin)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">profit margin</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Quotation Value</h3>
                    <Icon icon="lucide:file-text" className="text-lg text-blue-600" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(financialData.quotations.value)}
                    </p>
                    <p className="text-sm text-blue-600">
                      {financialData.quotations.total} quotes
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatPercentage((financialData.quotations.converted / financialData.quotations.total) * 100)} conversion
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Total Expenses</h3>
                    <Icon icon="lucide:credit-card" className="text-lg text-red-600" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(Object.values(financialData.expenses).reduce((a, b) => a + b, 0))}
                    </p>
                    <p className="text-sm text-red-600">
                      {formatPercentage((Object.values(financialData.expenses).reduce((a, b) => a + b, 0) / financialData.revenue.current) * 100)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">of revenue</p>
                </div>
              </div>

              {/* Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <Icon icon="lucide:line-chart" className="text-4xl text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Revenue chart visualization</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <Icon icon="lucide:pie-chart" className="text-4xl text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Expense pie chart</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Performance Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Monthly Performance</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Month
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Profit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quotations
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Conversion Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Expenses
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {monthlyData.slice(-6).map((data) => (
                        <tr key={data.month} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {data.month}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(data.revenue)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(data.profit)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.quotations}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPercentage((data.conversions / data.quotations) * 100)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(data.expenses)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {(activeTab === 'revenue' || activeTab === 'profit' || activeTab === 'expenses') && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="text-center py-12">
                <Icon 
                  icon={
                    activeTab === 'revenue' ? 'lucide:dollar-sign' :
                    activeTab === 'profit' ? 'lucide:trending-up' : 'lucide:pie-chart'
                  } 
                  className="text-6xl text-blue-400 mx-auto mb-4" 
                />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'revenue' ? 'Revenue Analysis' :
                   activeTab === 'profit' ? 'Profit & Loss Analysis' : 'Expense Analysis'}
                </h3>
                <p className="text-gray-600 mb-4">
                  Detailed {activeTab} analysis with advanced charts and insights
                </p>
                <p className="text-sm text-gray-500">
                  Advanced analytics dashboard coming soon
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
