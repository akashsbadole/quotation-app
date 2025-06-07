import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { forecastingService } from "../services/forecasting.service";

// Local interface for component (mapped from service interface)
interface LocalForecastData {
  period: string;
  predicted: number;
  actual?: number;
  confidence: number;
  trend: "up" | "down" | "stable";
}

interface SalesForecastingProps {
  onNavigate?: (section: string) => void;
}

export const SalesForecasting: React.FC<SalesForecastingProps> = () => {
  const [forecastData, setForecastData] = useState<LocalForecastData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("quarterly");
  const [selectedModel, setSelectedModel] = useState("ai-enhanced");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateForecast();
  }, [selectedPeriod, selectedModel]);

  const generateForecast = async () => {
    setLoading(true);

    try {
      const result = await forecastingService.generateForecast(
        selectedPeriod as "monthly" | "quarterly",
        selectedModel
      );
      if (result.success && result.data) {
        // Map service data to component interface
        const mappedData = result.data.map((item) => ({
          period: item.period,
          predicted: item.predicted,
          actual: item.actual,
          confidence: item.confidence,
          trend: item.trend,
        }));
        setForecastData(mappedData);
      } else {
        console.error("Failed to generate forecast:", result.error);
        alert("Failed to generate forecast. Please try again.");
      }
    } catch (error) {
      console.error("Error generating forecast:", error);
      alert("Error generating forecast. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "lucide:trending-up";
      case "down":
        return "lucide:trending-down";
      case "stable":
        return "lucide:minus";
      default:
        return "lucide:minus";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      case "stable":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "bg-green-100 text-green-800";
    if (confidence >= 80) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const totalPredicted = forecastData.reduce(
    (sum, item) => sum + item.predicted,
    0
  );
  const totalActual = forecastData.reduce(
    (sum, item) => sum + (item.actual || 0),
    0
  );
  const avgConfidence =
    forecastData.reduce((sum, item) => sum + item.confidence, 0) /
    forecastData.length;
  const accuracy = totalActual > 0 ? (totalActual / totalPredicted) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Sales Forecasting
          </h1>
          <p className="text-gray-600 mt-1">
            AI-powered sales predictions and trend analysis
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateForecast}
            disabled={loading}
          >
            <Icon
              icon={loading ? "lucide:loader-2" : "lucide:refresh-cw"}
              className={`text-lg ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh Forecast</span>
          </motion.button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: "Total Predicted",
            value: `$${totalPredicted.toLocaleString()}`,
            icon: "lucide:target",
            color: "blue",
            change: "+12.5%",
          },
          {
            title: "Forecast Accuracy",
            value: `${accuracy.toFixed(1)}%`,
            icon: "lucide:check-circle",
            color: "green",
            change: "+2.3%",
          },
          {
            title: "Avg Confidence",
            value: `${avgConfidence.toFixed(0)}%`,
            icon: "lucide:brain",
            color: "purple",
            change: "+1.8%",
          },
          {
            title: "Growth Trend",
            value: "+15.2%",
            icon: "lucide:trending-up",
            color: "green",
            change: "+0.7%",
          },
        ].map((metric, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {metric.change} vs last period
                </p>
              </div>
              <div
                className={`w-12 h-12 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}
              >
                <Icon
                  icon={metric.icon}
                  className={`text-${metric.color}-600 text-xl`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forecast Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forecasting Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ai-enhanced">AI Enhanced</option>
              <option value="linear-regression">Linear Regression</option>
              <option value="seasonal-arima">Seasonal ARIMA</option>
              <option value="ensemble">Ensemble Model</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Range
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="12months">Last 12 Months</option>
              <option value="24months">Last 24 Months</option>
              <option value="36months">Last 36 Months</option>
            </select>
          </div>
        </div>
      </div>

      {/* Forecast Chart Visualization */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Sales Forecast Visualization
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Predicted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Actual</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Icon
                icon="lucide:loader-2"
                className="animate-spin text-4xl text-blue-600 mb-4"
              />
              <p className="text-gray-600">Generating forecast...</p>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-end space-x-2 overflow-x-auto">
            {forecastData.map((item, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 flex flex-col items-center space-y-2"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex space-x-1">
                  {/* Predicted Bar */}
                  <div
                    className="w-8 bg-blue-500 rounded-t"
                    style={{
                      height: `${
                        (item.predicted /
                          Math.max(...forecastData.map((d) => d.predicted))) *
                        200
                      }px`,
                    }}
                  ></div>
                  {/* Actual Bar */}
                  {item.actual && (
                    <div
                      className="w-8 bg-green-500 rounded-t"
                      style={{
                        height: `${
                          (item.actual /
                            Math.max(...forecastData.map((d) => d.predicted))) *
                          200
                        }px`,
                      }}
                    ></div>
                  )}
                </div>
                <div className="text-xs text-gray-600 text-center">
                  <div className="font-medium">{item.period}</div>
                  <div>${(item.predicted / 1000).toFixed(0)}k</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Forecast Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Detailed Forecast
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Predicted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {forecastData.map((item, index) => {
                const variance = item.actual
                  ? ((item.actual - item.predicted) / item.predicted) * 100
                  : null;
                return (
                  <motion.tr
                    key={index}
                    className="hover:bg-gray-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.predicted.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.actual ? `$${item.actual.toLocaleString()}` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {variance !== null ? (
                        <span
                          className={
                            variance >= 0 ? "text-green-600" : "text-red-600"
                          }
                        >
                          {variance >= 0 ? "+" : ""}
                          {variance.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(
                          item.confidence
                        )}`}
                      >
                        {item.confidence}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Icon
                        icon={getTrendIcon(item.trend)}
                        className={`text-lg ${getTrendColor(item.trend)}`}
                      />
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Icon icon="lucide:brain" className="text-2xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
            <div className="space-y-2 text-purple-100">
              <p>
                • Sales are trending upward with a 15.2% growth rate over the
                forecast period
              </p>
              <p>
                • Q4 shows the strongest growth potential, likely due to
                seasonal factors
              </p>
              <p>
                • Current forecast accuracy is 96.8%, indicating reliable
                predictions
              </p>
              <p>
                • Consider increasing inventory for Q4 to meet projected demand
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
