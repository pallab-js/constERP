import { getDb } from "@/lib/db";
import type { DbRow } from "@/lib/types";
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
      <form action={add} className="bg-surface-indigo rounded-xl p-4 border border-hairline grid grid-cols-3 gap-3">
        <input name="category" placeholder="Category" required className="bg-canvas rounded px-3 py-2" />
        <select name="project_id" className="bg-canvas rounded px-3 py-2"><option value="">Project</option>{projects.map((p: DbRow)=><option key={p.id ?? 0} value={p.id ?? ""}>{p.code}</option>)}</select>
        <input name="date" type="date" required className="bg-canvas rounded px-3 py-2" />
        <input name="amount" type="number" placeholder="Amount" required className="bg-canvas rounded px-3 py-2" />
        <input name="mode" placeholder="Mode" className="bg-canvas rounded px-3 py-2" />
        <input name="ref" placeholder="Ref" className="bg-canvas rounded px-3 py-2" />
        <input name="notes" placeholder="Notes" className="bg-canvas rounded px-3 py-2 col-span-3" />
        <button className="bg-blurple text-ink rounded px-4 py-2 col-span-3">Add Expense</button>
      </form>
      <div className="bg-surface-indigo rounded-xl p-4 border border-hairline">
        <h2 className="font-semibold mb-2">Expenses by Category</h2>
        <SimpleBar data={catData} />
      </div>
      <div className="bg-surface-indigo rounded-xl p-4 border border-hairline overflow-auto">
        <table className="w-full text-sm"><thead className="text-ink-400"><tr><th className="text-left py-1">Date</th><th>Category</th><th>Project</th><th>Amount</th><th>Mode</th></tr></thead>
        <tbody>{rows.map((r: DbRow)=>(<tr key={r.id ?? 0} className="border-t border-hairline"><td className="py-1">{r.date}</td><td>{r.category}</td><td>{r.pcode}</td><td>{r.amount}</td><td>{r.mode}</td></tr>))}</tbody></table>
      </div>
    </div>
  );
}
