import { X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface FilterTab {
  name: string;
  slug: string;
}

interface CollectionsSidebarProps {
  allTabs: FilterTab[];
  activeFilter: string;
  onFilterChange: (slug: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const SidebarContent = ({
  allTabs,
  activeFilter,
  onFilterChange,
  priceRange,
  onPriceRangeChange,
  hasActiveFilters,
  onClearFilters,
}: CollectionsSidebarProps) => {
  const collectionTabs = allTabs.filter(t => ['all', 'new-arrivals', 'best-sellers'].includes(t.slug));
  const categoryTabs = allTabs.filter(t => !['all', 'new-arrivals', 'best-sellers'].includes(t.slug));

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-1">
        {/* Clear all */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-body"
          >
            <X className="h-3 w-3" /> Clear all filters
          </button>
        )}

        {/* Collections */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-display text-sm font-semibold tracking-wide uppercase text-foreground">
            Collections
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
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

        {/* Categories */}
        {categoryTabs.length > 0 && (
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-display text-sm font-semibold tracking-wide uppercase text-foreground">
              Categories
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
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

        {/* Price Range */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-display text-sm font-semibold tracking-wide uppercase text-foreground">
            Price Range
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
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
      </div>
    </ScrollArea>
  );
};

// Desktop sidebar
export const CollectionsSidebarDesktop = (props: CollectionsSidebarProps) => (
  <aside className="hidden lg:block w-60 shrink-0 border-r border-border pr-6">
    <h2 className="font-display text-lg font-bold mb-4">Filters</h2>
    <SidebarContent {...props} />
  </aside>
);

// Mobile filter drawer
export const CollectionsSidebarMobile = (props: CollectionsSidebarProps) => (
  <Sheet>
    <SheetTrigger asChild>
      <button className="lg:hidden flex items-center gap-2 text-sm font-body text-foreground hover:text-primary transition-colors">
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {props.hasActiveFilters && (
          <span className="h-2 w-2 rounded-full bg-primary" />
        )}
      </button>
    </SheetTrigger>
    <SheetContent side="left" className="w-72 p-6">
      <SheetHeader>
        <SheetTitle className="font-display text-lg">Filters</SheetTitle>
      </SheetHeader>
      <div className="mt-4">
        <SidebarContent {...props} />
      </div>
    </SheetContent>
  </Sheet>
);
