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

const defaultForm = { name: '', type: 'flat', rate: 0, free_above_amount: '', min_weight: '', max_weight: '', is_active: true };

export default function AdminShipping() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const { data: rates = [], isLoading } = useQuery({
    queryKey: ['admin-shipping'],
    queryFn: async () => {
      const { data, error } = await supabase.from('shipping_rates').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async (d: any) => {
      const payload = { name: d.name, type: d.type, rate: d.rate, free_above_amount: d.free_above_amount ? parseFloat(d.free_above_amount) : null, min_weight: d.min_weight ? parseFloat(d.min_weight) : null, max_weight: d.max_weight ? parseFloat(d.max_weight) : null, is_active: d.is_active };
      if (d.id) { const { error } = await supabase.from('shipping_rates').update(payload).eq('id', d.id); if (error) throw error; }
      else { const { error } = await supabase.from('shipping_rates').insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-shipping'] }); toast.success('Saved'); close(); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('shipping_rates').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-shipping'] }); toast.success('Deleted'); },
  });

  const close = () => { setDialogOpen(false); setEditingId(null); setForm(defaultForm); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Shipping Rates</h1><p className="text-muted-foreground text-sm">Configure shipping options.</p></div>
        <Button onClick={() => { setForm(defaultForm); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Add Rate</Button>
      </div>

      {isLoading ? <p className="text-center py-12 text-muted-foreground">Loading...</p> : rates.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">No shipping rates configured.</div>
      ) : (
        <div className="grid gap-4">
          {rates.map((r: any) => (
            <div key={r.id} className="border rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{r.name}</p>
                <p className="text-sm text-muted-foreground">
                  {r.type === 'flat' && `Flat rate: ₹${r.rate}`}
                  {r.type === 'free_above' && `Free above ₹${r.free_above_amount}, otherwise ₹${r.rate}`}
                  {r.type === 'weight_based' && `₹${r.rate}/kg (${r.min_weight || 0}-${r.max_weight || '∞'}kg)`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingId(r.id); setForm({ name: r.name, type: r.type, rate: r.rate, free_above_amount: r.free_above_amount?.toString() || '', min_weight: r.min_weight?.toString() || '', max_weight: r.max_weight?.toString() || '', is_active: r.is_active }); setDialogOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => del.mutate(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={v => { if (!v) close(); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? 'Edit' : 'Add'} Shipping Rate</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Standard Shipping" /></div>
            <div><Label>Type</Label>
              <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="flat">Flat Rate</SelectItem><SelectItem value="free_above">Free Above Amount</SelectItem><SelectItem value="weight_based">Weight Based</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>Rate (₹)</Label><Input type="number" value={form.rate} onChange={e => setForm(f => ({ ...f, rate: parseFloat(e.target.value) || 0 }))} /></div>
            {form.type === 'free_above' && <div><Label>Free Above (₹)</Label><Input type="number" value={form.free_above_amount} onChange={e => setForm(f => ({ ...f, free_above_amount: e.target.value }))} /></div>}
            {form.type === 'weight_based' && <div className="grid grid-cols-2 gap-4"><div><Label>Min Weight (kg)</Label><Input type="number" value={form.min_weight} onChange={e => setForm(f => ({ ...f, min_weight: e.target.value }))} /></div><div><Label>Max Weight (kg)</Label><Input type="number" value={form.max_weight} onChange={e => setForm(f => ({ ...f, max_weight: e.target.value }))} /></div></div>}
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
