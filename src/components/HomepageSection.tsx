import { ReactNode } from 'react';
import { useSectionEnabled } from '@/hooks/useHomepageSections';

interface Props {
  sectionKey: string;
  children: ReactNode;
  /** When true, hide this section if it has no meaningful content to show. */
  hideIfEmpty?: boolean;
  /** Caller-evaluated emptiness flag (e.g. zero items returned from a query). */
  isEmpty?: boolean;
}

/**
 * Conditionally renders a homepage section based on:
 *  1. Admin enable/disable from the homepage_sections table
 *  2. Optional caller-provided "isEmpty" flag for graceful fallback
 *     (so the homepage never leaves an empty layout block).
 */
export function HomepageSection({ sectionKey, children, hideIfEmpty, isEmpty }: Props) {
  const enabled = useSectionEnabled(sectionKey);
  if (!enabled) return null;
  if (hideIfEmpty && isEmpty) return null;
  return <>{children}</>;
}
