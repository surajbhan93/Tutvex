import { useEffect, useState } from "react";
import TutorDashboardLayout from "@/components/tutor-dashboard/TutorDashboardLayout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import api from "@/lib/apiClient";
import { Zap, ShoppingCart, Calendar, TrendingUp, Check, LayoutDashboard } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type CreditWallet = {
  availableCredits: number;
  usedCredits: number;
  totalEarned: number;
  totalPurchased: number;
  freeCreditsAvailable?: number;
  freeCreditsTotal?: number;
  purchasedCreditsAvailable?: number;
};

type CreditTransaction = {
  _id: string;
  credits: number;
  amount: number;
  transactionType: string;
  status: string;
  description: string;
  createdAt: string;
};

type CreditPackage = {
  id: string;
  name: string;
  credits: number;
  price: number;
  perCreditCost: number;
  popular?: boolean;
};

const packages: CreditPackage[] = [
  {
    id: "basic",
    name: "Basic",
    credits: 10,
    price: 199,
    perCreditCost: 19.9,
  },
  {
    id: "standard",
    name: "Standard",
    credits: 30,
    price: 499,
    perCreditCost: 16.6,
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    credits: 75,
    price: 999,
    perCreditCost: 13.3,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    credits: 150,
    price: 1799,
    perCreditCost: 12,
  },
];

const CreditsPage = () => {
  const [wallet, setWallet] = useState<CreditWallet | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [walletRes, transactionsRes] = await Promise.all([
        api.get("/wallet/credits"),
        api.get("/wallet/credit-transactions?limit=20"),
      ]);

      setWallet(walletRes.data.data);
      setTransactions(transactionsRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch credit data", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (pkg: CreditPackage) => {
    try {
      setPurchasing(true);

      // Create order
      const orderRes = await api.post("/wallet/credits/create-order", {
        packageType: pkg.id,
      });

      const { orderId, amount, credits, razorpayKeyId } = orderRes.data.data;

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: razorpayKeyId,
          amount: amount * 100,
          currency: "INR",
          name: "Tutvex",
          description: `${credits} Lead Credits`,
          order_id: orderId,
          handler: async (response: any) => {
            try {
              await api.post("/wallet/credits/verify-payment", {
                credits,
                amount,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              alert(`${credits} credits added successfully!`);
              fetchData();
            } catch (error: any) {
              alert(error.response?.data?.message || "Payment verification failed");
            }
          },
          prefill: {
            name: "",
            email: "",
            contact: "",
          },
          theme: {
            color: "#4F46E5",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        setPurchasing(false);
      };
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create order");
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <TutorDashboardLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-4 text-slate-600">Loading credits...</p>
          </div>
        </div>
      </TutorDashboardLayout>
    );
  }

  return (
    <TutorDashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: "Dashboard", href: "/tutor/dashboard", icon: LayoutDashboard },
                { label: "Purchase Credits", icon: Zap },
              ]}
            />
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-slate-900">
              Purchase Lead Credits
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Unlock student enquiries and grow your tutoring business
            </p>
          </div>

          {/* Current Balance */}
          <div className="mb-8">
            <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 p-8 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-100 uppercase tracking-wide">
                    Your Credits Balance
                  </p>
                  <p className="mt-3 text-6xl font-black">
                    {wallet?.availableCredits || 0}
                  </p>
                  <p className="mt-1 text-yellow-100 text-sm">Available Credits</p>
                </div>
                <Zap className="h-20 w-20 text-yellow-200" />
              </div>

              {/* Credit Breakdown */}
              <div className="mt-6 pt-6 border-t border-yellow-400/30 grid grid-cols-3 gap-4">
                {/* Free Credits */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
                    <p className="text-xs font-semibold text-yellow-100 uppercase">Free</p>
                  </div>
                  <p className="text-2xl font-bold">
                    {wallet?.freeCreditsAvailable || 0}<span className="text-sm font-normal text-yellow-200">/{wallet?.freeCreditsTotal || 3}</span>
                  </p>
                </div>

                {/* Purchased Credits */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-blue-300"></div>
                    <p className="text-xs font-semibold text-yellow-100 uppercase">Purchased</p>
                  </div>
                  <p className="text-2xl font-bold">{wallet?.purchasedCreditsAvailable || 0}</p>
                </div>

                {/* Used Credits */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <p className="text-xs font-semibold text-yellow-100 uppercase">Used</p>
                  </div>
                  <p className="text-2xl font-bold">{wallet?.usedCredits || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Packages */}
          <div className="mb-12">
            <h2 className="mb-6 text-center text-2xl font-bold text-slate-900">
              Choose Your Package
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  package={pkg}
                  onPurchase={handlePurchase}
                  purchasing={purchasing}
                />
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-12 rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-center text-2xl font-bold text-slate-900">
              How It Works
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <BenefitCard
                step="1"
                title="Purchase Credits"
                description="Choose a package and buy credits at discounted rates"
              />
              <BenefitCard
                step="2"
                title="Browse Leads"
                description="View matched student enquiries in the marketplace"
              />
              <BenefitCard
                step="3"
                title="Unlock & Connect"
                description="Use credits to unlock contact details and connect with parents"
              />
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-6 text-xl font-semibold text-slate-900">
              Recent Credit Transactions
            </h2>

            {transactions.length === 0 ? (
              <div className="py-12 text-center">
                <Zap className="mx-auto h-16 w-16 text-slate-300" />
                <p className="mt-4 text-slate-600">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((txn) => (
                  <CreditTransactionItem key={txn._id} transaction={txn} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </TutorDashboardLayout>
  );
};

const PackageCard = ({
  package: pkg,
  onPurchase,
  purchasing,
}: {
  package: CreditPackage;
  onPurchase: (pkg: CreditPackage) => void;
  purchasing: boolean;
}) => {
  return (
    <div
      className={`relative rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl ${
        pkg.popular ? "ring-2 ring-yellow-500 scale-105" : ""
      }`}
    >
      {pkg.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 px-4 py-1 text-xs font-semibold text-white">
          BEST VALUE
        </div>
      )}

      <div className="mb-4 flex items-center justify-center">
        <div className="rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 p-4">
          <Zap className="h-8 w-8 text-white" />
        </div>
      </div>

      <h3 className="text-center text-2xl font-bold text-slate-900">
        {pkg.name}
      </h3>

      <div className="my-4 text-center">
        <p className="text-5xl font-bold text-slate-900">₹{pkg.price}</p>
        <p className="mt-2 text-lg font-semibold text-yellow-600">
          {pkg.credits} Credits
        </p>
      </div>

      <div className="mb-4 rounded-lg bg-yellow-50 p-3 text-center">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-yellow-700">
            ₹{pkg.perCreditCost.toFixed(1)}
          </span>{" "}
          per credit
        </p>
      </div>

      <ul className="mb-6 space-y-2">
        <li className="flex items-center gap-2 text-sm text-slate-600">
          <Check className="h-4 w-4 text-green-600" />
          Unlock {pkg.credits} leads
        </li>
        <li className="flex items-center gap-2 text-sm text-slate-600">
          <Check className="h-4 w-4 text-green-600" />
          No expiry
        </li>
        <li className="flex items-center gap-2 text-sm text-slate-600">
          <Check className="h-4 w-4 text-green-600" />
          Instant activation
        </li>
      </ul>

      <button
        onClick={() => onPurchase(pkg)}
        disabled={purchasing}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 py-3 font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
      >
        <ShoppingCart className="h-4 w-4" />
        {purchasing ? "Processing..." : "Buy Now"}
      </button>
    </div>
  );
};

const BenefitCard = ({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) => (
  <div className="text-center">
    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-xl font-bold text-white">
      {step}
    </div>
    <h3 className="mb-2 font-semibold text-slate-900">{title}</h3>
    <p className="text-sm text-slate-600">{description}</p>
  </div>
);

const CreditTransactionItem = ({
  transaction,
}: {
  transaction: CreditTransaction;
}) => {
  const isCredit = transaction.credits > 0;

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
      <div className="flex items-center gap-4">
        <div
          className={`rounded-xl p-3 ${
            isCredit ? "bg-green-50" : "bg-red-50"
          }`}
        >
          {isCredit ? (
            <TrendingUp className="h-5 w-5 text-green-600" />
          ) : (
            <Zap className="h-5 w-5 text-red-600" />
          )}
        </div>
        <div>
          <p className="font-medium text-slate-900">{transaction.description}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
            <Calendar className="h-3 w-3" />
            {new Date(transaction.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`text-lg font-bold ${
            isCredit ? "text-green-600" : "text-red-600"
          }`}
        >
          {isCredit ? "+" : ""}
          {Math.abs(transaction.credits)} credits
        </p>
        {transaction.amount > 0 && (
          <p className="text-xs text-slate-500">₹{transaction.amount}</p>
        )}
      </div>
    </div>
  );
};

export default CreditsPage;
