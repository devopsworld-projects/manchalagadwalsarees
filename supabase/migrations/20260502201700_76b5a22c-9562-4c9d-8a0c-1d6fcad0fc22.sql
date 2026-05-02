
-- Wipe existing main menu and rebuild to mirror kankatala.com
DELETE FROM menu_items WHERE menu_group = 'main';

-- Top-level items
WITH parents AS (
  INSERT INTO menu_items (label, slug, menu_group, sort_order, is_active, parent_id) VALUES
    ('Kanchipuram', 'kanchipuram', 'main', 1, true, NULL),
    ('Weave',       NULL,          'main', 2, true, NULL),
    ('Fabric',      'fabric',      'main', 3, true, NULL),
    ('Craft',       NULL,          'main', 4, true, NULL),
    ('Occasion',    NULL,          'main', 5, true, NULL),
    ('Accessories', NULL,          'main', 6, true, NULL),
    ('Sale',        'kankatala-sale','main', 7, true, NULL)
  RETURNING id, label
)
INSERT INTO menu_items (label, slug, url, menu_group, sort_order, is_active, parent_id)
SELECT v.label, v.slug, v.url, 'main', v.sort_order, true, p.id
FROM parents p
JOIN (VALUES
  -- Kanchipuram
  ('Kanchipuram', 'All Kanchipuram',          'kanchipuram',                NULL, 1),
  ('Kanchipuram', 'Bridal Kanchipuram',        'bridal-kanchipuram-sarees',  NULL, 2),
  ('Kanchipuram', 'Pastel Kanchipuram',        'pastel-kanchipuram',         NULL, 3),
  ('Kanchipuram', 'Korvai Border',             'korvai-border-kanchipuram',  NULL, 4),
  ('Kanchipuram', 'Tissue Kanchipuram',        'tissue-kanchipuram',         NULL, 5),
  ('Kanchipuram', 'Pure Zari Kanchipuram',     'pure-zari-kanchipuram',      NULL, 6),
  ('Kanchipuram', 'Kalamkari Kanchipuram',     'kalamkari-kanchipuram',      NULL, 7),
  ('Kanchipuram', 'Printed Kanchipuram',       'printed-kanchipuram',        NULL, 8),
  ('Kanchipuram', 'Vintage Kanchipuram',       'vintage-kanchipuram-sarees', NULL, 9),
  ('Kanchipuram', 'Taranga Kanchi Pattu',      'taranga-kanchi-pattu',       NULL,10),
  -- Weave
  ('Weave', 'All Weaves',                     'kankatala-blends-fusion-weaves', NULL, 1),
  ('Weave', 'Banarasi',                       'banarasi-sarees',                NULL, 2),
  ('Weave', 'Paithani',                       'paithani',                       NULL, 3),
  ('Weave', 'Patan Patola',                   'patan-patola-sarees',            NULL, 4),
  ('Weave', 'Ikat',                           'ikat-sarees',                    NULL, 5),
  ('Weave', 'Gadwal',                         'gadwal',                         NULL, 6),
  ('Weave', 'Uppada',                         'uppada-sarees',                  NULL, 7),
  ('Weave', 'Pochampally',                    'pochampally-sarees',             NULL, 8),
  ('Weave', 'Coimbatore',                     'coimbatore',                     NULL, 9),
  ('Weave', 'Ponduru Cotton',                 'ponduru-cotton-sarees',          NULL,10),
  ('Weave', 'Kota',                           'kota-sarees',                    NULL,11),
  ('Weave', 'Chanderi',                       'chanderi-sarees',                NULL,12),
  -- Fabric
  ('Fabric', 'All Fabric',                    'fabric',                         NULL, 1),
  ('Fabric', 'Silk',                          'silk-sarees',                    NULL, 2),
  ('Fabric', 'Handspun Cotton',               'handspun-cotton-sarees',         NULL, 3),
  ('Fabric', 'Organza',                       'organza',                        NULL, 4),
  ('Fabric', 'Soft Silk',                     'soft-silk-sarees',               NULL, 5),
  ('Fabric', 'Georgette & Chiffon',           'georgette-chiffon',              NULL, 6),
  ('Fabric', 'Tussar',                        'tussar-sarees',                  NULL, 7),
  ('Fabric', 'Linen',                         'linen',                          NULL, 8),
  -- Craft
  ('Craft', 'Kalamkari',                      'kalamkari',                      NULL, 1),
  ('Craft', 'Bandhani',                       'bandhani-sarees',                NULL, 2),
  ('Craft', 'Chikankari',                     'chikankari-sarees',              NULL, 3),
  ('Craft', 'Printed Sarees',                 'printed-sarees',                 NULL, 4),
  ('Craft', 'Embroidered Sarees',             'embroidered-sarees',             NULL, 5),
  -- Occasion
  ('Occasion', 'Wedding',                     'wedding-collection',             NULL, 1),
  ('Occasion', 'Bridal',                      'bridal-kanchipuram-sarees',      NULL, 2),
  ('Occasion', 'Festive',                     'festive-collection',             NULL, 3),
  ('Occasion', 'Formal',                      'formal-collection',              NULL, 4),
  ('Occasion', 'Casual',                      'casual-collection',              NULL, 5),
  ('Occasion', 'Party',                       'party-collection',               NULL, 6),
  -- Accessories
  ('Accessories', 'Dupattas',                 'dupatta',                        NULL, 1),
  ('Accessories', 'Blouses',                  'blouse',                         NULL, 2),
  ('Accessories', 'Suits',                    'salwar-suit-set',                NULL, 3),
  ('Accessories', 'Lehenga',                  'lehenga',                        NULL, 4),
  ('Accessories', 'Bags, Belts & Clutches',   'bags-belts-clutches',            NULL, 5),
  ('Accessories', 'Dhoti',                    'dhoti',                          NULL, 6)
) AS v(parent_label, label, slug, url, sort_order)
ON p.label = v.parent_label;
