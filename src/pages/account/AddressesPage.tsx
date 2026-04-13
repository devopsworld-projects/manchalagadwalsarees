import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, MapPin, Star, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AddressForm {
  label: string; full_name: string; phone: string;
  address_line1: string; address_line2: string;
  city: string; state: string; pincode: string; is_default: boolean;
}

const emptyForm: AddressForm = { label: 'Home', full_name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', pincode: '', is_default: false };

export default function AddressesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressForm>(emptyForm);

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['user-addresses', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('user_addresses').select('*').eq('user_id', user!.id).order('is_default', { ascending: false }).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (form.is_default) await supabase.from('user_addresses').update({ is_default: false }).eq('user_id', user!.id);
      if (editingId) {
        const { error } = await supabase.from('user_addresses').update({ ...form }).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('user_addresses').insert({ ...form, user_id: user!.id });
        if (error) throw error;
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['user-addresses'] }); setDialogOpen(false); setEditingId(null); setForm(emptyForm); toast.success(editingId ? 'Address updated' : 'Address added'); },
    onError: () => toast.error('Failed to save address'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('user_addresses').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['user-addresses'] }); toast.success('Address deleted'); },
    onError: () => toast.error('Failed to delete'),
  });

  const openEdit = (addr: any) => {
    setEditingId(addr.id);
    setForm({ label: addr.label, full_name: addr.full_name, phone: addr.phone || '', address_line1: addr.address_line1, address_line2: addr.address_line2 || '', city: addr.city, state: addr.state, pincode: addr.pincode, is_default: addr.is_default });
    setDialogOpen(true);
  };

  const openAdd = () => { setEditingId(null); setForm({ ...emptyForm, is_default: addresses.length === 0 }); setDialogOpen(true); };
  const updateField = (key: keyof AddressForm, value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }));

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-accent text-[7px]">◆</span>
          <h2 className="font-display text-lg font-bold tracking-[0.1em] uppercase">My Addresses</h2>
        </div>
        <button onClick={openAdd} className="bg-accent text-accent-foreground px-5 py-2 font-display text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-1.5 hover:bg-accent/90 transition-colors">
          <Plus className="h-3 w-3" /> Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16 border border-border relative">
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-accent/20" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-accent/20" />
          <MapPin className="h-10 w-10 text-accent/40 mx-auto mb-3" />
          <p className="font-display text-sm tracking-wider text-muted-foreground uppercase">No addresses saved yet</p>
          <button onClick={openAdd} className="mt-4 border border-primary text-primary px-6 py-2 font-display text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-primary hover:text-primary-foreground transition-colors">
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr: any) => (
            <div key={addr.id} className="relative border border-border p-5 group">
              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-accent/20" />
              {addr.is_default && (
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[9px] font-display font-bold tracking-[0.15em] text-accent uppercase">
                  <Star className="h-3 w-3 fill-accent" /> Default
                </span>
              )}
              <p className="font-display text-[10px] text-accent tracking-[0.2em] uppercase mb-1">{addr.label}</p>
              <p className="font-body font-medium text-sm">{addr.full_name}</p>
              <p className="font-body text-sm text-muted-foreground mt-1">{addr.address_line1}{addr.address_line2 && `, ${addr.address_line2}`}</p>
              <p className="font-body text-sm text-muted-foreground">{addr.city}, {addr.state} - {addr.pincode}</p>
              {addr.phone && <p className="font-body text-sm text-muted-foreground mt-1">📞 {addr.phone}</p>}
              <div className="flex gap-2 mt-4">
                <button onClick={() => openEdit(addr)} className="border border-border px-4 py-1.5 font-display text-[9px] tracking-[0.15em] uppercase hover:border-accent hover:text-accent transition-colors flex items-center gap-1">
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button onClick={() => deleteMutation.mutate(addr.id)} className="px-4 py-1.5 font-display text-[9px] tracking-[0.15em] uppercase text-destructive hover:bg-destructive/5 transition-colors flex items-center gap-1">
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display tracking-wider uppercase text-sm">{editingId ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={e => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-display text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/60 mb-1.5 block">Label</label>
                <Input value={form.label} onChange={e => updateField('label', e.target.value)} className="font-body border-border" placeholder="Home / Work" required />
              </div>
              <div>
                <label className="font-display text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/60 mb-1.5 block">Full Name</label>
                <Input value={form.full_name} onChange={e => updateField('full_name', e.target.value)} className="font-body border-border" required />
              </div>
            </div>
            <div>
              <label className="font-display text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/60 mb-1.5 block">Phone</label>
              <Input value={form.phone} onChange={e => updateField('phone', e.target.value)} className="font-body border-border" placeholder="+91 XXXXX XXXXX" />
            </div>
            <div>
              <label className="font-display text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/60 mb-1.5 block">Address Line 1</label>
              <Input value={form.address_line1} onChange={e => updateField('address_line1', e.target.value)} className="font-body border-border" required />
            </div>
            <div>
              <label className="font-display text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/60 mb-1.5 block">Address Line 2</label>
              <Input value={form.address_line2} onChange={e => updateField('address_line2', e.target.value)} className="font-body border-border" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-display text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/60 mb-1.5 block">City</label>
                <Input value={form.city} onChange={e => updateField('city', e.target.value)} className="font-body border-border" required />
              </div>
              <div>
                <label className="font-display text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/60 mb-1.5 block">State</label>
                <Input value={form.state} onChange={e => updateField('state', e.target.value)} className="font-body border-border" required />
              </div>
              <div>
                <label className="font-display text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/60 mb-1.5 block">Pincode</label>
                <Input value={form.pincode} onChange={e => updateField('pincode', e.target.value)} className="font-body border-border" required />
              </div>
            </div>
            <label className="flex items-center gap-2 font-body text-sm cursor-pointer">
              <input type="checkbox" checked={form.is_default} onChange={e => updateField('is_default', e.target.checked)} className="rounded" />
              Set as default address
            </label>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saveMutation.isPending} className="flex-1 bg-primary text-primary-foreground py-3 font-display text-[11px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50">
                {saveMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {editingId ? 'Update Address' : 'Save Address'}
              </button>
              <button type="button" onClick={() => setDialogOpen(false)} className="border border-border px-6 py-3 font-display text-[11px] tracking-[0.15em] uppercase hover:bg-muted transition-colors">Cancel</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
