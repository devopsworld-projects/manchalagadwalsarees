import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Pencil, Trash2, X, Upload, ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { useBulkSelect } from '@/hooks/useBulkSelect';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Category = Tables<'categories'>;

const AdminCategories = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', sort_order: '0', image_url: '' });

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const bulk = useBulkSelect(categories);

  const saveMutation = useMutation({
    mutationFn: async (cat: TablesInsert<'categories'>) => {
      if (editing) { const { error } = await supabase.from('categories').update(cat).eq('id', editing.id); if (error) throw error; }
      else { const { error } = await supabase.from('categories').insert(cat); if (error) throw error; }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-categories'] }); toast({ title: editing ? 'Category updated' : 'Category created' }); resetForm(); },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('categories').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-categories'] }); toast({ title: 'Category deleted' }); },
  });

  const bulkDel = useMutation({
    mutationFn: async (ids: string[]) => {
      for (const id of ids) { const { error } = await supabase.from('categories').delete().eq('id', id); if (error) throw error; }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-categories'] }); toast({ title: `${bulk.count} categories deleted` }); bulk.clear(); },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const resetForm = () => { setForm({ name: '', slug: '', description: '', sort_order: '0', image_url: '' }); setEditing(null); setShowForm(false); };

  const startEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug, description: c.description || '', sort_order: String(c.sort_order || 0), image_url: c.image_url || '' });
    setShowForm(true);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `categories/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from('product-images').upload(path, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path);
      setForm(f => ({ ...f, image_url: publicUrl }));
      toast({ title: 'Image uploaded' });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({ name: form.name, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'), description: form.description || null, sort_order: Number(form.sort_order), image_url: form.image_url || null });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">Categories</h2>
        <div className="flex gap-2">
          {bulk.someSelected && (
            <button onClick={() => { if (confirm(`Delete ${bulk.count} categories?`)) bulkDel.mutate(Array.from(bulk.selectedIds)); }}
              disabled={bulkDel.isPending}
              className="flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 text-sm font-body tracking-wider hover:bg-destructive/90 transition-colors disabled:opacity-50">
              <Trash2 className="h-4 w-4" /> DELETE {bulk.count}
            </button>
          )}
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-body tracking-wider hover:bg-burgundy-light transition-colors">
            <Plus className="h-4 w-4" /> ADD CATEGORY
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-semibold">{editing ? 'Edit Category' : 'New Category'}</h3>
              <button onClick={resetForm}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="font-body text-sm font-semibold block mb-1">Name *</label><input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-border px-3 py-2 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" /></div>
              <div><label className="font-body text-sm font-semibold block mb-1">Slug</label><input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated" className="w-full border border-border px-3 py-2 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" /></div>
              <div><label className="font-body text-sm font-semibold block mb-1">Description</label><textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full border border-border px-3 py-2 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" /></div>
              <div><label className="font-body text-sm font-semibold block mb-1">Sort Order</label><input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} className="w-full border border-border px-3 py-2 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" /></div>
              <div className="flex gap-3">
                <button type="submit" disabled={saveMutation.isPending} className="flex-1 bg-primary text-primary-foreground py-2.5 text-sm tracking-wider font-body hover:bg-burgundy-light transition-colors disabled:opacity-50">{saveMutation.isPending ? 'SAVING...' : editing ? 'UPDATE' : 'CREATE'}</button>
                <button type="button" onClick={resetForm} className="px-6 py-2.5 border border-border text-sm font-body hover:bg-muted transition-colors">CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground font-body">Loading categories...</div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                <th className="p-3 w-10"><Checkbox checked={bulk.allSelected} onCheckedChange={bulk.toggleAll} /></th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Slug</th>
                <th className="text-left p-3">Description</th>
                <th className="text-center p-3">Order</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories?.map(cat => (
                <tr key={cat.id} className={`hover:bg-muted/30 transition-colors ${bulk.selectedIds.has(cat.id) ? 'bg-primary/5' : ''}`}>
                  <td className="p-3"><Checkbox checked={bulk.selectedIds.has(cat.id)} onCheckedChange={() => bulk.toggle(cat.id)} /></td>
                  <td className="p-3 font-body text-sm font-medium">{cat.name}</td>
                  <td className="p-3 font-body text-sm text-muted-foreground">{cat.slug}</td>
                  <td className="p-3 font-body text-sm text-muted-foreground">{cat.description || '—'}</td>
                  <td className="p-3 font-body text-sm text-center">{cat.sort_order}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => startEdit(cat)} className="p-1.5 hover:bg-muted rounded transition-colors"><Pencil className="h-4 w-4 text-muted-foreground" /></button>
                      <button onClick={() => { if (confirm('Delete this category?')) deleteMutation.mutate(cat.id); }} className="p-1.5 hover:bg-destructive/10 rounded transition-colors"><Trash2 className="h-4 w-4 text-destructive" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!categories || categories.length === 0) && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground font-body">No categories yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
