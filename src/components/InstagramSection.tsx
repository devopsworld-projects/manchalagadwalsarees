import { useEffect, useRef } from 'react';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { Instagram } from 'lucide-react';

/**
 * Instagram feed powered by Behold.so (free widget).
 * Admin enters their Behold feed ID in Settings → Social.
 * Falls back to a styled "Follow us" CTA when no feed is configured.
 */
export function InstagramSection() {
  const { data: settings } = useStoreSettings();
  const enabled = (settings?.instagram_section_enabled ?? 'true') === 'true';
  const feedId = settings?.behold_feed_id?.trim();
  const title = settings?.instagram_section_title || 'Follow Our Journey';
  const subtitle = settings?.instagram_section_subtitle || '@manchala_gadwal_sareee';
  const igUrl = settings?.social_instagram || 'https://www.instagram.com/manchala_gadwal_sareee';
  const loaded = useRef(false);

  useEffect(() => {
    if (!feedId || loaded.current) return;
    if (document.querySelector('script[data-behold]')) { loaded.current = true; return; }
    const s = document.createElement('script');
    s.src = `https://w.behold.so/widget.js`;
    s.type = 'module';
    s.setAttribute('data-behold', 'true');
    document.body.appendChild(s);
    loaded.current = true;
  }, [feedId]);

  if (!enabled) return null;

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container px-4">
        <div className="text-center mb-8 md:mb-10">
          <span className="text-accent text-[8px] tracking-[0.5em]">◆&nbsp;&nbsp;INSTAGRAM&nbsp;&nbsp;◆</span>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-primary mt-3">{title}</h2>
          <p className="font-body text-xs md:text-sm text-muted-foreground mt-2 break-all">{subtitle}</p>
          <div className="w-16 ornate-line mt-4 mx-auto" />
        </div>

        {feedId ? (
          // @ts-expect-error custom element
          <behold-widget feed-id={feedId} class="block max-w-5xl mx-auto" />
        ) : (
          <div className="max-w-3xl mx-auto text-center border border-border bg-muted/20 p-10">
            <Instagram className="h-10 w-10 mx-auto text-primary mb-4" />
            <p className="font-body text-base mb-5 text-muted-foreground">
              Discover our latest weaves, behind-the-scenes craft, and bridal stories.
            </p>
            <a
              href={igUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-display text-[11px] tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors min-h-[44px]"
            >
              <Instagram className="h-4 w-4" /> Follow on Instagram
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
