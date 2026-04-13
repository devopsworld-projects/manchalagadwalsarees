import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Image, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

const defaultForm = { title: '', subtitle: '', image_url: '', cta_text: 'Shop Now', cta_link: '/collections', sort_order: 0, is_active: true };

export default function AdminHeroSlides() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const { data: slides = [], isLoading } = useQuery({
    queryKey: ['admin-hero-slides'],
    queryFn: async () => {
      const { data, error } = await supabase.from('hero_slides').select('*').order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async (d: any) => {
      const payload = {
        title: d.title || null, subtitle: d.subtitle || null, image_url: d.image_url,
        cta_text: d.cta_text || 'Shop Now', cta_link: d.cta_link || '/collections',
        sort_order: d.sort_order, is_active: d.is_active,
      };
      if (d.id) {
        const { error } = await supabase.from('hero_slides').update(payload).eq('id', d.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('hero_slides').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-hero-slides'] }); toast.success('Saved'); close(); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('hero_slides').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-hero-slides'] }); toast.success('Deleted'); },
  });

  const close = () => { setDialogOpen(false); setEditingId(null); setForm(defaultForm); };

  const handleImageUpload = async (file: File) => {
    const ext = file.name.split('.').pop();
    const path = `hero-slides/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file);
    if (error) { toast.error('Upload failed'); return; }
    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path);
    setForm(f => ({ ...f, image_url: publicUrl }));
    toast.success('Image uploaded');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hero Slider</h1>
          <p className="text-muted-foreground text-sm">Manage homepage hero carousel slides.</p>
        </div>
        <Button onClick={() => { setForm({ ...defaultForm, sort_order: slides.length }); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Slide
        </Button>
      </div>

      {isLoading ? <p className="text-center py-12 text-muted-foreground">Loading...</p> : slides.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">
          <Image className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No hero slides yet</p>
          <p className="text-sm mt-1">Add slides to create a homepage carousel.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {slides.map((s: any) => (
            <div key={s.id} className="border rounded-lg p-4 flex items-center gap-4">
              <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0" />
              {s.image_url ? (
                <img src={s.image_url} alt={s.title || 'Slide'} className="h-20 w-36 object-cover rounded" />
              ) : (
                <div className="h-20 w-36 bg-muted rounded flex items-center justify-center">
                  <Image className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{s.title || 'Untitled Slide'}</p>
                <p className="text-sm text-muted-foreground truncate">{s.subtitle || 'No subtitle'}</p>
                <p className="text-xs text-muted-foreground">
                  CTA: {s.cta_text} → {s.cta_link} • Order: {s.sort_order}
                </p>
              </div>
              <Badge variant={s.is_active ? 'default' : 'secondary'}>
                {s.is_active ? 'Active' : 'Hidden'}
              </Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                setEditingId(s.id);
                setForm({
                  title: s.title || '', subtitle: s.subtitle || '', image_url: s.image_url,
                  cta_text: s.cta_text || 'Shop Now', cta_link: s.cta_link || '/collections',
                  sort_order: s.sort_order, is_active: s.is_active,
                });
                setDialogOpen(true);
              }}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => del.mutate(s.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={v => { if (!v) close(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editingId ? 'Edit' : 'Add'} Hero Slide</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. New Kanjivaram Collection" /></div>
            <div><Label>Subtitle</Label><Input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="e.g. Elegance in Every Drape" /></div>
            <div>
              <Label>Image *</Label>
              <Input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
              {form.image_url && <img src={form.image_url} alt="Preview" className="mt-2 h-32 w-full object-cover rounded" />}
              <Input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="Or paste image URL" className="mt-2" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>CTA Text</Label><Input value={form.cta_text} onChange={e => setForm(f => ({ ...f, cta_text: e.target.value }))} placeholder="Shop Now" /></div>
              <div><Label>CTA Link</Label><Input value={form.cta_link} onChange={e => setForm(f => ({ ...f, cta_link: e.target.value }))} placeholder="/collections" /></div>
            </div>
            <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} /><Label>Active</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close}>Cancel</Button>
            <Button onClick={() => {
              if (!form.image_url.trim()) { toast.error('Image is required'); return; }
              save.mutate({ ...form, id: editingId || undefined });
            }} disabled={save.isPending}>
              {save.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
