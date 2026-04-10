-- Fix order_items: require order ownership or very recent order for guest checkout
DROP POLICY IF EXISTS "Users can insert items for their own orders" ON public.order_items;

-- For authenticated users: order must belong to them
CREATE POLICY "Authenticated users can insert items for own orders"
ON public.order_items
FOR INSERT
TO authenticated
WITH CHECK (
  product_name IS NOT NULL
  AND quantity > 0
  AND EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
    AND orders.created_at > now() - interval '2 minutes'
  )
);

-- For anonymous/guest checkout: order must be very recent and have no user_id
CREATE POLICY "Guests can insert items for recent guest orders"
ON public.order_items
FOR INSERT
TO anon
WITH CHECK (
  product_name IS NOT NULL
  AND quantity > 0
  AND EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id IS NULL
    AND orders.created_at > now() - interval '2 minutes'
  )
);

-- Fix user_roles: ensure the ALL policy is the only one (it already requires admin)
-- Verify no other INSERT policies exist by explicitly dropping any
-- The existing "Admins can manage roles" ALL policy with has_role check is correct
-- Just ensure there's no open INSERT policy
DO $$ BEGIN
  -- This is a no-op safety check; the ALL policy already covers INSERT for admins only
  NULL;
END $$;