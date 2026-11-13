import { getDb } from "@/lib/db";
import type { DbRow } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { revalidatePath } from "next/cache";
import { SimpleBar } from "@/components/DashboardCharts";
export default function ExpensesPage() {
  const db = getDb();
  const projects = db.prepare("SELECT id,code FROM projects").all() as DbRow[];
  const rows = db.prepare("SELECT e.*, p.code as pcode FROM expenses e LEFT JOIN projects p ON p.id=e.project_id ORDER BY e.id DESC").all() as DbRow[];
  const catRows = db.prepare("SELECT category, SUM(amount) as total FROM expenses GROUP BY category").all() as DbRow[];
  const catData = catRows.map((r: DbRow)=>({ name: String(r.category ?? ""), value: Math.round(Number(r.total ?? 0)) }));
  async function add(formData: FormData) {
    "use server"; const db = getDb();
    db.prepare("INSERT INTO expenses (category,project_id,date,amount,mode,ref,notes) VALUES (?,?,?,?,?,?,?)").run(formData.get("category"),formData.get("project_id")||null,formData.get("date"),formData.get("amount")||0,formData.get("mode"),formData.get("ref"),formData.get("notes"));
    revalidatePath("/expenses");
  }
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-blurple">Expenses</h1>
      <form action={add} className="grid grid-cols-1 gap-3 rounded-xl border border-hairline bg-surface-indigo p-4 sm:grid-cols-2 xl:grid-cols-3">
        <input name="category" placeholder="Category" required className="rounded bg-canvas px-3 py-2" />
        <select name="project_id" className="rounded bg-canvas px-3 py-2"><option value="">Project</option>{projects.map((p: DbRow)=><option key={p.id ?? 0} value={p.id ?? ""}>{p.code}</option>)}</select>
        <input name="date" type="date" required className="rounded bg-canvas px-3 py-2" />
        <input name="amount" type="number" placeholder="Amount" required className="rounded bg-canvas px-3 py-2" />
        <input name="mode" placeholder="Mode" className="rounded bg-canvas px-3 py-2" />
        <input name="ref" placeholder="Ref" className="rounded bg-canvas px-3 py-2" />
        <input name="notes" placeholder="Notes" className="rounded bg-canvas px-3 py-2 sm:col-span-2 xl:col-span-3" />
        <button className="rounded bg-blurple px-4 py-2 font-medium text-ink sm:col-span-2 xl:col-span-3">Add Expense</button>
      </form>
      <div className="rounded-xl border border-hairline bg-surface-indigo p-4">
        <h2 className="mb-2 font-semibold">Expenses by Category</h2>
        <SimpleBar data={catData} />
      </div>
      <div className="overflow-x-auto rounded-xl border border-hairline bg-surface-indigo p-4">
        <table className="w-full min-w-[760px] text-sm"><thead className="text-ink-400"><tr><th className="py-2 text-left font-medium">Date</th><th className="py-2 text-left font-medium">Category</th><th className="py-2 text-left font-medium">Project</th><th className="py-2 text-right font-medium">Amount</th><th className="py-2 text-left font-medium">Mode</th><th className="py-2 text-left font-medium">Notes</th></tr></thead>
        <tbody>{rows.map((r: DbRow)=>(<tr key={r.id ?? 0} className="border-t border-hairline align-top"><td className="py-2 pr-3 whitespace-nowrap">{r.date}</td><td className="py-2 pr-3">{r.category}</td><td className="py-2 pr-3">{r.pcode}</td><td className="py-2 text-right whitespace-nowrap">{formatINR(Number(r.amount ?? 0))}</td><td className="py-2 pr-3 capitalize">{r.mode}</td><td className="py-2 text-ink-300">{r.notes}</td></tr>))}</tbody></table>
      </div>
    </div>
  );
}
