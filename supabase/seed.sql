-- Seed demo data — run in Supabase SQL Editor after 001 + 002
-- Idempotent with ON CONFLICT where possible

INSERT INTO tables (number, name, capacity, status) VALUES
 (1,'Table 1',4,'available'),(2,'Table 2',2,'occupied'),(3,'Table 3',6,'available'),(4,'Table 4',4,'occupied'),
 (5,'Table 5',2,'available'),(6,'Table 6',4,'occupied'),(7,'Table 7',8,'available'),(8,'Table 8',4,'reserved'),
 (9,'Table 9',2,'available'),(10,'Table 10',4,'available'),(11,'Table 11',6,'available'),(12,'Table 12',4,'available')
ON CONFLICT (number) DO NOTHING;

INSERT INTO menu_items (id, name, description, price, category, is_available) VALUES
 ('m1','Cappuccino','Classic Italian espresso with steamed milk foam',180,'Hot Coffee',true),
 ('m2','Cafe Latte','Smooth espresso with creamy steamed milk',190,'Hot Coffee',true),
 ('m7','Iced Latte','Chilled espresso over cold milk and ice',200,'Cold Coffee',true),
 ('m8','Cold Coffee','Classic blended cold coffee with ice cream',180,'Cold Coffee',true),
 ('m12','Masala Chai','Traditional spiced Indian tea',80,'Chai & Tea',true),
 ('m15','Orange Juice','Freshly squeezed',120,'Fresh Drinks',true),
 ('m18','Veg Sandwich','Grilled sandwich',140,'Snacks',true),
 ('m21','Chocolate Brownie','Rich dark chocolate',180,'Desserts',true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO raw_materials (id, name, unit, current_stock, low_stock_threshold, cost_per_unit) VALUES
 ('rm1','Milk','ml',12400,15000,0.06),('rm2','Coffee Beans','grams',4200,2000,0.5),('rm3','Sugar','grams',18000,5000,0.02),
 ('rm4','Tea Leaves','grams',2500,1000,0.8),('rm5','Paper Cups (Hot)','pieces',180,100,3),('rm6','Plastic Cups (Cold)','pieces',220,100,4),
 ('rm7','Ice','grams',8000,5000,0.03),('rm8','Orange Juice Concentrate','ml',3000,2000,0.15)
ON CONFLICT (id) DO NOTHING;

INSERT INTO recipes (menu_item_id, raw_material_id, quantity) VALUES
 ('m1','rm1',150),('m1','rm2',18),('m1','rm5',1),
 ('m8','rm1',100),('m8','rm2',15),('m8','rm7',200),('m8','rm6',1)
ON CONFLICT DO NOTHING;
