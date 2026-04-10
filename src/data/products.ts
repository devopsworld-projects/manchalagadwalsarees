import sareeRed from '@/assets/saree-red.jpg';
import sareeBlue from '@/assets/saree-blue.jpg';
import sareeGreen from '@/assets/saree-green.jpg';
import sareePink from '@/assets/saree-pink.jpg';
import sareeOrange from '@/assets/saree-orange.jpg';
import sareeWhite from '@/assets/saree-white.jpg';
import sareeMaroon from '@/assets/saree-maroon.jpg';

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

export const products: Product[] = [
  {
    id: 'OMS01',
    name: 'Kanjivaram Red Silk',
    price: 2499,
    originalPrice: 3499,
    image: sareeRed,
    category: 'Pattu Sarees',
    colors: ['#c41e3a', '#d4af37', '#8b0000'],
    isNew: true,
    description: 'Exquisite Kanjivaram silk saree in rich red with intricate gold zari work. Perfect for weddings and festive occasions.',
  },
  {
    id: 'OMS02',
    name: 'Royal Blue Banarasi',
    price: 1899,
    image: sareeBlue,
    category: 'Banarasi',
    colors: ['#0047ab', '#d4af37', '#1a237e'],
    isNew: true,
    isBestSeller: true,
    description: 'Stunning royal blue Banarasi silk saree with silver zari detailing. A timeless piece for your collection.',
  },
  {
    id: 'OMS03',
    name: 'Emerald Kanjivaram',
    price: 2199,
    image: sareeGreen,
    category: 'Pattu Sarees',
    colors: ['#2e8b57', '#d4af37', '#006400'],
    isNew: true,
    description: 'Beautiful emerald green Kanjivaram silk with traditional gold border. Elegant and sophisticated.',
  },
  {
    id: 'OMS04',
    name: 'Magenta Banarasi Silk',
    price: 1699,
    originalPrice: 2299,
    image: sareePink,
    category: 'Banarasi',
    colors: ['#ff00ff', '#ffc0cb', '#c71585'],
    isBestSeller: true,
    description: 'Vibrant magenta pink Banarasi silk with delicate silver zari flower motifs.',
  },
  {
    id: 'OMS05',
    name: 'Orange Pattu Silk',
    price: 1299,
    image: sareeOrange,
    category: 'Pattu Sarees',
    colors: ['#ff8c00', '#d4af37', '#ff4500'],
    isNew: true,
    description: 'Bright orange Pattu silk saree with gold zari border. Vibrant and festive.',
  },
  {
    id: 'OMS06',
    name: 'Cream Bridal Kanjivaram',
    price: 3999,
    originalPrice: 5499,
    image: sareeWhite,
    category: 'Premium',
    colors: ['#fffdd0', '#d4af37', '#f5f5dc'],
    isBestSeller: true,
    description: 'Luxurious cream Kanjivaram with rich gold zari work. Perfect bridal saree.',
  },
  {
    id: 'OMS07',
    name: 'Maroon Heritage Silk',
    price: 2799,
    image: sareeMaroon,
    category: 'Premium',
    colors: ['#800000', '#d4af37', '#8b0000'],
    isNew: true,
    isBestSeller: true,
    description: 'Rich maroon heritage silk with exquisite gold zari flower motifs and tassels.',
  },
];

export const categories = [
  { name: 'All Collections', slug: 'all' },
  { name: 'Pattu Sarees', slug: 'pattu-sarees' },
  { name: 'Banarasi', slug: 'banarasi' },
  { name: 'Premium', slug: 'premium' },
  { name: 'New Arrivals', slug: 'new-arrivals' },
  { name: 'Best Sellers', slug: 'best-sellers' },
];
