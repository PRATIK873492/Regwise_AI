import { useState, useEffect } from "react";
import { dashboardAPI } from "../services/api";
import { DashboardMetrics } from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  LayoutDashboard,
  TrendingUp,
  AlertCircle,
  Globe,
  Bell,
  Activity,
  PieChart as PieChartIcon,
  BarChart3,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

export const Dashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeFilter, setTimeFilter] = useState("7d");

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await dashboardAPI.getMetrics();
      setMetrics(data);
    } catch (err) {
      setError("Failed to load dashboard metrics. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const riskData = metrics
    ? [
        {
          name: "Low Risk",
          value: metrics.riskBreakdown.low,
          color: "#3B82F6",
        },
        {
          name: "Medium Risk",
          value: metrics.riskBreakdown.medium,
          color: "#F59E0B",
        },
        {
          name: "High Risk",
          value: metrics.riskBreakdown.high,
          color: "#EF4444",
        },
      ]
    : [];

  const chartData = metrics
    ? [
        { name: "Low", value: metrics.riskBreakdown.low, fill: "#3B82F6" },
        {
          name: "Medium",
          value: metrics.riskBreakdown.medium,
          fill: "#F59E0B",
        },
        { name: "High", value: metrics.riskBreakdown.high, fill: "#EF4444" },
      ]
    : [];

  // Mock trend data for line chart
  const trendData = [
    { month: "Jan", alerts: 8, compliance: 82 },
    { month: "Feb", alerts: 12, compliance: 85 },
    { month: "Mar", alerts: 10, compliance: 84 },
    { month: "Apr", alerts: 15, compliance: 86 },
    { month: "May", alerts: 11, compliance: 87 },
    { month: "Jun", alerts: 9, compliance: 88 },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "search":
        return <Activity className="w-4 h-4 text-blue-600" />;
      case "alert":
        return <Bell className="w-4 h-4 text-orange-600" />;
      case "update":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getComplianceScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getComplianceGradient = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-red-600";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-foreground">Analytics Dashboard</h1>
                <p className="text-muted-foreground">
                  Compliance metrics and insights
                </p>
              </div>
            </div>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="border-0 shadow-lg">
                  <CardHeader>
                    <Skeleton className="h-4 w-20" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : metrics ? (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Globe className="w-8 h-8 text-blue-600" />
                    <Badge
                      variant="secondary"
                      className="bg-blue-200 text-blue-800"
                    >
                      <ArrowUp className="w-3 h-3 mr-1" />
                      +2
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-800 mb-1">Total Countries</p>
                  <p className="text-3xl font-bold text-blue-900">
                    {metrics.totalCountries}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500" />
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Bell className="w-8 h-8 text-orange-600" />
                    <Badge
                      variant="secondary"
                      className="bg-orange-200 text-orange-800"
                    >
                      <ArrowUp className="w-3 h-3 mr-1" />
                      +3
                    </Badge>
                  </div>
                  <p className="text-sm text-orange-800 mb-1">Active Alerts</p>
                  <p className="text-3xl font-bold text-orange-900">
                    {metrics.activeAlerts}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                    <Badge
                      variant="secondary"
                      className="bg-green-200 text-green-800"
                    >
                      <ArrowUp className="w-3 h-3 mr-1" />
                      +5%
                    </Badge>
                  </div>
                  <p className="text-sm text-green-800 mb-1">
                    Compliance Score
                  </p>
                  <p
                    className={`text-3xl font-bold ${getComplianceScoreColor(
                      metrics.complianceScore
                    )}`}
                  >
                    {metrics.complianceScore}%
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-sm text-purple-800 mb-1">Last Updated</p>
                  <p className="text-lg font-semibold text-purple-900">
                    {new Date(metrics.lastUpdated).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Distribution Donut Chart */}
              <Card className="border-0 shadow-lg">
                <div className="h-1 bg-gradient-to-r from-primary to-secondary" />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <PieChartIcon className="w-5 h-5 text-primary" />
                        <span>Risk Distribution</span>
                      </CardTitle>
                      <CardDescription>Breakdown by risk level</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={riskData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={110}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {riskData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {riskData.map((item, index) => (
                      <div
                        key={index}
                        className="text-center p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center justify-center space-x-2 mb-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm font-medium">
                            {item.name.split(" ")[0]}
                          </span>
                        </div>
                        <p className="text-xl font-bold text-foreground">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Risk Analysis Bar Chart */}
              <Card className="border-0 shadow-lg">
                <div className="h-1 bg-gradient-to-r from-secondary to-teal-600" />
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-secondary" />
                    <span>Risk Analysis</span>
                  </CardTitle>
                  <CardDescription>
                    Requirements by risk category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trend Analysis */}
            <Card className="border-0 shadow-lg">
              <div className="h-1 bg-gradient-to-r from-accent to-orange-600" />
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <span>Compliance Trends</span>
                </CardTitle>
                <CardDescription>
                  Alerts and compliance score over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient
                          id="colorAlerts"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#FFA500"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#FFA500"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorCompliance"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#00BFA6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#00BFA6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="alerts"
                        stroke="#FFA500"
                        fillOpacity={1}
                        fill="url(#colorAlerts)"
                        name="Alerts"
                      />
                      <Area
                        type="monotone"
                        dataKey="compliance"
                        stroke="#00BFA6"
                        fillOpacity={1}
                        fill="url(#colorCompliance)"
                        name="Compliance Score"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg">
              <div className="h-1 bg-gradient-to-r from-primary to-secondary" />
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>
                  Latest actions in your workspace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.recentActivity.map((activity, index) => (
                    <div
                      key={activity.id}
                      className={`flex items-start space-x-4 p-4 rounded-lg transition-all duration-300 hover:shadow-md ${
                        index % 2 === 0 ? "bg-muted/30" : "bg-muted/10"
                      }`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground font-medium">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-3 mt-1">
                          <p className="text-sm text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                          {activity.country && (
                            <Badge variant="outline" className="text-xs">
                              {activity.country}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
};
