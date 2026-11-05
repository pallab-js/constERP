import Database from 'better-sqlite3';
import { readFileSync, unlinkSync, existsSync } from 'fs';
if (existsSync('data/erp.db')) unlinkSync('data/erp.db');
const db = new Database('data/erp.db');
db.exec(readFileSync('db/migrations/001_init.sql','utf8'));
db.exec(`
INSERT INTO clients (name,contact,phone,email,address,gstin) VALUES
('Assam PWD','Er. R. Das','9864012345','pwd@assam.gov.in','Guwahati, Assam','18AAAPA1234A1Z5'),
('NHIDCL','Project Dir','9435012345','info@nhidcl.com','Shillong, Meghalaya','17AAACN1234A1Z2'),
('Mizoram PWD','Chief Engg','9436012345','pwd@mizoram.gov.in','Aizawl, Mizoram','15AAAPM1234A1Z8');
INSERT INTO vendors (name,category,phone,email,address,gstin) VALUES
('Brahmaputra Cement','material','9864111111','sales@bcement.in','Guwahati','18AABCB1234A1Z1'),
('NE Steel Traders','material','9435222222','ne@steel.in','Dimapur','13AABCN2222A1Z2'),
('Himalayan Labour Co','labour','9400333333','hl@labour.in','Imphal','14AABCH3333A1Z3');
INSERT INTO projects (code,name,client_id,type,status,start_date,end_date,contract_value,budget,site,manager,progress_pct) VALUES
('PRJ-001','Guwahati Bypass Road','1','road','active','2025-01-10','2026-06-30',45000000,42000000,'Guwahati','R. Sharma',35),
('PRJ-002','Shillong Bypass','2','road','active','2025-03-01','2026-12-31',78000000,75000000,'Shillong','A. Baruah',20),
('PRJ-003','Aizawl Water Supply','3','building','on_hold','2024-09-01','2025-12-31',23000000,22000000,'Aizawl','L. Zama',60);
INSERT INTO materials (name,unit,category,reorder_level,rate) VALUES
('OPC Cement','bag','cement',500,420),
('TMT Steel 12mm','MT','steel',20,68000),
('Coarse Aggregate','cum','aggregate',100,1200);
INSERT INTO workers (name,role,phone,wage_type,wage_rate,join_date) VALUES
('Raju Das','Mason','9864555555','daily',650,'2024-06-01'),
('Bimal Roy','Helper','9864666666','daily',400,'2024-08-15'),
('Anil Sharma','Operator','9864777777','monthly',18000,'2023-11-01');
INSERT INTO equipment (name,type,reg_no,ownership,daily_rate,status) VALUES
('Excavator EX-200','Excavator','AS01EX1234','owned',12000,'active'),
('Transit Mixer TM-1','Mixer','AS01TM5678','hired',4500,'active');
INSERT INTO estimates (number,project_id,client_id,date,status,total,notes) VALUES
('EST-001',1,1,'2024-12-20','approved',46000000,'Road project estimate'),
('EST-002',2,2,'2025-02-15','sent',79000000,'Bypass estimate');
INSERT INTO purchase_orders (po_number,vendor_id,project_id,date,expected_date,status,total,notes) VALUES
('PO-001',1,1,'2025-01-15','2025-01-25','received',2100000,'Cement order'),
('PO-002',2,2,'2025-03-10','2025-03-20','open',3400000,'Steel order');
INSERT INTO invoices (number,project_id,client_id,date,due_date,status,subtotal,total) VALUES
('INV-001',1,1,'2025-04-01','2025-04-30','paid',5000000,5400000),
('INV-002',2,2,'2025-05-15','2025-06-15','unpaid',3000000,3240000);
INSERT INTO receipts (invoice_id,date,amount,mode,ref) VALUES
(1,'2025-04-28',5400000,'bank','NEFT-123');
INSERT INTO expenses (category,project_id,date,amount,mode,notes) VALUES
('Fuel',1,'2025-04-10',45000,'cash','Diesel for excavator'),
('Labour',1,'2025-04-12',120000,'bank','Mason wages'),
('Material',2,'2025-05-02',85000,'bank','Cement purchase');
INSERT INTO attendance (worker_id,date,status,project_id,hours) VALUES
(1,'2025-04-01','present',1,8),
(2,'2025-04-01','present',1,8),
(3,'2025-04-01','absent',2,0);
INSERT INTO wage_payments (worker_id,period,amount,date,mode) VALUES
(1,'2025-04',19500,'2025-04-30','bank'),
(2,'2025-04',12000,'2025-04-30','cash');
INSERT INTO deployments (equipment_id,project_id,from_date,to_date,rate,notes) VALUES
(1,1,'2025-01-15','2025-06-30',12000,'Site excavation'),
(2,2,'2025-03-05','2025-08-31',4500,'Concrete work');
INSERT INTO maintenance_logs (equipment_id,date,type,cost,notes) VALUES
(1,'2025-03-20','Service',15000,'Engine oil change');
INSERT INTO fuel_logs (equipment_id,date,litres,cost,notes) VALUES
(1,'2025-04-10',200,45000,'Diesel');
INSERT INTO stock_movements (material_id,type,qty,project_id,date,ref) VALUES
(1,'in',1000,NULL,'2025-01-05','PO-001'),
(1,'out',300,1,'2025-02-10','Site usage');
INSERT INTO progress_reports (project_id,date,work_done,pct,notes) VALUES
(1,'2025-04-15','Earthwork completed',35,'On schedule'),
(2,'2025-05-01','Survey done',20,'Started');
`);
console.log('seeded all');
