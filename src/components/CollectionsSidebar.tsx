import { useState } from 'react';
import { X, SlidersHorizontal, ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface FilterTab {
  name: string;
  slug: string;
}

export interface ColorOption {
  name: string;
  hex: string;
}

export const AVAILABLE_COLORS: ColorOption[] = [
  { name: 'Red', hex: '#c41e3a' },
  { name: 'Blue', hex: '#0047ab' },
  { name: 'Green', hex: '#2e8b57' },
  { name: 'Pink', hex: '#ff69b4' },
  { name: 'Orange', hex: '#ff8c00' },
  { name: 'White', hex: '#fffdd0' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Gold', hex: '#d4af37' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Black', hex: '#1a1a1a' },
];

export const AVAILABLE_MATERIALS = [
  'Silk', 'Banarasi', 'Kanjivaram', 'Cotton', 'Chiffon', 'Georgette', 'Organza', 'Linen',
];

export interface CollectionsSidebarProps {
  allTabs: FilterTab[];
  activeFilter: string;
  onFilterChange: (slug: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedColors: string[];
  onColorsChange: (colors: string[]) => void;
  selectedMaterials: string[];
  onMaterialsChange: (materials: string[]) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const FilterSection = ({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) => (
  <Collapsible defaultOpen={defaultOpen}>
    <CollapsibleTrigger className="flex w-full items-center justify-between py-3 group">
      <span className="font-display text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground">
        {title}
      </span>
      <ChevronDown className="h-3.5 w-3.5 text-accent transition-transform group-data-[state=open]:rotate-180" />
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div className="pb-2">{children}</div>
    </CollapsibleContent>
  </Collapsible>
);

const SidebarContent = ({
  allTabs,
  activeFilter,
  onFilterChange,
  priceRange,
  onPriceRangeChange,
  selectedColors,
  onColorsChange,
  selectedMaterials,
  onMaterialsChange,
  hasActiveFilters,
  onClearFilters,
}: CollectionsSidebarProps) => {
  const categoryTabs = allTabs.filter(t => !['all', 'new-arrivals', 'best-sellers'].includes(t.slug));

  const toggleColor = (hex: string) => {
    onColorsChange(
      selectedColors.includes(hex)
        ? selectedColors.filter(c => c !== hex)
        : [...selectedColors, hex]
    );
  };

  const toggleMaterial = (material: string) => {
    onMaterialsChange(
      selectedMaterials.includes(material)
        ? selectedMaterials.filter(m => m !== material)
        : [...selectedMaterials, material]
    );
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-1">
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-[10px] text-accent hover:text-primary flex items-center gap-1.5 font-display tracking-[0.15em] uppercase mb-4 transition-colors"
          >
            <X className="h-3 w-3" /> Clear All Filters
          </button>
        )}

        {/* Categories */}
        {categoryTabs.length > 0 && (
          <FilterSection title="Categories">
            <div className="flex flex-col gap-0.5 pt-1">
              {categoryTabs.map(tab => (
                <button
                  key={tab.slug}
                  onClick={() => onFilterChange(tab.slug)}
                  className={cn(
                    'text-left px-3 py-2.5 text-sm font-body transition-all border-l-2',
                    activeFilter === tab.slug
                      ? 'border-accent bg-accent/5 text-foreground font-semibold'
                      : 'border-transparent text-muted-foreground hover:border-accent/30 hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-2" />

        {/* Price Range */}
        <FilterSection title="Price Range">
          <div className="pt-4 px-1">
            <Slider
              value={priceRange}
              onValueChange={(v) => onPriceRangeChange(v as [number, number])}
              min={0}
              max={50000}
              step={500}
              className="mb-4"
            />
            <div className="flex justify-between text-xs font-body text-muted-foreground">
              <span className="bg-muted px-2 py-1">₹{priceRange[0].toLocaleString('en-IN')}</span>
              <span className="bg-muted px-2 py-1">₹{priceRange[1].toLocaleString('en-IN')}</span>
            </div>
          </div>
        </FilterSection>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-2" />

        {/* Colors */}
        <FilterSection title="Colors">
          <div className="grid grid-cols-5 gap-2.5 pt-3">
            {AVAILABLE_COLORS.map(color => (
              <button
                key={color.hex}
                onClick={() => toggleColor(color.hex)}
                title={color.name}
                className={cn(
                  'h-8 w-8 rounded-full border-2 transition-all relative',
                  selectedColors.includes(color.hex)
                    ? 'border-accent scale-110 ring-2 ring-accent/30'
                    : 'border-border/60 hover:scale-105 hover:border-accent/40'
                )}
                style={{ backgroundColor: color.hex }}
              >
                {selectedColors.includes(color.hex) && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="h-2 w-2 bg-white rounded-full shadow-sm" />
                  </span>
                )}
              </button>
            ))}
          </div>
          {selectedColors.length > 0 && (
            <p className="text-[10px] text-accent font-display tracking-wider mt-2 uppercase">
              {selectedColors.length} color{selectedColors.length > 1 ? 's' : ''} selected
            </p>
          )}
        </FilterSection>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-2" />

        {/* Material */}
        <FilterSection title="Material">
          <div className="flex flex-col gap-1.5 pt-2">
            {AVAILABLE_MATERIALS.map(material => (
              <label
                key={material}
                className="flex items-center gap-2.5 cursor-pointer text-sm font-body text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                <Checkbox
                  checked={selectedMaterials.includes(material)}
                  onCheckedChange={() => toggleMaterial(material)}
                  className="h-4 w-4 border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                />
                {material}
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </ScrollArea>
  );
};

export const CollectionsSidebar = (props: CollectionsSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile filter button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-20 left-4 z-40 bg-foreground text-background shadow-lg px-5 py-3 flex items-center gap-2 text-xs font-display tracking-[0.15em] uppercase border border-accent/30"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {props.hasActiveFilters && (
          <span className="h-2 w-2 rounded-full bg-accent" />
        )}
      </button>

      {/* Mobile filter drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 lg:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-background z-50 shadow-2xl lg:hidden flex flex-col">
            {/* Header with temple accent */}
            <div className="relative p-5 border-b border-border">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-accent text-[8px] tracking-[0.3em] uppercase font-body">◆ Refine ◆</span>
                  <h2 className="font-display text-lg font-bold tracking-wide">Filters</h2>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-2 hover:text-accent transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain p-5">
              <SidebarContent {...props} />
            </div>
            <div className="p-4 border-t border-border">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-full bg-foreground text-background py-3.5 text-xs font-display tracking-[0.2em] uppercase hover:bg-primary transition-colors"
              >
                View {props.hasActiveFilters ? 'Filtered' : 'All'} Results
              </button>
            </div>
          </div>
        </>
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'shrink-0 transition-all duration-300 relative sticky top-4 self-start max-h-[calc(100vh-6rem)] overflow-y-auto hidden lg:block',
          collapsed ? 'w-10' : 'w-60 pr-6'
        )}
      >
        {/* Temple pillar accent */}
        {!collapsed && (
          <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
        )}

        <button
          onClick={() => setCollapsed(c => !c)}
          className="absolute -right-3 top-2 z-10 h-6 w-6 border border-accent/40 bg-background flex items-center justify-center text-accent hover:text-primary hover:border-primary transition-colors shadow-sm"
          title={collapsed ? 'Expand filters' : 'Collapse filters'}
        >
          {collapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
        </button>

        {collapsed ? (
          <div className="flex flex-col items-center pt-10 gap-3">
            <button
              onClick={() => setCollapsed(false)}
              className="text-accent hover:text-primary transition-colors"
              title="Show filters"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            {props.hasActiveFilters && (
              <span className="h-2 w-2 rounded-full bg-accent" />
            )}
          </div>
        ) : (
          <>
            <div className="mb-5">
              <span className="text-accent text-[8px] tracking-[0.3em] uppercase font-body">◆ Refine ◆</span>
              <h2 className="font-display text-base font-bold tracking-wide">Filters</h2>
            </div>
            <SidebarContent {...props} />
          </>
        )}
      </aside>
    </>
  );
};
