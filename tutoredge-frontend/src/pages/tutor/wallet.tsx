import { useEffect, useState } from "react";
import TutorDashboardLayout from "@/components/tutor-dashboard/TutorDashboardLayout";
import api from "@/lib/apiClient";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Download,
  IndianRupee,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

type WalletData = {
  availableBalance: number;
  pendingSettlement: number;
  totalEarned: number;
  totalWithdrawn: number;
  totalCommissionPaid: number;
};

type Transaction = {
  _id: string;
  amount: number;
  transactionType: string;
  status: string;
  description: string;
  createdAt: string;
  metadata?: any;
};

const WalletPage = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const [walletRes, transactionsRes] = await Promise.all([
        api.get("/wallet/balance"),
        api.get("/wallet/transactions?limit=50"),
      ]);

      setWallet(walletRes.data.data);
      setTransactions(transactionsRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch wallet data", error);
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
            <p className="mt-4 text-slate-600">Loading wallet...</p>
          </div>
        </div>
      </TutorDashboardLayout>
    );
  }

  return (
    <TutorDashboardLayout>
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Wallet</h1>
            <p className="mt-2 text-slate-600">
              Manage your earnings and withdrawals
            </p>
          </div>

          {/* Balance Cards */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <BalanceCard
              title="Available Balance"
              amount={wallet?.availableBalance || 0}
              icon={Wallet}
              color="green"
            />
            <BalanceCard
              title="Total Earned"
              amount={wallet?.totalEarned || 0}
              icon={TrendingUp}
              color="blue"
            />
            <BalanceCard
              title="Total Withdrawn"
              amount={wallet?.totalWithdrawn || 0}
              icon={Download}
              color="purple"
            />
            <BalanceCard
              title="Commission Paid"
              amount={wallet?.totalCommissionPaid || 0}
              icon={TrendingDown}
              color="orange"
            />
          </div>

          {/* Withdraw Button */}
          <div className="mb-8">
            <button
              onClick={() => setShowWithdrawModal(true)}
              disabled={(wallet?.availableBalance || 0) < 100}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-teal-600 px-6 py-3 font-semibold text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-5 w-5" />
              Request Withdrawal
            </button>
            <p className="mt-2 text-sm text-slate-500">
              Minimum withdrawal: ₹100
            </p>
          </div>

          {/* Transactions List */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-6 text-xl font-semibold text-slate-900">
              Transaction History
            </h2>

            {transactions.length === 0 ? (
              <div className="py-12 text-center">
                <Wallet className="mx-auto h-16 w-16 text-slate-300" />
                <p className="mt-4 text-slate-600">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((txn) => (
                  <TransactionItem key={txn._id} transaction={txn} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <WithdrawalModal
          availableBalance={wallet?.availableBalance || 0}
          onClose={() => setShowWithdrawModal(false)}
          onSuccess={() => {
            setShowWithdrawModal(false);
            fetchWalletData();
          }}
        />
      )}
    </TutorDashboardLayout>
  );
};

const BalanceCard = ({
  title,
  amount,
  icon: Icon,
  color,
}: {
  title: string;
  amount: number;
  icon: any;
  color: "green" | "blue" | "purple" | "orange";
}) => {
  const colorMap = {
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            ₹{amount.toLocaleString()}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${colorMap[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const typeIcons: any = {
    student_payment: TrendingUp,
    commission_deduction: TrendingDown,
    withdrawal: Download,
    refund: TrendingUp,
    bonus: TrendingUp,
    admin_adjustment: IndianRupee,
  };

  const statusColors: any = {
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-700",
  };

  const statusIcons: any = {
    pending: Clock,
    completed: CheckCircle,
    failed: XCircle,
    cancelled: XCircle,
  };

  const Icon = typeIcons[transaction.transactionType] || IndianRupee;
  const StatusIcon = statusIcons[transaction.status] || Clock;

  const isCredit = transaction.amount > 0;

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
      <div className="flex items-center gap-4">
        <div
          className={`rounded-xl p-3 ${
            isCredit ? "bg-green-50" : "bg-red-50"
          }`}
        >
          <Icon
            className={`h-5 w-5 ${
              isCredit ? "text-green-600" : "text-red-600"
            }`}
          />
        </div>
        <div>
          <p className="font-medium text-slate-900">
            {transaction.description}
          </p>
          <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(transaction.createdAt).toLocaleDateString()}
            </span>
            <span
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${
                statusColors[transaction.status]
              }`}
            >
              <StatusIcon className="h-3 w-3" />
              {transaction.status}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`text-lg font-bold ${
            isCredit ? "text-green-600" : "text-red-600"
          }`}
        >
          {isCredit ? "+" : ""}₹{Math.abs(transaction.amount).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

const WithdrawalModal = ({
  availableBalance,
  onClose,
  onSuccess,
}: {
  availableBalance: number;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [amount, setAmount] = useState("");
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
  });
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const withdrawalAmount = parseFloat(amount);
    if (withdrawalAmount < 100) {
      alert("Minimum withdrawal amount is ₹100");
      return;
    }

    if (withdrawalAmount > availableBalance) {
      alert("Insufficient balance");
      return;
    }

    try {
      setProcessing(true);
      await api.post("/wallet/withdraw", {
        amount: withdrawalAmount,
        bankDetails,
      });
      alert("Withdrawal request submitted! We'll process it within 3-5 business days.");
      onSuccess();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to request withdrawal");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Request Withdrawal
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Available: ₹{availableBalance.toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Withdrawal Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Min. ₹100"
              required
              min="100"
              max={availableBalance}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Bank Details */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Account Holder Name
            </label>
            <input
              type="text"
              value={bankDetails.accountHolderName}
              onChange={(e) =>
                setBankDetails({ ...bankDetails, accountHolderName: e.target.value })
              }
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Account Number
            </label>
            <input
              type="text"
              value={bankDetails.accountNumber}
              onChange={(e) =>
                setBankDetails({ ...bankDetails, accountNumber: e.target.value })
              }
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              IFSC Code
            </label>
            <input
              type="text"
              value={bankDetails.ifscCode}
              onChange={(e) =>
                setBankDetails({ ...bankDetails, ifscCode: e.target.value })
              }
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Bank Name
            </label>
            <input
              type="text"
              value={bankDetails.bankName}
              onChange={(e) =>
                setBankDetails({ ...bankDetails, bankName: e.target.value })
              }
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-300 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="flex-1 rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700 transition disabled:opacity-50"
            >
              {processing ? "Processing..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WalletPage;
