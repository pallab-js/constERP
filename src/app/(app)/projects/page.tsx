import { getDb } from "@/lib/db";
import type { DbRow } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { revalidatePath } from "next/cache";
import { SimpleBar } from "@/components/DashboardCharts";

export default function ProjectsPage() {
  const db = getDb();
  const clients = db.prepare("SELECT id,name FROM clients").all() as DbRow[];
  const rows = db.prepare("SELECT p.*, c.name as client_name FROM projects p LEFT JOIN clients c ON c.id=p.client_id ORDER BY p.id DESC").all() as DbRow[];
  const stRows = db.prepare("SELECT status, COUNT(*) as c FROM projects GROUP BY status").all() as DbRow[];
  const stData = stRows.map((r: DbRow) => ({ name: String(r.status ?? ""), value: Number(r.c ?? 0) }));

  async function add(formData: FormData) {
    "use server";
    const db = getDb();
    db.prepare("INSERT INTO projects (code,name,client_id,type,status,start_date,end_date,contract_value,budget,site,manager) VALUES (?,?,?,?,?,?,?,?,?,?,?)").run(
      formData.get("code"),
      formData.get("name"),
      formData.get("client_id") || null,
      formData.get("type"),
      formData.get("status") || "active",
      formData.get("start_date"),
      formData.get("end_date"),
      formData.get("contract_value") || 0,
      formData.get("budget") || 0,
      formData.get("site"),
      formData.get("manager")
    );
    revalidatePath("/projects");
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-blurple">Projects</h1>
      <form action={add} className="grid grid-cols-1 gap-3 rounded-xl border border-hairline bg-surface-indigo p-4 sm:grid-cols-2 xl:grid-cols-3">
        <input name="code" placeholder="Code" required className="rounded bg-canvas px-3 py-2" />
        <input name="name" placeholder="Name" required className="rounded bg-canvas px-3 py-2" />
        <select name="client_id" className="rounded bg-canvas px-3 py-2"><option value="">Client</option>{clients.map((c: DbRow) => <option key={c.id ?? 0} value={c.id ?? ""}>{c.name}</option>)}</select>
        <select name="type" className="rounded bg-canvas px-3 py-2"><option value="">Type</option><option>road</option><option>building</option><option>drainage</option><option>bridge</option><option>industrial</option></select>
        <select name="status" className="rounded bg-canvas px-3 py-2"><option value="active">active</option><option value="on_hold">on_hold</option><option value="completed">completed</option><option value="cancelled">cancelled</option></select>
        <input name="start_date" type="date" className="rounded bg-canvas px-3 py-2" />
        <input name="end_date" type="date" className="rounded bg-canvas px-3 py-2" />
        <input name="contract_value" type="number" placeholder="Contract value" className="rounded bg-canvas px-3 py-2" />
        <input name="budget" type="number" placeholder="Budget" className="rounded bg-canvas px-3 py-2" />
        <input name="site" placeholder="Site" className="rounded bg-canvas px-3 py-2" />
        <input name="manager" placeholder="Manager" className="rounded bg-canvas px-3 py-2" />
        <button className="rounded bg-blurple px-4 py-2 font-medium text-ink sm:col-span-2 xl:col-span-3">Add Project</button>
      </form>
      <div className="rounded-xl border border-hairline bg-surface-indigo p-4">
        <h2 className="mb-2 font-semibold">Projects by Status</h2>
        <SimpleBar data={stData} />
      </div>
      <div className="overflow-x-auto rounded-xl border border-hairline bg-surface-indigo p-4">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="text-ink-400"><tr><th className="py-2 text-left font-medium">Code</th><th className="py-2 text-left font-medium">Name</th><th className="py-2 text-left font-medium">Client</th><th className="py-2 text-left font-medium">Site</th><th className="py-2 text-left font-medium">Status</th><th className="py-2 text-right font-medium">Progress</th><th className="py-2 text-right font-medium">Contract</th></tr></thead>
          <tbody>{rows.map((r: DbRow) => (
            <tr key={r.id ?? 0} className="border-t border-hairline align-top">
              <td className="py-2 pr-3 font-mono">{r.code}</td>
              <td className="py-2 pr-3">{r.name}</td>
              <td className="py-2 pr-3 text-ink-300">{r.client_name}</td>
              <td className="py-2 pr-3 text-ink-300">{r.site}</td>
              <td className="py-2 pr-3 capitalize">{String(r.status ?? "").replace("_", " ")}</td>
              <td className="py-2 text-right">{r.progress_pct}%</td>
              <td className="py-2 text-right whitespace-nowrap">{formatINR(Number(r.contract_value ?? 0))}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
