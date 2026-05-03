-- Create public bucket for auto-generated product Open Graph images
insert into storage.buckets (id, name, public)
values ('og-images', 'og-images', true)
on conflict (id) do update set public = true;

-- Public read access
create policy "OG images are publicly readable"
on storage.objects for select
using (bucket_id = 'og-images');

-- Allow anyone to upload an OG image (file size limited by Supabase defaults; non-sensitive content)
create policy "Anyone can upload OG images"
on storage.objects for insert
with check (bucket_id = 'og-images');

-- Allow upserts
create policy "Anyone can update OG images"
on storage.objects for update
using (bucket_id = 'og-images');