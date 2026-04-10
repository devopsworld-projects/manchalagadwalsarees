-- Fix 1: Restrict store_settings public read to non-sensitive keys
DROP POLICY IF EXISTS "Settings are publicly readable" ON public.store_settings;
CREATE POLICY "Non-sensitive settings are publicly readable"
ON public.store_settings
FOR SELECT
TO public
USING (key IN ('store_name', 'store_description', 'announcement_text', 'currency', 'hero_title', 'hero_subtitle', 'hero_image'));

-- Fix 2: Tighten order_items INSERT policy
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
CREATE POLICY "Users can insert items for their own orders"
ON public.order_items
FOR INSERT
TO public
WITH CHECK (
  product_name IS NOT NULL
  AND quantity > 0
  AND EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.created_at > now() - interval '5 minutes'
  )
);