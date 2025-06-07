import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

interface AnalyticsData {
  conversionRate: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
  };
  totalQuotations: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
  };
  averageValue: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
  };
  responseTime: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
  };
}

interface ChartData {
  month: string;
  quotations: number;
  conversions: number;
  revenue: number;
}

interface TopPerformer {
  id: string;
  name: string;
  type: 'salesperson' | 'product' | 'client';
  value: number;
  metric: string;
  change: number;
}

interface PerformanceAnalyticsProps {
  onNavigate?: (section: string) => void;
}

export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ onNavigate }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'performance'>('overview');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockAnalyticsData: AnalyticsData = {
      conversionRate: {
        current: 68.5,
        previous: 65.2,
        trend: 'up',
      },
      totalQuotations: {
        current: 247,
        previous: 198,
        trend: 'up',
      },
      averageValue: {
        current: 28500,
        previous: 26800,
        trend: 'up',
      },
      responseTime: {
        current: 2.3,
        previous: 2.8,
        trend: 'down', // Lower is better for response time
      },
    };

    const mockChartData: ChartData[] = [
      { month: 'Jan', quotations: 45, conversions: 28, revenue: 785000 },
      { month: 'Feb', quotations: 52, conversions: 34, revenue: 920000 },
      { month: 'Mar', quotations: 48, conversions: 31, revenue: 845000 },
      { month: 'Apr', quotations: 61, conversions: 42, revenue: 1150000 },
      { month: 'May', quotations: 58, conversions: 39, revenue: 1080000 },
      { month: 'Jun', quotations: 67, conversions: 46, revenue: 1290000 },
      { month: 'Jul', quotations: 72, conversions: 51, revenue: 1420000 },
      { month: 'Aug', quotations: 69, conversions: 48, revenue: 1350000 },
      { month: 'Sep', quotations: 74, conversions: 52, revenue: 1480000 },
      { month: 'Oct', quotations: 78, conversions: 55, revenue: 1560000 },
      { month: 'Nov', quotations: 82, conversions: 58, revenue: 1650000 },
      { month: 'Dec', quotations: 85, conversions: 61, revenue: 1720000 },
    ];

    const mockTopPerformers: TopPerformer[] = [
      {
        id: 'sales-1',
        name: 'Sarah Johnson',
        type: 'salesperson',
        value: 85.2,
        metric: 'Conversion Rate',
        change: 12.5,
      },
      {
        id: 'sales-2',
        name: 'Mike Davis',
        type: 'salesperson',
        value: 78.9,
        metric: 'Conversion Rate',
        change: 8.3,
      },
      {
        id: 'product-1',
        name: 'Enterprise Software License',
        type: 'product',
        value: 1250000,
        metric: 'Revenue',
        change: 15.7,
      },
      {
        id: 'product-2',
        name: 'Professional Services',
        type: 'product',
        value: 890000,
        metric: 'Revenue',
        change: 22.1,
      },
      {
        id: 'client-1',
        name: 'Acme Corporation',
        type: 'client',
        value: 325000,
        metric: 'Lifetime Value',
        change: 18.9,
      },
      {
        id: 'client-2',
        name: 'Tech Solutions Inc',
        type: 'client',
        value: 275000,
        metric: 'Lifetime Value',
        change: 14.2,
      },
    ];

    setAnalyticsData(mockAnalyticsData);
    setChartData(mockChartData);
    setTopPerformers(mockTopPerformers);
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

  const getTrendColor = (trend: 'up' | 'down' | 'stable', isGood: boolean = true) => {
    if (trend === 'stable') return 'text-gray-500';
    const isPositive = (trend === 'up' && isGood) || (trend === 'down' && !isGood);
    return isPositive ? 'text-green-600' : 'text-red-600';
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getPerformerIcon = (type: string) => {
    switch (type) {
      case 'salesperson':
        return 'lucide:user';
      case 'product':
        return 'lucide:package';
      case 'client':
        return 'lucide:building';
      default:
        return 'lucide:star';
    }
  };

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
                onClick={() => onNavigate?.('analytics-performance')}
              >
                <Icon icon="lucide:arrow-left" className="text-xl" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
                <p className="text-sm text-gray-600">Track and analyze your quotation performance metrics</p>
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
                <span>Export</span>
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
              { id: 'overview', name: 'Overview' },
              { id: 'trends', name: 'Trends' },
              { id: 'performance', name: 'Top Performers' },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as any)}
              >
                {tab.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && analyticsData && (
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
                    <h3 className="text-sm font-medium text-gray-600">Conversion Rate</h3>
                    <Icon 
                      icon={getTrendIcon(analyticsData.conversionRate.trend)} 
                      className={`text-lg ${getTrendColor(analyticsData.conversionRate.trend)}`} 
                    />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPercentage(analyticsData.conversionRate.current)}
                    </p>
                    <p className={`text-sm ${getTrendColor(analyticsData.conversionRate.trend)}`}>
                      {calculateChange(analyticsData.conversionRate.current, analyticsData.conversionRate.previous) > 0 ? '+' : ''}
                      {calculateChange(analyticsData.conversionRate.current, analyticsData.conversionRate.previous).toFixed(1)}%
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">vs previous period</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Total Quotations</h3>
                    <Icon 
                      icon={getTrendIcon(analyticsData.totalQuotations.trend)} 
                      className={`text-lg ${getTrendColor(analyticsData.totalQuotations.trend)}`} 
                    />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData.totalQuotations.current.toLocaleString()}
                    </p>
                    <p className={`text-sm ${getTrendColor(analyticsData.totalQuotations.trend)}`}>
                      {calculateChange(analyticsData.totalQuotations.current, analyticsData.totalQuotations.previous) > 0 ? '+' : ''}
                      {calculateChange(analyticsData.totalQuotations.current, analyticsData.totalQuotations.previous).toFixed(1)}%
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">vs previous period</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Average Value</h3>
                    <Icon 
                      icon={getTrendIcon(analyticsData.averageValue.trend)} 
                      className={`text-lg ${getTrendColor(analyticsData.averageValue.trend)}`} 
                    />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(analyticsData.averageValue.current)}
                    </p>
                    <p className={`text-sm ${getTrendColor(analyticsData.averageValue.trend)}`}>
                      {calculateChange(analyticsData.averageValue.current, analyticsData.averageValue.previous) > 0 ? '+' : ''}
                      {calculateChange(analyticsData.averageValue.current, analyticsData.averageValue.previous).toFixed(1)}%
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">vs previous period</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Response Time</h3>
                    <Icon 
                      icon={getTrendIcon(analyticsData.responseTime.trend)} 
                      className={`text-lg ${getTrendColor(analyticsData.responseTime.trend, false)}`} 
                    />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData.responseTime.current}h
                    </p>
                    <p className={`text-sm ${getTrendColor(analyticsData.responseTime.trend, false)}`}>
                      {calculateChange(analyticsData.responseTime.current, analyticsData.responseTime.previous) > 0 ? '+' : ''}
                      {calculateChange(analyticsData.responseTime.current, analyticsData.responseTime.previous).toFixed(1)}%
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">vs previous period</p>
                </div>
              </div>

              {/* Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quotation Trends</h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <Icon icon="lucide:bar-chart-3" className="text-4xl text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Chart visualization coming soon</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <Icon icon="lucide:funnel" className="text-4xl text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Funnel visualization coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'trends' && (
            <motion.div
              key="trends"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Monthly Data Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Month
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quotations
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Conversions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Conversion Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {chartData.map((data, index) => (
                        <tr key={data.month} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {data.month}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.quotations}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.conversions}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {((data.conversions / data.quotations) * 100).toFixed(1)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(data.revenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Trend Analysis */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="p-4 bg-green-100 rounded-lg mb-3">
                      <Icon icon="lucide:trending-up" className="text-3xl text-green-600 mx-auto" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Growing Trend</h4>
                    <p className="text-sm text-gray-600">
                      Quotation volume has increased by 89% over the past year
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="p-4 bg-blue-100 rounded-lg mb-3">
                      <Icon icon="lucide:target" className="text-3xl text-blue-600 mx-auto" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Improving Conversion</h4>
                    <p className="text-sm text-gray-600">
                      Conversion rates have improved by 15% in the last quarter
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="p-4 bg-purple-100 rounded-lg mb-3">
                      <Icon icon="lucide:dollar-sign" className="text-3xl text-purple-600 mx-auto" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Higher Value</h4>
                    <p className="text-sm text-gray-600">
                      Average quotation value has increased by 23% year-over-year
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'performance' && (
            <motion.div
              key="performance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Salespeople */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Salespeople</h3>
                  <div className="space-y-4">
                    {topPerformers.filter(p => p.type === 'salesperson').map((performer, index) => (
                      <div key={performer.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Icon icon={getPerformerIcon(performer.type)} className="text-blue-600 text-sm" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{performer.name}</p>
                            <p className="text-xs text-gray-500">{performer.metric}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatPercentage(performer.value)}</p>
                          <p className="text-xs text-green-600">+{performer.change}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
                  <div className="space-y-4">
                    {topPerformers.filter(p => p.type === 'product').map((performer, index) => (
                      <div key={performer.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Icon icon={getPerformerIcon(performer.type)} className="text-green-600 text-sm" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{performer.name}</p>
                            <p className="text-xs text-gray-500">{performer.metric}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatCurrency(performer.value)}</p>
                          <p className="text-xs text-green-600">+{performer.change}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Clients */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Clients</h3>
                  <div className="space-y-4">
                    {topPerformers.filter(p => p.type === 'client').map((performer, index) => (
                      <div key={performer.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Icon icon={getPerformerIcon(performer.type)} className="text-purple-600 text-sm" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{performer.name}</p>
                            <p className="text-xs text-gray-500">{performer.metric}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatCurrency(performer.value)}</p>
                          <p className="text-xs text-green-600">+{performer.change}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
