import { useState } from 'react';
import { Plus, Trash2, X, Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export interface VariantRow {
  id?: string;
  sku: string;
  attributes: Record<string, string>;
  price: string;
  original_price: string;
  stock: string;
  is_active: boolean;
  images: string[];
}

interface Props {
  variants: VariantRow[];
  onChange: (variants: VariantRow[]) => void;
}

const emptyVariant = (): VariantRow => ({
  sku: '', attributes: {}, price: '', original_price: '', stock: '0', is_active: true, images: [],
});

export function ProductVariantsEditor({ variants, onChange }: Props) {
  const [newAttrKey, setNewAttrKey] = useState('');
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const allKeys = Array.from(new Set(variants.flatMap(v => Object.keys(v.attributes))));

  const addVariant = () => {
    const v = emptyVariant();
    allKeys.forEach(k => { v.attributes[k] = ''; });
    onChange([...variants, v]);
  };

  const removeVariant = (i: number) => onChange(variants.filter((_, idx) => idx !== i));

  const updateVariant = (i: number, field: keyof VariantRow, value: any) => {
    const updated = [...variants];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };

  const updateAttribute = (i: number, key: string, value: string) => {
    const updated = [...variants];
    updated[i] = { ...updated[i], attributes: { ...updated[i].attributes, [key]: value } };
    onChange(updated);
  };

  const addAttributeKey = () => {
    const key = newAttrKey.trim();
    if (!key || allKeys.includes(key)) return;
    onChange(variants.map(v => ({ ...v, attributes: { ...v.attributes, [key]: '' } })));
    setNewAttrKey('');
  };

  const removeAttributeKey = (key: string) => {
    onChange(variants.map(v => {
      const attrs = { ...v.attributes };
      delete attrs[key];
      return { ...v, attributes: attrs };
    }));
  };

  const handleVariantImageUpload = async (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingIdx(i);
    const currentImages = [...(variants[i].images || [])];

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const path = `variants/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from('product-images').upload(path, file);
      if (error) continue;
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path);
      currentImages.push(urlData.publicUrl);
    }

    updateVariant(i, 'images', currentImages);
    setUploadingIdx(null);
    e.target.value = '';
  };

  const removeVariantImage = (variantIdx: number, imgIdx: number) => {
    const imgs = [...(variants[variantIdx].images || [])];
    imgs.splice(imgIdx, 1);
    updateVariant(variantIdx, 'images', imgs);
  };

  return (
    <div className="border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-display text-sm font-semibold">Product Variants</h4>
        <button type="button" onClick={addVariant} className="flex items-center gap-1 text-xs font-body text-primary hover:underline">
          <Plus className="h-3.5 w-3.5" /> Add Variant
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-body text-xs text-muted-foreground">Attributes:</span>
        {allKeys.map(key => (
          <span key={key} className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-xs font-body">
            {key}
            <button type="button" onClick={() => removeAttributeKey(key)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
          </span>
        ))}
        <div className="inline-flex items-center gap-1">
          <input value={newAttrKey} onChange={e => setNewAttrKey(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAttributeKey())}
            placeholder="e.g. Size"
            className="w-24 border border-border px-2 py-0.5 text-xs font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          <button type="button" onClick={addAttributeKey} className="text-xs font-body text-primary hover:underline">+ Add</button>
        </div>
      </div>

      {variants.length === 0 && (
        <p className="text-xs font-body text-muted-foreground text-center py-3">
          No variants yet. Click "Add Variant" to create size/color/fabric options.
        </p>
      )}

      {variants.map((v, i) => (
        <div key={i} className="border border-border rounded p-3 space-y-3 bg-muted/20">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs font-semibold text-muted-foreground">Variant {i + 1}</span>
            <button type="button" onClick={() => removeVariant(i)} className="text-destructive hover:text-destructive/80">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {allKeys.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allKeys.map(key => (
                <div key={key}>
                  <label className="font-body text-[10px] text-muted-foreground block mb-0.5">{key}</label>
                  <input value={v.attributes[key] || ''} onChange={e => updateAttribute(i, key, e.target.value)}
                    className="w-full border border-border px-2 py-1 text-xs font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="font-body text-[10px] text-muted-foreground block mb-0.5">SKU *</label>
              <input value={v.sku} onChange={e => updateVariant(i, 'sku', e.target.value)}
                className="w-full border border-border px-2 py-1 text-xs font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="font-body text-[10px] text-muted-foreground block mb-0.5">Price (₹) *</label>
              <input type="number" step="0.01" value={v.price} onChange={e => updateVariant(i, 'price', e.target.value)}
                className="w-full border border-border px-2 py-1 text-xs font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="font-body text-[10px] text-muted-foreground block mb-0.5">Original Price</label>
              <input type="number" step="0.01" value={v.original_price} onChange={e => updateVariant(i, 'original_price', e.target.value)}
                className="w-full border border-border px-2 py-1 text-xs font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="font-body text-[10px] text-muted-foreground block mb-0.5">Stock</label>
              <input type="number" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)}
                className="w-full border border-border px-2 py-1 text-xs font-body rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>

          {/* Variant Images */}
          <div>
            <label className="font-body text-[10px] text-muted-foreground block mb-1">Variant Images</label>
            <div className="flex flex-wrap gap-2 items-center">
              {(v.images || []).map((url, imgIdx) => (
                <div key={imgIdx} className="relative group">
                  <img src={url} alt="" className="w-12 h-14 object-cover rounded border border-border" />
                  <button type="button" onClick={() => removeVariantImage(i, imgIdx)}
                    className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full h-4 w-4 flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
              <label className={`flex items-center gap-1 border border-dashed border-border px-2 py-1.5 text-[10px] font-body cursor-pointer rounded hover:border-primary hover:text-primary transition-colors ${uploadingIdx === i ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {uploadingIdx === i ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                {uploadingIdx === i ? 'Uploading...' : 'Add Images'}
                <input type="file" accept="image/*" multiple onChange={e => handleVariantImageUpload(i, e)} disabled={uploadingIdx === i} className="hidden" />
              </label>
            </div>
          </div>

          <label className="flex items-center gap-1.5 font-body text-xs">
            <input type="checkbox" checked={v.is_active} onChange={e => updateVariant(i, 'is_active', e.target.checked)} /> Active
          </label>
        </div>
      ))}
    </div>
  );
}
