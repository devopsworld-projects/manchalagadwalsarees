import { SVGProps, useEffect, useRef, useState } from 'react';

type MotifKind = 'paisley' | 'temple' | 'elephant' | 'lotus';
type MotifTint = 'gold' | 'cream' | 'burgundy' | 'auto';
type MotifMotion = 'none' | 'float' | 'sway' | 'hover-lift' | 'hover-rotate';

interface Props extends Omit<SVGProps<SVGSVGElement>, 'color'> {
  kind?: MotifKind;
  /** Color family. 'auto' inherits currentColor — let parent set text-* */
  tint?: MotifTint;
  /** Decorative opacity (0–100). Defaults to a low-contrast value. */
  opacity?: number;
  /** Subtle motion variant. All animations are GPU-friendly + reduced-motion safe. */
  motion?: MotifMotion;
  /** Mirror horizontally — handy for symmetric corner pairs */
  flip?: boolean;
  /** Fade/slide in when scrolled into view */
  reveal?: boolean;
}

const tintClass: Record<MotifTint, string> = {
  gold: 'text-accent',
  cream: 'text-cream dark:text-background',
  burgundy: 'text-primary',
  auto: '',
};

const motionClass: Record<MotifMotion, string> = {
  none: '',
  float: 'motif-float',
  sway: 'motif-sway',
  'hover-lift': 'motif-hover-lift',
  'hover-rotate': 'motif-hover-rotate',
};

/**
 * Subtle decorative SVG motifs (paisley / temple arch / elephant / lotus).
 * Always decorative — aria-hidden + pointer-events-none. Use `tint` for
 * theme-aware coloring or set a `text-*` class on the parent with tint="auto".
 */
export function Motif({
  kind = 'paisley',
  tint = 'gold',
  opacity = 30,
  motion = 'none',
  flip = false,
  reveal = false,
  className = '',
  style,
  ...rest
}: Props) {
  const ref = useRef<SVGSVGElement | null>(null);
  const [shown, setShown] = useState(!reveal);

  useEffect(() => {
    if (!reveal || shown) return;
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [reveal, shown]);

  const finalOpacity = Math.max(0, Math.min(100, opacity)) / 100;
  const common = {
    ref,
    'aria-hidden': true,
    focusable: false as const,
    className: [
      'pointer-events-none select-none',
      tintClass[tint],
      motionClass[motion],
      flip ? '-scale-x-100' : '',
      reveal ? 'motif-reveal' : '',
      reveal && shown ? 'motif-reveal-in' : '',
      className,
    ]
      .filter(Boolean)
      .join(' '),
    style: {
      opacity: reveal && !shown ? 0 : finalOpacity,
      ['--motif-opacity' as any]: finalOpacity,
      ...style,
    },
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 0.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...rest,
  };

  switch (kind) {
    case 'temple':
      return (
        <svg viewBox="0 0 120 40" {...common}>
          <path d="M2 38 H118" />
          <path d="M10 38 V20 L20 10 L30 20 V38" />
          <path d="M30 38 V16 L42 4 L54 16 V38" />
          <path d="M54 38 V12 L66 0 L78 12 V38" />
          <path d="M78 38 V16 L90 4 L102 16 V38" />
          <path d="M102 38 V20 L110 10 L118 20" />
          <circle cx="66" cy="6" r="1.2" fill="currentColor" />
          <circle cx="42" cy="10" r="0.9" fill="currentColor" />
          <circle cx="90" cy="10" r="0.9" fill="currentColor" />
        </svg>
      );
    case 'elephant':
      return (
        <svg viewBox="0 0 120 60" {...common}>
          <path d="M14 50 c0-14 12-26 28-26 c14 0 22 8 26 16 c4 8 12 10 18 6 c6-4 6-12 0-14 c-6-2-10 2-10 6" />
          <path d="M14 50 v6 M28 50 v6 M52 50 v6 M66 50 v6" />
          <path d="M30 30 c-4-6-2-14 6-16 c8-2 14 4 14 10" />
          <circle cx="40" cy="28" r="1" fill="currentColor" />
          <path d="M70 38 q6 4 12 0" />
        </svg>
      );
    case 'lotus':
      return (
        <svg viewBox="0 0 60 60" {...common}>
          <path d="M30 50 c-8-6-12-14-12-22 c0 8 4 16 12 22z" />
          <path d="M30 50 c8-6 12-14 12-22 c0 8-4 16-12 22z" />
          <path d="M30 50 c-4-8-6-18-6-28 c0 10 2 20 6 28z" />
          <path d="M30 50 c4-8 6-18 6-28 c0 10-2 20-6 28z" />
          <path d="M30 50 V22" />
          <circle cx="30" cy="50" r="1.4" fill="currentColor" />
        </svg>
      );
    case 'paisley':
    default:
      return (
        <svg viewBox="0 0 60 90" {...common}>
          <path d="M30 4 C56 18 56 56 30 86 C12 64 12 38 30 4 z" />
          <path d="M30 14 C48 26 48 54 30 76 C18 58 18 36 30 14 z" />
          <path d="M30 24 C42 32 42 50 30 66 C22 54 22 38 30 24 z" />
          <circle cx="30" cy="40" r="2" fill="currentColor" />
          <circle cx="30" cy="52" r="1.2" fill="currentColor" />
          <circle cx="30" cy="62" r="0.8" fill="currentColor" />
        </svg>
      );
  }
}
