DROP POLICY "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT WITH CHECK (customer_name IS NOT NULL AND customer_email IS NOT NULL);

DROP POLICY "Anyone can create order items" ON public.order_items;
CREATE POLICY "Anyone can create order items" ON public.order_items
  FOR INSERT WITH CHECK (product_name IS NOT NULL AND quantity > 0);