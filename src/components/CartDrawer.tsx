import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Link } from 'react-router-dom';

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const { format } = useCurrency();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-foreground/50 z-[60]" onClick={() => setIsCartOpen(false)} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-[60] shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-display text-xl font-semibold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" /> Cart ({totalItems})
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:text-primary transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <ShoppingBag className="h-12 w-12 mb-4 opacity-30" />
            <p className="font-body">Your cart is empty</p>
            <button onClick={() => setIsCartOpen(false)} className="mt-4 text-sm text-primary underline font-body">
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4 border-b border-border pb-4">
                  <img src={product.image} alt={product.name} className="w-20 h-24 object-cover rounded-sm" />
                  <div className="flex-1">
                    <h3 className="font-display text-sm font-semibold">{product.name}</h3>
                    <p className="font-body text-sm text-muted-foreground">{product.id}</p>
                    <p className="font-body font-bold mt-1">{format(product.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)} className="p-1 border border-border rounded hover:bg-muted">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-body w-6 text-center">{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)} className="p-1 border border-border rounded hover:bg-muted">
                        <Plus className="h-3 w-3" />
                      </button>
                      <button onClick={() => removeFromCart(product.id)} className="ml-auto text-xs text-destructive font-body">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 pb-20 md:pb-4 border-t border-border space-y-3">
              <div className="flex justify-between font-body">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold text-lg">{format(totalPrice)}</span>
              </div>
              <Link
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="block w-full bg-primary text-primary-foreground text-center py-3 text-sm tracking-[0.15em] font-body hover:bg-burgundy-light transition-colors"
              >
                CHECKOUT
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
