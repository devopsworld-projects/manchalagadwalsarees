import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useBulkSelect } from '@/hooks/useBulkSelect';

type Coupon = {
  id: string; code: string; discount_type: string; discount_value: number;
  min_order_amount: number; max_uses: number | null; usage_count: number;
  expires_at: string | null; is_active: boolean;
};

const defaultForm = {
  code: '', discount_type: 'percentage', discount_value: 0,
  min_order_amount: 0, max_uses: '', expires_at: '', is_active: true,
};

export default function AdminCoupons() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async () => {
      const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Coupon[];
    },
  });

  const bulk = useBulkSelect(coupons);

  const saveMutation = useMutation({
    mutationFn: async (d: typeof form & { id?: string }) => {
      const payload = { code: d.code.toUpperCase().trim(), discount_type: d.discount_type, discount_value: d.discount_value, min_order_amount: d.min_order_amount, max_uses: d.max_uses ? parseInt(d.max_uses) : null, expires_at: d.expires_at || null, is_active: d.is_active };
      if (d.id) { const { error } = await supabase.from('coupons').update(payload).eq('id', d.id); if (error) throw error; }
      else { const { error } = await supabase.from('coupons').insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-coupons'] }); toast.success('Coupon saved'); close(); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('coupons').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-coupons'] }); toast.success('Deleted'); },
    onError: (e: any) => toast.error(e.message),
  });

  const bulkDel = useMutation({
    mutationFn: async (ids: string[]) => {
      for (const id of ids) { const { error } = await supabase.from('coupons').delete().eq('id', id); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-coupons'] }); toast.success(`${bulk.count} coupons deleted`); bulk.clear(); },
    onError: (e: any) => toast.error(e.message),
  });

  const close = () => { setDialogOpen(false); setEditingId(null); setForm(defaultForm); };

  const openEdit = (c: Coupon) => {
    setEditingId(c.id);
    setForm({ code: c.code, discount_type: c.discount_type, discount_value: c.discount_value, min_order_amount: c.min_order_amount, max_uses: c.max_uses?.toString() || '', expires_at: c.expires_at ? c.expires_at.split('T')[0] : '', is_active: c.is_active });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Coupons & Discounts</h1><p className="text-muted-foreground text-sm">Manage discount codes for your store.</p></div>
        <div className="flex gap-2">
          {bulk.someSelected && (
            <Button variant="destructive" onClick={() => { if (confirm(`Delete ${bulk.count} coupons?`)) bulkDel.mutate(Array.from(bulk.selectedIds)); }} disabled={bulkDel.isPending}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete {bulk.count}
            </Button>
          )}
          <Button onClick={() => { setForm(defaultForm); setEditingId(null); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Add Coupon</Button>
        </div>
      </div>

      {isLoading ? <p className="text-center py-12 text-muted-foreground">Loading...</p> : coupons.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">No coupons yet.</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 w-10"><Checkbox checked={bulk.allSelected} onCheckedChange={bulk.toggleAll} /></th>
                <th className="text-left p-3 font-medium">Code</th>
                <th className="text-left p-3 font-medium hidden sm:table-cell">Discount</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Min Order</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Usage</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.id} className={`border-t ${bulk.selectedIds.has(c.id) ? 'bg-primary/5' : ''}`}>
                  <td className="p-3"><Checkbox checked={bulk.selectedIds.has(c.id)} onCheckedChange={() => bulk.toggle(c.id)} /></td>
                  <td className="p-3 font-mono font-bold">{c.code}</td>
                  <td className="p-3 hidden sm:table-cell">{c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}</td>
                  <td className="p-3 hidden md:table-cell">₹{c.min_order_amount}</td>
                  <td className="p-3 hidden md:table-cell">{c.usage_count}{c.max_uses ? `/${c.max_uses}` : ''}</td>
                  <td className="p-3"><Badge variant={c.is_active ? 'default' : 'secondary'}>{c.is_active ? 'Active' : 'Inactive'}</Badge></td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { navigator.clipboard.writeText(c.code); toast.success('Copied!'); }}><Copy className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteMutation.mutate(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={v => { if (!v) close(); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? 'Edit Coupon' : 'Add Coupon'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Code *</Label><Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="e.g. SUMMER20" className="font-mono uppercase" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Type</Label>
                <Select value={form.discount_type} onValueChange={v => setForm(f => ({ ...f, discount_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="percentage">Percentage (%)</SelectItem><SelectItem value="fixed">Fixed (₹)</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label>Value</Label><Input type="number" value={form.discount_value} onChange={e => setForm(f => ({ ...f, discount_value: parseFloat(e.target.value) || 0 }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Min Order (₹)</Label><Input type="number" value={form.min_order_amount} onChange={e => setForm(f => ({ ...f, min_order_amount: parseFloat(e.target.value) || 0 }))} /></div>
              <div><Label>Max Uses (blank = unlimited)</Label><Input type="number" value={form.max_uses} onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))} /></div>
            </div>
            <div><Label>Expires At</Label><Input type="date" value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} /><Label>Active</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close}>Cancel</Button>
            <Button onClick={() => { if (!form.code.trim()) { toast.error('Code required'); return; } saveMutation.mutate({ ...form, id: editingId || undefined }); }} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
