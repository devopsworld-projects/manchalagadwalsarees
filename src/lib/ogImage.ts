import { supabase } from '@/integrations/supabase/client';

const BUCKET = 'og-images';

interface GenerateArgs {
  sku: string;
  name: string;
  category?: string;
  priceLabel: string;
  imageUrl: string;
}

const DEEP_BURGUNDY = '#5b1a1a';
const ANTIQUE_GOLD = '#c8a85a';
const WARM_CREAM = '#fbf6ec';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines - 1) break;
    } else {
      line = test;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  if (lines.length === maxLines) {
    const last = lines[maxLines - 1];
    if (ctx.measureText(last + '…').width > maxWidth) {
      lines[maxLines - 1] = last.slice(0, -3) + '…';
    } else if (words.join(' ') !== lines.join(' ')) {
      lines[maxLines - 1] = last + '…';
    }
  }
  return lines;
}

async function renderCard({ name, category, priceLabel, imageUrl }: GenerateArgs): Promise<Blob> {
  const W = 1200;
  const H = 630;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Cream background
  ctx.fillStyle = WARM_CREAM;
  ctx.fillRect(0, 0, W, H);

  // Left product image panel
  const PANEL_W = 520;
  ctx.fillStyle = '#eadfc9';
  ctx.fillRect(0, 0, PANEL_W, H);
  try {
    const img = await loadImage(imageUrl);
    const ratio = Math.max(PANEL_W / img.width, H / img.height);
    const dw = img.width * ratio;
    const dh = img.height * ratio;
    ctx.drawImage(img, (PANEL_W - dw) / 2, (H - dh) / 2, dw, dh);
  } catch {
    // ignore — keep placeholder
  }

  // Gold separator
  ctx.fillStyle = ANTIQUE_GOLD;
  ctx.fillRect(PANEL_W, 0, 4, H);

  // Right text panel
  const PAD = 60;
  const TEXT_X = PANEL_W + PAD;
  const TEXT_W = W - TEXT_X - PAD;

  // Brand
  ctx.fillStyle = DEEP_BURGUNDY;
  ctx.font = 'bold 22px Georgia, serif';
  ctx.textBaseline = 'top';
  const brand = 'MANCHALA · GADWAL SAREES';
  ctx.fillText(brand, TEXT_X, 60);

  // Gold underline
  ctx.fillStyle = ANTIQUE_GOLD;
  ctx.fillRect(TEXT_X, 95, 80, 3);

  // Category
  if (category) {
    ctx.fillStyle = ANTIQUE_GOLD;
    ctx.font = 'bold 20px Georgia, serif';
    ctx.fillText(category.toUpperCase(), TEXT_X, 130);
  }

  // Title (wrap up to 4 lines)
  ctx.fillStyle = DEEP_BURGUNDY;
  ctx.font = 'bold 56px Georgia, serif';
  const titleLines = wrapText(ctx, name, TEXT_W, 4);
  let y = 175;
  for (const l of titleLines) {
    ctx.fillText(l, TEXT_X, y);
    y += 64;
  }

  // Price
  y = Math.min(y + 30, H - 180);
  ctx.fillStyle = '#1a1a1a';
  ctx.font = 'bold 64px Georgia, serif';
  ctx.fillText(priceLabel, TEXT_X, y);

  // Footer line
  ctx.fillStyle = ANTIQUE_GOLD;
  ctx.fillRect(TEXT_X, H - 90, TEXT_W, 2);
  ctx.fillStyle = DEEP_BURGUNDY;
  ctx.font = '20px Georgia, serif';
  ctx.fillText('Free shipping across India · manchalagadwalsarees.lovable.app', TEXT_X, H - 60);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('canvas blob failed'))), 'image/jpeg', 0.85);
  });
}

/**
 * Returns the public URL for a product OG image, generating + uploading it on first request.
 * Returns null if generation fails (caller should fall back to product photo).
 */
export async function ensureProductOgImage(args: GenerateArgs): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const path = `products/${args.sku}.jpg`;

  // Check if already exists
  const { data: existing } = supabase.storage.from(BUCKET).getPublicUrl(path);
  if (existing?.publicUrl) {
    try {
      const head = await fetch(existing.publicUrl, { method: 'HEAD' });
      if (head.ok) return existing.publicUrl;
    } catch {
      // continue to generate
    }
  }

  try {
    const blob = await renderCard(args);
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, { contentType: 'image/jpeg', upsert: true, cacheControl: '604800' });
    if (error) return null;
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  } catch {
    return null;
  }
}
