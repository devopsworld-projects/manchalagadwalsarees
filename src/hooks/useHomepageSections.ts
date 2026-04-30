import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HomepageSection {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  content: Record<string, any>;
  image_url: string | null;
  is_enabled: boolean;
  sort_order: number;
}

export function useHomepageSections() {
  return useQuery({
    queryKey: ['homepage_sections'],
    queryFn: async (): Promise<HomepageSection[]> => {
      const { data, error } = await supabase
        .from('homepage_sections')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data ?? []) as HomepageSection[];
    },
    staleTime: 60_000,
  });
}

/**
 * Returns true when the section should render.
 * - Section row missing → render (default behaviour, safe fallback)
 * - Section disabled    → hide
 * - Section enabled     → render
 */
export function useSectionEnabled(key: string): boolean {
  const { data } = useHomepageSections();
  if (!data) return true;
  const row = data.find((s) => s.section_key === key);
  if (!row) return true;
  return row.is_enabled;
}
