import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload, Palette, Globe, Image, Megaphone, Share2, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const AdminSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Record<string, string>>({});
  const logoInputRef = useRef<HTMLInputElement>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('store_settings').select('*');
      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      settings.forEach(s => { map[s.key] = s.value || ''; });
      setForm(map);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (entries: Record<string, string>) => {
      for (const [key, value] of Object.entries(entries)) {
        // Upsert: try update first, if no rows affected then insert
        const { data } = await supabase
          .from('store_settings')
          .update({ value })
          .eq('key', key)
          .select();
        
        if (!data || data.length === 0) {
          await supabase
            .from('store_settings')
            .insert({ key, value });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      queryClient.invalidateQueries({ queryKey: ['store-settings-public'] });
      toast({ title: 'Settings saved successfully!' });
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const update = (key: string, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop();
    const path = `branding/logo.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' });
      return;
    }

    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path);
    update('logo_url', urlData.publicUrl);
    toast({ title: 'Logo uploaded! Save settings to apply.' });
  };

  const hslToHex = (hsl: string) => {
    const parts = hsl.trim().split(/\s+/);
    if (parts.length < 3) return '#8B2252';
    const h = parseFloat(parts[0]);
    const s = parseFloat(parts[1]) / 100;
    const l = parseFloat(parts[2]) / 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const hexToHsl = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '';
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground font-body">Loading settings...</div>;
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Store Settings</h2>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-6">
            <TabsTrigger value="general" className="text-xs gap-1"><Settings className="h-3.5 w-3.5 hidden sm:inline" /> General</TabsTrigger>
            <TabsTrigger value="branding" className="text-xs gap-1"><Upload className="h-3.5 w-3.5 hidden sm:inline" /> Branding</TabsTrigger>
            <TabsTrigger value="appearance" className="text-xs gap-1"><Palette className="h-3.5 w-3.5 hidden sm:inline" /> Colors</TabsTrigger>
            <TabsTrigger value="hero" className="text-xs gap-1"><Image className="h-3.5 w-3.5 hidden sm:inline" /> Hero</TabsTrigger>
            <TabsTrigger value="social" className="text-xs gap-1"><Share2 className="h-3.5 w-3.5 hidden sm:inline" /> Social</TabsTrigger>
            <TabsTrigger value="announcements" className="text-xs gap-1"><Megaphone className="h-3.5 w-3.5 hidden sm:inline" /> Announce</TabsTrigger>
          </TabsList>

          {/* General */}
          <TabsContent value="general" className="max-w-2xl space-y-5">
            <SectionTitle>General Information</SectionTitle>
            <Field label="Store Name" value={form.store_name} onChange={v => update('store_name', v)} />
            <Field label="Store Description" value={form.store_description} onChange={v => update('store_description', v)} type="textarea" />
            <Field label="Contact Email" value={form.store_email} onChange={v => update('store_email', v)} inputType="email" />
            <Field label="Phone Number" value={form.store_phone} onChange={v => update('store_phone', v)} inputType="tel" />
            <Field label="Store Address" value={form.store_address} onChange={v => update('store_address', v)} type="textarea" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Currency" value={form.currency} onChange={v => update('currency', v)} />
              <Field label="Tax Rate (%)" value={form.tax_rate} onChange={v => update('tax_rate', v)} inputType="number" />
            </div>
          </TabsContent>

          {/* Branding */}
          <TabsContent value="branding" className="max-w-2xl space-y-6">
            <SectionTitle>Logo & Branding</SectionTitle>
            
            <div className="space-y-3">
              <Label className="font-body text-sm font-semibold">Store Logo</Label>
              <div className="flex items-center gap-4">
                {form.logo_url ? (
                  <img src={form.logo_url} alt="Logo" className="h-16 w-auto border border-border rounded p-1" />
                ) : (
                  <div className="h-16 w-16 border-2 border-dashed border-border rounded flex items-center justify-center text-muted-foreground">
                    <Upload className="h-6 w-6" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" /> Upload Logo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">PNG or SVG recommended. Max 2MB.</p>
                </div>
              </div>
              <Field label="Or paste logo URL" value={form.logo_url} onChange={v => update('logo_url', v)} placeholder="https://..." />
            </div>

            <div className="space-y-3">
              <Label className="font-body text-sm font-semibold">Footer Description</Label>
              <Textarea
                value={form.footer_description || ''}
                onChange={e => update('footer_description', e.target.value)}
                rows={3}
                className="font-body text-sm"
                placeholder="Short description shown in the footer..."
              />
            </div>
          </TabsContent>

          {/* Appearance / Colors */}
          <TabsContent value="appearance" className="max-w-2xl space-y-6">
            <SectionTitle>Theme Colors</SectionTitle>
            <p className="text-sm text-muted-foreground font-body">Customize your store's color scheme. Changes apply after saving.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <ColorPicker
                label="Primary Color"
                description="Buttons, links, accents"
                value={form.primary_color || '350 45% 30%'}
                onChange={v => update('primary_color', v)}
                hslToHex={hslToHex}
                hexToHsl={hexToHsl}
              />
              <ColorPicker
                label="Accent Color"
                description="Gold highlights, badges"
                value={form.accent_color || '38 70% 50%'}
                onChange={v => update('accent_color', v)}
                hslToHex={hslToHex}
                hexToHsl={hexToHsl}
              />
              <ColorPicker
                label="Background Color"
                description="Page background"
                value={form.background_color || '40 33% 97%'}
                onChange={v => update('background_color', v)}
                hslToHex={hslToHex}
                hexToHsl={hexToHsl}
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground font-body">
                💡 <strong>Tip:</strong> Preview your colors below. The primary color is used for buttons and important elements. The accent color highlights special items like gold badges and prices.
              </p>
              <div className="flex gap-3 mt-3">
                <div className="h-10 w-20 rounded" style={{ backgroundColor: hslToHex(form.primary_color || '350 45% 30%') }} />
                <div className="h-10 w-20 rounded" style={{ backgroundColor: hslToHex(form.accent_color || '38 70% 50%') }} />
                <div className="h-10 w-20 rounded border border-border" style={{ backgroundColor: hslToHex(form.background_color || '40 33% 97%') }} />
              </div>
            </div>
          </TabsContent>

          {/* Hero Section */}
          <TabsContent value="hero" className="max-w-2xl space-y-5">
            <SectionTitle>Hero Banner</SectionTitle>
            <Field label="Hero Title" value={form.hero_title} onChange={v => update('hero_title', v)} placeholder="Kavi Women's World" />
            <Field label="Hero Subtitle" value={form.hero_subtitle} onChange={v => update('hero_subtitle', v)} placeholder="Elegance in Every Drape" />
            <Field label="CTA Button Text" value={form.hero_cta_text} onChange={v => update('hero_cta_text', v)} placeholder="Explore Collections" />
            <Field label="CTA Button Link" value={form.hero_cta_link} onChange={v => update('hero_cta_link', v)} placeholder="/collections" />
            <Field label="Hero Background Image URL" value={form.hero_image} onChange={v => update('hero_image', v)} placeholder="https://..." />
            {form.hero_image && (
              <img src={form.hero_image} alt="Hero preview" className="w-full max-h-40 object-cover rounded border border-border" />
            )}
          </TabsContent>

          {/* Social Links */}
          <TabsContent value="social" className="max-w-2xl space-y-5">
            <SectionTitle>Social Media & WhatsApp</SectionTitle>
            <Field label="WhatsApp Number" value={form.whatsapp_number} onChange={v => update('whatsapp_number', v)} placeholder="919494644998" helper="Include country code, no + sign" />
            <Field label="Instagram URL" value={form.social_instagram} onChange={v => update('social_instagram', v)} placeholder="https://instagram.com/yourpage" />
            <Field label="Facebook URL" value={form.social_facebook} onChange={v => update('social_facebook', v)} placeholder="https://facebook.com/yourpage" />
            <Field label="YouTube URL" value={form.social_youtube} onChange={v => update('social_youtube', v)} placeholder="https://youtube.com/yourchannel" />
          </TabsContent>

          {/* Announcements */}
          <TabsContent value="announcements" className="max-w-2xl space-y-5">
            <SectionTitle>Announcement Bar</SectionTitle>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.announcement_enabled === 'true'}
                onCheckedChange={v => update('announcement_enabled', v ? 'true' : 'false')}
              />
              <Label className="font-body text-sm">Show announcement bar on all pages</Label>
            </div>
            <Field
              label="Announcement Text"
              value={form.announcement_text}
              onChange={v => update('announcement_text', v)}
              type="textarea"
              placeholder="Separate multiple announcements with | (pipe). E.g: Free shipping! | New arrivals out now!"
              helper="Use | to separate multiple scrolling messages"
            />
          </TabsContent>
        </Tabs>

        <div className="mt-8 pt-6 border-t border-border">
          <Button
            type="submit"
            disabled={saveMutation.isPending}
            className="gap-2 tracking-wider uppercase text-xs"
          >
            <Save className="h-4 w-4" />
            {saveMutation.isPending ? 'Saving...' : 'Save All Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-display text-lg font-semibold border-b border-border pb-2 mb-4">{children}</h3>;
}

function Field({ label, value, onChange, type = 'input', inputType = 'text', placeholder, helper }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: 'input' | 'textarea';
  inputType?: string;
  placeholder?: string;
  helper?: string;
}) {
  return (
    <div>
      <Label className="font-body text-sm font-semibold block mb-1">{label}</Label>
      {type === 'textarea' ? (
        <Textarea
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          rows={3}
          className="font-body text-sm"
          placeholder={placeholder}
        />
      ) : (
        <Input
          type={inputType}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className="font-body text-sm"
          placeholder={placeholder}
        />
      )}
      {helper && <p className="text-xs text-muted-foreground mt-1">{helper}</p>}
    </div>
  );
}

function ColorPicker({ label, description, value, onChange, hslToHex, hexToHsl }: {
  label: string;
  description: string;
  value: string;
  onChange: (v: string) => void;
  hslToHex: (hsl: string) => string;
  hexToHsl: (hex: string) => string;
}) {
  return (
    <div className="space-y-2">
      <Label className="font-body text-sm font-semibold">{label}</Label>
      <p className="text-xs text-muted-foreground">{description}</p>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={hslToHex(value)}
          onChange={e => onChange(hexToHsl(e.target.value))}
          className="h-10 w-10 rounded border border-border cursor-pointer"
        />
        <Input
          value={hslToHex(value)}
          onChange={e => {
            const hsl = hexToHsl(e.target.value);
            if (hsl) onChange(hsl);
          }}
          className="font-mono text-xs flex-1"
          placeholder="#8B2252"
        />
      </div>
    </div>
  );
}

export default AdminSettings;
