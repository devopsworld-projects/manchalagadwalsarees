import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, MapPin, Star, Loader2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AddressForm {
  label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

const emptyForm: AddressForm = {
  label: 'Home',
  full_name: '',
  phone: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  pincode: '',
  is_default: false,
};

export default function AddressesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressForm>(emptyForm);

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['user-addresses', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user!.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (form.is_default) {
        // Unset other defaults
        await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', user!.id);
      }

      if (editingId) {
        const { error } = await supabase
          .from('user_addresses')
          .update({ ...form })
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_addresses')
          .insert({ ...form, user_id: user!.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      toast.success(editingId ? 'Address updated' : 'Address added');
    },
    onError: () => toast.error('Failed to save address'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('user_addresses').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      toast.success('Address deleted');
    },
    onError: () => toast.error('Failed to delete address'),
  });

  const openEdit = (addr: any) => {
    setEditingId(addr.id);
    setForm({
      label: addr.label,
      full_name: addr.full_name,
      phone: addr.phone || '',
      address_line1: addr.address_line1,
      address_line2: addr.address_line2 || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      is_default: addr.is_default,
    });
    setDialogOpen(true);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm, is_default: addresses.length === 0 });
    setDialogOpen(true);
  };

  const updateField = (key: keyof AddressForm, value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold">My Addresses</h2>
        <Button onClick={openAdd} size="sm" className="font-body text-xs tracking-wider uppercase">
          <Plus className="h-4 w-4 mr-1" /> Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-xl border border-border">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-body text-muted-foreground">No addresses saved yet</p>
          <Button onClick={openAdd} variant="outline" size="sm" className="mt-4 font-body text-xs tracking-wider uppercase">
            Add Your First Address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr: any) => (
            <div
              key={addr.id}
              className="relative bg-muted/30 rounded-xl border border-border p-5 group"
            >
              {addr.is_default && (
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-xs font-body text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  <Star className="h-3 w-3" /> Default
                </span>
              )}
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">{addr.label}</p>
              <p className="font-body font-medium text-sm">{addr.full_name}</p>
              <p className="font-body text-sm text-muted-foreground mt-1">
                {addr.address_line1}
                {addr.address_line2 && `, ${addr.address_line2}`}
              </p>
              <p className="font-body text-sm text-muted-foreground">
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
              {addr.phone && (
                <p className="font-body text-sm text-muted-foreground mt-1">📞 {addr.phone}</p>
              )}
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => openEdit(addr)} className="font-body text-xs">
                  <Pencil className="h-3 w-3 mr-1" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(addr.id)}
                  className="font-body text-xs text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={e => { e.preventDefault(); saveMutation.mutate(); }}
            className="space-y-4 mt-2"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="font-body text-sm">Label</Label>
                <Input value={form.label} onChange={e => updateField('label', e.target.value)} className="mt-1 font-body" placeholder="Home / Work" required />
              </div>
              <div>
                <Label className="font-body text-sm">Full Name</Label>
                <Input value={form.full_name} onChange={e => updateField('full_name', e.target.value)} className="mt-1 font-body" required />
              </div>
            </div>
            <div>
              <Label className="font-body text-sm">Phone</Label>
              <Input value={form.phone} onChange={e => updateField('phone', e.target.value)} className="mt-1 font-body" placeholder="+91 XXXXX XXXXX" />
            </div>
            <div>
              <Label className="font-body text-sm">Address Line 1</Label>
              <Input value={form.address_line1} onChange={e => updateField('address_line1', e.target.value)} className="mt-1 font-body" required />
            </div>
            <div>
              <Label className="font-body text-sm">Address Line 2</Label>
              <Input value={form.address_line2} onChange={e => updateField('address_line2', e.target.value)} className="mt-1 font-body" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="font-body text-sm">City</Label>
                <Input value={form.city} onChange={e => updateField('city', e.target.value)} className="mt-1 font-body" required />
              </div>
              <div>
                <Label className="font-body text-sm">State</Label>
                <Input value={form.state} onChange={e => updateField('state', e.target.value)} className="mt-1 font-body" required />
              </div>
              <div>
                <Label className="font-body text-sm">Pincode</Label>
                <Input value={form.pincode} onChange={e => updateField('pincode', e.target.value)} className="mt-1 font-body" required />
              </div>
            </div>
            <label className="flex items-center gap-2 font-body text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_default}
                onChange={e => updateField('is_default', e.target.checked)}
                className="rounded"
              />
              Set as default address
            </label>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saveMutation.isPending} className="font-body tracking-wider uppercase text-xs flex-1">
                {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingId ? 'Update Address' : 'Save Address'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="font-body text-xs">
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
