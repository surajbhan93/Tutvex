import { useEffect, useState } from "react";
import TutorDashboardLayout from "@/components/tutor-dashboard/TutorDashboardLayout";
import api from "@/lib/apiClient";
import { useAuthStore } from "@/stores/useAuthStore";
import toast from "react-hot-toast";
import { 
  Check, Crown, Zap, Star, Sparkles, 
  TrendingUp, Shield, Users, Target,
  CheckCircle2, X, Award, Rocket, Heart, Handshake, Phone
} from "lucide-react";

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
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  
  // Get authenticated user data
  const { user } = useAuthStore();

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
      toast.error("Failed to load subscription plans");
    } finally {
      setLoading(false);
    }
  };

  const handleActivateFreePlan = async () => {
    try {
      setProcessing(true);
      await api.post("/subscription/activate-free");
      toast.success("Free plan activated with 3 free credits!");
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to activate free plan");
    } finally {
      setProcessing(false);
    }
  };

  const handleSubscribe = async (plan: Plan) => {
    if (plan.slug === "free") {
      await handleActivateFreePlan();
      return;
    }

    // Prevent double-click
    if (processing) return;

    try {
      setProcessing(true);
      setProcessingPlanId(plan._id);
      toast.loading("Preparing secure checkout...", { id: "checkout-loading" });

      // Create order
      const orderRes = await api.post("/subscription/create-order", {
        planSlug: plan.slug,
      });

      const { orderId, amount, razorpayKeyId } = orderRes.data.data;

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      toast.dismiss("checkout-loading");

      const options = {
        key: razorpayKeyId,
        amount: amount * 100,
        currency: "INR",
        name: "Tutvex",
        description: `${plan.name} Subscription`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            toast.loading("Verifying payment...", { id: "verify-payment" });
            
            await api.post("/subscription/verify-payment", {
              planSlug: plan.slug,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            toast.dismiss("verify-payment");
            toast.success(`🎉 ${plan.name} plan activated successfully!`);
            
            // Refresh data immediately
            await fetchData();
            
            // Force page refresh to update user membership in navbar/profile
            setTimeout(() => window.location.reload(), 1500);
          } catch (error: any) {
            toast.dismiss("verify-payment");
            toast.error(error.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: "", // Add phone if available in user object
        },
        theme: {
          color: "#4F46E5",
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
            setProcessing(false);
            setProcessingPlanId(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
      // Don't reset processing here - will be reset on success/dismiss
    } catch (error: any) {
      toast.dismiss("checkout-loading");
      toast.error(error.response?.data?.message || "Failed to create order");
      setProcessing(false);
      setProcessingPlanId(null);
    }
  };

  if (loading) {
    return (
      <TutorDashboardLayout>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="text-center">
            <div className="relative mx-auto h-16 w-16">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            </div>
            <p className="mt-6 text-lg font-semibold text-slate-700">Loading plans...</p>
          </div>
        </div>
      </TutorDashboardLayout>
    );
  }

  const currentPlanSlug = currentSubscription?.planId?.slug || null;

  return (
    <TutorDashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient Orbs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/40 to-cyan-200/40 rounded-full blur-3xl animate-float-delayed"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* Header Section */}
          <div className="text-center mb-16 space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/50 shadow-sm">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-700">FLEXIBLE PRICING</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              <span className="block text-slate-900 mb-2">Choose the perfect plan</span>
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                for your tutoring journey
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Join thousands of successful tutors. Get more leads, connect with students, and grow your business.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <span className="font-medium">No hidden fees</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium">Secure payments</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <span className="font-medium">1000+ tutors</span>
              </div>
            </div>
          </div>

          {/* Current Plan Badge */}
          {currentSubscription && (
            <div className="flex justify-center mb-10">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-300/50">
                <Crown className="h-5 w-5 text-white" />
                <div className="text-white">
                  <span className="font-semibold">Current Plan: {currentSubscription.planId.name}</span>
                  {currentSubscription.status === "active" && (
                    <span className="ml-2 text-sm opacity-90">
                      • Expires {new Date(currentSubscription.expiryDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20">
            {plans.map((plan, idx) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                isCurrentPlan={plan.slug === currentPlanSlug}
                onSubscribe={handleSubscribe}
                processing={processing && processingPlanId === plan._id}
                delay={idx * 100}
              />
            ))}
          </div>

          {/* 🤝 REVENUE-SHARE SECTION */}
          <div className="mb-20">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-2 border-emerald-200/50 shadow-xl">
              {/* Decorative Background */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10 p-8 sm:p-12">
                {/* Header */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-200">
                    <Handshake className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                    Prefer the <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">50% Revenue-Share</span> Model?
                  </h2>
                </div>

                {/* Description */}
                <p className="text-center text-lg text-slate-600 mb-8 max-w-3xl mx-auto">
                  Don't want to purchase a subscription? You can also work with Tutvex on a <strong className="text-slate-800">50% revenue-sharing model</strong> (no subscription required).
                </p>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: Target, text: "Relevant student opportunities" },
                    { icon: Users, text: "Student–tutor matching support" },
                    { icon: Phone, text: "Parent connection when lead available" },
                    { icon: TrendingUp, text: "50% revenue share (no subscription)" },
                    { icon: Shield, text: "Tutvex support & guidance" },
                    { icon: CheckCircle2, text: "No upfront investment needed" },
                  ].map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white/80 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex-shrink-0 p-2 rounded-lg bg-emerald-100">
                        <benefit.icon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <span className="text-slate-700 font-medium">{benefit.text}</span>
                    </div>
                  ))}
                </div>

                {/* Important Notice */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200/50 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-amber-100">
                      <Star className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-amber-900 mb-2">
                        ⭐ Important Notice
                      </h3>
                      <p className="text-amber-800 mb-3 leading-relaxed">
                        <strong>Subscription tutors get priority access</strong> to student leads and matching opportunities, plus they pay only <strong className="text-amber-900">30% revenue share for the first month</strong>.
                      </p>
                      <p className="text-amber-700 text-sm leading-relaxed">
                        Revenue-share tutors (without subscription) may receive opportunities based on lead availability and matching criteria with <strong>50% revenue share</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                  <a 
                    href="https://wa.me/919335999333?text=Hi%20Tutvex%2C%20I%27m%20interested%20in%20the%2050%25%20revenue-share%20model%20(without%20subscription).%20Please%20share%20more%20details."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    <Handshake className="h-6 w-6" />
                    Contact Tutvex
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                  </a>
                  <p className="mt-4 text-sm text-slate-500">
                    Our team will get in touch within 24 hours • WhatsApp: +91 93359 99333
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Comparison Table */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                Compare all features
              </h2>
              <p className="text-slate-600 text-lg">
                Everything you need to know about what's included
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                    <tr className="border-b-2 border-slate-200">
                      <th className="px-6 py-5 text-left text-sm font-bold text-slate-900 sticky left-0 bg-gradient-to-r from-slate-50 to-slate-100 z-10">
                        Features
                      </th>
                      {plans.map((plan) => (
                        <th key={plan._id} className="px-6 py-5 text-center min-w-[140px]">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-bold text-slate-900">{plan.name}</span>
                            <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                              ₹{plan.price}
                            </span>
                            <span className="text-xs text-slate-500">per month</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <FeatureRow
                      feature="Monthly Credits"
                      values={plans.map((p) => p.monthlyCredits.toString())}
                      highlight
                    />
                    <FeatureRow
                      feature="Featured Profile"
                      values={plans.map((p) => p.features.featuredProfile)}
                    />
                    <FeatureRow
                      feature="Direct Contact Access"
                      values={plans.map((p) => p.features.contactAccess)}
                    />
                    <FeatureRow
                      feature="Analytics Dashboard"
                      values={plans.map((p) => p.features.analyticsAccess)}
                    />
                    <FeatureRow
                      feature="Priority Lead Matching"
                      values={plans.map((p) => p.features.priorityMatching)}
                    />
                    <FeatureRow
                      feature="WhatsApp Integration"
                      values={plans.map((p) => p.features.whatsappAccess)}
                    />
                    <FeatureRow
                      feature="Verified Badge"
                      values={plans.map((p) => p.features.verifiedBadge)}
                    />
                    <FeatureRow
                      feature="24/7 Support"
                      values={plans.map((p) => p.features.dedicatedSupport)}
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className="mt-20 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50">
              <Heart className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold text-green-700">Loved by 1000+ tutors</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Still have questions?
            </h3>
            
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              All plans include secure payments, instant activation, and 24/7 customer support. 
              Switch plans anytime without any hassle.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button className="px-6 py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-semibold hover:border-indigo-300 hover:shadow-lg transition-all">
                Contact Support
              </button>
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-xl transition-all">
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(5deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-30px, 30px) rotate(-5deg); }
          66% { transform: translate(20px, -20px) rotate(5deg); }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }
      `}</style>
    </TutorDashboardLayout>
  );
};

const PlanCard = ({
  plan,
  isCurrentPlan,
  onSubscribe,
  processing,
  delay = 0,
}: {
  plan: Plan;
  isCurrentPlan: boolean;
  onSubscribe: (plan: Plan) => void;
  processing: boolean;
  delay?: number;
}) => {
  const planConfig: Record<string, any> = {
    free: {
      icon: Zap,
      gradient: "from-slate-600 to-slate-800",
      badgeColor: "bg-slate-100 text-slate-700",
      buttonGradient: "from-slate-600 to-slate-700",
      borderColor: "border-slate-200",
      shadowColor: "hover:shadow-slate-200/50",
    },
    starter: {
      icon: Star,
      gradient: "from-blue-500 to-cyan-600",
      badgeColor: "bg-blue-100 text-blue-700",
      buttonGradient: "from-blue-500 to-cyan-600",
      borderColor: "border-blue-200",
      shadowColor: "hover:shadow-blue-300/50",
    },
    pro: {
      icon: Sparkles,
      gradient: "from-purple-600 to-indigo-600",
      badgeColor: "bg-purple-100 text-purple-700",
      buttonGradient: "from-purple-600 to-indigo-600",
      borderColor: "border-purple-300",
      shadowColor: "hover:shadow-purple-400/60",
      popular: true,
    },
    premium: {
      icon: Crown,
      gradient: "from-amber-500 to-yellow-600",
      badgeColor: "bg-amber-100 text-amber-700",
      buttonGradient: "from-amber-500 to-yellow-600",
      borderColor: "border-amber-300",
      shadowColor: "hover:shadow-amber-300/60",
      bestValue: true,
    },
  };

  const config = planConfig[plan.slug] || planConfig.free;
  const Icon = config.icon;

  return (
    <div 
      className="relative h-full"
      style={{ 
        animation: `slideUp 0.6s ease-out ${delay}ms forwards`,
        opacity: 0 
      }}
    >
      {/* Popular/Best Value Badge */}
      {config.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur-md"></div>
            <div className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
              <Target className="h-3.5 w-3.5 text-white" />
              <span className="text-xs font-bold text-white tracking-wide">MOST POPULAR</span>
            </div>
          </div>
        </div>
      )}

      {config.bestValue && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full blur-md"></div>
            <div className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 shadow-lg">
              <Award className="h-3.5 w-3.5 text-white" />
              <span className="text-xs font-bold text-white tracking-wide">BEST VALUE</span>
            </div>
          </div>
        </div>
      )}

      {/* Card */}
      <div 
        className={`
          relative h-full bg-white rounded-2xl p-6 sm:p-8 
          border-2 ${config.borderColor}
          shadow-lg ${config.shadowColor}
          transition-all duration-300 
          hover:-translate-y-2
          ${config.popular ? 'scale-105 ring-2 ring-purple-400/30' : ''}
          ${config.bestValue ? 'ring-2 ring-amber-400/30' : ''}
        `}
      >
        {/* Icon */}
        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg mb-6`}>
          <Icon className="h-6 w-6 text-white" />
        </div>

        {/* Plan Name */}
        <h3 className="text-2xl font-bold text-slate-900 mb-4">{plan.name}</h3>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className={`text-5xl font-extrabold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
              ₹{plan.price}
            </span>
            <span className="text-slate-500">/mo</span>
          </div>
          
          {/* Credits Badge */}
          <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full ${config.badgeColor}`}>
            <Zap className="h-3.5 w-3.5" />
            <span className="text-sm font-bold">{plan.monthlyCredits} credits</span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {[
            { key: 'featuredProfile', label: 'Featured Profile' },
            { key: 'contactAccess', label: 'Contact Access' },
            { key: 'priorityMatching', label: 'Priority Matching' },
            { key: 'analyticsAccess', label: 'Analytics' },
            { key: 'whatsappAccess', label: 'WhatsApp' },
            { key: 'verifiedBadge', label: 'Verified Badge' },
            { key: 'dedicatedSupport', label: '24/7 Support' },
          ].map(({ key, label }) => {
            const hasFeature = plan.features[key as keyof typeof plan.features];
            return (
              <li key={key} className="flex items-center gap-2.5">
                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                  hasFeature ? 'bg-green-100' : 'bg-slate-100'
                }`}>
                  {hasFeature ? (
                    <Check className="h-3 w-3 text-green-600 stroke-[3]" />
                  ) : (
                    <X className="h-3 w-3 text-slate-400" />
                  )}
                </div>
                <span className={`text-sm ${hasFeature ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                  {label}
                </span>
              </li>
            );
          })}
        </ul>

        {/* CTA Button */}
        <button
          onClick={() => onSubscribe(plan)}
          disabled={processing || isCurrentPlan}
          className={`
            w-full py-3.5 rounded-xl font-semibold text-base
            transition-all duration-300
            ${isCurrentPlan
              ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
              : `bg-gradient-to-r ${config.buttonGradient} text-white shadow-md hover:shadow-xl hover:scale-105 active:scale-95`
            }
          `}
        >
          {isCurrentPlan ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Active Plan
            </span>
          ) : processing ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Get Started
              <Rocket className="h-4 w-4" />
            </span>
          )}
        </button>

        {/* Bottom Note */}
        {!isCurrentPlan && (
          <p className="text-xs text-center text-slate-500 mt-4">
            Cancel anytime • No hidden fees
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const FeatureRow = ({
  feature,
  values,
  highlight = false,
}: {
  feature: string;
  values: (string | boolean)[];
  highlight?: boolean;
}) => (
  <tr className={`transition-colors hover:bg-slate-50/50 ${highlight ? 'bg-indigo-50/30' : ''}`}>
    <td className={`px-6 py-5 text-sm font-semibold text-slate-800 sticky left-0 bg-white ${highlight ? 'bg-indigo-50/30' : ''}`}>
      <div className="flex items-center gap-2">
        {highlight && <Star className="h-4 w-4 text-indigo-600" />}
        {feature}
      </div>
    </td>
    {values.map((value, idx) => (
      <td key={idx} className="px-6 py-5 text-center">
        {typeof value === "boolean" ? (
          value ? (
            <div className="inline-flex items-center justify-center">
              <div className="p-1.5 rounded-full bg-green-100 transform hover:scale-110 transition-transform">
                <Check className="h-5 w-5 text-green-600 stroke-[3]" />
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center justify-center">
              <X className="h-5 w-5 text-slate-300" />
            </div>
          )
        ) : (
          <span className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-bold ${
            highlight 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
              : 'bg-slate-100 text-slate-700'
          }`}>
            {value} {highlight && <Zap className="ml-1 h-4 w-4" />}
          </span>
        )}
      </td>
    ))}
  </tr>
);

export default SubscriptionPage;
