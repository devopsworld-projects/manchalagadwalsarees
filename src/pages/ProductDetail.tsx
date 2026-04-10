import { useParams, Link } from 'react-router-dom';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Heart, Truck, Shield, RotateCcw } from 'lucide-react';
import { useState } from 'react';

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen">
        <AnnouncementBar />
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-display text-3xl mb-4">Product Not Found</h1>
          <Link to="/collections" className="text-primary underline font-body">Back to Collections</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main className="container py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="font-body text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/collections" className="hover:text-primary">Collections</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Image */}
          <div className="aspect-[3/4] overflow-hidden rounded-sm bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              width={800}
              height={1024}
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="font-body text-xs text-muted-foreground tracking-wider uppercase mb-1">{product.category}</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold">{product.name}</h1>
              <p className="font-body text-xs text-muted-foreground mt-1">SKU: {product.id}</p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="font-body text-lg text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="bg-primary/10 text-primary text-xs font-body font-bold px-2 py-1 rounded">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="font-body text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Colors */}
            <div>
              <p className="font-body text-sm font-semibold mb-2">Colors</p>
              <div className="flex gap-2">
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className={`h-8 w-8 rounded-full border-2 transition-all ${
                      selectedColor === i ? 'border-primary scale-110' : 'border-border'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Color ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 bg-primary text-primary-foreground py-3.5 text-sm tracking-[0.15em] font-body hover:bg-burgundy-light transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                ADD TO CART
              </button>
              <button className="p-3.5 border border-border hover:border-primary hover:text-primary transition-colors" aria-label="Add to wishlist">
                <Heart className="h-5 w-5" />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <Truck className="h-5 w-5 mx-auto mb-1 text-gold" />
                <p className="font-body text-[10px] text-muted-foreground">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="h-5 w-5 mx-auto mb-1 text-gold" />
                <p className="font-body text-[10px] text-muted-foreground">Secure Payment</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-5 w-5 mx-auto mb-1 text-gold" />
                <p className="font-body text-[10px] text-muted-foreground">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
