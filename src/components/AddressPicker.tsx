import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { MapPin, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export interface SavedAddress {
  id: string;
  label: string;
  full_name: string;
  phone: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

interface Props {
  selectedId: string | null;
  onSelect: (addr: SavedAddress) => void;
}

/** GoKwik-style: shows saved addresses with one-tap selection. Auto-picks default. */
export function AddressPicker({ selectedId, onSelect }: Props) {
  const { user } = useAuth();
  const [autoPicked, setAutoPicked] = useState(false);

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
      return data as SavedAddress[];
    },
    enabled: !!user,
  });

  // Auto-select default address
  useEffect(() => {
    if (autoPicked || addresses.length === 0 || selectedId) return;
    const def = addresses.find(a => a.is_default) || addresses[0];
    onSelect(def);
    setAutoPicked(true);
  }, [addresses, autoPicked, selectedId, onSelect]);

  if (!user) return null;
  if (isLoading) return <div className="text-sm text-muted-foreground font-body">Loading addresses…</div>;

  if (addresses.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-lg p-5 text-center bg-muted/20">
        <MapPin className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
        <p className="font-body text-sm text-muted-foreground mb-3">No saved addresses yet</p>
        <Button asChild variant="outline" size="sm" className="font-body">
          <Link to="/account/addresses"><Plus className="h-4 w-4 mr-1" /> Add address</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold">Deliver to</h3>
        <Link to="/account/addresses" className="text-xs text-primary underline font-body">Manage</Link>
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        {addresses.map(addr => {
          const active = selectedId === addr.id;
          return (
            <button
              key={addr.id}
              type="button"
              onClick={() => onSelect(addr)}
              className={`relative text-left border rounded-lg p-3 transition-colors min-h-[44px] ${
                active ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              {active && <Check className="absolute top-2 right-2 h-4 w-4 text-primary" />}
              <div className="flex items-center gap-2 mb-1">
                <span className="font-display text-[10px] tracking-wider uppercase bg-muted px-1.5 py-0.5">{addr.label}</span>
                {addr.is_default && <span className="text-[9px] text-accent font-body uppercase tracking-wider">Default</span>}
              </div>
              <p className="font-body text-sm font-semibold leading-tight">{addr.full_name}</p>
              <p className="font-body text-xs text-muted-foreground leading-snug mt-1 line-clamp-2">
                {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
              </p>
              {addr.phone && <p className="font-body text-xs text-muted-foreground mt-0.5">{addr.phone}</p>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
