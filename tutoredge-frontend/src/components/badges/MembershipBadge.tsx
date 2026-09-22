import React from "react";

export type MembershipType = "free" | "subscription" | "revenue_share";
export type PlanSlug = "free" | "starter" | "pro" | "premium";

interface MembershipBadgeProps {
  membershipType?: MembershipType;
  currentPlanSlug?: PlanSlug;
  revenueSharePercentage?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const MembershipBadge: React.FC<MembershipBadgeProps> = ({
  membershipType = "free",
  currentPlanSlug = "free",
  revenueSharePercentage = 0,
  size = "md",
  showLabel = true,
}) => {
  // Revenue Share Badge
  if (membershipType === "revenue_share") {
    return (
      <div
        className={`
          inline-flex items-center gap-1.5 rounded-full border
          bg-emerald-100 text-emerald-700 border-emerald-200
          ${size === "sm" ? "px-2 py-0.5 text-xs" : ""}
          ${size === "md" ? "px-3 py-1 text-sm" : ""}
          ${size === "lg" ? "px-4 py-1.5 text-base" : ""}
          font-semibold shadow-sm
        `}
      >
        <span className={size === "sm" ? "text-xs" : "text-sm"}>🤝</span>
        {showLabel && <span>Revenue Share</span>}
        {revenueSharePercentage > 0 && size !== "sm" && (
          <span className="text-xs opacity-75">({revenueSharePercentage}%)</span>
        )}
      </div>
    );
  }

  // Subscription Badges
  const badgeConfig: Record<
    PlanSlug,
    { label: string; icon: string; color: string; bgColor: string; borderColor: string }
  > = {
    free: {
      label: "Free",
      icon: "⚡",
      color: "text-slate-600",
      bgColor: "bg-slate-100",
      borderColor: "border-slate-200",
    },
    starter: {
      label: "Starter",
      icon: "⭐",
      color: "text-blue-700",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200",
    },
    pro: {
      label: "Pro",
      icon: "✨",
      color: "text-purple-700",
      bgColor: "bg-purple-100",
      borderColor: "border-purple-200",
    },
    premium: {
      label: "Premium",
      icon: "👑",
      color: "text-amber-700",
      bgColor: "bg-amber-100",
      borderColor: "border-amber-200",
    },
  };

  const config = badgeConfig[currentPlanSlug] || badgeConfig.free;

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 rounded-full border
        ${config.bgColor} ${config.color} ${config.borderColor}
        ${size === "sm" ? "px-2 py-0.5 text-xs" : ""}
        ${size === "md" ? "px-3 py-1 text-sm" : ""}
        ${size === "lg" ? "px-4 py-1.5 text-base" : ""}
        font-semibold shadow-sm
      `}
    >
      <span className={size === "sm" ? "text-xs" : "text-sm"}>{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </div>
  );
};

export default MembershipBadge;
