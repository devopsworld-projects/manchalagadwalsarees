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
    <section className="py-16 md:py-20 bg-primary relative overflow-hidden">
      {/* Decorative gold accents */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />

      <div className="container max-w-xl text-center relative z-10">
        <span className="font-body text-xs tracking-[0.3em] uppercase text-accent">Join Our Family</span>
        <h2 className="font-display text-2xl md:text-4xl font-bold text-primary-foreground mt-2 mb-2">
          Stay Updated
        </h2>
        <div className="w-12 h-[2px] bg-accent mx-auto mb-4" />
        <p className="font-body text-sm text-primary-foreground/70 mb-8">
          Subscribe for new collections, exclusive offers, and styling tips from the world of traditional sarees.
        </p>
        <form onSubmit={e => { e.preventDefault(); if (email.trim()) subscribe.mutate(email.trim()); }} className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
          />
          <Button type="submit" disabled={subscribe.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Send className="h-4 w-4 mr-2" /> {subscribe.isPending ? '...' : 'Subscribe'}
          </Button>
        </form>
      </div>
    </section>
  );
}
