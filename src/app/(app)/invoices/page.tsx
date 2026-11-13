import { getDb } from "@/lib/db";
import type { DbRow } from "@/lib/types";
import { formatINR } from "@/lib/format";
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
      <form action={add} className="grid grid-cols-1 gap-3 rounded-xl border border-hairline bg-surface-indigo p-4 sm:grid-cols-2 xl:grid-cols-3">
        <input name="number" placeholder="Number" required className="rounded bg-canvas px-3 py-2" />
        <select name="project_id" className="rounded bg-canvas px-3 py-2"><option value="">Project</option>{projects.map((p: DbRow)=><option key={p.id ?? 0} value={p.id ?? ""}>{p.code}</option>)}</select>
        <select name="client_id" className="rounded bg-canvas px-3 py-2"><option value="">Client</option>{clients.map((c: DbRow)=><option key={c.id ?? 0} value={c.id ?? ""}>{c.name}</option>)}</select>
        <input name="date" type="date" required className="rounded bg-canvas px-3 py-2" />
        <input name="due_date" type="date" className="rounded bg-canvas px-3 py-2" />
        <select name="status" className="rounded bg-canvas px-3 py-2"><option>unpaid</option><option>paid</option><option>overdue</option><option>cancelled</option></select>
        <input name="subtotal" type="number" placeholder="Subtotal" className="rounded bg-canvas px-3 py-2" />
        <input name="total" type="number" placeholder="Total" className="rounded bg-canvas px-3 py-2" />
        <button className="rounded bg-blurple px-4 py-2 font-medium text-ink sm:col-span-2 xl:col-span-3">Add Invoice</button>
      </form>
      <div className="rounded-xl border border-hairline bg-surface-indigo p-4">
        <h2 className="mb-2 font-semibold">Invoices by Status</h2>
        <SimpleBar data={stData} />
      </div>
      <div className="overflow-x-auto rounded-xl border border-hairline bg-surface-indigo p-4">
        <table className="w-full min-w-[760px] text-sm"><thead className="text-ink-400"><tr><th className="py-2 text-left font-medium">Number</th><th className="py-2 text-left font-medium">Project</th><th className="py-2 text-left font-medium">Client</th><th className="py-2 text-left font-medium">Date</th><th className="py-2 text-right font-medium">Total</th><th className="py-2 text-left font-medium">Status</th></tr></thead>
        <tbody>{rows.map((r: DbRow)=>(<tr key={r.id ?? 0} className="border-t border-hairline"><td className="py-2 pr-3 font-mono">{r.number}</td><td className="py-2 pr-3">{r.pcode}</td><td className="py-2 pr-3">{r.cname}</td><td className="py-2 pr-3 whitespace-nowrap">{r.date}</td><td className="py-2 text-right whitespace-nowrap">{formatINR(Number(r.total ?? 0))}</td><td className="py-2 capitalize">{r.status}</td></tr>))}</tbody></table>
      </div>
    </div>
  );
}
