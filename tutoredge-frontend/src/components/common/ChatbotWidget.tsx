"use client";

import { useEffect, useRef, useState } from "react";
import { askChatbot } from "@/lib/chatbot";

import { getSessionId } from "@/utils/session";
import QuickReplies from "./QuickReplies";
import TypingIndicator from "./TypingIndicator";

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
      <div className="flex items-center justify-between bg-green-500 text-white px-4 py-3 rounded-t-xl">
        <span className="font-semibold">Tutvex Chat</span>
        <button onClick={onClose}>✕</button>
      </div>

      {/* Messages */}
      <div
  className="flex-1 overflow-y-auto p-3 space-y-2"
  style={{ overscrollBehavior: "contain" }}
>

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
              msg.sender === "user"
                ? "ml-auto bg-green-500 text-white"
                : "mr-auto bg-gray-100 text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {/* 🤖 Typing Indicator */}
        {isTyping && <TypingIndicator />}

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
