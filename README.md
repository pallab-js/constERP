# ConstERP

A lightweight construction ERP for small teams — tracking clients, projects,
materials, workers, equipment, estimates, purchase orders, invoices, expenses,
and attendance.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS 4**, and a
**better-sqlite3** database with migration-based schema management.

---

## Features

- **Dashboard** — project status charts, revenue, and recent projects.
- **Projects** — pipeline with status, budget, contract value, and progress.
- **Clients & Vendors** — contact details, GSTIN, and categorization.
- **Estimates & Purchase Orders** — line items with quantities, rates, and totals.
- **Materials & Stock Movements** — reorder levels and inventory tracking.
- **Invoices & Receipts** — GST breakdowns (CGST/SGST/IGST) and payment status.
- **Expenses** — categorized site costs with mode of payment.
- **Workers & Attendance** — daily/monthly wages, attendance logs, and wage payments.
- **Equipment & Deployments** — owned/hired assets, daily rates, maintenance, and fuel logs.

## Tech Stack

| Layer        | Technology                                              |
| ------------ | ------------------------------------------------------- |
| Framework    | Next.js 16 (App Router)                                 |
| Language     | TypeScript 5                                            |
| Styling      | Tailwind CSS 4                                          |
| Database     | better-sqlite3 (file-based SQLite)                      |
| Validation   | Zod                                                     |
| Charts       | Recharts                                                |
| Icons        | Lucide React                                            |
| Testing      | Playwright                                              |

## Getting Started

```bash
# install dependencies
npm install

# seed the database with sample data
npm run seed

# start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

> `npm run seed` drops and recreates `data/erp.db` from
> `db/migrations/001_init.sql`. Run it before first use.

## Project Structure

```
src/
  app/
    layout.tsx              # root layout
    (app)/
      layout.tsx            # app shell (sidebar + main)
      page.tsx              # dashboard
      clients/page.tsx
      vendors/page.tsx
      projects/page.tsx
      estimates/page.tsx
      materials/page.tsx
      purchase-orders/page.tsx
      invoices/page.tsx
      expenses/page.tsx
      workers/page.tsx
      attendance/page.tsx
      equipment/page.tsx
  components/
    Sidebar.tsx
    DashboardCharts.tsx
  lib/
    db.ts                   # database connection + migrations
    format.ts               # currency, date, and status helpers
    types.ts                # shared types (e.g. DbRow)
db/
  migrations/
    001_init.sql            # full schema
scripts/
  seed.mjs                 # sample data loader
```

## Scripts

| Command     | Description                              |
| ----------- | ---------------------------------------- |
| `npm run dev`    | Start the development server        |
| `npm run build`  | Build for production                 |
| `npm run start`  | Start the production server          |
| `npm run lint`   | Run ESLint                            |
| `npm run seed`   | Seed the database with sample data    |

## Database

The database is a single SQLite file at `data/erp.db` (override with the
`DATABASE_PATH` environment variable). Schema is applied automatically on first
connection by scanning `db/migrations/*.sql` in sorted order and tracking
applied migrations in a `_migrations` table.

## Environment

Copy `.env.example` to `.env` and adjust as needed:

```
DATABASE_PATH=./data/erp.db
```

## License

MIT — see [LICENSE](./LICENSE).