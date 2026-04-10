import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const defaultForm = { page_path: '', title: '', description: '', og_image: '' };

export default function AdminPageSEO() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['admin-page-seo'],
    queryFn: async () => {
      const { data, error } = await supabase.from('page_seo').select('*').order('page_path');
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async (d: any) => {
      const payload = { page_path: d.page_path, title: d.title || null, description: d.description || null, og_image: d.og_image || null };
      if (d.id) { const { error } = await supabase.from('page_seo').update(payload).eq('id', d.id); if (error) throw error; }
      else { const { error } = await supabase.from('page_seo').insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-page-seo'] }); toast.success('Saved'); close(); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('page_seo').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-page-seo'] }); toast.success('Deleted'); },
  });

  const close = () => { setDialogOpen(false); setEditingId(null); setForm(defaultForm); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Page SEO</h1><p className="text-muted-foreground text-sm">Set custom meta tags per page.</p></div>
        <Button onClick={() => { setForm(defaultForm); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Add Page</Button>
      </div>

      {isLoading ? <p className="text-center py-12 text-muted-foreground">Loading...</p> : pages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">No page SEO settings yet.</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50"><tr><th className="text-left p-3">Page</th><th className="text-left p-3 hidden sm:table-cell">Title</th><th className="text-left p-3 hidden md:table-cell">Description</th><th className="text-right p-3">Actions</th></tr></thead>
            <tbody>
              {pages.map((p: any) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3 font-mono text-sm">{p.page_path}</td>
                  <td className="p-3 hidden sm:table-cell truncate max-w-[200px]">{p.title || '—'}</td>
                  <td className="p-3 hidden md:table-cell truncate max-w-[250px] text-muted-foreground">{p.description || '—'}</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingId(p.id); setForm({ page_path: p.page_path, title: p.title || '', description: p.description || '', og_image: p.og_image || '' }); setDialogOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => del.mutate(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={v => { if (!v) close(); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? 'Edit' : 'Add'} Page SEO</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Page Path *</Label><Input value={form.page_path} onChange={e => setForm(f => ({ ...f, page_path: e.target.value }))} placeholder="e.g. / or /about or /collections" /></div>
            <div><Label>Title (max 60 chars)</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} maxLength={60} /><p className="text-xs text-muted-foreground mt-1">{form.title.length}/60</p></div>
            <div><Label>Description (max 160 chars)</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} maxLength={160} rows={3} /><p className="text-xs text-muted-foreground mt-1">{form.description.length}/160</p></div>
            <div><Label>OG Image URL</Label><Input value={form.og_image} onChange={e => setForm(f => ({ ...f, og_image: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close}>Cancel</Button>
            <Button onClick={() => { if (!form.page_path.trim()) { toast.error('Page path required'); return; } save.mutate({ ...form, id: editingId || undefined }); }} disabled={save.isPending}>{save.isPending ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
