-- Seed Manchala Gadwal Sarees navigation (Kankatala-inspired)
DELETE FROM menu_items WHERE menu_group IN ('main','topbar','mobile');

DO $$
DECLARE
  kanchi_id uuid; weave_id uuid; fabric_id uuid; craft_id uuid; occasion_id uuid; access_id uuid;
BEGIN
  INSERT INTO menu_items (label, url, sort_order, is_active, menu_group) VALUES
    ('Free Shipping in India', '/shipping-policy', 1, true, 'topbar'),
    ('Track Order', '/account/orders', 2, true, 'topbar'),
    ('Contact Us', '/contact', 3, true, 'topbar');

  INSERT INTO menu_items (label, slug, sort_order, is_active, menu_group)
    VALUES ('Kanchipuram', 'kanchipuram', 1, true, 'main') RETURNING id INTO kanchi_id;
  INSERT INTO menu_items (label, slug, parent_id, sort_order, is_active, menu_group) VALUES
    ('All Kanchipuram',        'kanchipuram',                kanchi_id, 1, true, 'main'),
    ('Bridal Kanchipuram',     'bridal-kanchipuram',         kanchi_id, 2, true, 'main'),
    ('Pastel Kanchipuram',     'pastel-kanchipuram',         kanchi_id, 3, true, 'main'),
    ('Korvai Border',          'korvai-border-kanchipuram',  kanchi_id, 4, true, 'main'),
    ('Tissue Kanchipuram',     'tissue-kanchipuram',         kanchi_id, 5, true, 'main'),
    ('Pure Zari Kanchipuram',  'pure-zari-kanchipuram',      kanchi_id, 6, true, 'main'),
    ('Kalamkari Kanchipuram',  'kalamkari-kanchipuram',      kanchi_id, 7, true, 'main'),
    ('Vintage Kanchipuram',    'vintage-kanchipuram',        kanchi_id, 8, true, 'main');

  INSERT INTO menu_items (label, slug, sort_order, is_active, menu_group)
    VALUES ('Weave', 'weave', 2, true, 'main') RETURNING id INTO weave_id;
  INSERT INTO menu_items (label, slug, parent_id, sort_order, is_active, menu_group) VALUES
    ('All Weaves',     'weave',              weave_id, 1, true, 'main'),
    ('Gadwal',         'gadwal',             weave_id, 2, true, 'main'),
    ('Banarasi',       'banarasi',           weave_id, 3, true, 'main'),
    ('Paithani',       'paithani',           weave_id, 4, true, 'main'),
    ('Patan Patola',   'patan-patola',       weave_id, 5, true, 'main'),
    ('Ikat',           'ikat',               weave_id, 6, true, 'main'),
    ('Uppada',         'uppada',             weave_id, 7, true, 'main'),
    ('Pochampally',    'pochampally',        weave_id, 8, true, 'main'),
    ('Chanderi',       'chanderi',           weave_id, 9, true, 'main'),
    ('Kota',           'kota',               weave_id, 10, true, 'main');

  INSERT INTO menu_items (label, slug, sort_order, is_active, menu_group)
    VALUES ('Fabric', 'fabric', 3, true, 'main') RETURNING id INTO fabric_id;
  INSERT INTO menu_items (label, slug, parent_id, sort_order, is_active, menu_group) VALUES
    ('All Fabric',         'fabric',                fabric_id, 1, true, 'main'),
    ('Silk',               'silk',                  fabric_id, 2, true, 'main'),
    ('Handspun Cotton',    'handspun-cotton',       fabric_id, 3, true, 'main'),
    ('Organza',            'organza',               fabric_id, 4, true, 'main'),
    ('Soft Silk',          'soft-silk',             fabric_id, 5, true, 'main'),
    ('Georgette & Chiffon','georgette-chiffon',     fabric_id, 6, true, 'main'),
    ('Tussar',             'tussar',                fabric_id, 7, true, 'main'),
    ('Linen',              'linen',                 fabric_id, 8, true, 'main');

  INSERT INTO menu_items (label, slug, sort_order, is_active, menu_group)
    VALUES ('Craft', 'craft', 4, true, 'main') RETURNING id INTO craft_id;
  INSERT INTO menu_items (label, slug, parent_id, sort_order, is_active, menu_group) VALUES
    ('Kalamkari',          'kalamkari',          craft_id, 1, true, 'main'),
    ('Bandhani',           'bandhani',           craft_id, 2, true, 'main'),
    ('Chikankari',         'chikankari',         craft_id, 3, true, 'main'),
    ('Printed Sarees',     'printed-sarees',     craft_id, 4, true, 'main'),
    ('Embroidered Sarees', 'embroidered-sarees', craft_id, 5, true, 'main');

  INSERT INTO menu_items (label, slug, sort_order, is_active, menu_group)
    VALUES ('Occasion', 'occasion', 5, true, 'main') RETURNING id INTO occasion_id;
  INSERT INTO menu_items (label, slug, parent_id, sort_order, is_active, menu_group) VALUES
    ('Wedding',  'wedding',  occasion_id, 1, true, 'main'),
    ('Bridal',   'bridal',   occasion_id, 2, true, 'main'),
    ('Festive',  'festive',  occasion_id, 3, true, 'main'),
    ('Formal',   'formal',   occasion_id, 4, true, 'main'),
    ('Casual',   'casual',   occasion_id, 5, true, 'main'),
    ('Party',    'party',    occasion_id, 6, true, 'main');

  INSERT INTO menu_items (label, slug, sort_order, is_active, menu_group)
    VALUES ('Accessories', 'accessories', 6, true, 'main') RETURNING id INTO access_id;
  INSERT INTO menu_items (label, slug, parent_id, sort_order, is_active, menu_group) VALUES
    ('Dupattas',                'dupatta',             access_id, 1, true, 'main'),
    ('Blouses',                 'blouse',              access_id, 2, true, 'main'),
    ('Suits',                   'salwar-suit-set',     access_id, 3, true, 'main'),
    ('Lehenga',                 'lehenga',             access_id, 4, true, 'main'),
    ('Bags, Belts & Clutches',  'bags-belts-clutches', access_id, 5, true, 'main'),
    ('Dhoti',                   'dhoti',               access_id, 6, true, 'main');
END $$;