import { useMemo, useState } from 'react';
import { ChevronDown, Phone, Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';

type MenuItem = {
  id: string;
  label: string;
  slug: string | null;
  url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  menu_group: string;
};

interface MenuPreviewProps {
  items: MenuItem[];
  group: string;
}

type PreviewMode = 'desktop' | 'mobile';

export function MenuPreview({ items, group }: MenuPreviewProps) {
  const [mode, setMode] = useState<PreviewMode>('desktop');
  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const groupItems = useMemo(
    () => items.filter(i => i.menu_group === group && i.is_active),
    [items, group]
  );
  const topItems = groupItems.filter(i => !i.parent_id);
  const getChildren = (parentId: string) =>
    groupItems.filter(i => i.parent_id === parentId);

  const topbar = items.filter(i => i.menu_group === 'topbar' && i.is_active && !i.parent_id);

  // ─── DESKTOP PREVIEW (mirrors Navbar.tsx mega menu) ───
  if (mode === 'desktop') {
    if (group === 'main') {
      const half = Math.ceil(topItems.length / 2);
      const left = topItems.slice(0, half);
      const right = topItems.slice(half);

      return (
        <PreviewShell mode={mode} setMode={setMode}>
          {/* Top utility bar */}
          <div className="bg-foreground text-background">
            <div className="flex items-center justify-between h-7 px-4">
              <nav className="flex items-center gap-5">
                {topbar.length === 0 && (
                  <span className="text-[9px] tracking-[0.2em] text-background/40 uppercase">Top bar items</span>
                )}
                {topbar.map(t => (
                  <span key={t.id} className="text-[9px] tracking-[0.2em] font-display text-background/70 uppercase">
                    {t.label}
                  </span>
                ))}
              </nav>
              <span className="flex items-center gap-1.5 text-[9px] tracking-[0.1em] text-background/70">
                <Phone className="h-2.5 w-2.5 text-accent/70" />
                +91 98858 79188
              </span>
            </div>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
          </div>

          {/* Main bar */}
          <div className="bg-background border-b border-border/60 relative">
            <div className="flex items-center justify-between gap-3 px-4 py-3 min-h-[80px]">
              {/* Left nav */}
              <nav className="flex flex-1 items-center justify-end gap-5">
                {left.map(item => (
                  <PreviewNavTrigger
                    key={item.id}
                    item={item}
                    hasChildren={getChildren(item.id).length > 0}
                    open={openId === item.id}
                    onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  />
                ))}
              </nav>

              {/* Wordmark */}
              <div className="flex flex-col items-center shrink-0 px-4">
                <span className="font-display text-xl font-bold tracking-[0.08em] text-primary leading-none">
                  MANCHALA
                </span>
                <span className="flex items-center gap-1.5 mt-1">
                  <span className="h-px w-4 bg-accent/60" />
                  <span className="font-body text-[7px] tracking-[0.4em] text-accent uppercase">
                    Gadwal Sarees
                  </span>
                  <span className="h-px w-4 bg-accent/60" />
                </span>
              </div>

              {/* Right nav */}
              <nav className="flex flex-1 items-center justify-start gap-5">
                {right.map(item => (
                  <PreviewNavTrigger
                    key={item.id}
                    item={item}
                    hasChildren={getChildren(item.id).length > 0}
                    open={openId === item.id}
                    onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  />
                ))}
              </nav>

              {/* Right action icons */}
              <div className="flex items-center gap-1 shrink-0">
                <Search className="h-4 w-4 text-primary/70" />
                <Heart className="h-4 w-4 text-primary/70" />
                <User className="h-4 w-4 text-primary/70" />
                <ShoppingBag className="h-4 w-4 text-primary/70" />
                <span className="ml-1 pl-1 border-l border-border/60 flex items-center gap-1 text-[10px] text-primary/70">
                  ₹ INR <ChevronDown className="h-2.5 w-2.5" />
                </span>
              </div>
            </div>

            {/* Mega menu panel */}
            {openId && (() => {
              const item = topItems.find(t => t.id === openId);
              const children = getChildren(openId);
              if (!item || children.length === 0) return null;
              const colCount = children.length > 12 ? 4 : children.length > 6 ? 3 : 2;
              const gridClass =
                colCount === 4 ? 'grid-cols-4' : colCount === 3 ? 'grid-cols-3' : 'grid-cols-2';

              return (
                <div className="absolute left-1/2 -translate-x-1/2 top-full bg-background border border-border/70 shadow-2xl z-20 w-[640px] max-w-[95%]">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent/40 via-accent to-accent/40" />
                  <div className="p-5">
                    <div className="mb-3 pb-2 border-b border-border/60">
                      <h3 className="font-display text-xs tracking-[0.15em] uppercase text-primary">
                        {item.label}
                      </h3>
                      <p className="font-body text-[10px] text-muted-foreground tracking-wide mt-0.5">
                        Explore our handpicked {item.label.toLowerCase()} collection
                      </p>
                    </div>
                    <div className={`grid ${gridClass} gap-x-4 gap-y-1`}>
                      {children.map(child => (
                        <span
                          key={child.id}
                          className="text-[11px] font-body text-primary/85 py-1 capitalize"
                        >
                          • {child.label}
                        </span>
                      ))}
                    </div>
                    {item.slug && (
                      <div className="mt-3 pt-2 border-t border-border/60">
                        <span className="text-[9px] tracking-[0.2em] font-display font-bold text-accent uppercase">
                          View All {item.label} →
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {topItems.length === 0 && (
            <div className="text-center py-10 text-muted-foreground text-xs">
              No active items in this group.
            </div>
          )}
        </PreviewShell>
      );
    }

    // Other groups (footer / topbar / mobile) — show simple link list preview
    return (
      <PreviewShell mode={mode} setMode={setMode}>
        <div className="p-6 bg-foreground text-background">
          <h4 className="text-[10px] tracking-[0.3em] uppercase text-accent mb-4 font-display">
            {group} Preview
          </h4>
          {topItems.length === 0 ? (
            <div className="text-background/50 text-xs">No active items.</div>
          ) : (
            <div className="space-y-2">
              {topItems.map(item => (
                <div key={item.id}>
                  <div className="text-sm text-background/85 font-body">{item.label}</div>
                  {getChildren(item.id).map(child => (
                    <div key={child.id} className="pl-4 text-xs text-background/55 font-body">
                      └ {child.label}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </PreviewShell>
    );
  }

  // ─── MOBILE PREVIEW ───
  return (
    <PreviewShell mode={mode} setMode={setMode}>
      <div className="relative bg-background min-h-[420px]">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between p-3 border-b border-border/60">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 text-primary"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex flex-col items-center">
            <span className="font-display text-base font-bold tracking-[0.08em] text-primary leading-none">
              MANCHALA
            </span>
            <span className="font-body text-[7px] tracking-[0.4em] text-accent uppercase mt-0.5">
              Gadwal Sarees
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Search className="h-4 w-4 text-primary/70" />
            <ShoppingBag className="h-4 w-4 text-primary/70" />
          </div>
        </div>

        {/* Drawer */}
        {mobileOpen && (
          <>
            <div
              className="absolute inset-0 bg-foreground/40 z-10"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute inset-0 bg-background z-20 flex flex-col">
              <div className="relative p-4 bg-primary text-primary-foreground">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent/50 via-accent to-accent/50" />
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center w-full">
                    <span className="font-display text-lg font-bold tracking-[0.08em] leading-none">
                      MANCHALA
                    </span>
                    <span className="flex items-center gap-1.5 mt-1">
                      <span className="h-px w-3 bg-accent/70" />
                      <span className="font-body text-[7px] tracking-[0.4em] text-accent uppercase">
                        Gadwal Sarees
                      </span>
                      <span className="h-px w-3 bg-accent/70" />
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {topItems.length === 0 && (
                  <div className="text-xs text-muted-foreground py-4 text-center">
                    No active items.
                  </div>
                )}
                {topItems.map(item => {
                  const children = getChildren(item.id);
                  const expanded = mobileExpanded === item.id;
                  if (children.length === 0) {
                    return (
                      <div
                        key={item.id}
                        className="block py-2 text-[11px] tracking-[0.2em] font-display font-semibold text-foreground/80 uppercase"
                      >
                        {item.label}
                      </div>
                    );
                  }
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() =>
                          setMobileExpanded(expanded ? null : item.id)
                        }
                        className="flex items-center justify-between w-full py-2 text-[11px] tracking-[0.2em] font-display font-semibold text-foreground/80 uppercase"
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-3 w-3 text-accent/60 transition-transform ${expanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {expanded && (
                        <div className="pl-3 pb-1 border-l-2 border-accent/30 ml-1 space-y-0.5">
                          {children.map(child => (
                            <div
                              key={child.id}
                              className="py-1.5 text-[11px] font-body text-muted-foreground"
                            >
                              • {child.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </PreviewShell>
  );
}

function PreviewNavTrigger({
  item,
  hasChildren,
  open,
  onClick,
}: {
  item: MenuItem;
  hasChildren: boolean;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-[11px] tracking-[0.02em] font-body font-medium text-primary hover:text-accent transition-colors py-1.5 capitalize"
    >
      {item.label}
      {hasChildren && (
        <ChevronDown
          className={`h-2.5 w-2.5 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      )}
    </button>
  );
}

function PreviewShell({
  mode,
  setMode,
  children,
}: {
  mode: PreviewMode;
  setMode: (m: PreviewMode) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/40">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Live Preview
        </span>
        <div className="flex gap-1 text-[11px]">
          <button
            onClick={() => setMode('desktop')}
            className={`px-3 py-1 rounded ${mode === 'desktop' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-background'}`}
          >
            Desktop
          </button>
          <button
            onClick={() => setMode('mobile')}
            className={`px-3 py-1 rounded ${mode === 'mobile' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-background'}`}
          >
            Mobile
          </button>
        </div>
      </div>
      <div
        className={`overflow-hidden ${mode === 'mobile' ? 'max-w-[380px] mx-auto my-4 border rounded-2xl shadow-xl' : ''}`}
      >
        {children}
      </div>
    </div>
  );
}
