import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  index?: string;          // e.g. "I" / "II" — Roman numeral mark
  eyebrow?: string;        // small uppercase label
  title: ReactNode;        // main display title (can include <em>, <span>)
  subtitle?: string;
  align?: 'left' | 'center';
  link?: { to: string; label: string };
}

/**
 * Editorial section header — large display type, Roman numeral mark,
 * gold hairline, optional CTA link. Used across the homepage to give
 * every section a unified premium voice.
 */
export function SectionHeader({ index, eyebrow, title, subtitle, align = 'left', link }: Props) {
  const alignCls = align === 'center' ? 'text-center items-center' : 'text-left items-start';
  return (
    <div className={`flex flex-col ${alignCls} mb-14 md:mb-20 max-w-3xl ${align === 'center' ? 'mx-auto' : ''}`}>
      {/* Roman numeral + eyebrow row */}
      <div className={`flex items-baseline gap-5 mb-6 ${align === 'center' ? 'justify-center' : ''}`}>
        {index && (
          <span className="font-display text-[42px] md:text-[64px] leading-none font-light text-accent/50 tabular-nums">
            {index}.
          </span>
        )}
        <div className="flex items-center gap-3">
          <div className="w-10 h-px bg-accent" />
          {eyebrow && (
            <span className="font-body text-[10px] tracking-luxe uppercase text-accent">
              {eyebrow}
            </span>
          )}
        </div>
      </div>

      {/* Massive display title */}
      <h2 className="font-display text-[40px] sm:text-[56px] md:text-[72px] lg:text-[88px] leading-[0.95] font-medium tracking-[-0.01em] text-foreground">
        {title}
      </h2>

      {subtitle && (
        <p className={`font-serif text-base md:text-lg text-muted-foreground italic mt-6 ${align === 'center' ? '' : 'max-w-xl'}`}>
          {subtitle}
        </p>
      )}

      {link && (
        <Link
          to={link.to}
          className="link-luxe mt-8 font-display text-[10px] tracking-luxe uppercase text-accent"
        >
          {link.label} →
        </Link>
      )}
    </div>
  );
}
