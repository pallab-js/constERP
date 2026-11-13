import Database from 'better-sqlite3';
import { readFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const DB_PATH = process.env.DATABASE_PATH || 'data/erp.db';
mkdirSync(dirname(DB_PATH), { recursive: true });
if (existsSync(DB_PATH)) unlinkSync(DB_PATH);
const db = new Database(DB_PATH);
db.exec(readFileSync('db/migrations/001_init.sql', 'utf8'));

db.exec(`
INSERT INTO clients (name,contact,phone,email,address,gstin) VALUES
('Nagaland PWD (R&B), Kohima','Er. K. Ao','9436001122','pwd.kohima@nagaland.gov.in','New Secretariat Road, Kohima, Nagaland 797001','13AAAPN1234A1Z1'),
('NHIDCL Dimapur Division','Project Director, NE Works','03862-245100','dimapur@nhidcl.com','Circular Road, Dimapur, Nagaland 797112','13AAACN5678B1Z2'),
('Kohima Smart City Development Ltd.','Chief Executive Officer','0370-2290123','info@smartkohima.in','PR Hill, Kohima, Nagaland 797001','13AABCK9012C1Z3'),
('Nagaland Police Housing & Welfare Corporation','Executive Engineer','0370-2240456','nphc@nagaland.gov.in','Police Complex, Chumoukedima, Nagaland 797103','13AABCN3344D1Z4'),
('Mokokchung Municipal Council','Municipal Engineer','0369-2223344','mmc@nagaland.gov.in','Town Hall Road, Mokokchung, Nagaland 798601','13AABCM7788E1Z5');

INSERT INTO vendors (name,category,phone,email,address,gstin) VALUES
('Dimapur Cement & Hardware Supply','material','9436012345','sales@dimapurcement.in','NH-29, Burma Camp, Dimapur, Nagaland 797112','13AABCD1111A1Z1'),
('Nagaland Steel & TMT Traders','material','9862012345','orders@nagasteel.in','Duncan Bosti, Dimapur, Nagaland 797113','13AABCN2222B1Z2'),
('Zunheboto Stone Quarry Co.','material','9615012345','quarry@zstone.in','Lumami Road, Zunheboto, Nagaland 798620','13AABCZ3333C1Z3'),
('Hornbill Earthmovers & Rentals','equipment','9436078901','rentals@hornbilleq.in','Chumoukedima, Nagaland 797103','13AABCH4444D1Z4'),
('Ao & Sons Skilled Labour Contractors','labour','9402612345','contact@aosons.in','Mokokchung Town, Nagaland 798601','13AABCA5555E1Z5'),
('Eastern Bitumen Suppliers','material','9435134567','sales@ebitumen.in','Golaghat Road, Dimapur, Nagaland 797112','13AABCE6666F1Z6');

INSERT INTO projects (code,name,client_id,type,status,start_date,end_date,contract_value,budget,site,manager,progress_pct) VALUES
('NL-PWD-001','Kohima-Jessami Road Improvement (Pkg-I)','1','road','active','2025-02-10','2026-11-30',68500000,64200000,'Kohima to Jessami, Kohima District','Imkong Ao',42),
('NL-NH-002','Dimapur Bypass Drainage & Culvert Works','2','drainage','active','2025-04-01','2026-08-31',24800000,23100000,'NH-29 Bypass, Chumoukedima','T. Longkumer',58),
('NL-SC-003','Kohima Smart Market Complex','3','building','active','2024-11-15','2026-05-30',91200000,86500000,'PR Hill, Kohima','Vizol Koso',67),
('NL-PHC-004','Police Barracks Renovation, Chumoukedima','4','building','on_hold','2025-01-20','2026-03-31',18600000,17800000,'Police Complex, Chumoukedima','S. Yaden',31),
('NL-MMC-005','Mokokchung Town Footpath & Street Lighting','5','road','completed','2024-06-01','2025-03-15',12400000,11850000,'Mokokchung Town, Mokokchung District','L. Imchen',100);

INSERT INTO materials (name,unit,category,reorder_level,rate) VALUES
('OPC 43 Grade Cement','bag','cement',400,455),
('TMT Steel 12mm','MT','steel',15,69500),
('TMT Steel 16mm','MT','steel',10,70200),
('Crushed Stone Aggregate 20mm','cum','aggregate',120,1650),
('River Sand (screened)','cum','aggregate',80,2100),
('Bitumen VG-30','MT','bitumen',8,58500),
('Paver Blocks (80mm)','sqm','paving',300,720),
('PVC Drainage Pipe 200mm','nos','plumbing',60,1450);

INSERT INTO workers (name,role,phone,wage_type,wage_rate,join_date) VALUES
('Imti Aier','Site Supervisor','9436002211','monthly',28000,'2024-04-10'),
('Keneiselie Rio','Mason','9862033344','daily',750,'2024-06-15'),
('Mhathung Lotha','Helper','9615022233','daily',480,'2024-07-01'),
('Alem Longchar','Excavator Operator','9402644455','daily',1100,'2024-03-20'),
('Sentilong Ozukum','Bar Bender','8794211122','daily',820,'2024-08-05'),
('Neikolie Zhimomi','Electrician','9856112233','daily',900,'2024-09-12');

INSERT INTO equipment (name,type,reg_no,ownership,daily_rate,status) VALUES
('Tata Hitachi EX 210 Excavator','Excavator','NL-01-G-2145','owned',13500,'active'),
('Ashok Leyland Transit Mixer 6cum','Transit Mixer','NL-07-D-1182','hired',5200,'active'),
('JCB 3DX Backhoe Loader','Backhoe Loader','NL-01-H-3340','owned',9800,'active'),
('Kirloskar DG Set 62.5 kVA','Generator','NL-GEN-062','owned',3200,'maintenance'),
('Vibratory Road Roller 10T','Road Roller','NL-05-E-0901','hired',7600,'idle');

INSERT INTO estimates (number,project_id,client_id,date,status,total,notes) VALUES
('EST-NL-001',1,1,'2025-01-25','approved',68500000,'Road widening, drainage, and blacktopping estimate for Kohima-Jessami stretch'),
('EST-NL-002',2,2,'2025-03-12','approved',24800000,'Side drains, RCC culverts, and road restoration near Dimapur bypass'),
('EST-NL-003',3,3,'2024-10-20','approved',91200000,'G+2 market complex with parking and utility block at Kohima'),
('EST-NL-004',4,4,'2024-12-28','sent',18600000,'Structural repair and barracks refurbishment at Chumoukedima');

INSERT INTO purchase_orders (po_number,vendor_id,project_id,date,expected_date,status,total,notes) VALUES
('PO-NL-001',1,1,'2025-02-18','2025-02-25','received',1820000,'Cement and basic hardware for initial road works'),
('PO-NL-002',2,1,'2025-03-05','2025-03-12','received',3475000,'TMT steel for culvert and retaining structures'),
('PO-NL-003',6,2,'2025-04-20','2025-04-28','open',2340000,'VG-30 bitumen for drainage-adjoining road restoration'),
('PO-NL-004',4,3,'2025-05-10','2025-05-15','closed',156000,'Transit mixer hire for market complex slab casting');

INSERT INTO invoices (number,project_id,client_id,date,due_date,status,subtotal,total) VALUES
('INV-NL-001',1,1,'2025-04-10','2025-05-10','paid',12500000,13500000),
('INV-NL-002',2,2,'2025-06-15','2025-07-15','paid',6200000,6696000),
('INV-NL-003',3,3,'2025-08-01','2025-08-31','unpaid',18400000,19872000),
('INV-NL-004',5,5,'2025-03-20','2025-04-20','paid',12400000,13392000);

INSERT INTO receipts (invoice_id,date,amount,mode,ref) VALUES
(1,'2025-05-05',13500000,'bank','NEFT-SBI-KOH-88421'),
(2,'2025-07-10',6696000,'bank','RTGS-AXIS-DMP-55210'),
(4,'2025-04-18',13392000,'bank','NEFT-SBI-MKG-11045');

INSERT INTO expenses (category,project_id,date,amount,mode,notes) VALUES
('Fuel',1,'2025-04-12',68500,'cash','Diesel for excavator and roller at Kohima-Jessami site'),
('Labour',1,'2025-04-30',286000,'bank','Weekly wages for road section gang, Phek approach'),
('Material',2,'2025-05-08',145000,'bank','Local procurement of shuttering and drainage fittings, Dimapur'),
('Equipment Hire',3,'2025-06-02',52000,'bank','Transit mixer hire for podium slab pour, Kohima'),
('Maintenance',3,'2025-07-18',18500,'cash','DG set servicing and filter replacement at smart market site'),
('Transport',4,'2025-03-14',42000,'bank','Material transport from Dimapur to Chumoukedima barracks');

INSERT INTO attendance (worker_id,date,status,project_id,hours) VALUES
(1,'2026-11-10','present',1,9),
(2,'2026-11-10','present',1,8),
(3,'2026-11-10','present',1,8),
(4,'2026-11-10','half',2,4),
(5,'2026-11-10','present',3,8),
(6,'2026-11-10','absent',3,0),
(1,'2026-11-11','present',1,9),
(2,'2026-11-11','present',1,8),
(3,'2026-11-11','absent',1,0),
(4,'2026-11-11','present',2,8);

INSERT INTO wage_payments (worker_id,period,amount,date,mode) VALUES
(1,'2026-10',28000,'2026-10-31','bank'),
(2,'2026-10',19500,'2026-10-31','bank'),
(3,'2026-10',12480,'2026-10-31','cash'),
(4,'2026-10',28600,'2026-10-31','bank'),
(5,'2026-10',21320,'2026-10-31','cash');

INSERT INTO deployments (equipment_id,project_id,from_date,to_date,rate,notes) VALUES
(1,1,'2025-02-15','2026-11-30',13500,'Hill cutting and formation work on Kohima-Jessami road'),
(2,3,'2025-05-01','2025-09-30',5200,'Concrete pours for smart market complex slabs'),
(3,2,'2025-04-10','2026-08-31',9800,'Excavation and backfilling for drains and culverts'),
(5,1,'2025-06-01','2025-12-31',7600,'Compaction on completed sub-base sections');

INSERT INTO maintenance_logs (equipment_id,date,type,cost,notes) VALUES
(1,'2025-06-18','Scheduled Service',24500,'Hydraulic oil change and track inspection at Kohima site'),
(3,'2025-07-22','Repair',11200,'Bucket pin replacement and greasing'),
(4,'2025-10-05','Breakdown Repair',18500,'Alternator belt and coolant hose replacement');

INSERT INTO fuel_logs (equipment_id,date,litres,cost,notes) VALUES
(1,'2025-04-12',220,20570,'Diesel filled at Kohima depot'),
(1,'2025-05-03',180,16830,'Diesel for formation cutting shift'),
(3,'2025-04-28',95,8882,'Diesel for culvert excavation, Dimapur bypass');

INSERT INTO stock_movements (material_id,type,qty,project_id,date,ref) VALUES
(1,'in',1200,NULL,'2025-02-20','PO-NL-001'),
(1,'out',350,1,'2025-03-02','Kohima-Jessami culvert concrete'),
(2,'in',18,NULL,'2025-03-10','PO-NL-002'),
(2,'out',6,1,'2025-03-25','Retaining wall reinforcement'),
(4,'in',200,NULL,'2025-04-05','Local quarry supply'),
(4,'out',75,2,'2025-04-18','Drain bedding, Dimapur bypass');

INSERT INTO progress_reports (project_id,date,work_done,pct,notes) VALUES
(1,'2025-09-30','Formation cutting and two RCC culverts completed on Phek approach',42,'Monsoon slowed work for two weeks; schedule recovered'),
(2,'2025-10-15','Main drain lining and three culvert slabs completed near Chumoukedima',58,'Traffic diversion managed with NHIDCL coordination'),
(3,'2025-10-20','Superstructure and first-floor slab completed at PR Hill site',67,'Finishing and MEP rough-in in progress'),
(4,'2025-08-01','Roof treatment and partial masonry repair completed before hold',31,'On hold pending revised client release'),
(5,'2025-03-15','Footpath, paver blocks, and street-light poles handed over to council',100,'Completed and accepted by Mokokchung Municipal Council');
`);

console.log('seeded: Nagaland-focused sample data');
db.close();
