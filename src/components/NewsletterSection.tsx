import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

export function NewsletterSection() {
  const [email, setEmail] = useState('');

  const subscribe = useMutation({
    mutationFn: async (emailAddr: string) => {
      const { error } = await supabase.from('newsletter_subscribers').insert({ email: emailAddr });
      if (error) {
        if (error.code === '23505') throw new Error('Already subscribed!');
        throw error;
      }
    },
    onSuccess: () => { toast.success('Subscribed successfully!'); setEmail(''); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <section className="py-12 md:py-16 bg-primary/5">
      <div className="container max-w-xl text-center">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Stay Updated</h2>
        <p className="font-body text-sm text-muted-foreground mb-6">Subscribe for new collections, exclusive offers, and styling tips.</p>
        <form onSubmit={e => { e.preventDefault(); if (email.trim()) subscribe.mutate(email.trim()); }} className="flex gap-2">
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required className="flex-1" />
          <Button type="submit" disabled={subscribe.isPending}><Send className="h-4 w-4 mr-2" /> {subscribe.isPending ? 'Subscribing...' : 'Subscribe'}</Button>
        </form>
      </div>
    </section>
  );
}
