import { X } from 'lucide-react';
import { useState } from 'react';
import { useStoreSettings } from '@/hooks/useStoreSettings';

const defaultAnnouncements = [
  '🛒 We accept only online orders!',
  'Free shipping across India on all orders! 🚚',
  'Outside India? Contact us on WhatsApp for international shipping! 🌍',
  '24/7 Customer Support Available! 💬',
];

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const { data: settings } = useStoreSettings();

  if (settings?.announcement_enabled === 'false') return null;
  if (!visible) return null;

  const customText = settings?.announcement_text;
  const announcements = customText
    ? customText.split('|').map(s => s.trim()).filter(Boolean)
    : defaultAnnouncements;

  return (
    <div className="bg-foreground text-background relative overflow-hidden">
      {/* Top gold line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />
      <div className="flex animate-marquee whitespace-nowrap py-2 pr-10">
        {[...announcements, ...announcements].map((text, i) => (
          <span key={i} className="mx-8 text-[11px] font-body tracking-[0.08em] text-background/80">
            <span className="text-accent mr-2">◆</span>
            {text}
          </span>
        ))}
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-7 w-7 flex items-center justify-center rounded-full bg-foreground/80 text-background/70 hover:text-background hover:bg-foreground transition-colors"
        aria-label="Close announcements"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
    </div>
  );
}
