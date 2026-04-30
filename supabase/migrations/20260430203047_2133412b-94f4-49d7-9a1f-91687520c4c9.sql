CREATE TABLE public.homepage_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  image_url TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enabled sections publicly readable"
  ON public.homepage_sections FOR SELECT
  USING (is_enabled = true);

CREATE POLICY "Admins read all sections"
  ON public.homepage_sections FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage sections"
  ON public.homepage_sections FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_homepage_sections_updated_at
  BEFORE UPDATE ON public.homepage_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.homepage_sections (section_key, title, subtitle, sort_order) VALUES
  ('hero',          'Hero',                NULL, 10),
  ('featured',      'Featured Carousel',   NULL, 20),
  ('new_arrivals',  'New Collections',     NULL, 30),
  ('categories',    'Shop by Category',    NULL, 40),
  ('heritage',      'Our Heritage',        NULL, 50),
  ('banner',        'Banner Slider',       NULL, 60),
  ('fabric_guide',  'Know Your Fabrics',   'Discover the artistry behind every weave', 70),
  ('occasions',     'Shop by Occasion',    NULL, 80),
  ('best_sellers',  'Best Sellers',        NULL, 90),
  ('testimonials',  'What Our Customers Say', NULL, 100),
  ('newsletter',    'Stay in Touch',       NULL, 110)
ON CONFLICT (section_key) DO NOTHING;