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
    <section className="relative py-28 md:py-36 overflow-hidden bg-foreground">
      {/* Subtle mandala bg */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-accent rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-accent rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-accent rounded-full" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="lotus-divider mb-5">
            <span className="lotus" />
          </div>
          

          <h2 className="font-display text-3xl md:text-5xl font-bold text-background tracking-wide mt-2 mb-4">
            Join Our Family
          </h2>

          <div className="ornate-line w-20 mx-auto mb-6" />

          <p className="font-serif text-base md:text-lg text-background/55 mb-12 italic leading-relaxed max-w-md mx-auto">
            Receive blessings of new collections, festive offerings, and styling rituals — straight to your inbox.
          </p>

          <form
            onSubmit={e => {
              e.preventDefault();
              if (email.trim()) subscribe.mutate(email.trim());
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 bg-background/10 border-background/15 text-background placeholder:text-background/25 font-body tracking-wider h-13 text-sm"
            />
            <Button
              type="submit"
              disabled={subscribe.isPending}
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-display tracking-[0.2em] text-[11px] uppercase px-10 h-13"
            >
              <Send className="h-3.5 w-3.5 mr-2" />
              {subscribe.isPending ? '...' : 'Subscribe'}
            </Button>
          </form>

          <p className="font-body text-[10px] text-background/20 mt-6 tracking-wider">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>

      {/* Decorative diamonds */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="w-24 h-24 border border-accent/15 rotate-45" />
        <div className="w-16 h-16 border border-accent/10 rotate-45 absolute top-4 left-4" />
      </div>
      <div className="absolute left-16 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="w-24 h-24 border border-accent/15 rotate-45" />
        <div className="w-16 h-16 border border-accent/10 rotate-45 absolute top-4 left-4" />
      </div>
    </section>
  );
}
