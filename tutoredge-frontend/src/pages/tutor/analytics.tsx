import { useEffect, useState } from "react";
import TutorDashboardLayout from "@/components/tutor-dashboard/TutorDashboardLayout";
import api from "@/lib/apiClient";
import {
  TrendingUp,
  Users,
  IndianRupee,
  Target,
  Eye,
  CheckCircle,
  XCircle,
  Activity,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

type AnalyticsData = {
  leadStats: {
    totalUnlocks: number;
    byStatus: { _id: string; count: number }[];
  };
  conversionStats: {
    total: number;
    active: number;
    rate: string;
  };
  revenueStats: {
    totalRevenue: number;
    totalCommission: number;
    totalPaid: number;
  };
  monthlyTrend: any[];
};

type ConversionFunnel = {
  new: number;
  contacted: number;
  response_received: number;
  demo_scheduled: number;
  demo_completed: number;
  converted: number;
  lost: number;
};

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [funnel, setFunnel] = useState<ConversionFunnel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [analyticsRes, funnelRes] = await Promise.all([
        api.get("/analytics/dashboard"),
        api.get("/analytics/conversion-funnel"),
      ]);

      setAnalytics(analyticsRes.data.data);
      setFunnel(funnelRes.data.data);
    } catch (error) {
      console.error("Failed to fetch analytics", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <TutorDashboardLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-4 text-slate-600">Loading analytics...</p>
          </div>
        </div>
      </TutorDashboardLayout>
    );
  }

  const statusData =
    analytics?.leadStats.byStatus.map((item) => ({
      name: item._id.replace("_", " "),
      value: item.count,
    })) || [];

  const COLORS = [
    "#3B82F6",
    "#EAB308",
    "#A855F7",
    "#F97316",
    "#14B8A6",
    "#22C55E",
    "#EF4444",
  ];

  const funnelData = funnel
    ? [
        { stage: "New", count: funnel.new },
        { stage: "Contacted", count: funnel.contacted },
        { stage: "Response", count: funnel.response_received },
        { stage: "Demo Scheduled", count: funnel.demo_scheduled },
        { stage: "Demo Done", count: funnel.demo_completed },
        { stage: "Converted", count: funnel.converted },
      ]
    : [];

  return (
    <TutorDashboardLayout>
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Analytics Dashboard
            </h1>
            <p className="mt-2 text-slate-600">
              Track your performance, conversions, and earnings
            </p>
          </div>

          {/* KPI Cards */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
            <KPICard
              title="Total Leads Unlocked"
              value={analytics?.leadStats.totalUnlocks || 0}
              icon={Eye}
              color="blue"
            />
            <KPICard
              title="Active Conversions"
              value={analytics?.conversionStats.active || 0}
              icon={Users}
              color="green"
            />
            <KPICard
              title="Conversion Rate"
              value={`${analytics?.conversionStats.rate || 0}%`}
              icon={Target}
              color="purple"
            />
            <KPICard
              title="Total Revenue"
              value={`₹${analytics?.revenueStats.totalRevenue || 0}`}
              icon={IndianRupee}
              color="amber"
            />
          </div>

          {/* Charts Row 1 */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Lead Status Pie Chart */}
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-900">
                <Activity className="h-5 w-5 text-indigo-600" />
                Leads by Status
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Conversion Funnel */}
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-900">
                <Target className="h-5 w-5 text-indigo-600" />
                Conversion Funnel
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="stage" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4F46E5" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Monthly Trend */}
          {analytics?.monthlyTrend && analytics.monthlyTrend.length > 0 && (
            <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-900">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                Monthly Activity Trend
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analytics.monthlyTrend.reverse().map((item) => ({
                      month: `${item._id.month}/${item._id.year}`,
                      unlocks: item.unlocks,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="unlocks"
                      stroke="#4F46E5"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Revenue Breakdown */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900">
              <IndianRupee className="h-5 w-5 text-indigo-600" />
              Revenue Breakdown
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <RevenueCard
                title="Total Revenue"
                amount={analytics?.revenueStats.totalRevenue || 0}
                icon={TrendingUp}
                color="green"
              />
              <RevenueCard
                title="Total Paid"
                amount={analytics?.revenueStats.totalPaid || 0}
                icon={CheckCircle}
                color="blue"
              />
              <RevenueCard
                title="Commission Paid"
                amount={analytics?.revenueStats.totalCommission || 0}
                icon={XCircle}
                color="red"
              />
            </div>
          </div>
        </div>
      </div>
    </TutorDashboardLayout>
  );
};

const KPICard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: "blue" | "green" | "purple" | "amber";
}) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${colorMap[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

const RevenueCard = ({
  title,
  amount,
  icon: Icon,
  color,
}: {
  title: string;
  amount: number;
  icon: any;
  color: "green" | "blue" | "red";
}) => {
  const colorMap = {
    green: "bg-green-50 border-green-200 text-green-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    red: "bg-red-50 border-red-200 text-red-700",
  };

  return (
    <div className={`rounded-xl border-2 p-6 ${colorMap[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="mt-2 text-2xl font-bold">₹{amount.toLocaleString()}</p>
        </div>
        <Icon className="h-8 w-8 opacity-60" />
      </div>
    </div>
  );
};

export default AnalyticsPage;
