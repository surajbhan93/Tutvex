"use client";

import { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import {
  Users,
  ClipboardList,
  FileCheck,
  IndianRupee,
  TrendingUp,
  CreditCard,
  Zap,
  Award,
  Wallet,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import Link from "next/link";

/* =========================
   TYPES
========================= */
type Tutor = {
  fullName: string;
  email: string;
  subjects: string[];
  rating: number;
  price: number;
};

type SubscriptionPlan = {
  name: string;
  slug: string;
  price: number;
  features: any;
};

type Subscription = {
  planId: SubscriptionPlan;
  status: string;
  expiryDate: string;
};

type CreditWallet = {
  availableCredits: number;
  usedCredits: number;
  totalEarned: number;
};

type WalletSummary = {
  wallet: {
    availableBalance: number;
    totalEarned: number;
    totalWithdrawn: number;
    totalCommissionPaid: number;
  };
  credits: CreditWallet;
  conversions: {
    active: number;
    total: number;
  };
};

type LeadStats = {
  newLeads: number;
  myLeads: number;
};

const DashboardHomePage = () => {
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [walletSummary, setWalletSummary] = useState<WalletSummary | null>(null);
  const [leadStats, setLeadStats] = useState<LeadStats>({ newLeads: 0, myLeads: 0 });
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [tutorRes, subscriptionRes, walletRes, marketplaceRes, myLeadsRes] =
          await Promise.all([
            api.get("/tutor/me"),
            api.get("/subscription/current"),
            api.get("/wallet/summary"),
            api.get("/leads/marketplace"),
            api.get("/leads/my-leads"),
          ]);

        setTutor(tutorRes.data.data);
        setSubscription(subscriptionRes.data.data);
        setWalletSummary(walletRes.data.data);
        setLeadStats({
          newLeads: Array.isArray(marketplaceRes.data.data)
            ? marketplaceRes.data.data.length
            : 0,
          myLeads: Array.isArray(myLeadsRes.data.data) ? myLeadsRes.data.data.length : 0,
        });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const currentPlan = subscription?.planId?.name || "Free";
  const planBadgeColor =
    currentPlan === "Premium"
      ? "bg-gradient-to-r from-amber-500 to-yellow-500"
      : currentPlan === "Pro"
      ? "bg-gradient-to-r from-purple-500 to-indigo-600"
      : currentPlan === "Starter"
      ? "bg-gradient-to-r from-blue-500 to-cyan-500"
      : "bg-gradient-to-r from-gray-400 to-gray-500";

  return (
    <div className="space-y-8">
      {/* WELCOME HEADER */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Welcome back, {tutor?.fullName || "Tutor"}! 👋
            </h1>
            <p className="mt-2 text-indigo-100">
              Here's your subscription and monetization overview
            </p>
          </div>
          <div className={`rounded-xl px-6 py-3 ${planBadgeColor} shadow-lg`}>
            <p className="text-sm font-medium">Current Plan</p>
            <p className="text-2xl font-bold">{currentPlan}</p>
          </div>
        </div>
      </div>

      {/* MONETIZATION CARDS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Current Plan */}
        <Link href="/tutor/subscription">
          <MonetizationCard
            title="Current Plan"
            value={currentPlan}
            subtitle={
              subscription?.status === "active"
                ? `Expires: ${new Date(subscription.expiryDate).toLocaleDateString()}`
                : "Inactive"
            }
            icon={Award}
            color="indigo"
          />
        </Link>

        {/* Available Credits */}
        <Link href="/tutor/credits">
          <MonetizationCard
            title="Available Credits"
            value={walletSummary?.credits?.availableCredits ?? 0}
            subtitle={`Used: ${walletSummary?.credits?.usedCredits ?? 0}`}
            icon={Zap}
            color="yellow"
          />
        </Link>

        {/* New Leads */}
        <Link href="/tutor/leads/marketplace">
          <MonetizationCard
            title="New Leads"
            value={leadStats.newLeads}
            subtitle="Available to unlock"
            icon={Eye}
            color="green"
          />
        </Link>

        {/* Total Earnings */}
        <Link href="/tutor/wallet">
          <MonetizationCard
            title="Earnings"
            value={`₹${walletSummary?.wallet?.availableBalance ?? 0}`}
            subtitle={`Total: ₹${walletSummary?.wallet?.totalEarned ?? 0}`}
            icon={Wallet}
            color="purple"
          />
        </Link>
      </div>

      {/* SECONDARY STATS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          title="My Leads"
          value={leadStats.myLeads}
          icon={ClipboardList}
          link="/tutor/leads/my-leads"
        />
        <StatCard
          title="Active Conversions"
          value={walletSummary?.conversions?.active ?? 0}
          icon={Users}
        />
        <StatCard
          title="Total Commission Paid"
          value={`₹${walletSummary?.wallet?.totalCommissionPaid ?? 0}`}
          icon={IndianRupee}
        />
      </div>

      {/* QUICK ACTIONS */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border">
        <h2 className="mb-4 text-xl font-semibold text-slate-800">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Link href="/tutor/subscription">
            <button className="w-full rounded-xl border-2 border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition">
              Upgrade Plan
            </button>
          </Link>
          <Link href="/tutor/credits">
            <button className="w-full rounded-xl border-2 border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-medium text-yellow-700 hover:bg-yellow-100 transition">
              Buy Credits
            </button>
          </Link>
          <Link href="/tutor/leads/marketplace">
            <button className="w-full rounded-xl border-2 border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 hover:bg-green-100 transition">
              Browse Leads
            </button>
          </Link>
          <Link href="/tutor/analytics">
            <button className="w-full rounded-xl border-2 border-purple-200 bg-purple-50 px-4 py-3 text-sm font-medium text-purple-700 hover:bg-purple-100 transition">
              View Analytics
            </button>
          </Link>
        </div>
      </div>

      {/* FEATURE HIGHLIGHT */}
      {subscription?.planId?.slug === "free" && (
        <div className="rounded-2xl bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-yellow-500 p-3">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-800">
                Unlock More with Premium Plans!
              </h3>
              <p className="mt-1 text-slate-600">
                Get more credits, priority matching, featured profile, and exclusive benefits.
              </p>
              <Link href="/tutor/subscription">
                <button className="mt-4 rounded-xl bg-yellow-500 px-6 py-2 text-sm font-medium text-white hover:bg-yellow-600 transition">
                  View Plans
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================
   MONETIZATION CARD
========================= */
const MonetizationCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  color: "indigo" | "yellow" | "green" | "purple";
}) => {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    yellow: "bg-yellow-50 text-yellow-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="group cursor-pointer rounded-2xl bg-white p-6 shadow-sm border hover:shadow-lg transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className={`rounded-xl p-3 ${colorMap[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

/* =========================
   STAT CARD
========================= */
const StatCard = ({
  title,
  value,
  icon: Icon,
  link,
}: {
  title: string;
  value: string | number;
  icon: any;
  link?: string;
}) => {
  const content = (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm border hover:shadow-md transition-all">
      <div className="rounded-xl bg-slate-50 p-3">
        <Icon className="h-6 w-6 text-slate-600" />
      </div>
      <div>
        <h3 className="text-sm text-slate-500">{title}</h3>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );

  return link ? <Link href={link}>{content}</Link> : content;
};

export default DashboardHomePage;
