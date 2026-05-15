import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Pencil, Trash2, X, Upload, FileSpreadsheet, Loader2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';
import * as XLSX from 'xlsx';
import { ProductVariantsEditor, VariantRow } from '@/components/admin/ProductVariantsEditor';
import { Checkbox } from '@/components/ui/checkbox';
import { useBulkSelect } from '@/hooks/useBulkSelect';

type Product = Tables<'products'>;

const AdminProducts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImporting, setBulkImporting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [form, setForm] = useState({
    sku: '', name: '', description: '', price: '', original_price: '',
    category_id: '', colors: '', is_new: false, is_best_seller: false,
    is_active: true, stock: '0', images: '' as string,
    specifications: {} as Record<string, string>,
  });

  const SPEC_FIELDS = [
    'Pattern', 'Occasion', 'Fabric', 'Material', 'Color Family',
    'Base Color', 'Border Type', 'Border Size', 'Secondary Color',
  ];

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

  const bulk = useBulkSelect(products);

  const saveMutation = useMutation({
    mutationFn: async (product: TablesInsert<'products'>) => {
      let productId: string;
      if (editingProduct) {
        const { error } = await supabase.from('products').update(product).eq('id', editingProduct.id);
        if (error) throw error;
        productId = editingProduct.id;
      } else {
        const { data, error } = await supabase.from('products').insert(product).select('id').single();
        if (error) throw error;
        productId = data.id;
      }
      if (editingProduct) {
        await supabase.from('product_variants').delete().eq('product_id', productId);
      }
      if (variants.length > 0) {
        const variantRows = variants.filter(v => v.sku && v.price).map(v => ({
          product_id: productId,
          sku: v.sku,
          attributes: v.attributes,
          price: Number(v.price),
          original_price: v.original_price ? Number(v.original_price) : null,
          stock: Number(v.stock || 0),
          is_active: v.is_active,
          images: v.images || [],
        }));
        if (variantRows.length > 0) {
          const { error: vErr } = await supabase.from('product_variants').insert(variantRows);
          if (vErr) throw vErr;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: editingProduct ? 'Product updated' : 'Product created' });
      resetForm();
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const deleteProduct = async (id: string) => {
    await supabase.from('order_items').delete().eq('product_id', id);
    await supabase.from('product_variants').delete().eq('product_id', id);
    await supabase.from('wishlists').delete().eq('product_id', id);
    await supabase.from('reviews').delete().eq('product_id', id);
    await supabase.from('related_products').delete().eq('product_id', id);
    await supabase.from('related_products').delete().eq('related_product_id', id);
    await supabase.from('product_tag_map').delete().eq('product_id', id);
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  };

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Product deleted' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to delete', description: error.message, variant: 'destructive' });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      for (const id of ids) {
        await deleteProduct(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: `${bulk.count} products deleted` });
      bulk.clear();
    },
    onError: (error: any) => {
      toast({ title: 'Bulk delete failed', description: error.message, variant: 'destructive' });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from('products').update({ is_active }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: vars.is_active ? 'Product activated' : 'Product deactivated' });
    },
    onError: (err: any) => toast({ title: 'Failed', description: err.message, variant: 'destructive' }),
  });

  const bulkSetActiveMutation = useMutation({
    mutationFn: async ({ ids, is_active }: { ids: string[]; is_active: boolean }) => {
      const { error } = await supabase.from('products').update({ is_active }).in('id', ids);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: `${vars.ids.length} product(s) ${vars.is_active ? 'activated' : 'deactivated'}` });
      bulk.clear();
    },
    onError: (err: any) => toast({ title: 'Bulk update failed', description: err.message, variant: 'destructive' }),
  });

  const resetForm = () => {
    setForm({ sku: '', name: '', description: '', price: '', original_price: '', category_id: '', colors: '', is_new: false, is_best_seller: false, is_active: true, stock: '0', images: '', specifications: {} });
    setVariants([]);
    setEditingProduct(null);
    setShowForm(false);
  };

  const startEdit = async (p: Product) => {
    setEditingProduct(p);
    setForm({
      sku: p.sku, name: p.name, description: p.description || '',
      price: String(p.price), original_price: p.original_price ? String(p.original_price) : '',
      category_id: p.category_id || '', colors: (p.colors || []).join(', '),
      is_new: p.is_new || false, is_best_seller: p.is_best_seller || false,
      is_active: p.is_active !== false, stock: String(p.stock || 0),
      images: (p.images || []).join(', '),
      specifications: ((p as any).specifications as Record<string, string>) || {},
    });
    const { data: existingVariants } = await supabase
      .from('product_variants').select('*').eq('product_id', p.id);
    setVariants((existingVariants || []).map(v => ({
      id: v.id, sku: v.sku,
      attributes: (v.attributes as Record<string, string>) || {},
      price: String(v.price), original_price: v.original_price ? String(v.original_price) : '',
      stock: String(v.stock), is_active: v.is_active,
      images: (v.images as string[]) || [],
    })));
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
      images: form.images ? form.images.split(',').map(i => i.trim()).filter(Boolean) : [],
      is_new: form.is_new, is_best_seller: form.is_best_seller,
      is_active: form.is_active, stock: Number(form.stock),
      specifications: form.specifications as any,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    const current = form.images ? form.images.split(',').map(i => i.trim()).filter(Boolean) : [];
    let uploaded = 0;
    let failed = 0;
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from('product-images').upload(path, file);
      if (error) { failed++; continue; }
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path);
      current.push(urlData.publicUrl);
      uploaded++;
    }
    setForm(f => ({ ...f, images: current.join(', ') }));
    setUploadingImages(false);
    toast({ title: `${uploaded} image${uploaded !== 1 ? 's' : ''} uploaded${failed > 0 ? `, ${failed} failed` : ''}`, variant: failed > 0 ? 'destructive' : 'default' });
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const imgs = form.images.split(',').map(i => i.trim()).filter(Boolean);
    imgs.splice(index, 1);
    setForm(f => ({ ...f, images: imgs.join(', ') }));
  };

  const handleBulkImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBulkImporting(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet);
      if (rows.length === 0) { toast({ title: 'Empty spreadsheet', variant: 'destructive' }); setBulkImporting(false); return; }
      const catMap: Record<string, string> = {};
      categories?.forEach(c => { catMap[c.name.toLowerCase()] = c.id; });
      const productRows: TablesInsert<'products'>[] = rows.map((row: any) => ({
        sku: String(row['SKU'] || row['sku'] || ''),
        name: String(row['Name'] || row['name'] || row['Product Name'] || ''),
        description: row['Description'] || row['description'] || null,
        price: Number(row['Price'] || row['price'] || 0),
        original_price: row['Original Price'] || row['original_price'] ? Number(row['Original Price'] || row['original_price']) : null,
        stock: Number(row['Stock'] || row['stock'] || 0),
        category_id: catMap[(String(row['Category'] || row['category'] || '')).toLowerCase()] || null,
        colors: row['Colors'] || row['colors'] ? String(row['Colors'] || row['colors']).split(',').map(c => c.trim()) : [],
        images: row['Images'] || row['images'] ? String(row['Images'] || row['images']).split(',').map(i => i.trim()) : [],
        is_new: String(row['New'] || row['is_new'] || '').toLowerCase() === 'true' || row['New'] === true,
        is_best_seller: String(row['Best Seller'] || row['is_best_seller'] || '').toLowerCase() === 'true' || row['Best Seller'] === true,
        is_active: row['Active'] === false || String(row['Active'] || row['is_active'] || '').toLowerCase() === 'false' ? false : true,
      }));
      const valid = productRows.filter(p => p.sku && p.name && p.price > 0);
      if (valid.length === 0) { toast({ title: 'No valid products', description: 'Ensure columns: SKU, Name, Price are filled.', variant: 'destructive' }); setBulkImporting(false); return; }
      const { data: insertedProducts, error } = await supabase.from('products').insert(valid).select('id, sku');
      if (error) throw error;
      let variantCount = 0;
      const variantsSheetName = workbook.SheetNames.find(n => n.toLowerCase().includes('variant'));
      if (variantsSheetName && insertedProducts) {
        const variantSheet = workbook.Sheets[variantsSheetName];
        const variantRows: any[] = XLSX.utils.sheet_to_json(variantSheet);
        const skuToId: Record<string, string> = {};
        insertedProducts.forEach(p => { skuToId[p.sku] = p.id; });
        const knownCols = new Set(['product sku', 'variant sku', 'sku', 'price', 'original price', 'stock', 'active']);
        const sampleRow = variantRows[0] || {};
        const attrCols = Object.keys(sampleRow).filter(k => !knownCols.has(k.toLowerCase()));
        const variantsToInsert = variantRows.map((row: any) => {
          const productSku = String(row['Product SKU'] || row['product sku'] || '');
          const productId = skuToId[productSku];
          if (!productId) return null;
          const attributes: Record<string, string> = {};
          attrCols.forEach(col => { if (row[col]) attributes[col] = String(row[col]); });
          return { product_id: productId, sku: String(row['Variant SKU'] || row['SKU'] || row['sku'] || ''), attributes, price: Number(row['Price'] || row['price'] || 0), original_price: row['Original Price'] || row['original price'] ? Number(row['Original Price'] || row['original price']) : null, stock: Number(row['Stock'] || row['stock'] || 0), is_active: row['Active'] === false || String(row['Active'] || '').toLowerCase() === 'false' ? false : true };
        }).filter((v): v is NonNullable<typeof v> => v !== null && !!v.sku && v.price > 0);
        if (variantsToInsert.length > 0) {
          const { error: vErr } = await supabase.from('product_variants').insert(variantsToInsert);
          if (vErr) throw vErr;
          variantCount = variantsToInsert.length;
        }
      }
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      const desc = [valid.length < rows.length ? `${rows.length - valid.length} product rows skipped.` : '', variantCount > 0 ? `${variantCount} variants imported.` : ''].filter(Boolean).join(' ');
      toast({ title: `${valid.length} products imported!`, description: desc || undefined });
      setShowBulkImport(false);
    } catch (err: any) {
      toast({ title: 'Import failed', description: err.message, variant: 'destructive' });
    } finally {
      setBulkImporting(false);
      e.target.value = '';
    }
  };

  const downloadTemplate = () => {
    const productsWs = XLSX.utils.aoa_to_sheet([
      ['SKU', 'Name', 'Description', 'Price', 'Original Price', 'Stock', 'Category', 'Colors', 'Images', 'New', 'Best Seller', 'Active'],
      ['KWW-001', 'Silk Saree', 'Beautiful handwoven silk saree', 2999, 3999, 10, 'Sarees', '#c41e3a, #d4af37', '', 'true', 'false', 'true'],
    ]);
    productsWs['!cols'] = [{ wch: 12 }, { wch: 20 }, { wch: 35 }, { wch: 10 }, { wch: 14 }, { wch: 8 }, { wch: 15 }, { wch: 20 }, { wch: 30 }, { wch: 8 }, { wch: 12 }, { wch: 8 }];
    const variantsWs = XLSX.utils.aoa_to_sheet([
      ['Product SKU', 'Variant SKU', 'Size', 'Fabric', 'Price', 'Original Price', 'Stock', 'Active'],
      ['KWW-001', 'KWW-001-S-SILK', 'S', 'Silk', 2999, 3999, 5, 'true'],
      ['KWW-001', 'KWW-001-M-SILK', 'M', 'Silk', 3199, 3999, 3, 'true'],
      ['KWW-001', 'KWW-001-L-COT', 'L', 'Cotton', 2499, 2999, 8, 'true'],
    ]);
    variantsWs['!cols'] = [{ wch: 14 }, { wch: 18 }, { wch: 8 }, { wch: 10 }, { wch: 10 }, { wch: 14 }, { wch: 8 }, { wch: 8 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, productsWs, 'Products');
    XLSX.utils.book_append_sheet(wb, variantsWs, 'Variants');
    XLSX.writeFile(wb, 'product_import_template.xlsx');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-display text-2xl font-bold">Products</h2>
        <div className="flex gap-2">
          {bulk.someSelected && (
            <>
              <button
                onClick={() => bulkSetActiveMutation.mutate({ ids: Array.from(bulk.selectedIds), is_active: true })}
                disabled={bulkSetActiveMutation.isPending}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 text-sm font-body tracking-wider hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Eye className="h-4 w-4" /> ACTIVATE {bulk.count}
              </button>
              <button
                onClick={() => bulkSetActiveMutation.mutate({ ids: Array.from(bulk.selectedIds), is_active: false })}
                disabled={bulkSetActiveMutation.isPending}
                className="flex items-center gap-2 border border-border px-4 py-2 text-sm font-body tracking-wider hover:bg-muted transition-colors disabled:opacity-50"
              >
                <EyeOff className="h-4 w-4" /> DEACTIVATE {bulk.count}
              </button>
              <button
                onClick={() => { if (confirm(`Delete ${bulk.count} selected products?`)) bulkDeleteMutation.mutate(Array.from(bulk.selectedIds)); }}
                disabled={bulkDeleteMutation.isPending}
                className="flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 text-sm font-body tracking-wider hover:bg-destructive/90 transition-colors disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" /> DELETE {bulk.count}
              </button>
            </>
          )}
          <button onClick={() => setShowBulkImport(true)} className="flex items-center gap-2 border border-border px-4 py-2 text-sm font-body tracking-wider hover:bg-muted transition-colors">
            <FileSpreadsheet className="h-4 w-4" /> BULK IMPORT
          </button>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-body tracking-wider hover:bg-burgundy-light transition-colors">
            <Plus className="h-4 w-4" /> ADD PRODUCT
          </button>
        </div>
      </div>

      {showBulkImport && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-semibold">Bulk Import Products</h3>
              <button onClick={() => setShowBulkImport(false)}><X className="h-5 w-5" /></button>
            </div>
            <p className="font-body text-sm text-muted-foreground mb-4">
              Upload an Excel (.xlsx) file with product data. <strong>Sheet 1 (Products)</strong> — Required: SKU, Name, Price.
              Optional: Description, Original Price, Stock, Category, Colors, Images, New, Best Seller, Active.
              <strong>Sheet 2 (Variants)</strong> — Optional. Columns: Product SKU, Variant SKU, Price, Stock, plus any custom attribute columns.
            </p>
            <div className="space-y-4">
              <button onClick={downloadTemplate} className="w-full flex items-center justify-center gap-2 border border-dashed border-border py-3 text-sm font-body text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                <FileSpreadsheet className="h-4 w-4" /> Download Template
              </button>
              <label className={`w-full flex items-center justify-center gap-2 border border-primary py-3 text-sm font-body cursor-pointer transition-colors ${bulkImporting ? 'opacity-50 cursor-not-allowed bg-muted' : 'bg-primary text-primary-foreground hover:bg-burgundy-light'}`}>
                {bulkImporting ? <><Loader2 className="h-4 w-4 animate-spin" /> Importing...</> : <><Upload className="h-4 w-4" /> Upload Excel File</>}
                <input type="file" accept=".xlsx,.xls,.csv" onChange={handleBulkImport} disabled={bulkImporting} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-semibold">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
              <button onClick={resetForm}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-sm font-semibold block mb-1">SKU *</label>
                  <input required value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} className="w-full border border-border px-3 py-2 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="font-body text-sm font-semibold block mb-1">Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-border px-3 py-2 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="font-body text-sm font-semibold block mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full border border-border px-3 py-2 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-body text-sm font-semibold block mb-1">Price (₹) *</label>
                  <input required type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="w-full border border-border px-3 py-2 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="font-body text-sm font-semibold block mb-1">Original Price</label>
                  <input type="number" step="0.01" value={form.original_price} onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))} className="w-full border border-border px-3 py-2 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="font-body text-sm font-semibold block mb-1">Stock</label>
                  <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="w-full border border-border px-3 py-2 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="font-body text-sm font-semibold block mb-2">Specifications (Saree Details)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border border-border rounded-sm bg-muted/20">
                  {SPEC_FIELDS.map(field => (
                    <div key={field}>
                      <label className="font-body text-xs text-muted-foreground block mb-1">{field}</label>
                      <input
                        value={form.specifications[field] || ''}
                        onChange={e => setForm(f => ({ ...f, specifications: { ...f.specifications, [field]: e.target.value } }))}
                        className="w-full border border-border px-2 py-1.5 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-body text-sm font-semibold block mb-1">Category</label>
                <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} className="w-full border border-border px-3 py-2 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="">Select category</option>
                  {categories?.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-body text-sm font-semibold block mb-1">Colors (comma-separated hex)</label>
                <input value={form.colors} onChange={e => setForm(f => ({ ...f, colors: e.target.value }))} placeholder="#c41e3a, #d4af37" className="w-full border border-border px-3 py-2 text-sm font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="font-body text-sm font-semibold block mb-1">Images</label>
                <label className={`flex items-center justify-center gap-2 border border-dashed border-border py-3 text-sm font-body cursor-pointer hover:border-primary hover:text-primary transition-colors ${uploadingImages ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {uploadingImages ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</> : <><Upload className="h-4 w-4" /> Select images (multiple)</>}
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploadingImages} className="hidden" />
                </label>
                {form.images && (
                  <div className="flex gap-2 flex-wrap mt-3">
                    {form.images.split(',').map((url, i) => url.trim() && (
                      <div key={i} className="relative group">
                        <img src={url.trim()} alt="" className="w-16 h-16 object-cover rounded border border-border" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <ProductVariantsEditor variants={variants} onChange={setVariants} />
              <div className="flex gap-6">
                <label className="flex items-center gap-2 font-body text-sm"><input type="checkbox" checked={form.is_new} onChange={e => setForm(f => ({ ...f, is_new: e.target.checked }))} /> New Arrival</label>
                <label className="flex items-center gap-2 font-body text-sm"><input type="checkbox" checked={form.is_best_seller} onChange={e => setForm(f => ({ ...f, is_best_seller: e.target.checked }))} /> Best Seller</label>
                <label className="flex items-center gap-2 font-body text-sm"><input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} /> Active</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saveMutation.isPending} className="flex-1 bg-primary text-primary-foreground py-2.5 text-sm tracking-wider font-body hover:bg-burgundy-light transition-colors disabled:opacity-50">
                  {saveMutation.isPending ? 'SAVING...' : editingProduct ? 'UPDATE' : 'CREATE'}
                </button>
                <button type="button" onClick={resetForm} className="px-6 py-2.5 border border-border text-sm font-body hover:bg-muted transition-colors">CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground font-body">Loading products...</div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                <th className="p-3 w-10"><Checkbox checked={bulk.allSelected} onCheckedChange={bulk.toggleAll} /></th>
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
                <tr key={product.id} className={`hover:bg-muted/30 transition-colors ${bulk.selectedIds.has(product.id) ? 'bg-primary/5' : ''}`}>
                  <td className="p-3"><Checkbox checked={bulk.selectedIds.has(product.id)} onCheckedChange={() => bulk.toggle(product.id)} /></td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] && <img src={product.images[0]} alt="" className="w-10 h-12 object-cover rounded" />}
                      <span className="font-body text-sm font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-3 font-body text-sm text-muted-foreground">{product.sku}</td>
                  <td className="p-3 font-body text-sm text-muted-foreground">{(product as any).categories?.name || '—'}</td>
                  <td className="p-3 font-body text-sm text-right font-medium">₹{Number(product.price).toLocaleString()}</td>
                  <td className="p-3 font-body text-sm text-center">{product.stock}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-block text-[10px] font-body font-bold px-2 py-0.5 rounded-full ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => startEdit(product)} className="p-1.5 hover:bg-muted rounded transition-colors"><Pencil className="h-4 w-4 text-muted-foreground" /></button>
                      <button onClick={() => { if (confirm('Delete this product?')) deleteMutation.mutate(product.id); }} className="p-1.5 hover:bg-destructive/10 rounded transition-colors"><Trash2 className="h-4 w-4 text-destructive" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!products || products.length === 0) && (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground font-body">No products yet. Add your first product!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
