import { motion } from "framer-motion";
import { LogOut, XCircle } from "lucide-react";

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

const LogoutConfirm = ({ onConfirm, onCancel }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
    >
      {/* 🔴 Gradient Header */}
      <div className="bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 px-6 py-5 text-white">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <LogOut className="h-6 w-6" />
          </div>
        </div>

        <h3 className="mt-3 text-center text-xl font-bold">
          Confirm Logout
        </h3>
      </div>

      {/* BODY */}
      <div className="px-6 py-6 text-center">
        <p className="text-sm text-gray-600">
          Are you sure you want to logout from the admin panel?
        </p>

        <p className="mt-2 text-xs text-gray-400">
          You will need to login again to access the dashboard.
        </p>

        {/* ACTIONS */}
        <div className="mt-6 flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <XCircle className="h-4 w-4" />
            Cancel
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConfirm}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-red-700 hover:to-pink-700"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default LogoutConfirm;
