
-- Drop existing public read policy and replace with broader one
DROP POLICY IF EXISTS "Non-sensitive settings are publicly readable" ON public.store_settings;

CREATE POLICY "Public settings are readable by everyone"
ON public.store_settings
FOR SELECT
TO public
USING (
  key = ANY (ARRAY[
    'store_name', 'store_description', 'store_email', 'store_phone', 'store_address',
    'currency', 'tax_rate',
    'logo_url', 'favicon_url',
    'primary_color', 'accent_color', 'background_color',
    'hero_title', 'hero_subtitle', 'hero_cta_text', 'hero_cta_link', 'hero_image',
    'announcement_text', 'announcement_enabled',
    'social_instagram', 'social_facebook', 'social_youtube', 'social_whatsapp',
    'footer_description',
    'whatsapp_number'
  ])
);
