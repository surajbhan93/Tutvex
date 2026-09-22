"use client";

import { useEffect, useRef, useState } from "react";
import { askChatbot } from "@/lib/chatbot";
import { getSessionId } from "@/utils/session";
import QuickReplies from "./QuickReplies";
import TypingIndicator from "./TypingIndicator";
import { User } from "lucide-react";

type Role = "guest" | "parent" | "student" | "tutor" | "admin";

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function ChatbotWidget({
  onClose,
}: {
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [role, setRole] = useState<Role>("guest");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const sessionId = getSessionId();

  /* ===================== AUTO SCROLL ===================== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* ===================== FIRST GREETING ===================== */
  useEffect(() => {
    handleSend(""); // trigger greeting
    // eslint-disable-next-line
  }, []);

  /* ===================== SEND MESSAGE ===================== */
  const handleSend = async (text?: string) => {
    const userMessage = text ?? input;
    if (!userMessage?.trim() && userMessage !== "") return;

    // Add user message
    if (userMessage.trim()) {
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: userMessage },
      ]);
    }

    setInput("");
    setIsTyping(true); // 👈 show typing dots

    try {
      const res = await askChatbot({
        message: userMessage,
        sessionId,
      });

      /* ⏳ Artificial delay (500–1000ms) */
      const delay = Math.floor(Math.random() * 500) + 500;
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Detect role from bot reply (UI purpose only)
      const replyLower = res.reply.toLowerCase();
      if (replyLower.includes("parent")) setRole("parent");
      else if (replyLower.includes("student")) setRole("student");
      else if (replyLower.includes("tutor")) setRole("tutor");

      // Check if response contains tutor registration link
      const hasTutorRegistration = res.reply.includes("tutor-registration") || 
                                   res.reply.includes("/tutor-flow/tutor-registration");
      
      if (hasTutorRegistration) {
        // Open registration in new tab
        window.open("https://tutvex.com/tutor-flow/tutor-registration/?role=tutor&source=CHATBOT&campaign=BECOME_TUTOR", "_blank");
      }

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "❌ Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false); // 👈 hide typing dots
    }
  };

  return (
   <div
  className="fixed right-6 z-50 w-80 max-w-[90vw] rounded-xl bg-white shadow-2xl border flex flex-col"
  style={{
    bottom: "90px",            // ✅ stable bottom
    maxHeight: "70vh",         // ✅ never go off screen
  }}
>

      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-t-xl shadow-md">
        <div className="flex items-center gap-3">
          {/* Agent Avatar */}
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
            <span className="text-2xl">👩‍💼</span>
          </div>
          <div>
            <span className="font-semibold text-lg block">Tutvex Support</span>
            <span className="text-xs text-green-100 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
              Online now
            </span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors text-xl"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div
  className="flex-1 overflow-y-auto p-3 space-y-3"
  style={{ overscrollBehavior: "contain" }}
>

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-2 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Icon */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              msg.sender === "user" 
                ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-md" 
                : "bg-gradient-to-br from-green-100 to-green-200 shadow-md"
            }`}>
              {msg.sender === "user" ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <div className="text-lg">👩‍💼</div>
              )}
            </div>
            
            {/* Message Bubble */}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm whitespace-pre-line ${
                msg.sender === "user"
                  ? "bg-green-500 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* 🤖 Typing Indicator */}
        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-green-200 shadow-md flex items-center justify-center">
              <div className="text-lg">👩‍💼</div>
            </div>
            <TypingIndicator />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies (context-based) */}
      {messages.length < 6 && (
        <QuickReplies role={role} onSelect={(text) => handleSend(text)} />
      )}

      {/* Input */}
      <div className="flex border-t p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={() => handleSend()}
          className="ml-2 rounded-lg bg-green-500 px-4 text-white text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
