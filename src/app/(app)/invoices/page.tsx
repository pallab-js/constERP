import { getDb } from "@/lib/db";
import type { DbRow } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { SimpleBar } from "@/components/DashboardCharts";
export default function InvoicesPage() {
  const db = getDb();
  const projects = db.prepare("SELECT id,code FROM projects").all() as DbRow[];
  const clients = db.prepare("SELECT id,name FROM clients").all() as DbRow[];
  const rows = db.prepare("SELECT i.*, p.code as pcode, c.name as cname FROM invoices i LEFT JOIN projects p ON p.id=i.project_id LEFT JOIN clients c ON c.id=i.client_id ORDER BY i.id DESC").all() as DbRow[];
  const stRows = db.prepare("SELECT status, COUNT(*) as c FROM invoices GROUP BY status").all() as DbRow[];
  const stData = stRows.map((r: DbRow)=>({ name: String(r.status ?? ""), value: Number(r.c ?? 0) }));
  async function add(formData: FormData) {
    "use server"; const db = getDb();
    db.prepare("INSERT INTO invoices (number,project_id,client_id,date,due_date,status,subtotal,total) VALUES (?,?,?,?,?,?,?,?)").run(formData.get("number"),formData.get("project_id")||null,formData.get("client_id")||null,formData.get("date"),formData.get("due_date"),formData.get("status")||"unpaid",formData.get("subtotal")||0,formData.get("total")||0);
    revalidatePath("/invoices");
  }
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-blurple">Invoices</h1>
      <form action={add} className="bg-surface-indigo rounded-xl p-4 border border-hairline grid grid-cols-3 gap-3">
        <input name="number" placeholder="Number" required className="bg-canvas rounded px-3 py-2" />
        <select name="project_id" className="bg-canvas rounded px-3 py-2"><option value="">Project</option>{projects.map((p: DbRow)=><option key={p.id ?? 0} value={p.id ?? ""}>{p.code}</option>)}</select>
        <select name="client_id" className="bg-canvas rounded px-3 py-2"><option value="">Client</option>{clients.map((c: DbRow)=><option key={c.id ?? 0} value={c.id ?? ""}>{c.name}</option>)}</select>
        <input name="date" type="date" required className="bg-canvas rounded px-3 py-2" />
        <input name="due_date" type="date" className="bg-canvas rounded px-3 py-2" />
        <select name="status" className="bg-canvas rounded px-3 py-2"><option>unpaid</option><option>paid</option><option>overdue</option></select>
        <input name="subtotal" type="number" placeholder="Subtotal" className="bg-canvas rounded px-3 py-2" />
        <input name="total" type="number" placeholder="Total" className="bg-canvas rounded px-3 py-2" />
        <button className="bg-blurple text-ink rounded px-4 py-2 col-span-3">Add Invoice</button>
      </form>
      <div className="bg-surface-indigo rounded-xl p-4 border border-hairline">
        <h2 className="font-semibold mb-2">Invoices by Status</h2>
        <SimpleBar data={stData} />
      </div>
      <div className="bg-surface-indigo rounded-xl p-4 border border-hairline overflow-auto">
        <table className="w-full text-sm"><thead className="text-ink-400"><tr><th className="text-left py-1">Number</th><th>Project</th><th>Client</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>{rows.map((r: DbRow)=>(<tr key={r.id ?? 0} className="border-t border-hairline"><td className="py-1 font-mono">{r.number}</td><td>{r.pcode}</td><td>{r.cname}</td><td>{r.date}</td><td>{r.total}</td><td>{r.status}</td></tr>))}</tbody></table>
      </div>
    </div>
  );
}
