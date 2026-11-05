import { getDb } from "@/lib/db";
import type { DbRow } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { SimpleBar } from "@/components/DashboardCharts";

export default function ProjectsPage() {
  const db = getDb();
  const clients = db.prepare("SELECT id,name FROM clients").all() as DbRow[];
  const rows = db.prepare("SELECT p.*, c.name as client_name FROM projects p LEFT JOIN clients c ON c.id=p.client_id ORDER BY p.id DESC").all() as DbRow[];
  const stRows = db.prepare("SELECT status, COUNT(*) as c FROM projects GROUP BY status").all() as DbRow[];
  const stData = stRows.map((r: DbRow)=>({ name: String(r.status ?? ""), value: Number(r.c ?? 0) }));
  async function add(formData: FormData) {
    "use server";
    const db = getDb();
    db.prepare("INSERT INTO projects (code,name,client_id,type,status,start_date,end_date,contract_value,budget,site,manager) VALUES (?,?,?,?,?,?,?,?,?,?,?)").run(
      formData.get("code"), formData.get("name"), formData.get("client_id")||null, formData.get("type"), formData.get("status")||"active",
      formData.get("start_date"), formData.get("end_date"), formData.get("contract_value")||0, formData.get("budget")||0, formData.get("site"), formData.get("manager")
    );
    revalidatePath("/projects");
  }
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-blurple">Projects</h1>
      <form action={add} className="bg-surface-indigo rounded-xl p-4 border border-hairline grid grid-cols-3 gap-3">
        <input name="code" placeholder="Code" required className="bg-canvas rounded px-3 py-2" />
        <input name="name" placeholder="Name" required className="bg-canvas rounded px-3 py-2" />
        <select name="client_id" className="bg-canvas rounded px-3 py-2"><option value="">Client</option>{clients.map((c: DbRow)=><option key={c.id ?? 0} value={c.id ?? ""}>{c.name}</option>)}</select>
        <select name="type" className="bg-canvas rounded px-3 py-2"><option value="">Type</option><option>road</option><option>building</option><option>drainage</option><option>bridge</option><option>industrial</option></select>
        <select name="status" className="bg-canvas rounded px-3 py-2"><option value="active">active</option><option>on_hold</option><option>completed</option></select>
        <input name="start_date" type="date" className="bg-canvas rounded px-3 py-2" />
        <input name="end_date" type="date" className="bg-canvas rounded px-3 py-2" />
        <input name="contract_value" type="number" placeholder="Contract value" className="bg-canvas rounded px-3 py-2" />
        <input name="budget" type="number" placeholder="Budget" className="bg-canvas rounded px-3 py-2" />
        <input name="site" placeholder="Site" className="bg-canvas rounded px-3 py-2" />
        <input name="manager" placeholder="Manager" className="bg-canvas rounded px-3 py-2" />
        <button className="bg-blurple text-ink rounded px-4 py-2 col-span-3">Add Project</button>
      </form>
      <div className="bg-surface-indigo rounded-xl p-4 border border-hairline">
        <h2 className="font-semibold mb-2">Projects by Status</h2>
        <SimpleBar data={stData} />
      </div>
      <div className="bg-surface-indigo rounded-xl p-4 border border-hairline overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-ink-400"><tr><th className="text-left py-1">Code</th><th>Name</th><th>Client</th><th>Status</th><th>Progress</th><th>Contract</th></tr></thead>
          <tbody>{rows.map((r: DbRow)=>(
            <tr key={r.id ?? 0} className="border-t border-hairline">
              <td className="py-1 font-mono">{r.code}</td><td>{r.name}</td><td>{r.client_name}</td><td>{r.status}</td><td>{r.progress_pct}%</td><td>{r.contract_value}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
