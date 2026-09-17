'use client';

import { PhoneCall } from 'lucide-react';

const WhatsappFloat = () => {
  const phoneNumber = '919305275932';
  const message = encodeURIComponent(
    "Hi Tutvex 👋 I’m looking for a qualified tutor for my child. Please guide me with available subjects, pricing, and how the process works. Thanks!"
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="
        fixed bottom-5 right-5 z-50
        flex items-center justify-center
        w-14 h-14 rounded-full
        bg-gradient-to-br from-green-500 to-green-600
        text-white shadow-xl
        hover:scale-110 transition-transform
      "
    >
      {/* Glow ring */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-30 animate-ping" />

      {/* Icon */}
      <PhoneCall size={26} className="relative z-10" />
    </a>
  );
};

export default WhatsappFloat;
