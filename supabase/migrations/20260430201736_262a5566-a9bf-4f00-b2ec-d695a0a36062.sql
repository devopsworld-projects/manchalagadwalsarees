DO $$
DECLARE
  base TEXT := 'https://stoxqbcsqiqqfmnymjdh.supabase.co/storage/v1/object/public/product-images/cat/';
  mapping JSONB := jsonb_build_object(
    'kanchipuram',               'kanchipuram.jpg',
    'bridal-kanchipuram',        'kanchipuram.jpg',
    'pure-zari-kanchipuram',     'kanchipuram.jpg',
    'korvai-border-kanchipuram', 'kanchipuram.jpg',
    'vintage-kanchipuram',       'kanchipuram.jpg',
    'kalamkari-kanchipuram',     'kalamkari.jpg',
    'pastel-kanchipuram',        'pastel.jpg',
    'tissue-kanchipuram',        'tissue.jpg',
    'banarasi',                  'banarasi.jpg',
    'gadwal',                    'gadwal.jpg',
    'paithani',                  'paithani.jpg',
    'bandhani',                  'bandhani.jpg',
    'ikat',                      'ikat.jpg',
    'patan-patola',              'ikat.jpg',
    'pochampally',               'pochampally.jpg',
    'kalamkari',                 'kalamkari.jpg',
    'chikankari',                'chikankari.jpg',
    'printed-sarees',            'printed.jpg',
    'embroidered-sarees',        'festive.jpg',
    'handspun-cotton',           'cotton.jpg',
    'chanderi',                  'chanderi.jpg',
    'kota',                      'kota.jpg',
    'linen',                     'linen.jpg',
    'organza',                   'organza.jpg',
    'georgette-chiffon',         'printed.jpg',
    'tussar',                    'tussar.jpg',
    'uppada',                    'uppada.jpg',
    'silk',                      'banarasi.jpg',
    'soft-silk',                 'pastel.jpg',
    'bridal',                    'bridal.jpg',
    'wedding',                   'bridal.jpg',
    'festive',                   'festive.jpg',
    'party',                     'festive.jpg',
    'casual',                    'cotton.jpg',
    'formal',                    'pastel.jpg',
    'weave',                     'gadwal.jpg',
    'fabric',                    'fabric.jpg',
    'blouse',                    'blouse.jpg',
    'dupatta',                   'dupatta.jpg',
    'lehenga',                   'lehenga.jpg',
    'salwar-suit-set',           'suits.jpg',
    'dhoti',                     'dhoti.jpg',
    'bags-belts-clutches',       'bags.jpg'
  );
  rec RECORD;
  img_url TEXT;
BEGIN
  FOR rec IN SELECT id, slug FROM public.categories LOOP
    IF mapping ? rec.slug THEN
      img_url := base || (mapping ->> rec.slug);

      UPDATE public.categories
        SET image_url = img_url
        WHERE id = rec.id;

      UPDATE public.products
        SET images = ARRAY[img_url]::text[]
        WHERE category_id = rec.id
          AND (
            images IS NULL
            OR array_length(images, 1) IS NULL
            OR images = ARRAY['/placeholder.svg']::text[]
          );
    END IF;
  END LOOP;
END $$;