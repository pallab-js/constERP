-- 001_init.sql: core schema for the construction ERP
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  contact TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  gstin TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS vendors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- material | labour | equipment | service
  phone TEXT,
  email TEXT,
  address TEXT,
  gstin TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  client_id INTEGER,
  type TEXT, -- road | building | drainage | bridge | industrial
  status TEXT NOT NULL DEFAULT 'active', -- active | on_hold | completed | cancelled
  start_date TEXT,
  end_date TEXT,
  contract_value REAL NOT NULL DEFAULT 0,
  budget REAL NOT NULL DEFAULT 0,
  progress_pct REAL NOT NULL DEFAULT 0,
  site TEXT,
  manager TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS estimates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  number TEXT NOT NULL UNIQUE,
  project_id INTEGER,
  client_id INTEGER,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft | sent | approved | rejected
  total REAL NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS estimate_lines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  estimate_id INTEGER NOT NULL,
  description TEXT NOT NULL,
  qty REAL NOT NULL DEFAULT 0,
  unit TEXT,
  rate REAL NOT NULL DEFAULT 0,
  amount REAL NOT NULL DEFAULT 0,
  FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS progress_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  work_done TEXT,
  pct REAL,
  notes TEXT,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  category TEXT,
  reorder_level REAL NOT NULL DEFAULT 0,
  rate REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS purchase_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  po_number TEXT NOT NULL UNIQUE,
  vendor_id INTEGER NOT NULL,
  project_id INTEGER,
  date TEXT NOT NULL,
  expected_date TEXT,
  status TEXT NOT NULL DEFAULT 'open', -- open | received | closed | cancelled
  total REAL NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS po_lines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  po_id INTEGER NOT NULL,
  material_id INTEGER,
  description TEXT NOT NULL,
  qty REAL NOT NULL DEFAULT 0,
  unit TEXT,
  rate REAL NOT NULL DEFAULT 0,
  amount REAL NOT NULL DEFAULT 0,
  FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS stock_movements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  material_id INTEGER NOT NULL,
  type TEXT NOT NULL, -- in | out
  qty REAL NOT NULL DEFAULT 0,
  project_id INTEGER,
  po_id INTEGER,
  date TEXT NOT NULL,
  ref TEXT,
  notes TEXT,
  FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  number TEXT NOT NULL UNIQUE,
  project_id INTEGER,
  client_id INTEGER,
  date TEXT NOT NULL,
  due_date TEXT,
  status TEXT NOT NULL DEFAULT 'unpaid', -- unpaid | paid | overdue | cancelled
  subtotal REAL NOT NULL DEFAULT 0,
  cgst REAL NOT NULL DEFAULT 0,
  sgst REAL NOT NULL DEFAULT 0,
  igst REAL NOT NULL DEFAULT 0,
  total REAL NOT NULL DEFAULT 0,
  paid REAL NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS receipts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER,
  date TEXT NOT NULL,
  amount REAL NOT NULL DEFAULT 0,
  mode TEXT,
  ref TEXT,
  notes TEXT,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  project_id INTEGER,
  vendor_id INTEGER,
  po_id INTEGER,
  date TEXT NOT NULL,
  amount REAL NOT NULL DEFAULT 0,
  mode TEXT,
  ref TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS workers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT,
  phone TEXT,
  wage_type TEXT NOT NULL DEFAULT 'daily', -- daily | monthly
  wage_rate REAL NOT NULL DEFAULT 0,
  join_date TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  worker_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'present', -- present | absent | half
  project_id INTEGER,
  hours REAL NOT NULL DEFAULT 0,
  FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS wage_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  worker_id INTEGER NOT NULL,
  period TEXT NOT NULL, -- YYYY-MM
  amount REAL NOT NULL DEFAULT 0,
  date TEXT NOT NULL,
  mode TEXT,
  notes TEXT,
  FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS equipment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT,
  reg_no TEXT,
  ownership TEXT NOT NULL DEFAULT 'owned', -- owned | hired
  daily_rate REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active', -- active | maintenance | idle
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS deployments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipment_id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  from_date TEXT NOT NULL,
  to_date TEXT,
  rate REAL NOT NULL DEFAULT 0,
  notes TEXT,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS maintenance_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipment_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  type TEXT,
  cost REAL NOT NULL DEFAULT 0,
  notes TEXT,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fuel_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipment_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  litres REAL NOT NULL DEFAULT 0,
  cost REAL NOT NULL DEFAULT 0,
  notes TEXT,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_po_vendor ON purchase_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_stock_mat ON stock_movements(material_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);