import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { CURRENCIES, useCurrency, type CurrencyCode } from '@/context/CurrencyContext';

export function CurrencySelector({ variant = 'header' }: { variant?: 'header' | 'topbar' }) {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const triggerCls =
    variant === 'topbar'
      ? 'flex items-center gap-1 text-[10px] tracking-[0.15em] font-display text-background/70 hover:text-accent transition-colors uppercase'
      : 'flex items-center gap-1 px-2 py-2 text-[12px] font-body font-medium text-primary/80 hover:text-accent transition-colors';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={triggerCls}
        aria-label="Select currency"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{currency.symbol}</span>
        <span className="hidden sm:inline">{currency.code}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-1 w-56 bg-background border border-border shadow-xl z-50 py-1"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent/40 via-accent to-accent/40" />
          {Object.values(CURRENCIES).map(c => {
            const active = c.code === currency.code;
            return (
              <button
                key={c.code}
                role="option"
                aria-selected={active}
                onClick={() => {
                  setCurrency(c.code as CurrencyCode);
                  setOpen(false);
                }}
                className={`flex items-center justify-between w-full px-4 py-2.5 text-[13px] font-body text-primary hover:bg-secondary/60 transition-colors ${
                  active ? 'bg-secondary/40' : ''
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-6 text-accent font-semibold">{c.symbol}</span>
                  <span>{c.label}</span>
                  <span className="text-muted-foreground text-[11px]">({c.code})</span>
                </span>
                {active && <Check className="h-3.5 w-3.5 text-accent" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
