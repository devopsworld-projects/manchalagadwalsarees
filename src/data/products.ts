export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  colors: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  description: string;
}

// Products are now fetched from the database. This file only exports the interface.
export const products: Product[] = [];

export const categories = [
  { name: 'All Collections', slug: 'all' },
  { name: 'New Arrivals', slug: 'new-arrivals' },
  { name: 'Best Sellers', slug: 'best-sellers' },
];
