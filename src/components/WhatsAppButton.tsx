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
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
