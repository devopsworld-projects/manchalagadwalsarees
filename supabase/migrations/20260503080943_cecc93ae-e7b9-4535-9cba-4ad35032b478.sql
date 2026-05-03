
CREATE TABLE public.store_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  pincode TEXT,
  phone TEXT,
  hours TEXT,
  map_url TEXT,
  directions_url TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  rating NUMERIC,
  reviews_count INTEGER,
  photo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.store_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active store locations"
ON public.store_locations FOR SELECT
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert store locations"
ON public.store_locations FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update store locations"
ON public.store_locations FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete store locations"
ON public.store_locations FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_store_locations_updated_at
BEFORE UPDATE ON public.store_locations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.store_locations (name, address, city, state, pincode, phone, hours, map_url, directions_url, rating, reviews_count, sort_order) VALUES
('Manchala Gadwal Sarees - Yousufguda', '8-3-978, Sri Nagar Colony, SBH Colony, Yousufguda', 'Hyderabad', 'Telangana', '500073', '094931 34992', 'Open 24 hours', 'https://www.google.com/maps/search/?api=1&query=Manchala+Gadwal+Sarees+Yousufguda+Hyderabad', 'https://www.google.com/maps/dir/?api=1&destination=Manchala+Gadwal+Sarees+Yousufguda+Hyderabad', 4.9, 220, 1),
('Manchala Gadwal Sarees - Chikkadpally', 'Chikkadpally, New Nallakunta', 'Hyderabad', 'Telangana', '500020', '094931 34992', 'Open 24 hours', 'https://www.google.com/maps/search/?api=1&query=Manchala+Gadwal+Sarees+Chikkadpally+Hyderabad', 'https://www.google.com/maps/dir/?api=1&destination=Manchala+Gadwal+Sarees+Chikkadpally+Hyderabad', 4.9, 292, 2);

INSERT INTO public.homepage_sections (section_key, is_enabled, sort_order)
VALUES ('store_locations', true, 95)
ON CONFLICT (section_key) DO NOTHING;
