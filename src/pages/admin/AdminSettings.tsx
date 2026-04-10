import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

const AdminSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Record<string, string>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('store_settings').select('*');
      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      settings.forEach(s => { map[s.key] = s.value || ''; });
      setForm(map);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (entries: Record<string, string>) => {
      for (const [key, value] of Object.entries(entries)) {
        const { error } = await supabase
          .from('store_settings')
          .update({ value })
          .eq('key', key);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast({ title: 'Settings saved' });
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const fields = [
    { key: 'store_name', label: 'Store Name', type: 'text' },
    { key: 'store_email', label: 'Contact Email', type: 'email' },
    { key: 'store_phone', label: 'Phone Number', type: 'tel' },
    { key: 'store_address', label: 'Store Address', type: 'textarea' },
    { key: 'currency', label: 'Currency', type: 'text' },
    { key: 'tax_rate', label: 'Tax Rate (%)', type: 'number' },
  ];

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground font-body">Loading settings...</div>;
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Store Settings</h2>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        {fields.map(field => (
          <div key={field.key}>
            <label className="font-body text-sm font-semibold block mb-1">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                rows={3}
                value={form[field.key] || ''}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                className="w-full border border-border px-3 py-2 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            ) : (
              <input
                type={field.type}
                value={form[field.key] || ''}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                className="w-full border border-border px-3 py-2 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 text-sm font-body tracking-wider hover:bg-burgundy-light transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saveMutation.isPending ? 'SAVING...' : 'SAVE SETTINGS'}
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
