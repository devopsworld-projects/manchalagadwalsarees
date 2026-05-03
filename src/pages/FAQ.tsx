import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Footer } from '@/components/Footer';
import { PageMeta } from '@/components/PageMeta';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FAQ() {
  const { data: items = [] } = useQuery({
    queryKey: ['faq-items'],
    queryFn: async () => {
      const { data, error } = await supabase.from('faq_items').select('*').eq('is_active', true).order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const categories = [...new Set(items.map((i: any) => i.category))];

  return (
    <div className="min-h-screen">
      <PageMeta title="FAQ — Manchala Gadwal Sarees" description="Frequently asked questions about our products, shipping, returns and more." canonicalPath="/faq" />
      <AnnouncementBar />
      <Navbar /><Breadcrumbs />
      <main className="container max-w-3xl py-12">
        <h1 className="font-display text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>
        {categories.map(cat => (
          <div key={cat} className="mb-8">
            <h2 className="font-display text-lg font-semibold mb-4 text-primary">{cat}</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {items.filter((i: any) => i.category === cat).map((item: any) => (
                <AccordionItem key={item.id} value={item.id} className="border rounded-lg px-4">
                  <AccordionTrigger className="font-body text-sm hover:no-underline">{item.question}</AccordionTrigger>
                  <AccordionContent className="font-body text-sm text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-muted-foreground">No FAQs available yet.</p>}
      </main>
      <Footer />
    </div>
  );
}
