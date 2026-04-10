import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Product = Tables<'products'>;
type Category = Tables<'categories'>;

const AdminProducts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    sku: '', name: '', description: '', price: '', original_price: '',
    category_id: '', colors: '', is_new: false, is_best_seller: false,
    is_active: true, stock: '0', images: '' as string,
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data } = await supabase.from('categories').select('*').order('name');
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (product: TablesInsert<'products'>) => {
      if (editingProduct) {
        const { error } = await supabase.from('products').update(product).eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(product);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: editingProduct ? 'Product updated' : 'Product created' });
      resetForm();
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Product deleted' });
    },
  });

  const resetForm = () => {
    setForm({ sku: '', name: '', description: '', price: '', original_price: '', category_id: '', colors: '', is_new: false, is_best_seller: false, is_active: true, stock: '0', images: '' });
    setEditingProduct(null);
    setShowForm(false);
  };

  const startEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      sku: p.sku, name: p.name, description: p.description || '',
      price: String(p.price), original_price: p.original_price ? String(p.original_price) : '',
      category_id: p.category_id || '', colors: (p.colors || []).join(', '),
      is_new: p.is_new || false, is_best_seller: p.is_best_seller || false,
      is_active: p.is_active !== false, stock: String(p.stock || 0),
      images: (p.images || []).join(', '),
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      sku: form.sku, name: form.name, description: form.description || null,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      category_id: form.category_id || null,
      colors: form.colors ? form.colors.split(',').map(c => c.trim()) : [],
      images: form.images ? form.images.split(',').map(i => i.trim()) : [],
      is_new: form.is_new, is_best_seller: form.is_best_seller,
      is_active: form.is_active, stock: Number(form.stock),
    });
  };

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop();
    const path = `products/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file);
    if (error) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
      return;
    }
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path);
    const current = form.images ? form.images.split(',').map(i => i.trim()).filter(Boolean) : [];
    current.push(urlData.publicUrl);
    setForm(f => ({ ...f, images: current.join(', ') }));
    toast({ title: 'Image uploaded' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">Products</h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-body tracking-wider hover:bg-burgundy-light transition-colors"
        >
          <Plus className="h-4 w-4" /> ADD PRODUCT
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-semibold">
                {editingProduct ? 'Edit Product' : 'New Product'}
              </h3>
              <button onClick={resetForm}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-sm font-semibold block mb-1">SKU *</label>
                  <input required value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
                    className="w-full border border-border px-3 py-2 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="font-body text-sm font-semibold block mb-1">Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-border px-3 py-2 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="font-body text-sm font-semibold block mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-border px-3 py-2 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-body text-sm font-semibold block mb-1">Price (₹) *</label>
                  <input required type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full border border-border px-3 py-2 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="font-body text-sm font-semibold block mb-1">Original Price</label>
                  <input type="number" step="0.01" value={form.original_price} onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))}
                    className="w-full border border-border px-3 py-2 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="font-body text-sm font-semibold block mb-1">Stock</label>
                  <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                    className="w-full border border-border px-3 py-2 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="font-body text-sm font-semibold block mb-1">Category</label>
                <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                  className="w-full border border-border px-3 py-2 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="">Select category</option>
                  {categories?.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-body text-sm font-semibold block mb-1">Colors (comma-separated hex)</label>
                <input value={form.colors} onChange={e => setForm(f => ({ ...f, colors: e.target.value }))} placeholder="#c41e3a, #d4af37"
                  className="w-full border border-border px-3 py-2 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="font-body text-sm font-semibold block mb-1">Images</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm font-body mb-2" />
                {form.images && (
                  <div className="flex gap-2 flex-wrap mt-2">
                    {form.images.split(',').map((url, i) => url.trim() && (
                      <img key={i} src={url.trim()} alt="" className="w-16 h-16 object-cover rounded border border-border" />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 font-body text-sm">
                  <input type="checkbox" checked={form.is_new} onChange={e => setForm(f => ({ ...f, is_new: e.target.checked }))} /> New Arrival
                </label>
                <label className="flex items-center gap-2 font-body text-sm">
                  <input type="checkbox" checked={form.is_best_seller} onChange={e => setForm(f => ({ ...f, is_best_seller: e.target.checked }))} /> Best Seller
                </label>
                <label className="flex items-center gap-2 font-body text-sm">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} /> Active
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saveMutation.isPending}
                  className="flex-1 bg-primary text-primary-foreground py-2.5 text-sm tracking-wider font-body hover:bg-burgundy-light transition-colors disabled:opacity-50">
                  {saveMutation.isPending ? 'SAVING...' : editingProduct ? 'UPDATE' : 'CREATE'}
                </button>
                <button type="button" onClick={resetForm}
                  className="px-6 py-2.5 border border-border text-sm font-body hover:bg-muted transition-colors">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products table */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground font-body">Loading products...</div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">SKU</th>
                <th className="text-left p-3">Category</th>
                <th className="text-right p-3">Price</th>
                <th className="text-center p-3">Stock</th>
                <th className="text-center p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products?.map(product => (
                <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] && (
                        <img src={product.images[0]} alt="" className="w-10 h-12 object-cover rounded" />
                      )}
                      <span className="font-body text-sm font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-3 font-body text-sm text-muted-foreground">{product.sku}</td>
                  <td className="p-3 font-body text-sm text-muted-foreground">
                    {(product as any).categories?.name || '—'}
                  </td>
                  <td className="p-3 font-body text-sm text-right font-medium">₹{Number(product.price).toLocaleString()}</td>
                  <td className="p-3 font-body text-sm text-center">{product.stock}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-block text-[10px] font-body font-bold px-2 py-0.5 rounded-full ${
                      product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => startEdit(product)} className="p-1.5 hover:bg-muted rounded transition-colors">
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => { if (confirm('Delete this product?')) deleteMutation.mutate(product.id); }}
                        className="p-1.5 hover:bg-destructive/10 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!products || products.length === 0) && (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground font-body">No products yet. Add your first product!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
