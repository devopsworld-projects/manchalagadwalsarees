import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: reviews = [], refetch } = useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: async () => {
      const { data, error } = await supabase.from('reviews').select('*').eq('product_id', productId).eq('is_approved', true).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const avgRating = reviews.length > 0 ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Please log in to leave a review'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('reviews').insert({ product_id: productId, user_id: user.id, rating, comment: comment.trim() || null });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Review submitted! It will appear after approval.');
    setComment(''); setRating(5);
    refetch();
  };

  return (
    <div className="mt-10 border-t border-border pt-8">
      <h2 className="font-display text-xl font-bold mb-4">Customer Reviews</h2>
      {reviews.length > 0 && (
        <div className="flex items-center gap-3 mb-6">
          <span className="font-display text-3xl font-bold">{avgRating.toFixed(1)}</span>
          <div>
            <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />)}</div>
            <p className="text-xs text-muted-foreground">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      )}

      <div className="space-y-4 mb-8">
        {reviews.map((r: any) => (
          <div key={r.id} className="border rounded-lg p-4">
            <div className="flex gap-0.5 mb-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />)}</div>
            {r.comment && <p className="font-body text-sm text-muted-foreground">{r.comment}</p>}
            <p className="text-xs text-muted-foreground mt-2">{new Date(r.created_at).toLocaleDateString()}</p>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>}
      </div>

      <div className="bg-muted/30 rounded-lg p-4">
        <h3 className="font-display text-base font-semibold mb-3">Write a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <p className="text-sm font-body mb-1">Rating</p>
            <div className="flex gap-1">{Array.from({ length: 5 }).map((_, i) => (
              <button key={i} type="button" onClick={() => setRating(i + 1)}>
                <Star className={`h-5 w-5 cursor-pointer ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
              </button>
            ))}</div>
          </div>
          <Textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience..." rows={3} />
          <Button type="submit" disabled={submitting || !user} size="sm">
            {!user ? 'Login to Review' : submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </div>
    </div>
  );
}
