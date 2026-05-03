-- Allow new public-readable keys for COD rules + Instagram feed config
DROP POLICY IF EXISTS "Public settings are readable by everyone" ON public.store_settings;

CREATE POLICY "Public settings are readable by everyone"
ON public.store_settings
FOR SELECT
TO public
USING (key = ANY (ARRAY[
  'store_name','store_description','store_email','store_phone','store_address',
  'currency','tax_rate','logo_url','favicon_url','primary_color','accent_color',
  'background_color','hero_title','hero_subtitle','hero_cta_text','hero_cta_link',
  'hero_image','announcement_text','announcement_enabled',
  'social_instagram','social_facebook','social_youtube','social_whatsapp',
  'footer_description','whatsapp_number','razorpay_key_id',
  'payment_cod_enabled','payment_online_enabled','low_stock_threshold',
  -- COD rules
  'cod_enabled','cod_min_order','cod_max_order','cod_pincode_mode','cod_pincodes',
  -- Instagram (Behold) widget
  'behold_feed_id','instagram_section_enabled','instagram_section_title','instagram_section_subtitle'
]));