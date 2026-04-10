import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const phone = '919494644998';
  const url = `https://wa.me/${phone}?text=Hi%2C%20I%27m%20interested%20in%20your%20sarees!`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed top-1/2 -translate-y-1/2 right-0 z-50 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-l-full p-3 shadow-lg transition-transform hover:scale-110"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
