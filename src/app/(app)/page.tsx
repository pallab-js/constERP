import { getDb } from "@/lib/db";
import type { DbRow } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { RevenueChart, ProjectStatusChart } from "@/components/DashboardCharts";

export default function Dashboard() {
  const db = getDb();
  const projects = db.prepare("SELECT COUNT(*) as c FROM projects").get() as { c: number };
  const clients = db.prepare("SELECT COUNT(*) as c FROM clients").get() as { c: number };
  const invoices = db.prepare("SELECT COUNT(*) as c FROM invoices").get() as { c: number };
  const openPOs = db.prepare("SELECT COUNT(*) as c FROM purchase_orders WHERE status='open'").get() as { c: number };
  const totalRevenue = db.prepare("SELECT COALESCE(SUM(total),0) as s FROM invoices").get() as { s: number };
  const totalExpenses = db.prepare("SELECT COALESCE(SUM(amount),0) as s FROM expenses").get() as { s: number };
  const activeProjects = db.prepare("SELECT COUNT(*) as c FROM projects WHERE status='active'").get() as { c: number };

  const statusRows = db.prepare("SELECT status, COUNT(*) as c FROM projects GROUP BY status").all() as DbRow[];
  const statusData = statusRows.map((r: DbRow) => ({ name: String(r.status ?? ""), value: Number(r.c ?? 0) }));

  const stats = [
    { label: "Active Projects", value: activeProjects.c },
    { label: "Total Projects", value: projects.c },
    { label: "Clients", value: clients.c },
    { label: "Invoices", value: invoices.c },
    { label: "Open POs", value: openPOs.c },
    { label: "Revenue", value: formatINR(Number(totalRevenue.s)) },
    { label: "Expenses", value: formatINR(Number(totalExpenses.s)) },
    { label: "Net", value: formatINR(Number(totalRevenue.s) - Number(totalExpenses.s)) },
  ];

  const financeData = [
    { name: "Revenue", value: Math.round(Number(totalRevenue.s)) },
    { name: "Expenses", value: Math.round(Number(totalExpenses.s)) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-blurple">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-400">Northeast India operations overview, with active sites across Nagaland.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-hairline bg-surface-indigo p-4">
            <div className="text-xs text-ink-400">{s.label}</div>
            <div className="mt-1 text-xl font-bold break-words sm:text-2xl">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-hairline bg-surface-indigo p-4">
          <h2 className="mb-2 font-semibold">Revenue vs Expenses</h2>
          <RevenueChart data={financeData} />
        </div>
        <div className="rounded-xl border border-hairline bg-surface-indigo p-4">
          <h2 className="mb-2 font-semibold">Project Status</h2>
          <ProjectStatusChart data={statusData} />
        </div>
      </div>
      <div className="rounded-xl border border-hairline bg-surface-indigo p-4">
        <h2 className="mb-3 font-semibold">Recent Projects</h2>
        <RecentProjects />
      </div>
    </div>
  );
}

function RecentProjects() {
  const db = getDb();
  const rows = db.prepare("SELECT id, code, name, status, progress_pct, site FROM projects ORDER BY id DESC LIMIT 8").all() as DbRow[];
  if (rows.length === 0) return <p className="text-sm text-ink-400">No projects yet.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="text-ink-400">
          <tr>
            <th className="py-2 text-left font-medium">Code</th>
            <th className="py-2 text-left font-medium">Name</th>
            <th className="py-2 text-left font-medium">Site</th>
            <th className="py-2 text-left font-medium">Status</th>
            <th className="py-2 text-right font-medium">Progress</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id ?? 0} className="border-t border-hairline align-top">
              <td className="py-2 pr-3 font-mono text-xs sm:text-sm">{r.code}</td>
              <td className="py-2 pr-3">{r.name}</td>
              <td className="py-2 pr-3 text-ink-300">{r.site}</td>
              <td className="py-2 pr-3 capitalize">{String(r.status ?? "").replace("_", " ")}</td>
              <td className="py-2 text-right">{r.progress_pct}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
