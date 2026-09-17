import { useEffect, useState } from "react";
import TutorDashboardLayout from "@/components/tutor-dashboard/TutorDashboardLayout";
import api from "@/lib/apiClient";
import { Check, Crown, Zap, Star, Sparkles } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Plan = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  monthlyCredits: number;
  features: {
    featuredProfile: boolean;
    contactAccess: boolean;
    analyticsAccess: boolean;
    priorityMatching: boolean;
    whatsappAccess: boolean;
    verifiedBadge: boolean;
    proBadge: boolean;
    premiumBadge: boolean;
    dedicatedSupport: boolean;
  };
};

type Subscription = {
  planId: { name: string; slug: string };
  status: string;
  expiryDate: string;
};

const SubscriptionPage = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansRes, subscriptionRes] = await Promise.all([
        api.get("/subscription/plans"),
        api.get("/subscription/current"),
      ]);

      setPlans(plansRes.data.data || []);
      setCurrentSubscription(subscriptionRes.data.data);
    } catch (error) {
      console.error("Failed to fetch subscription data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateFreePlan = async () => {
    try {
      setProcessing(true);
      await api.post("/subscription/activate-free");
      alert("Free plan activated with 3 free credits!");
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to activate free plan");
    } finally {
      setProcessing(false);
    }
  };

  const handleSubscribe = async (plan: Plan) => {
    if (plan.slug === "free") {
      await handleActivateFreePlan();
      return;
    }

    try {
      setProcessing(true);

      // Create order
      const orderRes = await api.post("/subscription/create-order", {
        planSlug: plan.slug,
      });

      const { orderId, amount, razorpayKeyId } = orderRes.data.data;

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
          description: `${plan.name} Subscription`,
          order_id: orderId,
          handler: async (response: any) => {
            try {
              await api.post("/subscription/verify-payment", {
                planSlug: plan.slug,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              alert("Subscription activated successfully!");
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
        setProcessing(false);
      };
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create order");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <TutorDashboardLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-4 text-slate-600">Loading plans...</p>
          </div>
        </div>
      </TutorDashboardLayout>
    );
  }

  const currentPlanSlug = currentSubscription?.planId?.slug || null;

  return (
    <TutorDashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-slate-900">
              Choose Your Perfect Plan
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Unlock more leads, get priority matching, and grow your tutoring business
            </p>
          </div>

          {/* Current Plan Badge */}
          {currentSubscription && (
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-6 py-2 text-sm font-medium text-indigo-700">
                <Crown className="h-4 w-4" />
                Current Plan: {currentSubscription.planId.name}
                {currentSubscription.status === "active" && (
                  <span className="text-xs">
                    (Expires: {new Date(currentSubscription.expiryDate).toLocaleDateString()})
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Plans Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                isCurrentPlan={plan.slug === currentPlanSlug}
                onSubscribe={handleSubscribe}
                processing={processing}
              />
            ))}
          </div>

          {/* Features Comparison */}
          <div className="mt-16">
            <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">
              Feature Comparison
            </h2>
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Feature
                    </th>
                    {plans.map((plan) => (
                      <th
                        key={plan._id}
                        className="px-6 py-4 text-center text-sm font-semibold text-slate-700"
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <FeatureRow
                    feature="Monthly Credits"
                    values={plans.map((p) => p.monthlyCredits.toString())}
                  />
                  <FeatureRow
                    feature="Featured Profile"
                    values={plans.map((p) => p.features.featuredProfile)}
                  />
                  <FeatureRow
                    feature="Contact Access"
                    values={plans.map((p) => p.features.contactAccess)}
                  />
                  <FeatureRow
                    feature="Analytics Dashboard"
                    values={plans.map((p) => p.features.analyticsAccess)}
                  />
                  <FeatureRow
                    feature="Priority Matching"
                    values={plans.map((p) => p.features.priorityMatching)}
                  />
                  <FeatureRow
                    feature="WhatsApp Access"
                    values={plans.map((p) => p.features.whatsappAccess)}
                  />
                  <FeatureRow
                    feature="Verified Badge"
                    values={plans.map((p) => p.features.verifiedBadge)}
                  />
                  <FeatureRow
                    feature="Dedicated Support"
                    values={plans.map((p) => p.features.dedicatedSupport)}
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </TutorDashboardLayout>
  );
};

const PlanCard = ({
  plan,
  isCurrentPlan,
  onSubscribe,
  processing,
}: {
  plan: Plan;
  isCurrentPlan: boolean;
  onSubscribe: (plan: Plan) => void;
  processing: boolean;
}) => {
  const planIcons: any = {
    free: Zap,
    starter: Star,
    pro: Sparkles,
    premium: Crown,
  };

  const planColors: any = {
    free: "from-gray-400 to-gray-500",
    starter: "from-blue-500 to-cyan-500",
    pro: "from-purple-500 to-indigo-600",
    premium: "from-amber-500 to-yellow-500",
  };

  const Icon = planIcons[plan.slug] || Zap;
  const isPopular = plan.slug === "pro";

  return (
    <div
      className={`relative rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl ${
        isPopular ? "ring-2 ring-purple-500 scale-105" : ""
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-1 text-xs font-semibold text-white">
          MOST POPULAR
        </div>
      )}

      <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-r ${planColors[plan.slug]} p-3`}>
        <Icon className="h-6 w-6 text-white" />
      </div>

      <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-slate-900">₹{plan.price}</span>
        <span className="text-slate-500">/month</span>
      </div>

      <p className="mt-2 text-sm text-slate-600">{plan.monthlyCredits} Credits/month</p>

      <ul className="mt-6 space-y-3">
        {plan.features.featuredProfile && (
          <li className="flex items-center gap-2 text-sm text-slate-600">
            <Check className="h-4 w-4 text-green-600" />
            Featured Profile
          </li>
        )}
        {plan.features.priorityMatching && (
          <li className="flex items-center gap-2 text-sm text-slate-600">
            <Check className="h-4 w-4 text-green-600" />
            Priority Matching
          </li>
        )}
        {plan.features.analyticsAccess && (
          <li className="flex items-center gap-2 text-sm text-slate-600">
            <Check className="h-4 w-4 text-green-600" />
            Advanced Analytics
          </li>
        )}
        {plan.features.whatsappAccess && (
          <li className="flex items-center gap-2 text-sm text-slate-600">
            <Check className="h-4 w-4 text-green-600" />
            WhatsApp Access
          </li>
        )}
        {plan.features.dedicatedSupport && (
          <li className="flex items-center gap-2 text-sm text-slate-600">
            <Check className="h-4 w-4 text-green-600" />
            Dedicated Support
          </li>
        )}
      </ul>

      <button
        onClick={() => onSubscribe(plan)}
        disabled={processing || isCurrentPlan}
        className={`mt-8 w-full rounded-xl py-3 font-semibold transition ${
          isCurrentPlan
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : `bg-gradient-to-r ${planColors[plan.slug]} text-white hover:opacity-90`
        }`}
      >
        {isCurrentPlan ? "Current Plan" : processing ? "Processing..." : "Subscribe Now"}
      </button>
    </div>
  );
};

const FeatureRow = ({
  feature,
  values,
}: {
  feature: string;
  values: (string | boolean)[];
}) => (
  <tr>
    <td className="px-6 py-4 text-sm font-medium text-slate-700">{feature}</td>
    {values.map((value, idx) => (
      <td key={idx} className="px-6 py-4 text-center">
        {typeof value === "boolean" ? (
          value ? (
            <Check className="mx-auto h-5 w-5 text-green-600" />
          ) : (
            <span className="text-slate-300">—</span>
          )
        ) : (
          <span className="text-sm font-semibold text-slate-700">{value}</span>
        )}
      </td>
    ))}
  </tr>
);

export default SubscriptionPage;
