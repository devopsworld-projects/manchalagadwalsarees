import { X } from 'lucide-react';
import { useState } from 'react';

const announcements = [
  '🛒 We accept only online orders!',
  'Free shipping across India on all orders! 🚚',
  'Outside India? Contact us on WhatsApp for international shipping! 🌍',
  '24/7 Customer Support Available! 💬',
];

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-primary text-primary-foreground relative overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap py-2">
        {[...announcements, ...announcements].map((text, i) => (
          <span key={i} className="mx-8 text-sm font-body tracking-wide">{text}</span>
        ))}
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
        aria-label="Close announcements"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
