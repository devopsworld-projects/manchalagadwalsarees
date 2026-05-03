import { Skeleton } from '@/components/ui/skeleton';
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton';

/**
 * Generic full-page skeleton used as Suspense fallback for route-level lazy loading.
 * Mimics the standard storefront layout: header, hero/content, product grid, footer.
 */
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40">
        <div className="container px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          <Skeleton className="h-10 w-32 md:w-40" />
          <div className="hidden md:flex items-center gap-6">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="container px-4 md:px-6 py-6 md:py-10">
        <Skeleton className="w-full h-[220px] md:h-[420px] rounded-sm" />
      </div>

      {/* Section title */}
      <div className="container px-4 md:px-6 py-6 space-y-3 text-center">
        <Skeleton className="h-3 w-24 mx-auto" />
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-3 w-80 max-w-full mx-auto" />
      </div>

      {/* Product grid */}
      <div className="container px-4 md:px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/40 bg-muted/20">
        <div className="container px-4 md:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Compact skeleton for admin pages */
export function AdminPageSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-muted px-4 py-3 flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-24" />
          ))}
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-4 py-4 flex gap-4 items-center">
              <Skeleton className="h-10 w-12 rounded" />
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20 ml-auto" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
