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
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useBulkSelect } from '@/hooks/useBulkSelect';

const defaultForm = { title: '', slug: '', content: '', excerpt: '', image_url: '', author: 'Admin', is_published: false };

export default function AdminBlog() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['admin-blog'],
    queryFn: async () => {
      const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const bulk = useBulkSelect(posts);

  const save = useMutation({
    mutationFn: async (d: any) => {
      const slug = d.slug || d.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
      const payload = { title: d.title, slug, content: d.content, excerpt: d.excerpt || null, image_url: d.image_url || null, author: d.author, is_published: d.is_published, published_at: d.is_published ? new Date().toISOString() : null };
      if (d.id) { const { error } = await supabase.from('blog_posts').update(payload).eq('id', d.id); if (error) throw error; }
      else { const { error } = await supabase.from('blog_posts').insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-blog'] }); toast.success('Saved'); close(); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('blog_posts').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-blog'] }); toast.success('Deleted'); },
  });

  const bulkDel = useMutation({
    mutationFn: async (ids: string[]) => {
      for (const id of ids) { const { error } = await supabase.from('blog_posts').delete().eq('id', id); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-blog'] }); toast.success(`${bulk.count} posts deleted`); bulk.clear(); },
    onError: (e: any) => toast.error(e.message),
  });

  const close = () => { setDialogOpen(false); setEditingId(null); setForm(defaultForm); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Blog / CMS</h1><p className="text-muted-foreground text-sm">Manage articles and content pages.</p></div>
        <div className="flex gap-2">
          {bulk.someSelected && (
            <Button variant="destructive" onClick={() => { if (confirm(`Delete ${bulk.count} posts?`)) bulkDel.mutate(Array.from(bulk.selectedIds)); }} disabled={bulkDel.isPending}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete {bulk.count}
            </Button>
          )}
          <Button onClick={() => { setForm(defaultForm); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" /> New Post</Button>
        </div>
      </div>

      {isLoading ? <p className="text-center py-12 text-muted-foreground">Loading...</p> : posts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">No blog posts yet.</div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Checkbox checked={bulk.allSelected} onCheckedChange={bulk.toggleAll} />
            <span className="text-sm text-muted-foreground">Select all</span>
          </div>
          {posts.map((p: any) => (
            <div key={p.id} className={`border rounded-lg p-4 flex items-center justify-between ${bulk.selectedIds.has(p.id) ? 'bg-primary/5 border-primary/30' : ''}`}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Checkbox checked={bulk.selectedIds.has(p.id)} onCheckedChange={() => bulk.toggle(p.id)} />
                <div className="min-w-0">
                  <p className="font-medium truncate">{p.title}</p>
                  <p className="text-xs text-muted-foreground">By {p.author} • {new Date(p.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={p.is_published ? 'default' : 'secondary'}>{p.is_published ? 'Published' : 'Draft'}</Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingId(p.id); setForm({ title: p.title, slug: p.slug, content: p.content, excerpt: p.excerpt || '', image_url: p.image_url || '', author: p.author, is_published: p.is_published }); setDialogOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => del.mutate(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={v => { if (!v) close(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? 'Edit' : 'New'} Blog Post</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div><Label>Slug</Label><Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated from title" /></div>
            <div><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} placeholder="Brief summary..." /></div>
            <div><Label>Content *</Label><Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={10} placeholder="Write your article..." /></div>
            <div><Label>Featured Image URL</Label><Input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} /></div>
            <div><Label>Author</Label><Input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.is_published} onCheckedChange={v => setForm(f => ({ ...f, is_published: v }))} /><Label>Published</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close}>Cancel</Button>
            <Button onClick={() => { if (!form.title.trim()) { toast.error('Title required'); return; } save.mutate({ ...form, id: editingId || undefined }); }} disabled={save.isPending}>{save.isPending ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
