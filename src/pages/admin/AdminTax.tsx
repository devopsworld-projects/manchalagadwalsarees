import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const defaultForm = { name: '', rate: 0, applies_to: 'all', category_id: '', is_active: true };

export default function AdminTax() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ['admin-tax'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tax_rules').select('*, categories(name)').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories-list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('id, name').order('name');
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async (d: any) => {
      const payload = { name: d.name, rate: d.rate, applies_to: d.applies_to, category_id: d.category_id || null, is_active: d.is_active };
      if (d.id) { const { error } = await supabase.from('tax_rules').update(payload).eq('id', d.id); if (error) throw error; }
      else { const { error } = await supabase.from('tax_rules').insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-tax'] }); toast.success('Saved'); close(); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('tax_rules').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-tax'] }); toast.success('Deleted'); },
  });

  const close = () => { setDialogOpen(false); setEditingId(null); setForm(defaultForm); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Tax Rules</h1><p className="text-muted-foreground text-sm">Configure GST/tax rates.</p></div>
        <Button onClick={() => { setForm(defaultForm); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Add Rule</Button>
      </div>

      {isLoading ? <p className="text-center py-12 text-muted-foreground">Loading...</p> : rules.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">No tax rules configured.</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50"><tr><th className="text-left p-3">Name</th><th className="text-left p-3">Rate</th><th className="text-left p-3 hidden sm:table-cell">Applies To</th><th className="text-left p-3">Status</th><th className="text-right p-3">Actions</th></tr></thead>
            <tbody>
              {rules.map((r: any) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3 font-medium">{r.name}</td>
                  <td className="p-3">{r.rate}%</td>
                  <td className="p-3 hidden sm:table-cell">{r.applies_to === 'all' ? 'All products' : (r as any).categories?.name || 'Category'}</td>
                  <td className="p-3"><Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge></td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingId(r.id); setForm({ name: r.name, rate: r.rate, applies_to: r.applies_to, category_id: r.category_id || '', is_active: r.is_active }); setDialogOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => del.mutate(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={v => { if (!v) close(); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? 'Edit' : 'Add'} Tax Rule</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. GST 18%" /></div>
            <div><Label>Rate (%)</Label><Input type="number" value={form.rate} onChange={e => setForm(f => ({ ...f, rate: parseFloat(e.target.value) || 0 }))} /></div>
            <div><Label>Applies To</Label>
              <Select value={form.applies_to} onValueChange={v => setForm(f => ({ ...f, applies_to: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Products</SelectItem><SelectItem value="category">Specific Category</SelectItem></SelectContent>
              </Select>
            </div>
            {form.applies_to === 'category' && (
              <div><Label>Category</Label>
                <Select value={form.category_id} onValueChange={v => setForm(f => ({ ...f, category_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} /><Label>Active</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close}>Cancel</Button>
            <Button onClick={() => { if (!form.name.trim()) { toast.error('Name required'); return; } save.mutate({ ...form, id: editingId || undefined }); }} disabled={save.isPending}>{save.isPending ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
