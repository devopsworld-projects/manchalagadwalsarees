import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminReviews() {
  const qc = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase.from('reviews').select('*, products(name)').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const approve = useMutation({
    mutationFn: async ({ id, val }: { id: string; val: boolean }) => {
      const { error } = await supabase.from('reviews').update({ is_approved: val }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-reviews'] }); toast.success('Updated'); },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-reviews'] }); toast.success('Deleted'); },
  });

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Reviews & Ratings</h1><p className="text-muted-foreground text-sm">Moderate customer reviews.</p></div>

      {isLoading ? <p className="text-center py-12 text-muted-foreground">Loading...</p> : reviews.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">No reviews yet.</div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r: any) => (
            <div key={r.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-sm">{(r as any).products?.name || 'Unknown Product'}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={r.is_approved ? 'default' : 'secondary'}>{r.is_approved ? 'Approved' : 'Pending'}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              {r.comment && <p className="text-sm text-muted-foreground mb-3">{r.comment}</p>}
              <div className="flex gap-2">
                {!r.is_approved && <Button size="sm" variant="outline" onClick={() => approve.mutate({ id: r.id, val: true })} className="text-green-600"><Check className="h-3.5 w-3.5 mr-1" /> Approve</Button>}
                {r.is_approved && <Button size="sm" variant="outline" onClick={() => approve.mutate({ id: r.id, val: false })} className="text-amber-600"><X className="h-3.5 w-3.5 mr-1" /> Unapprove</Button>}
                <Button size="sm" variant="outline" className="text-destructive" onClick={() => del.mutate(r.id)}><Trash2 className="h-3.5 w-3.5 mr-1" /> Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
