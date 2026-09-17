import { useEffect, useState } from "react";

type Option = { label: string; value: string };

export default function ChatbotPage() {
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  // const [step, setStep] = useState<string | null>(null);

  const [reply, setReply] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [waMsg, setWaMsg] = useState<string | null>(null);
  const [input, setInput] = useState("");

    // ✅ ADD THIS
  useEffect(() => {
    callBot({});
  }, []);
  
 const callBot = async (payload: any) => {
  setLoading(true);
  setWaMsg(null); // 🔥 IMPORTANT RESET


  const res = await fetch("/api/chatbot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  setReply(data.reply || "");
  setOptions(data.options || []);
  setWaMsg(data.whatsappMessage ?? null);

  setLoading(false);
};

const handleOption = (value: string) => {
  if (value === "whatsapp") {
    callBot({ language, role, step: "whatsapp" });
    return;
  }

  if (!language) {
    setLanguage(value);
    callBot({ language: value });
    return;
  }

  if (!role) {
    setRole(value);
    callBot({ language, role: value });
    return;
  }
callBot({ language, role, step: value });

};

  // 🔥 FIXED TEXT HANDLER
  const sendText = () => {
    if (!input.trim()) return;

    callBot({
      language,
      role,
      step: null,      // 🔴 THIS WAS THE BUG
      message: input,
    });

    setInput("");
  };

  const openWhatsApp = () => {
    if (!waMsg) return;

    window.open(
      `https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(waMsg)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[360px] rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-center mb-4">
          🤖 Tutvex Chatbot
        </h2>

        {/* BOT REPLY */}
        {reply && (
          <p className="text-sm text-gray-700 text-center mb-3 whitespace-pre-line">
            {reply}
          </p>
        )}

        {/* OPTIONS FROM API */}
        {options.length > 0 && (
          <div className="space-y-2 mb-3">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleOption(opt.value)}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* TEXT INPUT */}
    {language && role && !waMsg && (
  <div className="flex gap-2">
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Type your question..."
      className="flex-1 border rounded px-3 py-2 text-sm"
    />
    <button
      onClick={sendText}
      className="bg-indigo-600 text-white px-3 rounded"
    >
      ➤
    </button>
  </div>
)}


        {/* WHATSAPP FINAL */}
        {waMsg && (
          <button
            onClick={openWhatsApp}
            className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg"
          >
            💬 Talk on WhatsApp
          </button>
        )}

        {loading && (
          <p className="text-center text-sm text-gray-500 mt-3">
            Loading...
          </p>
        )}
      </div>
    </div>
  );
}
