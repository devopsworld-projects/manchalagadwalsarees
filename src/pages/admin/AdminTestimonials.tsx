import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useBulkSelect } from '@/hooks/useBulkSelect';

const defaultForm = { name: '', content: '', rating: 5, image_url: '', is_active: true, sort_order: 0 };

export default function AdminTestimonials() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase.from('testimonials').select('*').order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const bulk = useBulkSelect(items);

  const save = useMutation({
    mutationFn: async (d: any) => {
      const payload = { name: d.name, content: d.content, rating: d.rating, image_url: d.image_url || null, is_active: d.is_active, sort_order: d.sort_order };
      if (d.id) { const { error } = await supabase.from('testimonials').update(payload).eq('id', d.id); if (error) throw error; }
      else { const { error } = await supabase.from('testimonials').insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-testimonials'] }); toast.success('Saved'); close(); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('testimonials').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-testimonials'] }); toast.success('Deleted'); },
  });

  const bulkDel = useMutation({
    mutationFn: async (ids: string[]) => {
      for (const id of ids) { const { error } = await supabase.from('testimonials').delete().eq('id', id); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-testimonials'] }); toast.success(`${bulk.count} testimonials deleted`); bulk.clear(); },
    onError: (e: any) => toast.error(e.message),
  });

  const close = () => { setDialogOpen(false); setEditingId(null); setForm(defaultForm); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Testimonials</h1><p className="text-muted-foreground text-sm">Manage customer testimonials.</p></div>
        <div className="flex gap-2">
          {bulk.someSelected && (
            <Button variant="destructive" onClick={() => { if (confirm(`Delete ${bulk.count} testimonials?`)) bulkDel.mutate(Array.from(bulk.selectedIds)); }} disabled={bulkDel.isPending}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete {bulk.count}
            </Button>
          )}
          <Button onClick={() => { setForm({ ...defaultForm, sort_order: items.length }); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Add Testimonial</Button>
        </div>
      </div>

      {isLoading ? <p className="text-center py-12 text-muted-foreground">Loading...</p> : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">No testimonials yet.</div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Checkbox checked={bulk.allSelected} onCheckedChange={bulk.toggleAll} />
            <span className="text-sm text-muted-foreground">Select all</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((t: any) => (
              <div key={t.id} className={`border rounded-lg p-4 ${bulk.selectedIds.has(t.id) ? 'bg-primary/5 border-primary/30' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3">
                    <Checkbox checked={bulk.selectedIds.has(t.id)} onCheckedChange={() => bulk.toggle(t.id)} className="mt-1" />
                    <div>
                      <p className="font-medium">{t.name}</p>
                      <div className="flex gap-0.5 mt-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3 w-3 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />)}</div>
                    </div>
                  </div>
                  <Badge variant={t.is_active ? 'default' : 'secondary'}>{t.is_active ? 'Active' : 'Hidden'}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3 ml-8">{t.content}</p>
                <div className="flex gap-2 mt-3 ml-8">
                  <Button variant="ghost" size="sm" onClick={() => { setEditingId(t.id); setForm({ name: t.name, content: t.content, rating: t.rating, image_url: t.image_url || '', is_active: t.is_active, sort_order: t.sort_order }); setDialogOpen(true); }}><Pencil className="h-3.5 w-3.5 mr-1" /> Edit</Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => del.mutate(t.id)}><Trash2 className="h-3.5 w-3.5 mr-1" /> Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={v => { if (!v) close(); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? 'Edit' : 'Add'} Testimonial</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Content *</Label><Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={4} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Rating (1-5)</Label><Input type="number" min={1} max={5} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: parseInt(e.target.value) || 5 }))} /></div>
              <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} /></div>
            </div>
            <div><Label>Image URL</Label><Input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} /><Label>Active</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close}>Cancel</Button>
            <Button onClick={() => { if (!form.name.trim() || !form.content.trim()) { toast.error('Name and content required'); return; } save.mutate({ ...form, id: editingId || undefined }); }} disabled={save.isPending}>{save.isPending ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
