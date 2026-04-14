import { useState, useCallback } from 'react';

export function useBulkSelect<T extends { id: string }>(items: T[] | undefined) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (!items) return;
    setSelectedIds(prev => {
      if (prev.size === items.length) return new Set();
      return new Set(items.map(i => i.id));
    });
  }, [items]);

  const clear = useCallback(() => setSelectedIds(new Set()), []);

  const allSelected = !!items && items.length > 0 && selectedIds.size === items.length;
  const someSelected = selectedIds.size > 0;

  return { selectedIds, toggle, toggleAll, clear, allSelected, someSelected, count: selectedIds.size };
}
