# Graph Report - const  (2026-11-06)

## Corpus Check
- 26 files · ~48,075 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .db 2, (none) 1, .db-shm 1)

## Summary
- 145 nodes · 252 edges · 10 communities (9 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- package.json
- compilerOptions
- app/layout.tsx
- dependencies
- getDb
- db.ts
- scripts
- (app)/layout.tsx
- (app)/page.tsx

## God Nodes (most connected - your core abstractions)
1. `getDb()` - 38 edges
2. `next` - 16 edges
3. `compilerOptions` - 16 edges
4. `DbRow` - 14 edges
5. `SimpleBar()` - 7 edges
6. `scripts` - 5 edges
7. `Dashboard()` - 5 edges
8. `better-sqlite3` - 4 edges
9. `ExpensesPage()` - 4 edges
10. `InvoicesPage()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `add()` --calls--> `getDb()`  [EXTRACTED]
  src/app/(app)/attendance/page.tsx → src/lib/db.ts
- `add()` --calls--> `getDb()`  [EXTRACTED]
  src/app/(app)/clients/page.tsx → src/lib/db.ts
- `add()` --calls--> `getDb()`  [EXTRACTED]
  src/app/(app)/equipment/page.tsx → src/lib/db.ts
- `add()` --calls--> `getDb()`  [EXTRACTED]
  src/app/(app)/estimates/page.tsx → src/lib/db.ts
- `ExpensesPage()` --calls--> `SimpleBar()`  [EXTRACTED]
  src/app/(app)/expenses/page.tsx → src/components/DashboardCharts.tsx

## Import Cycles
- None detected.

## Communities (10 total, 1 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.10
Nodes (27): eslintConfig, allowScripts, better-sqlite3@13.0.3, devDependencies, eslint@^9, eslint-config-next@16.4.5, @playwright/test@^1.65.0, tailwindcss@^4 (+19 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "app/layout.tsx"
Cohesion: 0.33
Nodes (3): geistMono, geistSans, metadata

### Community 3 - "dependencies"
Cohesion: 0.13
Nodes (13): dependencies, better-sqlite3@^13.0.3, lucide-react@^1.69.0, next@16.4.5, react-dom@19.3.0, recharts@^3.10.1, zod@^4.6.7, better-sqlite3 (+5 more)

### Community 5 - "getDb"
Cohesion: 0.12
Nodes (24): AttendancePage(), add(), ClientsPage(), add(), EquipmentPage(), add(), EstimatesPage(), add() (+16 more)

### Community 6 - "db.ts"
Cohesion: 0.28
Nodes (4): nextConfig, next, SimpleBar(), DbRow

### Community 7 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 8 - "(app)/layout.tsx"
Cohesion: 0.38
Nodes (5): react@19.3.0, react, AppLayout(), links, Sidebar()

### Community 11 - "(app)/page.tsx"
Cohesion: 0.52
Nodes (5): Dashboard(), RecentProjects(), COLORS, ProjectStatusChart(), RevenueChart()

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `db.ts` to `package.json`, `(app)/layout.tsx`, `app/layout.tsx`, `dependencies`?**
  _High betweenness centrality (0.283) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0960591133004926 - nodes in this community are weakly interconnected._
- **Why does `getDb()` connect `getDb` to `(app)/page.tsx`, `db.ts`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `getDb` be split into smaller, more focused modules?**
  _Cohesion score 0.12318840579710146 - nodes in this community are weakly interconnected._