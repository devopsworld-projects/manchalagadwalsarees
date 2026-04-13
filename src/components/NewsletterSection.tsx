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
    <section className="py-20 md:py-28 bg-foreground relative overflow-hidden">
      {/* Top ornate gold border */}
      <div className="absolute top-0 left-0 right-0 ornate-line" />

      {/* Subtle mandala pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-accent/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-accent/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-accent/20 rounded-full" />
      </div>

      <div className="container max-w-xl text-center relative z-10">
        <span className="text-accent text-[8px]">◆ ◆ ◆</span>
        <h2 className="font-display text-2xl md:text-4xl font-bold text-background mt-3 tracking-wide">
          Join Our Family
        </h2>
        <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-4 mb-4" />
        <p className="font-serif text-sm md:text-base text-background/50 mb-10 italic leading-relaxed">
          Subscribe for new collections, exclusive offers, and styling tips from the world of traditional sarees.
        </p>
        <form onSubmit={e => { e.preventDefault(); if (email.trim()) subscribe.mutate(email.trim()); }} className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 bg-background/10 border-background/20 text-background placeholder:text-background/30 font-body tracking-wider"
          />
          <Button type="submit" disabled={subscribe.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90 font-display tracking-wider text-xs uppercase px-6">
            <Send className="h-3.5 w-3.5 mr-2" /> {subscribe.isPending ? '...' : 'Subscribe'}
          </Button>
        </form>
      </div>

      {/* Bottom ornate gold border */}
      <div className="absolute bottom-0 left-0 right-0 ornate-line" />
    </section>
  );
}
