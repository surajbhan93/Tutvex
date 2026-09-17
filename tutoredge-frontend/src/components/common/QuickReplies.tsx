import { MessageCircle, IndianRupee, UserPlus, Phone } from "lucide-react";

type Role = "guest" | "parent" | "student" | "tutor" | "admin";

type QuickRepliesProps = {
  role: Role;
  onSelect: (text: string) => void;
};

const BUTTONS: Record<Role, { label: string; value: string; icon: JSX.Element }[]> = {
  guest: [
    { label: "💰 Fees", value: "fees", icon: <IndianRupee size={14} /> },
    { label: "👨‍🏫 Become Tutor", value: "tutor kaise bane", icon: <UserPlus size={14} /> },
    { label: "📞 Contact", value: "contact", icon: <Phone size={14} /> },
  ],

  parent: [
    { label: "🔍 Find Tutor", value: "find tutor", icon: <UserPlus size={14} /> },
    { label: "💰 Fees", value: "fees", icon: <IndianRupee size={14} /> },
    { label: "🎁 Cashback", value: "cashback", icon: <IndianRupee size={14} /> },
  ],

  student: [
    { label: "🔍 Find Tutor", value: "find tutor", icon: <UserPlus size={14} /> },
    { label: "💰 Fees", value: "fees", icon: <IndianRupee size={14} /> },
    { label: "🎁 Cashback", value: "cashback", icon: <IndianRupee size={14} /> },
  ],

  tutor: [
    { label: "📝 Selection", value: "selection process", icon: <UserPlus size={14} /> },
    { label: "💵 Earnings", value: "tutor earning", icon: <IndianRupee size={14} /> },
    { label: "📄 Documents", value: "documents verification", icon: <UserPlus size={14} /> },
  ],

  admin: [],
};

export default function QuickReplies({ role, onSelect }: QuickRepliesProps) {
  const buttons = BUTTONS[role] || [];

  return (
    <div className="flex flex-wrap gap-2 p-2 border-t bg-gray-50">
      {buttons.map((btn) => (
        <button
          key={btn.value}
          onClick={() => onSelect(btn.value)}
          className="flex items-center gap-1 rounded-full border border-green-500 px-3 py-1 text-sm text-green-600
                     hover:bg-green-500 hover:text-white hover:scale-105 transition-all"
        >
          {btn.icon}
          {btn.label}
        </button>
      ))}

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919305275932"
        target="_blank"
        className="flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-sm text-white
                   hover:scale-105 transition-all"
      >
        <MessageCircle size={14} />
        WhatsApp
      </a>
    </div>
  );
}
