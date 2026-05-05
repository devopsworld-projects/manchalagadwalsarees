import { ReactNode } from 'react';
import { Motif } from './Motif';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  actions?: ReactNode;
}

export function SectionHeader({ eyebrow, title, subtitle, align = 'center', actions }: Props) {
  const isCenter = align === 'center';
  return (
    <div
      className={`mb-10 md:mb-14 flex flex-col gap-5 md:gap-6 ${
        isCenter
          ? 'items-center text-center'
          : 'md:flex-row md:items-end md:justify-between text-left'
      }`}
    >
      <div className={isCenter ? 'flex flex-col items-center' : ''}>
        {eyebrow && (
          <div className={`flex items-center gap-3 mb-3 md:mb-4 ${isCenter ? 'justify-center' : ''}`}>
            <span className="w-6 md:w-10 h-px bg-accent/50" />
            <Motif kind="paisley" className="h-4 w-3 text-accent/70" />
            <span className="font-body text-[9px] md:text-[10px] tracking-[0.35em] md:tracking-[0.4em] uppercase text-accent">
              {eyebrow}
            </span>
            <Motif kind="paisley" className="h-4 w-3 text-accent/70 -scale-x-100" />
            <span className="w-6 md:w-10 h-px bg-accent/50" />
          </div>
        )}
        <h2 className="font-display text-[26px] leading-[1.1] sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-foreground tracking-wide">
          {title}
        </h2>
        <div className={`mt-4 md:mt-5 h-px w-16 md:w-20 bg-gradient-to-r from-transparent via-accent to-transparent ${isCenter ? 'mx-auto' : ''}`} />
        {subtitle && (
          <p
            className={`font-serif italic text-sm md:text-base lg:text-lg text-muted-foreground mt-4 max-w-md ${
              isCenter ? 'mx-auto' : ''
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
