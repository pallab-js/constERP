import { getDb } from "@/lib/db";
import type { DbRow } from "@/lib/types";
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
    { label: "Revenue", value: `₹${Math.round(totalRevenue.s).toLocaleString("en-IN")}` },
    { label: "Expenses", value: `₹${Math.round(totalExpenses.s).toLocaleString("en-IN")}` },
    { label: "Net", value: `₹${Math.round(totalRevenue.s - totalExpenses.s).toLocaleString("en-IN")}` },
  ];

  const financeData = [
    { name: "Revenue", value: Math.round(totalRevenue.s) },
    { name: "Expenses", value: Math.round(totalExpenses.s) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-blurple">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface-indigo rounded-xl p-4 border border-hairline">
            <div className="text-ink-400 text-xs">{s.label}</div>
            <div className="text-2xl font-bold mt-1">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-indigo rounded-xl p-4 border border-hairline">
          <h2 className="font-semibold mb-2">Revenue vs Expenses</h2>
          <RevenueChart data={financeData} />
        </div>
        <div className="bg-surface-indigo rounded-xl p-4 border border-hairline">
          <h2 className="font-semibold mb-2">Project Status</h2>
          <ProjectStatusChart data={statusData} />
        </div>
      </div>
      <div className="bg-surface-indigo rounded-xl p-4 border border-hairline">
        <h2 className="font-semibold mb-2">Recent Projects</h2>
        <RecentProjects />
      </div>
    </div>
  );
}

function RecentProjects() {
  const db = getDb();
  const rows = db.prepare("SELECT id, code, name, status, progress_pct FROM projects ORDER BY id DESC LIMIT 8").all() as DbRow[];
  if (rows.length === 0) return <p className="text-ink-400 text-sm">No projects yet.</p>;
  return (
    <table className="w-full text-sm">
      <thead className="text-ink-400">
        <tr><th className="text-left py-1">Code</th><th className="text-left">Name</th><th className="text-left">Status</th><th className="text-right">Progress</th></tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id ?? 0} className="border-t border-hairline">
            <td className="py-1 font-mono">{r.code}</td>
            <td>{r.name}</td>
            <td>{r.status}</td>
            <td className="text-right">{r.progress_pct}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
