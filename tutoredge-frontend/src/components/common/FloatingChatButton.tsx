"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";
import ChatbotWidget from "./ChatbotWidget";

export default function FloatingChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <ChatbotWidget onClose={() => setOpen(false)} />}

      <div className="fixed bottom-6 right-6 z-50">
        <span className="absolute inset-0 rounded-full bg-green-500 opacity-70 animate-ping"></span>

        <button
          onClick={() => setOpen(true)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl hover:scale-105 transition"
        >
          <MessageCircle size={26} />
        </button>
      </div>
    </>
  );
}
