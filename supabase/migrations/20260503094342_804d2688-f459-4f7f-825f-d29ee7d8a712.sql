-- Deduplicate existing rows, keeping the earliest
DELETE FROM public.newsletter_subscribers a
USING public.newsletter_subscribers b
WHERE a.ctid > b.ctid
  AND lower(a.email) = lower(b.email);

-- Enforce uniqueness (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_email_unique
  ON public.newsletter_subscribers (lower(email));