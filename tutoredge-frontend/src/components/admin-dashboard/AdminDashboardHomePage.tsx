import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import apiClient from "@/lib/apiClient";
import { 
  Users, UserCheck, Clock, CheckCircle, XCircle, TrendingUp, TrendingDown,
  DollarSign, FileText, UserPlus, Calendar, Phone, Mail,
  Activity, AlertCircle, ArrowUpRight, Loader, BarChart3,
  MapPin, Award, MessageSquare, BookOpen, Bell, Zap, Target,
  ThumbsUp, Star, Globe, Sparkles, Rocket, Shield, HeartHandshake
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

/* ======================
   TYPES
====================== */
interface Tutor {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  status: "approved" | "pending" | "rejected";
  profileImage?: string;
  createdAt?: string;
}

interface Parent {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: {
    city?: string;
  };
  createdAt?: string;
}

interface TeamMember {
  _id: string;
  name: string;
  role: string;
}

interface DashboardStats {
  tutors: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    profileComplete: number;
    growth: number; // Percentage growth from last period
  };
  parents: {
    total: number;
    growth: number;
  };
  team: {
    total: number;
  };
  demoRequests: {
    total: number;
    pending: number;
    contacted: number;
    assigned: number;
    completed: number;
    conversionRate: number;
  };
  leads: {
    total: number;
  };
  activity: {
    todayRegistrations: number;
    todayDemoRequests: number;
    todayApprovals: number;
  };
}

interface RecentActivity {
  id: string;
  type: 'registration' | 'approval' | 'demo' | 'payment';
  user: string;
  action: string;
  timestamp: Date;
  icon: any;
  color: string;
}

/* ======================
   STATUS BADGE
====================== */
const StatusBadge = ({ status }: { status: string }) => {
  const configs = {
    approved: { 
      bg: 'bg-emerald-50 border-emerald-200', 
      text: 'text-emerald-700',
      icon: CheckCircle,
      dot: 'bg-emerald-500'
    },
    pending: { 
      bg: 'bg-amber-50 border-amber-200', 
      text: 'text-amber-700',
      icon: Clock,
      dot: 'bg-amber-500'
    },
    rejected: { 
      bg: 'bg-rose-50 border-rose-200', 
      text: 'text-rose-700',
      icon: XCircle,
      dot: 'bg-rose-500'
    },
  };

  const config = configs[status.toLowerCase() as keyof typeof configs] || configs.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      <Icon size={12} />
      <span className="text-xs font-semibold capitalize">{status}</span>
    </span>
  );
};

/* ======================
   PAGE
====================== */
export default function AdminDashboardPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [demoRequests, setDemoRequests] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [tutorRes, parentRes, teamRes, tutorStatsRes, demoRequestsRes] = await Promise.all([
          apiClient.get("/admin_dashboard/tutors").catch(() => ({ data: { data: [] } })),
          apiClient.get("/admin/parents").catch(() => ({ data: { data: [] } })),
          apiClient.get("/team").catch(() => ({ data: { data: [] } })),
          apiClient.get("/admin/tutors/dashboard/stats").catch(() => ({ data: { data: null } })),
          apiClient.get("/admin/demo-requests").catch(() => ({ data: { data: [] } })),
        ]);

        const tutorData = tutorRes.data.data || [];
        const parentData = parentRes.data.data || [];
        const teamData = teamRes.data.data || [];
        const tutorStatsData = tutorStatsRes.data.data;
        const demoRequestsData = demoRequestsRes.data.data || [];
        
        setTutors(tutorData);
        setParents(parentData);
        setTeam(teamData);
        setDemoRequests(demoRequestsData);

        // Calculate growth (mock for now - you can calculate based on date ranges)
        const tutorGrowth = tutorData.length > 0 ? 12.5 : 0;
        const parentGrowth = parentData.length > 0 ? 8.3 : 0;

        // Calculate today's activity
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayTutors = tutorData.filter((t: any) => 
          new Date(t.createdAt) >= today
        ).length;
        
        const todayParents = parentData.filter((p: any) => 
          new Date(p.createdAt) >= today
        ).length;

        const todayDemos = demoRequestsData.filter((d: any) => 
          new Date(d.createdAt) >= today
        ).length;

        // Calculate comprehensive stats
        const tutorStats = tutorStatsData || {
          totalTutors: tutorData.length,
          approved: tutorData.filter((t: Tutor) => t.status === "approved").length,
          pending: tutorData.filter((t: Tutor) => t.status === "pending").length,
          profileComplete: 0,
        };

        const rejected = tutorData.filter((t: Tutor) => t.status === "rejected").length;

        const demoStats = {
          total: demoRequestsData.length,
          pending: demoRequestsData.filter((d: any) => d.status === "pending").length,
          contacted: demoRequestsData.filter((d: any) => d.status === "contacted").length,
          assigned: demoRequestsData.filter((d: any) => d.status === "assigned").length,
          completed: demoRequestsData.filter((d: any) => d.status === "completed").length,
        };

        const conversionRate = demoStats.total > 0 
          ? ((demoStats.completed / demoStats.total) * 100).toFixed(1)
          : 0;

        setStats({
          tutors: {
            total: tutorStats.totalTutors,
            approved: tutorStats.approved,
            pending: tutorStats.pending,
            rejected: rejected,
            profileComplete: tutorStats.profileComplete,
            growth: tutorGrowth,
          },
          parents: {
            total: parentData.length,
            growth: parentGrowth,
          },
          team: {
            total: teamData.length,
          },
          demoRequests: {
            ...demoStats,
            conversionRate: Number(conversionRate),
          },
          leads: {
            total: demoRequestsData.length,
          },
          activity: {
            todayRegistrations: todayTutors + todayParents,
            todayDemoRequests: todayDemos,
            todayApprovals: tutorData.filter((t: any) => 
              t.status === 'approved' && new Date(t.updatedAt || t.createdAt) >= today
            ).length,
          },
        });

        // Generate recent activities
        const activities: RecentActivity[] = [];
        
        // Add recent tutors
        tutorData.slice(0, 3).forEach((tutor: Tutor) => {
          activities.push({
            id: tutor._id,
            type: 'registration',
            user: tutor.fullName,
            action: 'registered as tutor',
            timestamp: new Date(tutor.createdAt || Date.now()),
            icon: UserPlus,
            color: 'text-indigo-600',
          });
        });

        // Add recent parents
        parentData.slice(0, 2).forEach((parent: Parent) => {
          activities.push({
            id: parent._id,
            type: 'registration',
            user: parent.fullName,
            action: 'registered as parent',
            timestamp: new Date(parent.createdAt || Date.now()),
            icon: UserPlus,
            color: 'text-rose-600',
          });
        });

        // Sort by timestamp
        activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setRecentActivities(activities.slice(0, 5));

      } catch (err: any) {
        console.error("Dashboard load failed", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center space-y-4">
          <Loader className="w-16 h-16 text-indigo-600 animate-spin mx-auto" />
          <p className="text-slate-600 font-medium text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <p className="text-red-600 font-medium text-lg">{error}</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const tutorStatusData = [
    { name: 'Approved', value: stats?.tutors.approved || 0, color: '#10b981' },
    { name: 'Pending', value: stats?.tutors.pending || 0, color: '#f59e0b' },
    { name: 'Rejected', value: stats?.tutors.rejected || 0, color: '#ef4444' },
  ];

  const demoRequestStatusData = [
    { name: 'Pending', count: stats?.demoRequests.pending || 0 },
    { name: 'Contacted', count: stats?.demoRequests.contacted || 0 },
    { name: 'Assigned', count: stats?.demoRequests.assigned || 0 },
    { name: 'Completed', count: stats?.demoRequests.completed || 0 },
  ];

  // Geographic distribution from parent location data
  const cityDistribution: Record<string, number> = {};
  parents.forEach(parent => {
    const city = parent.location?.city || 'Unknown';
    cityDistribution[city] = (cityDistribution[city] || 0) + 1;
  });

  const geographicData = Object.entries(cityDistribution)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Top 8 cities

  // Growth trend mock data (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const growthTrendData = last7Days.map((day, index) => ({
    day,
    tutors: Math.floor(Math.random() * 10) + index * 2,
    parents: Math.floor(Math.random() * 8) + index * 1.5,
    demos: Math.floor(Math.random() * 5) + index,
  }));

  // Conversion funnel data
  const conversionFunnelData = [
    { stage: 'Demo Requests', count: stats?.demoRequests.total || 0, color: '#6366f1' },
    { stage: 'Contacted', count: stats?.demoRequests.contacted || 0, color: '#8b5cf6' },
    { stage: 'Assigned', count: stats?.demoRequests.assigned || 0, color: '#ec4899' },
    { stage: 'Completed', count: stats?.demoRequests.completed || 0, color: '#10b981' },
  ];

  const overviewData = [
    { name: 'Tutors', total: stats?.tutors.total || 0, approved: stats?.tutors.approved || 0 },
    { name: 'Parents', total: stats?.parents.total || 0, approved: stats?.parents.total || 0 },
    { name: 'Team', total: stats?.team.total || 0, approved: stats?.team.total || 0 },
    { name: 'Requests', total: stats?.demoRequests.total || 0, approved: stats?.demoRequests.completed || 0 },
  ];

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      
      {/* HEADER with Metrics Banner */}
      <div className="relative">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl opacity-10 blur-3xl" />
        
        <div className="relative bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <Rocket className="text-white" size={28} />
                </div>
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                    Admin Dashboard
                  </h1>
                  <p className="text-slate-600 text-sm mt-1">
                    Real-time analytics and platform insights
                  </p>
                </div>
              </div>
            </div>

            {/* Live Metrics Banner */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
                <Activity className="text-emerald-600 animate-pulse" size={20} />
                <div>
                  <p className="text-xs text-emerald-600 font-semibold">Live Data</p>
                  <p className="text-lg font-black text-emerald-900">{stats?.activity.todayRegistrations || 0}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border-2 border-indigo-200 rounded-xl">
                <Zap className="text-indigo-600" size={20} />
                <div>
                  <p className="text-xs text-indigo-600 font-semibold">Today</p>
                  <p className="text-lg font-black text-indigo-900">{stats?.activity.todayDemoRequests || 0} Demos</p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-2 border-amber-200 rounded-xl">
                <Target className="text-amber-600" size={20} />
                <div>
                  <p className="text-xs text-amber-600 font-semibold">Conversion</p>
                  <p className="text-lg font-black text-amber-900">{stats?.demoRequests.conversionRate || 0}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCardWithGrowth
          title="Total Tutors"
          value={stats?.tutors.total || 0}
          icon={Users}
          gradient="from-indigo-500 to-purple-600"
          subtitle={`${stats?.tutors.approved || 0} approved`}
          growth={stats?.tutors.growth || 0}
          link="/admin/applications"
        />
        <StatCardWithGrowth
          title="Total Parents"
          value={stats?.parents.total || 0}
          icon={UserPlus}
          gradient="from-rose-500 to-pink-600"
          subtitle="Registered users"
          growth={stats?.parents.growth || 0}
          link="/admin/parents"
        />
        <StatCard
          title="Demo Requests"
          value={stats?.demoRequests.total || 0}
          icon={Calendar}
          gradient="from-emerald-500 to-teal-600"
          subtitle={`${stats?.demoRequests.completed || 0} completed`}
          link="/admin/parent-demo-requests"
        />
        <StatCard
          title="Team Members"
          value={stats?.team.total || 0}
          icon={Award}
          gradient="from-amber-500 to-orange-600"
          subtitle="Active members"
          link="/admin/team"
        />
      </div>

      {/* SECONDARY STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniStatCard
          title="Approved Tutors"
          value={stats?.tutors.approved || 0}
          icon={CheckCircle}
          color="emerald"
        />
        <MiniStatCard
          title="Pending Applications"
          value={stats?.tutors.pending || 0}
          icon={Clock}
          color="amber"
        />
        <MiniStatCard
          title="Completed Demos"
          value={stats?.demoRequests.completed || 0}
          icon={CheckCircle}
          color="blue"
        />
        <MiniStatCard
          title="Profile Complete"
          value={stats?.tutors.profileComplete || 0}
          icon={UserCheck}
          color="purple"
        />
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Tutor Status Distribution */}
        <Link href="/admin/applications">
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="text-indigo-600" />
                Tutor Status Distribution
              </h3>
              <ArrowUpRight className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={20} />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tutorStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tutorStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Link>

        {/* Demo Request Status */}
        <Link href="/admin/parent-demo-requests">
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="text-emerald-600" />
                Demo Request Pipeline
              </h3>
              <ArrowUpRight className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={20} />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demoRequestStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Link>

        {/* Platform Overview */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-lg transition-shadow lg:col-span-2">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="text-purple-600" />
            Platform Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={overviewData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#6366f1" name="Total" radius={[8, 8, 0, 0]} />
              <Bar dataKey="approved" fill="#10b981" name="Active/Approved" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 7-Day Growth Trend */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-lg transition-shadow lg:col-span-2">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-600" />
            7-Day Growth Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={growthTrendData}>
              <defs>
                <linearGradient id="colorTutors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorParents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDemos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="tutors" stroke="#6366f1" fillOpacity={1} fill="url(#colorTutors)" name="Tutors" />
              <Area type="monotone" dataKey="parents" stroke="#ec4899" fillOpacity={1} fill="url(#colorParents)" name="Parents" />
              <Area type="monotone" dataKey="demos" stroke="#10b981" fillOpacity={1} fill="url(#colorDemos)" name="Demos" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MapPin className="text-rose-600" />
            Top Cities
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={geographicData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="city" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#f43f5e" radius={[0, 8, 8, 0]}>
                {geographicData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${340 + index * 10}, 70%, ${60 - index * 3}%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Target className="text-indigo-600" />
            Conversion Funnel
          </h3>
          <div className="space-y-3">
            {conversionFunnelData.map((stage, index) => {
              const maxCount = conversionFunnelData[0]?.count || 1;
              const percentage = ((stage.count / maxCount) * 100).toFixed(0);
              return (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-slate-700">{stage.stage}</span>
                    <span className="text-sm font-bold" style={{ color: stage.color }}>{stage.count}</span>
                  </div>
                  <div className="h-10 bg-slate-100 rounded-lg overflow-hidden flex items-center">
                    <div 
                      className="h-full flex items-center justify-end pr-3 text-white font-bold text-sm transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: stage.color,
                        minWidth: stage.count > 0 ? '40px' : '0'
                      }}
                    >
                      {percentage}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ACTIVITY FEED & INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border-2 border-slate-200 shadow-sm">
          <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="text-purple-600" size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Recent Activity</h2>
                <p className="text-slate-500 text-sm mt-1">Latest platform activities</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className={`p-2 rounded-lg bg-slate-100`}>
                    <activity.icon className={activity.color} size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      {activity.user} <span className="font-normal text-slate-600">{activity.action}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-600 font-medium capitalize">
                    {activity.type}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="space-y-6">
          {/* Performance Score */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8" />
              <h3 className="text-xl font-bold">Platform Health</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-indigo-100">Overall Score</span>
                <span className="text-3xl font-black">
                  {Math.round(((stats?.tutors.approved || 0) / Math.max(stats?.tutors.total || 1, 1)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.round(((stats?.tutors.approved || 0) / Math.max(stats?.tutors.total || 1, 1)) * 100)}%` }}
                />
              </div>
              <p className="text-sm text-indigo-100 mt-2">
                Approval rate and system performance
              </p>
            </div>
          </div>

          {/* Top Metrics */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Star className="text-amber-500" size={20} />
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600 font-medium">Pending Reviews</span>
                <span className="text-lg font-black text-slate-900">{stats?.tutors.pending || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600 font-medium">Active Demos</span>
                <span className="text-lg font-black text-slate-900">{stats?.demoRequests.contacted || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600 font-medium">Conversion Rate</span>
                <span className="text-lg font-black text-emerald-600">{stats?.demoRequests.conversionRate || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MONETIZATION CTA */}
      <Link href="/admin/monetization">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-10 h-10" />
                <h2 className="text-3xl font-black">Monetization Analytics</h2>
              </div>
              <p className="text-amber-50 text-lg mb-4">
                View detailed revenue reports, subscription analytics, and credit sales performance
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-xs text-amber-100 uppercase tracking-wide">Revenue Trends</p>
                  <p className="text-2xl font-bold">📈</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-xs text-amber-100 uppercase tracking-wide">Credit Analytics</p>
                  <p className="text-2xl font-bold">⚡</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-xs text-amber-100 uppercase tracking-wide">Subscription Data</p>
                  <p className="text-2xl font-bold">👥</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 group-hover:bg-white/30 transition-all">
                <ArrowUpRight className="w-12 h-12 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* RECENT TUTORS */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm">
          <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Recent Tutors</h2>
              <p className="text-slate-500 text-sm mt-1">Latest tutor registrations</p>
            </div>
            <Link 
              href="/admin/applications"
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
            >
              View All
              <ArrowUpRight size={16} />
            </Link>
          </div>
          
          <div className="divide-y-2 divide-slate-100">
            {tutors.slice(0, 5).map((tutor) => (
              <Link
                key={tutor._id}
                href={`/admin/applications/${tutor._id}`}
                className="p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors group"
              >
                {/* Avatar */}
                {tutor.profileImage ? (
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md border-2 border-slate-200 flex-shrink-0">
                    <Image 
                      src={tutor.profileImage}
                      alt={tutor.fullName}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-black shadow-md flex-shrink-0">
                    {tutor.fullName.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                    {tutor.fullName}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Mail size={12} />
                    <span className="truncate">{tutor.email}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex-shrink-0">
                  <StatusBadge status={tutor.status} />
                </div>
              </Link>
            ))}
            
            {tutors.length === 0 && (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No tutors found</p>
              </div>
            )}
          </div>
        </div>

        {/* RECENT PARENTS */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm">
          <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Recent Parents</h2>
              <p className="text-slate-500 text-sm mt-1">Latest parent registrations</p>
            </div>
            <Link 
              href="/admin/parents"
              className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold text-sm"
            >
              View All
              <ArrowUpRight size={16} />
            </Link>
          </div>
          
          <div className="divide-y-2 divide-slate-100">
            {parents.slice(0, 5).map((parent) => (
              <div
                key={parent._id}
                className="p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-lg font-black shadow-md flex-shrink-0">
                  {parent.fullName.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate">
                    {parent.fullName}
                  </p>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Mail size={12} />
                      <span className="truncate">{parent.email}</span>
                    </div>
                    {parent.location?.city && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin size={12} />
                        <span>{parent.location.city}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone */}
                {parent.phone && (
                  <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg flex-shrink-0">
                    <Phone size={12} />
                    <span className="font-mono">{parent.phone}</span>
                  </div>
                )}
              </div>
            ))}
            
            {parents.length === 0 && (
              <div className="p-12 text-center">
                <UserPlus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No parents found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <h2 className="text-3xl font-black mb-2">Quick Actions</h2>
        <p className="text-indigo-100 mb-6">Navigate to key admin sections</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            label="Applications"
            icon={FileText}
            href="/admin/applications"
          />
          <QuickActionButton
            label="Demo Requests"
            icon={Calendar}
            href="/admin/parent-demo-requests"
          />
          <QuickActionButton
            label="Messages"
            icon={MessageSquare}
            href="/admin/contact-messages"
          />
          <QuickActionButton
            label="Team"
            icon={Users}
            href="/admin/team"
          />
        </div>
      </div>
    </div>
  );
}

/* ======================
   STAT CARD WITH GROWTH
====================== */
function StatCardWithGrowth({ 
  title, 
  value, 
  icon: Icon, 
  gradient, 
  subtitle,
  growth,
  link 
}: { 
  title: string; 
  value: number; 
  icon: any; 
  gradient: string;
  subtitle?: string;
  growth: number;
  link?: string;
}) {
  const isPositive = growth >= 0;
  const GrowthIcon = isPositive ? TrendingUp : TrendingDown;
  
  const content = (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all hover:scale-105 cursor-pointer group relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-full -mr-16 -mt-16`} />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{title}</p>
          <div className="flex items-baseline gap-2 mt-3">
            <p className="text-4xl font-black text-slate-900">{value}</p>
            {growth !== 0 && (
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${
                isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}>
                <GrowthIcon size={12} />
                {Math.abs(growth)}%
              </div>
            )}
          </div>
          {subtitle && (
            <p className="mt-2 text-xs text-slate-500 font-medium">{subtitle}</p>
          )}
        </div>
        <div className={`bg-gradient-to-br ${gradient} p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );

  return link ? <Link href={link}>{content}</Link> : content;
}

/* ======================
   STAT CARD
====================== */
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  gradient, 
  subtitle,
  link 
}: { 
  title: string; 
  value: number; 
  icon: any; 
  gradient: string;
  subtitle?: string;
  link?: string;
}) {
  const content = (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all hover:scale-105 cursor-pointer group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{title}</p>
          <p className="mt-3 text-4xl font-black text-slate-900">{value}</p>
          {subtitle && (
            <p className="mt-2 text-xs text-slate-500 font-medium">{subtitle}</p>
          )}
        </div>
        <div className={`bg-gradient-to-br ${gradient} p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );

  return link ? <Link href={link}>{content}</Link> : content;
}

/* ======================
   MINI STAT CARD
====================== */
function MiniStatCard({ 
  title, 
  value, 
  icon: Icon,
  color
}: { 
  title: string; 
  value: number; 
  icon: any;
  color: 'amber' | 'rose' | 'emerald' | 'blue' | 'purple';
}) {
  const colors = {
    amber: 'from-amber-500 to-orange-500',
    rose: 'from-rose-500 to-pink-500',
    emerald: 'from-emerald-500 to-teal-500',
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`bg-gradient-to-br ${colors[color]} p-3 rounded-lg shadow-md`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-slate-600 font-medium">{title}</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}

/* ======================
   QUICK ACTION BUTTON
====================== */
function QuickActionButton({ 
  label, 
  icon: Icon, 
  href 
}: { 
  label: string; 
  icon: any; 
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-3 p-5 bg-white/10 backdrop-blur hover:bg-white/20 rounded-xl transition-all hover:scale-105 border-2 border-white/20"
    >
      <Icon className="w-8 h-8" />
      <span className="font-bold text-sm">{label}</span>
    </Link>
  );
}
