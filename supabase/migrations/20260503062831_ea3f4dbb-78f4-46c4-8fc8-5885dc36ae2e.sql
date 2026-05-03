
-- Enrich sample saree descriptions and specifications based on category & variant
UPDATE public.products p
SET
  description = CASE
    WHEN p.sku LIKE 'KANCHIPURAM-%' THEN 'A resplendent Kanchipuram silk saree handwoven by master weavers of Tamil Nadu. Features pure mulberry silk with rich zari borders, traditional temple motifs, and a contrast pallu — an heirloom piece that drapes beautifully and elevates every grand occasion.'
    WHEN p.sku LIKE 'BANARASI-%' THEN 'An opulent Banarasi silk saree from the looms of Varanasi, woven with intricate gold and silver zari work. The intricate brocade, mughal-inspired motifs and lustrous finish make it a timeless choice for weddings and ceremonies.'
    WHEN p.sku LIKE 'GADWAL-%' OR p.sku LIKE 'FABRIC-%' THEN 'A signature Gadwal saree featuring a soft cotton body with a pure silk border and pallu, joined by the traditional kuttu (interlocked weave) technique. Lightweight, breathable, and accented with delicate zari butta — perfect for festive day wear and temple visits.'
    WHEN p.sku LIKE 'PATOLA-%' THEN 'A double-ikat Patola silk saree from Patan, Gujarat — each thread dyed before weaving to create vivid geometric and floral motifs. A collector''s drape, prized for its symmetry, brilliance, and centuries-old craftsmanship.'
    WHEN p.sku LIKE 'CHANDERI-%' THEN 'A featherlight Chanderi saree woven in pure silk-cotton with shimmering zari butis. Known for its sheer texture and royal sheen, ideal for daytime functions and intimate gatherings.'
    WHEN p.sku LIKE 'TUSSAR-%' THEN 'A handwoven Tussar silk saree with natural gold-beige tones and a subtle slubby texture. Adorned with traditional motifs, this earthy drape is a celebration of organic luxury.'
    WHEN p.sku LIKE 'KANJIVARAM-%' THEN 'A pure Kanjivaram silk saree with the iconic korvai border, woven in lustrous mulberry silk and enriched with antique zari. A bridal heirloom that carries the legacy of South Indian craftsmanship.'
    WHEN p.sku LIKE 'POCHAMPALLY-%' THEN 'A handwoven Pochampally Ikat saree from Telangana, featuring tie-dyed yarns crafted into striking geometric patterns. Soft on the skin and rich in heritage.'
    WHEN p.sku LIKE 'BAGSBELTSCLUTCHES-%' THEN 'An artisanal accessory crafted to complement traditional drapes. Made with premium materials, refined detailing, and finished by hand for an heirloom feel.'
    WHEN p.sku LIKE 'WEAVE-%' THEN 'A handwoven heritage saree celebrating the timeless craft of Indian weavers. Features traditional motifs, refined zari accents and a graceful fall — a versatile drape for festive and ceremonial wear.'
    ELSE 'A handwoven heritage saree celebrating the timeless craft of Indian weavers. Features traditional motifs, refined zari accents and a graceful fall — a versatile drape for festive and ceremonial wear.'
  END,
  specifications = jsonb_strip_nulls(jsonb_build_object(
    'Pattern', CASE
      WHEN p.sku LIKE 'PATOLA-%' THEN 'Double Ikat'
      WHEN p.sku LIKE 'POCHAMPALLY-%' THEN 'Geometric Ikat'
      WHEN p.sku LIKE 'BANARASI-%' THEN 'Brocade Floral'
      WHEN p.sku LIKE 'CHANDERI-%' THEN 'Buti'
      WHEN p.sku LIKE 'TUSSAR-%' THEN 'Block Print'
      WHEN p.sku LIKE 'KANCHIPURAM-%' OR p.sku LIKE 'KANJIVARAM-%' THEN 'Temple Border'
      ELSE 'Butta'
    END,
    'Occasion', CASE
      WHEN p.name ILIKE '%bridal%' THEN 'Wedding'
      WHEN p.name ILIKE '%festive%' THEN 'Festive'
      WHEN p.name ILIKE '%royal%' THEN 'Reception'
      WHEN p.name ILIKE '%classic%' THEN 'Daily Wear'
      WHEN p.name ILIKE '%heritage%' THEN 'Cultural Events'
      ELSE 'Wedding'
    END,
    'Fabric', CASE
      WHEN p.sku LIKE 'KANCHIPURAM-%' OR p.sku LIKE 'KANJIVARAM-%' THEN 'Kanchipuram'
      WHEN p.sku LIKE 'BANARASI-%' THEN 'Banarasi'
      WHEN p.sku LIKE 'GADWAL-%' OR p.sku LIKE 'FABRIC-%' THEN 'Gadwal'
      WHEN p.sku LIKE 'PATOLA-%' THEN 'Patola'
      WHEN p.sku LIKE 'CHANDERI-%' THEN 'Chanderi'
      WHEN p.sku LIKE 'TUSSAR-%' THEN 'Tussar'
      WHEN p.sku LIKE 'POCHAMPALLY-%' THEN 'Pochampally'
      ELSE 'Handloom'
    END,
    'Material', CASE
      WHEN p.sku LIKE 'TUSSAR-%' THEN 'Tussar Silk'
      WHEN p.sku LIKE 'CHANDERI-%' THEN 'Silk Cotton'
      WHEN p.sku LIKE 'GADWAL-%' OR p.sku LIKE 'FABRIC-%' THEN 'Silk Cotton'
      WHEN p.sku LIKE 'BAGSBELTSCLUTCHES-%' THEN 'Mixed'
      ELSE 'Silk'
    END,
    'Color Family', CASE
      WHEN p.name ILIKE '%bridal%' THEN 'Jewel Tones'
      WHEN p.name ILIKE '%festive%' THEN 'Vibrant'
      WHEN p.name ILIKE '%royal%' THEN 'Royal'
      WHEN p.name ILIKE '%classic%' THEN 'Pastel'
      ELSE 'Pastel'
    END,
    'Base Color', CASE
      WHEN p.name ILIKE '%bridal%' THEN 'Maroon'
      WHEN p.name ILIKE '%festive%' THEN 'Mustard'
      WHEN p.name ILIKE '%royal%' THEN 'Deep Blue'
      WHEN p.name ILIKE '%classic%' THEN 'Cream'
      WHEN p.name ILIKE '%heritage%' THEN 'White'
      ELSE 'White'
    END,
    'Border Type', 'Contrast Zari',
    'Border Size', CASE
      WHEN p.name ILIKE '%bridal%' OR p.name ILIKE '%royal%' THEN 'Heavy'
      WHEN p.name ILIKE '%classic%' THEN 'Small'
      ELSE 'Medium'
    END,
    'Secondary Color', CASE
      WHEN p.name ILIKE '%bridal%' THEN 'Gold'
      WHEN p.name ILIKE '%festive%' THEN 'Red'
      WHEN p.name ILIKE '%royal%' THEN 'Gold'
      WHEN p.name ILIKE '%classic%' THEN 'Pink'
      ELSE 'Green'
    END,
    'Saree Length', '5.5 m',
    'Blouse Piece', '0.8 m (unstitched)',
    'Wash Care', 'Dry clean only'
  ))
WHERE p.is_active = true;
