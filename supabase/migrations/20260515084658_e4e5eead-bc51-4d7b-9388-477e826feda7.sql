
-- ============================================================
-- 1) GIFT CARDS — restrict public read
-- ============================================================
DROP POLICY IF EXISTS "Gift cards publicly readable" ON public.gift_cards;

CREATE POLICY "Users view own gift cards"
ON public.gift_cards
FOR SELECT
TO authenticated
USING (auth.uid() = purchased_by);

-- ============================================================
-- 2) COUPONS — drop public read, expose only via secure function
-- ============================================================
DROP POLICY IF EXISTS "Coupons publicly readable" ON public.coupons;

CREATE OR REPLACE FUNCTION public.validate_coupon(p_code text, p_order_total numeric)
RETURNS TABLE (
  id uuid,
  code text,
  discount_type text,
  discount_value numeric,
  min_order_amount numeric
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.code, c.discount_type, c.discount_value, c.min_order_amount
  FROM public.coupons c
  WHERE c.code = upper(trim(p_code))
    AND c.is_active = true
    AND (c.expires_at IS NULL OR c.expires_at > now())
    AND (c.max_uses IS NULL OR c.usage_count < c.max_uses)
    AND COALESCE(p_order_total, 0) >= COALESCE(c.min_order_amount, 0)
  LIMIT 1;
END;
$$;

REVOKE ALL ON FUNCTION public.validate_coupon(text, numeric) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_coupon(text, numeric) TO anon, authenticated;

-- ============================================================
-- 3) OG-IMAGES bucket — admin-only writes
-- ============================================================
DROP POLICY IF EXISTS "Anyone can upload OG images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update OG images" ON storage.objects;

CREATE POLICY "Admins can upload OG images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'og-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update OG images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'og-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete OG images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'og-images' AND has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- 4) Disable bucket LISTING (direct file URLs still work for public buckets)
-- ============================================================
DROP POLICY IF EXISTS "Product images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "OG images are publicly readable" ON storage.objects;

-- ============================================================
-- 5) FAQ items — only active items visible to public
-- ============================================================
DROP POLICY IF EXISTS "FAQ publicly readable" ON public.faq_items;

CREATE POLICY "Active FAQ publicly readable"
ON public.faq_items
FOR SELECT
TO public
USING (is_active = true);

-- ============================================================
-- 6) Banners — only active banners visible to public
-- ============================================================
DROP POLICY IF EXISTS "Banners publicly readable" ON public.banners;

CREATE POLICY "Active banners publicly readable"
ON public.banners
FOR SELECT
TO public
USING (is_active = true);

-- ============================================================
-- 7) Lock down trigger-only SECURITY DEFINER functions
-- ============================================================
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.auto_assign_first_admin() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
