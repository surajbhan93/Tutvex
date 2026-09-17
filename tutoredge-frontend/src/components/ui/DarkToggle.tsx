import { Moon, Sun } from "lucide-react";
import useDarkMode from "@/hooks/useDarkMode";

const DarkToggle = () => {
  const { enabled, toggle } = useDarkMode();

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full bg-white/70 dark:bg-gray-800 shadow"
    >
      {enabled ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default DarkToggle;
