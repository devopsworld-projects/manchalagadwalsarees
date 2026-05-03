-- Curated Google reviews table (manually managed in admin)
CREATE TABLE public.google_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_initial TEXT,
  rating SMALLINT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT NOT NULL,
  review_date DATE,
  profile_photo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.google_reviews ENABLE ROW LEVEL SECURITY;

-- Public can view active reviews
CREATE POLICY "Anyone can view active google reviews"
  ON public.google_reviews FOR SELECT
  USING (is_active = true);

-- Admins can do everything (uses existing has_role function)
CREATE POLICY "Admins can view all google reviews"
  ON public.google_reviews FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert google reviews"
  ON public.google_reviews FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update google reviews"
  ON public.google_reviews FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete google reviews"
  ON public.google_reviews FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_google_reviews_updated_at
  BEFORE UPDATE ON public.google_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Register homepage section so admin can toggle it
INSERT INTO public.homepage_sections (section_key, title, subtitle, is_enabled, sort_order)
VALUES (
  'google_reviews',
  'What Our Customers Say on Google',
  'Real reviews from happy customers across India',
  true,
  85
)
ON CONFLICT (section_key) DO NOTHING;

-- Store settings: link to Google Reviews page (used by "View all" button)
INSERT INTO public.store_settings (key, value)
VALUES ('google_reviews_url', 'https://www.google.com/search?q=manchala+gadwal+sarees')
ON CONFLICT (key) DO NOTHING;

-- Seed a few starter reviews so the section isn't empty
INSERT INTO public.google_reviews (author_name, author_initial, rating, review_text, review_date, sort_order) VALUES
('Lakshmi Reddy', 'L', 5, 'Beautiful authentic Gadwal saree! The quality of zari work and the silk is exceptional. Delivery was on time and the packaging was very elegant. Highly recommend Manchala Gadwal Sarees.', '2026-04-15', 1),
('Priya Sharma', 'P', 5, 'I bought a bridal Gadwal for my wedding and the response from everyone was incredible. The temple border and pure zari are stunning. Authentic handloom quality.', '2026-03-28', 2),
('Anitha Rao', 'A', 5, 'Excellent customer service. They guided me on choosing the right colour for my mother-in-law. The saree is exactly as shown in the pictures. Will buy again.', '2026-03-12', 3),
('Sneha Iyer', 'S', 5, 'Pure handloom Gadwal at a fair price. The fabric feels luxurious and the colours are very rich. Loved the temple motifs on the pallu.', '2026-02-20', 4),
('Divya Krishnan', 'D', 5, 'Trustworthy seller of authentic Gadwal sarees. I have ordered three times now and every saree exceeded my expectations. Beautiful weaving and finishing.', '2026-02-05', 5),
('Meera Patel', 'M', 5, 'The kuttu Gadwal I ordered is gorgeous. Real zari, soft cotton-silk body, and the contrast border is mesmerising. Genuine product, great pricing.', '2026-01-18', 6);
