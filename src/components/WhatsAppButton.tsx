import { useStoreSettings } from '@/hooks/useStoreSettings';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

export function WhatsAppButton() {
  const { data: settings } = useStoreSettings();
  const phone = settings?.whatsapp_number || '919494644998';
  const url = `https://wa.me/${phone}?text=Hi%2C%20I%27m%20interested%20in%20your%20sarees!`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 md:bottom-6 right-4 z-50 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full p-3.5 shadow-lg transition-transform hover:scale-110"
    >
      <WhatsAppIcon className="h-6 w-6" />
    </a>
  );
}
