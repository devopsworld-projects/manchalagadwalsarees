import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type MenuItem = {
  id: string;
  label: string;
  slug: string | null;
  url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  menu_group: string;
  children?: MenuItem[];
};

export function useMenuItems(group = 'main') {
  return useQuery({
    queryKey: ['menu-items', group],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('menu_group', group)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;

      const items = (data || []) as MenuItem[];
      const topLevel = items.filter(i => !i.parent_id);
      return topLevel.map(parent => ({
        ...parent,
        children: items.filter(i => i.parent_id === parent.id),
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}
