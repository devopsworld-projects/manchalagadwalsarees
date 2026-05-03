import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const defaultForm = {
  name: '',
  address: '',
  city: 'Hyderabad',
  state: 'Telangana',
  pincode: '',
  phone: '',
  hours: 'Open 24 hours',
  map_url: '',
  directions_url: '',
  rating: 0,
  reviews_count: 0,
  photo_url: '',
  is_active: true,
  sort_order: 0,
};

export default function AdminStoreLocations() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-store-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_locations')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async (d: any) => {
      const payload = {
        name: d.name,
        address: d.address,
        city: d.city || null,
        state: d.state || null,
        pincode: d.pincode || null,
        phone: d.phone || null,
        hours: d.hours || null,
        map_url: d.map_url || null,
        directions_url: d.directions_url || null,
        rating: d.rating || null,
        reviews_count: d.reviews_count || null,
        photo_url: d.photo_url || null,
        is_active: d.is_active,
        sort_order: d.sort_order,
      };
      if (d.id) {
        const { error } = await supabase.from('store_locations').update(payload).eq('id', d.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('store_locations').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-store-locations'] });
      qc.invalidateQueries({ queryKey: ['store-locations-public'] });
      toast.success('Saved');
      close();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('store_locations').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-store-locations'] });
      qc.invalidateQueries({ queryKey: ['store-locations-public'] });
      toast.success('Deleted');
    },
  });

  const close = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(defaultForm);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Store Locations</h1>
          <p className="text-muted-foreground text-sm">Manage your physical boutique locations shown on the homepage.</p>
        </div>
        <Button onClick={() => { setForm({ ...defaultForm, sort_order: items.length }); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Location
        </Button>
      </div>

      {isLoading ? (
        <p className="text-center py-12 text-muted-foreground">Loading...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">No store locations yet.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((r: any) => (
            <div key={r.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="min-w-0">
                  <p className="font-medium flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" /> {r.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{r.address}, {r.city}, {r.state} - {r.pincode}</p>
                  {r.phone && <p className="text-xs text-muted-foreground mt-1">📞 {r.phone}</p>}
                  {r.rating != null && r.rating > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">⭐ {r.rating} · {r.reviews_count} reviews</p>
                  )}
                </div>
                <Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Hidden'}</Badge>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingId(r.id);
                    setForm({
                      name: r.name,
                      address: r.address,
                      city: r.city || '',
                      state: r.state || '',
                      pincode: r.pincode || '',
                      phone: r.phone || '',
                      hours: r.hours || '',
                      map_url: r.map_url || '',
                      directions_url: r.directions_url || '',
                      rating: r.rating || 0,
                      reviews_count: r.reviews_count || 0,
                      photo_url: r.photo_url || '',
                      is_active: r.is_active,
                      sort_order: r.sort_order,
                    });
                    setDialogOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => { if (confirm('Delete this location?')) del.mutate(r.id); }}>
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(v) => { if (!v) close(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit' : 'Add'} Store Location</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Store Name *</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <Label>Address *</Label>
              <Textarea rows={2} value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>City</Label>
                <Input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
              </div>
              <div>
                <Label>State</Label>
                <Input value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} />
              </div>
              <div>
                <Label>Pincode</Label>
                <Input value={form.pincode} onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <Label>Hours</Label>
                <Input value={form.hours} onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>Google Maps URL</Label>
              <Input value={form.map_url} onChange={(e) => setForm((f) => ({ ...f, map_url: e.target.value }))} placeholder="https://www.google.com/maps/place/..." />
            </div>
            <div>
              <Label>Get Directions URL</Label>
              <Input value={form.directions_url} onChange={(e) => setForm((f) => ({ ...f, directions_url: e.target.value }))} placeholder="https://www.google.com/maps/dir/?api=1&destination=..." />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Rating (0-5)</Label>
                <Input type="number" step="0.1" min={0} max={5} value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div>
                <Label>Reviews Count</Label>
                <Input type="number" value={form.reviews_count} onChange={(e) => setForm((f) => ({ ...f, reviews_count: parseInt(e.target.value) || 0 }))} />
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close}>Cancel</Button>
            <Button
              onClick={() => {
                if (!form.name.trim() || !form.address.trim()) {
                  toast.error('Name and address required');
                  return;
                }
                save.mutate({ ...form, id: editingId || undefined });
              }}
              disabled={save.isPending}
            >
              {save.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
