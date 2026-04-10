import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Image } from 'lucide-react';
import { toast } from 'sonner';

const defaultForm = { title: '', subtitle: '', image_url: '', link: '', sort_order: 0, is_active: true };

export default function AdminBanners() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: async () => {
      const { data, error } = await supabase.from('banners').select('*').order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async (d: any) => {
      const payload = { title: d.title || null, subtitle: d.subtitle || null, image_url: d.image_url, link: d.link || null, sort_order: d.sort_order, is_active: d.is_active };
      if (d.id) { const { error } = await supabase.from('banners').update(payload).eq('id', d.id); if (error) throw error; }
      else { const { error } = await supabase.from('banners').insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-banners'] }); toast.success('Saved'); close(); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('banners').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-banners'] }); toast.success('Deleted'); },
  });

  const close = () => { setDialogOpen(false); setEditingId(null); setForm(defaultForm); };

  const handleImageUpload = async (file: File) => {
    const ext = file.name.split('.').pop();
    const path = `banners/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file);
    if (error) { toast.error('Upload failed'); return; }
    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path);
    setForm(f => ({ ...f, image_url: publicUrl }));
    toast.success('Image uploaded');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Banner Slider</h1><p className="text-muted-foreground text-sm">Manage homepage carousel banners.</p></div>
        <Button onClick={() => { setForm({ ...defaultForm, sort_order: banners.length }); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Add Banner</Button>
      </div>

      {isLoading ? <p className="text-center py-12 text-muted-foreground">Loading...</p> : banners.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">No banners yet.</div>
      ) : (
        <div className="grid gap-4">
          {banners.map((b: any) => (
            <div key={b.id} className="border rounded-lg p-4 flex items-center gap-4">
              {b.image_url ? <img src={b.image_url} alt={b.title || 'Banner'} className="h-20 w-36 object-cover rounded" /> : <div className="h-20 w-36 bg-muted rounded flex items-center justify-center"><Image className="h-6 w-6 text-muted-foreground" /></div>}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{b.title || 'Untitled'}</p>
                <p className="text-sm text-muted-foreground truncate">{b.subtitle || 'No subtitle'}</p>
                <p className="text-xs text-muted-foreground">Order: {b.sort_order} • {b.link || 'No link'}</p>
              </div>
              <Badge variant={b.is_active ? 'default' : 'secondary'}>{b.is_active ? 'Active' : 'Hidden'}</Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingId(b.id); setForm({ title: b.title || '', subtitle: b.subtitle || '', image_url: b.image_url, link: b.link || '', sort_order: b.sort_order, is_active: b.is_active }); setDialogOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => del.mutate(b.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={v => { if (!v) close(); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? 'Edit' : 'Add'} Banner</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div><Label>Subtitle</Label><Input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} /></div>
            <div>
              <Label>Image *</Label>
              <Input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
              {form.image_url && <img src={form.image_url} alt="Preview" className="mt-2 h-24 object-cover rounded" />}
              <Input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="Or paste image URL" className="mt-2" />
            </div>
            <div><Label>Link URL</Label><Input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="/collections" /></div>
            <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} /><Label>Active</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close}>Cancel</Button>
            <Button onClick={() => { if (!form.image_url.trim()) { toast.error('Image required'); return; } save.mutate({ ...form, id: editingId || undefined }); }} disabled={save.isPending}>{save.isPending ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
