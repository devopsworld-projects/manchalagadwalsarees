import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
    <section className="relative py-28 md:py-40 bg-background border-t border-border overflow-hidden">
      {/* Oversized watermark display word */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
        <span className="font-display italic text-[28vw] md:text-[20vw] leading-none text-accent/[0.07] font-medium tracking-tighter whitespace-nowrap">
          atelier
        </span>
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-px bg-accent" />
            <span className="font-body text-[10px] tracking-luxe uppercase text-accent">
              The Atelier Letter
            </span>
            <div className="w-10 h-px bg-accent" />
          </div>

          <h2 className="font-display text-[44px] sm:text-[60px] md:text-[80px] lg:text-[96px] leading-[0.95] font-medium tracking-[-0.015em] text-foreground mb-6">
            Be first to
            <br />
            <span className="italic font-serif font-normal text-accent">unveil.</span>
          </h2>

          <p className="font-serif text-base md:text-lg text-muted-foreground italic mb-12 max-w-md mx-auto leading-relaxed">
            New collections, festive offerings, private previews — delivered to you with quiet care.
          </p>

          <form
            onSubmit={e => {
              e.preventDefault();
              if (email.trim()) subscribe.mutate(email.trim());
            }}
            className="flex flex-col sm:flex-row gap-0 max-w-xl mx-auto border-b border-foreground/30 focus-within:border-accent transition-colors"
          >
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 bg-transparent border-0 rounded-none text-foreground placeholder:text-muted-foreground/50 font-serif italic text-base h-14 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              type="submit"
              disabled={subscribe.isPending}
              className="btn-luxe rounded-none bg-transparent hover:bg-foreground hover:text-background text-foreground font-display tracking-luxe text-[10px] uppercase h-14 px-8 border-0 shadow-none"
            >
              {subscribe.isPending ? '...' : 'Subscribe →'}
            </Button>
          </form>

          <p className="font-body text-[9px] tracking-refined text-muted-foreground/60 mt-6 uppercase">
            No spam · Unsubscribe anytime
          </p>
        </div>
      </div>
    </section>
  );
}
