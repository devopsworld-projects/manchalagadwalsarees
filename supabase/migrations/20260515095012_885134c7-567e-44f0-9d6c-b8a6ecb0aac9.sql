
-- ============ ORDERS ============
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS tracking_number text,
  ADD COLUMN IF NOT EXISTS courier text,
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_id text,
  ADD COLUMN IF NOT EXISTS coupon_code text,
  ADD COLUMN IF NOT EXISTS discount_amount numeric NOT NULL DEFAULT 0;

-- Allow user to update own pending order (for cancellation)
DROP POLICY IF EXISTS "Users can cancel own pending orders" ON public.orders;
CREATE POLICY "Users can cancel own pending orders"
ON public.orders FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id AND status IN ('pending','cancelled'));

-- ============ INVENTORY: stock adjustment ============
CREATE OR REPLACE FUNCTION public.adjust_stock_on_order_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_stock integer;
BEGIN
  IF NEW.product_id IS NULL THEN RETURN NEW; END IF;

  SELECT stock INTO current_stock FROM public.products WHERE id = NEW.product_id FOR UPDATE;
  IF current_stock IS NULL THEN RETURN NEW; END IF;

  IF current_stock < NEW.quantity THEN
    RAISE EXCEPTION 'Insufficient stock for product %', NEW.product_id;
  END IF;

  UPDATE public.products
    SET stock = stock - NEW.quantity, updated_at = now()
    WHERE id = NEW.product_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_adjust_stock_on_order_item ON public.order_items;
CREATE TRIGGER trg_adjust_stock_on_order_item
AFTER INSERT ON public.order_items
FOR EACH ROW EXECUTE FUNCTION public.adjust_stock_on_order_item();

-- Restore stock when an order is cancelled
CREATE OR REPLACE FUNCTION public.restore_stock_on_cancel()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'cancelled' AND OLD.status IS DISTINCT FROM 'cancelled' THEN
    UPDATE public.products p
      SET stock = stock + oi.quantity, updated_at = now()
      FROM public.order_items oi
      WHERE oi.order_id = NEW.id AND oi.product_id = p.id;
    NEW.cancelled_at = now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_restore_stock_on_cancel ON public.orders;
CREATE TRIGGER trg_restore_stock_on_cancel
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.restore_stock_on_cancel();

-- ============ COUPONS: atomic redemption ============
CREATE OR REPLACE FUNCTION public.redeem_coupon(p_code text, p_order_total numeric)
RETURNS TABLE(id uuid, code text, discount_type text, discount_value numeric, discount_amount numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c public.coupons;
  d numeric;
BEGIN
  SELECT * INTO c FROM public.coupons
    WHERE code = upper(trim(p_code))
    FOR UPDATE;

  IF NOT FOUND THEN RAISE EXCEPTION 'Invalid coupon code'; END IF;
  IF NOT c.is_active THEN RAISE EXCEPTION 'Coupon is inactive'; END IF;
  IF c.expires_at IS NOT NULL AND c.expires_at <= now() THEN RAISE EXCEPTION 'Coupon expired'; END IF;
  IF c.max_uses IS NOT NULL AND c.usage_count >= c.max_uses THEN RAISE EXCEPTION 'Coupon usage limit reached'; END IF;
  IF COALESCE(p_order_total,0) < COALESCE(c.min_order_amount,0) THEN
    RAISE EXCEPTION 'Order total below minimum for this coupon';
  END IF;

  IF c.discount_type = 'percentage' THEN
    d := round(p_order_total * c.discount_value / 100, 2);
  ELSE
    d := LEAST(c.discount_value, p_order_total);
  END IF;

  UPDATE public.coupons SET usage_count = usage_count + 1, updated_at = now() WHERE id = c.id;

  RETURN QUERY SELECT c.id, c.code, c.discount_type, c.discount_value, d;
END;
$$;

-- ============ PAYMENTS table ============
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  user_id uuid,
  provider text NOT NULL DEFAULT 'razorpay',
  provider_payment_id text,
  provider_order_id text,
  signature text,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'pending',
  raw jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage payments" ON public.payments
  FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'))
  WITH CHECK (has_role(auth.uid(),'admin'));

CREATE POLICY "Users view own payments" ON public.payments
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()
  ));

CREATE POLICY "Authenticated users insert payments for own orders" ON public.payments
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR o.user_id IS NULL))
  );

CREATE TRIGGER trg_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ RETURNS: refund tracking ============
ALTER TABLE public.return_requests
  ADD COLUMN IF NOT EXISTS refund_amount numeric,
  ADD COLUMN IF NOT EXISTS refunded_at timestamptz,
  ADD COLUMN IF NOT EXISTS refund_reference text;

-- ============ REVIEWS: verified buyer only ============
DROP POLICY IF EXISTS "Users create own reviews" ON public.reviews;
CREATE POLICY "Verified buyers create reviews" ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.order_items oi
      JOIN public.orders o ON o.id = oi.order_id
      WHERE oi.product_id = reviews.product_id
        AND o.user_id = auth.uid()
        AND o.status IN ('delivered','shipped','confirmed')
    )
  );
