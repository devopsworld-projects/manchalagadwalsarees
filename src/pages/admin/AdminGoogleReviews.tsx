import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Star, ExternalLink, Save } from 'lucide-react';
import { toast } from 'sonner';

const defaultForm = {
  author_name: '',
  author_initial: '',
  review_text: '',
  rating: 5,
  review_date: new Date().toISOString().slice(0, 10),
  profile_photo_url: '',
  is_active: true,
  sort_order: 0,
};

export default function AdminGoogleReviews() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [reviewsUrl, setReviewsUrl] = useState('');

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-google-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('google_reviews')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data || [];
    },
  });

  useQuery({
    queryKey: ['admin-google-reviews-url'],
    queryFn: async () => {
      const { data } = await supabase
        .from('store_settings')
        .select('value')
        .eq('key', 'google_reviews_url')
        .maybeSingle();
      const v = data?.value || '';
      setReviewsUrl(v);
      return v;
    },
  });

  const save = useMutation({
    mutationFn: async (d: any) => {
      const payload = {
        author_name: d.author_name,
        author_initial: d.author_initial || d.author_name[0]?.toUpperCase() || null,
        review_text: d.review_text,
        rating: d.rating,
        review_date: d.review_date || null,
        profile_photo_url: d.profile_photo_url || null,
        is_active: d.is_active,
        sort_order: d.sort_order,
      };
      if (d.id) {
        const { error } = await supabase.from('google_reviews').update(payload).eq('id', d.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('google_reviews').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-google-reviews'] });
      qc.invalidateQueries({ queryKey: ['google-reviews-public'] });
      toast.success('Saved');
      close();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('google_reviews').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-google-reviews'] });
      qc.invalidateQueries({ queryKey: ['google-reviews-public'] });
      toast.success('Deleted');
    },
  });

  const saveUrl = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('store_settings')
        .upsert({ key: 'google_reviews_url', value: reviewsUrl }, { onConflict: 'key' });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['store-settings-public'] });
      toast.success('Reviews URL saved');
    },
    onError: (e: any) => toast.error(e.message),
  });

  const close = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(defaultForm);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Google Reviews</h1>
          <p className="text-muted-foreground text-sm">Manually showcase your best Google reviews on the homepage.</p>
        </div>
        <Button onClick={() => { setForm({ ...defaultForm, sort_order: items.length }); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Review
        </Button>
      </div>

      {/* Reviews URL setting */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <Label className="text-sm font-medium">"View All Reviews" Google URL</Label>
        <p className="text-xs text-muted-foreground mb-2">Where the homepage CTA button takes visitors. Use your Google Business Profile or Google search URL.</p>
        <div className="flex gap-2">
          <Input
            value={reviewsUrl}
            onChange={(e) => setReviewsUrl(e.target.value)}
            placeholder="https://www.google.com/search?q=manchala+gadwal+sarees"
          />
          <Button onClick={() => saveUrl.mutate()} disabled={saveUrl.isPending}>
            <Save className="h-4 w-4 mr-2" /> Save
          </Button>
          {reviewsUrl && (
            <Button variant="outline" asChild>
              <a href={reviewsUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <p className="text-center py-12 text-muted-foreground">Loading...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">No reviews yet.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((r: any) => (
            <div key={r.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">{r.author_name}</p>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                    ))}
                  </div>
                  {r.review_date && <p className="text-xs text-muted-foreground mt-1">{r.review_date}</p>}
                </div>
                <Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Hidden'}</Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-4">{r.review_text}</p>
              <div className="flex gap-2 mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingId(r.id);
                    setForm({
                      author_name: r.author_name,
                      author_initial: r.author_initial || '',
                      review_text: r.review_text,
                      rating: r.rating,
                      review_date: r.review_date || '',
                      profile_photo_url: r.profile_photo_url || '',
                      is_active: r.is_active,
                      sort_order: r.sort_order,
                    });
                    setDialogOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => { if (confirm('Delete this review?')) del.mutate(r.id); }}>
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(v) => { if (!v) close(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit' : 'Add'} Google Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Label>Customer Name *</Label>
                <Input value={form.author_name} onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))} />
              </div>
              <div>
                <Label>Initial</Label>
                <Input maxLength={2} value={form.author_initial} onChange={(e) => setForm((f) => ({ ...f, author_initial: e.target.value }))} placeholder="auto" />
              </div>
            </div>
            <div>
              <Label>Review Text *</Label>
              <Textarea rows={5} value={form.review_text} onChange={(e) => setForm((f) => ({ ...f, review_text: e.target.value }))} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Rating</Label>
                <Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: parseInt(e.target.value) || 5 }))} />
              </div>
              <div>
                <Label>Review Date</Label>
                <Input type="date" value={form.review_date} onChange={(e) => setForm((f) => ({ ...f, review_date: e.target.value }))} />
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
            <div>
              <Label>Profile Photo URL (optional)</Label>
              <Input value={form.profile_photo_url} onChange={(e) => setForm((f) => ({ ...f, profile_photo_url: e.target.value }))} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close}>Cancel</Button>
            <Button
              onClick={() => {
                if (!form.author_name.trim() || !form.review_text.trim()) {
                  toast.error('Name and review text required');
                  return;
                }
                save.mutate({ ...form, id: editingId || undefined });
              }}
              disabled={save.isPending}
            >
              {save.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
