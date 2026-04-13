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
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Two-tone background: left dark, right accent */}
      <div className="absolute inset-0 flex">
        <div className="flex-1 bg-foreground" />
        <div className="w-1/3 bg-accent/10 hidden md:block" />
      </div>

      {/* Mobile: full dark bg */}
      <div className="absolute inset-0 bg-foreground md:hidden" />

      <div className="container relative z-10">
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-accent text-[7px]">◆</span>
            <div className="w-8 h-[1px] bg-accent/40" />
            <span className="font-body text-[10px] tracking-[0.4em] uppercase text-accent/70">Stay Connected</span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold text-background tracking-wide mb-4">
            Join Our Family
          </h2>

          <div className="ornate-line w-24 mb-6" />

          <p className="font-serif text-sm md:text-base text-background/40 mb-10 italic leading-relaxed">
            Be the first to know about new collections, exclusive offers, and styling inspirations.
          </p>

          <form onSubmit={e => { e.preventDefault(); if (email.trim()) subscribe.mutate(email.trim()); }} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 bg-background/10 border-background/15 text-background placeholder:text-background/25 font-body tracking-wider h-12"
            />
            <Button
              type="submit"
              disabled={subscribe.isPending}
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-display tracking-[0.2em] text-[11px] uppercase px-8 h-12"
            >
              <Send className="h-3.5 w-3.5 mr-2" />
              {subscribe.isPending ? '...' : 'Subscribe'}
            </Button>
          </form>
        </div>
      </div>

      {/* Decorative accent square on right */}
      <div className="absolute right-20 top-1/2 -translate-y-1/2 w-32 h-32 border border-accent/20 rotate-45 hidden lg:block" />
      <div className="absolute right-28 top-1/2 -translate-y-1/2 w-20 h-20 border border-accent/10 rotate-45 hidden lg:block" />
    </section>
  );
}
