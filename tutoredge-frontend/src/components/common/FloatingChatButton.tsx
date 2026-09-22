"use client";

import { useState } from "react";
import ChatbotWidget from "./ChatbotWidget";

export default function FloatingChatButton() {
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      {open && <ChatbotWidget onClose={() => setOpen(false)} />}

      <div className="fixed bottom-6 right-6 z-50">
        {/* Pulsing ring animation */}
        <span className="absolute inset-0 rounded-full bg-green-500 opacity-70 animate-ping"></span>
        <span className="absolute inset-0 rounded-full bg-green-400 opacity-50 animate-pulse"></span>

        {/* Main Button */}
        <button
          onClick={() => setOpen(true)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white shadow-2xl hover:shadow-green-500/50 hover:scale-110 transition-all duration-300 border-4 border-white"
          title="Chat with Tutvex Support"
        >
          {/* Customer Support Girl Icon */}
          <div className="relative flex items-center justify-center">
            {/* Main Icon - Girl with Headset */}
            <div className="text-3xl leading-none">
              👩‍💼
            </div>
            {/* Headphone indicator */}
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
              <svg 
                className="w-3 h-3 text-green-600" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"></path>
              </svg>
            </div>
          </div>
        </button>
        
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-20 right-0 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-xl whitespace-nowrap animate-fade-in">
            <div className="font-semibold">💬 Need Help?</div>
            <div className="text-xs text-gray-300">Chat with our support team</div>
            {/* Arrow */}
            <div className="absolute -bottom-1 right-6 w-2 h-2 bg-gray-900 transform rotate-45"></div>
          </div>
        )}

        {/* Online Status Indicator */}
        <div className="absolute top-0 right-0 h-4 w-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
      </div>
    </>
  );
}
