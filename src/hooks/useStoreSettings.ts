import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type StoreSettings = Record<string, string>;

export function useStoreSettings() {
  return useQuery({
    queryKey: ['store-settings-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('key, value');
      if (error) throw error;
      const map: StoreSettings = {};
      (data || []).forEach(s => {
        map[s.key] = s.value || '';
      });
      return map;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
