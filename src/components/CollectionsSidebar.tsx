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
  'Silk',
  'Banarasi',
  'Kanjivaram',
  'Cotton',
  'Chiffon',
  'Georgette',
  'Organza',
  'Linen',
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
  const collectionTabs = allTabs.filter(t => ['all', 'new-arrivals', 'best-sellers'].includes(t.slug));
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
      <div className="space-y-6 p-1">
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-body"
          >
            <X className="h-3 w-3" /> Clear all filters
          </button>
        )}

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-display text-sm font-semibold tracking-wide uppercase text-foreground">
            Collections
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-col gap-1 pt-1">
              {collectionTabs.map(tab => (
                <button
                  key={tab.slug}
                  onClick={() => onFilterChange(tab.slug)}
                  className={cn(
                    'text-left px-3 py-2 text-sm font-body rounded-sm transition-colors',
                    activeFilter === tab.slug
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {categoryTabs.length > 0 && (
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-display text-sm font-semibold tracking-wide uppercase text-foreground">
              Categories
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-1 pt-1">
                {categoryTabs.map(tab => (
                  <button
                    key={tab.slug}
                    onClick={() => onFilterChange(tab.slug)}
                    className={cn(
                      'text-left px-3 py-2 text-sm font-body rounded-sm transition-colors',
                      activeFilter === tab.slug
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-display text-sm font-semibold tracking-wide uppercase text-foreground">
            Price Range
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="pt-3 px-1">
              <Slider
                value={priceRange}
                onValueChange={(v) => onPriceRangeChange(v as [number, number])}
                min={0}
                max={50000}
                step={500}
                className="mb-3"
              />
              <div className="flex justify-between text-xs font-body text-muted-foreground">
                <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-display text-sm font-semibold tracking-wide uppercase text-foreground">
            Colors
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-wrap gap-2 pt-3">
              {AVAILABLE_COLORS.map(color => (
                <button
                  key={color.hex}
                  onClick={() => toggleColor(color.hex)}
                  title={color.name}
                  className={cn(
                    'h-7 w-7 rounded-full border-2 transition-all',
                    selectedColors.includes(color.hex)
                      ? 'border-primary scale-110 ring-2 ring-primary/30'
                      : 'border-border hover:scale-105'
                  )}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
            {selectedColors.length > 0 && (
              <p className="text-xs text-muted-foreground font-body mt-2">
                {selectedColors.length} selected
              </p>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-display text-sm font-semibold tracking-wide uppercase text-foreground">
            Material
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-col gap-2 pt-2">
              {AVAILABLE_MATERIALS.map(material => (
                <label
                  key={material}
                  className="flex items-center gap-2 cursor-pointer text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Checkbox
                    checked={selectedMaterials.includes(material)}
                    onCheckedChange={() => toggleMaterial(material)}
                    className="h-4 w-4"
                  />
                  {material}
                </label>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </ScrollArea>
  );
};

export const CollectionsSidebar = (props: CollectionsSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'shrink-0 border-r border-border transition-all duration-300 relative',
        collapsed ? 'w-10' : 'w-56 md:w-60 pr-4'
      )}
    >
      {/* Collapse / Expand toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3 top-2 z-10 h-6 w-6 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm"
        title={collapsed ? 'Expand filters' : 'Collapse filters'}
      >
        {collapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
      </button>

      {collapsed ? (
        <div className="flex flex-col items-center pt-10 gap-3">
          <button
            onClick={() => setCollapsed(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Show filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
          {props.hasActiveFilters && (
            <span className="h-2 w-2 rounded-full bg-primary" />
          )}
        </div>
      ) : (
        <>
          <h2 className="font-display text-lg font-bold mb-4">Filters</h2>
          <SidebarContent {...props} />
        </>
      )}
    </aside>
  );
};
