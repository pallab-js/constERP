import { getDb } from "@/lib/db";
import type { DbRow } from "@/lib/types";
import { revalidatePath } from "next/cache";
export default function EstimatesPage() {
  const db = getDb();
  const projects = db.prepare("SELECT id,code FROM projects").all() as DbRow[];
  const clients = db.prepare("SELECT id,name FROM clients").all() as DbRow[];
  const rows = db.prepare("SELECT e.*, p.code as pcode, c.name as cname FROM estimates e LEFT JOIN projects p ON p.id=e.project_id LEFT JOIN clients c ON c.id=e.client_id ORDER BY e.id DESC").all() as DbRow[];
  async function add(formData: FormData) {
    "use server"; const db = getDb();
    db.prepare("INSERT INTO estimates (number,project_id,client_id,date,status,total,notes) VALUES (?,?,?,?,?,?,?)").run(formData.get("number"),formData.get("project_id")||null,formData.get("client_id")||null,formData.get("date"),formData.get("status")||"draft",formData.get("total")||0,formData.get("notes"));
    revalidatePath("/estimates");
  }
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-blurple">Estimates</h1>
      <form action={add} className="bg-surface-indigo rounded-xl p-4 border border-hairline grid grid-cols-3 gap-3">
        <input name="number" placeholder="Number" required className="bg-canvas rounded px-3 py-2" />
        <select name="project_id" className="bg-canvas rounded px-3 py-2"><option value="">Project</option>{projects.map((p: DbRow)=><option key={p.id ?? 0} value={p.id ?? ""}>{p.code}</option>)}</select>
        <select name="client_id" className="bg-canvas rounded px-3 py-2"><option value="">Client</option>{clients.map((c: DbRow)=><option key={c.id ?? 0} value={c.id ?? ""}>{c.name}</option>)}</select>
        <input name="date" type="date" required className="bg-canvas rounded px-3 py-2" />
        <select name="status" className="bg-canvas rounded px-3 py-2"><option>draft</option><option>sent</option><option>approved</option><option>rejected</option></select>
        <input name="total" type="number" placeholder="Total" className="bg-canvas rounded px-3 py-2" />
        <input name="notes" placeholder="Notes" className="bg-canvas rounded px-3 py-2 col-span-3" />
        <button className="bg-blurple text-ink rounded px-4 py-2 col-span-3">Add Estimate</button>
      </form>
      <div className="bg-surface-indigo rounded-xl p-4 border border-hairline overflow-auto">
        <table className="w-full text-sm"><thead className="text-ink-400"><tr><th className="text-left py-1">Number</th><th>Project</th><th>Client</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>{rows.map((r: DbRow)=>(<tr key={r.id ?? 0} className="border-t border-hairline"><td className="py-1 font-mono">{r.number}</td><td>{r.pcode}</td><td>{r.cname}</td><td>{r.date}</td><td>{r.total}</td><td>{r.status}</td></tr>))}</tbody></table>
      </div>
    </div>
  );
}
