import { getDb } from "@/lib/db";
import type { DbRow } from "@/lib/types";
import { revalidatePath } from "next/cache";
export default function WorkersPage() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM workers ORDER BY id DESC").all() as DbRow[];
  async function add(formData: FormData) {
    "use server"; const db = getDb();
    db.prepare("INSERT INTO workers (name,role,phone,wage_type,wage_rate,join_date) VALUES (?,?,?,?,?,?)").run(formData.get("name"),formData.get("role"),formData.get("phone"),formData.get("wage_type")||"daily",formData.get("wage_rate")||0,formData.get("join_date"));
    revalidatePath("/workers");
  }
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-blurple">Workers</h1>
      <form action={add} className="bg-surface-indigo rounded-xl p-4 border border-hairline grid grid-cols-3 gap-3">
        <input name="name" placeholder="Name" required className="bg-canvas rounded px-3 py-2" />
        <input name="role" placeholder="Role" className="bg-canvas rounded px-3 py-2" />
        <input name="phone" placeholder="Phone" className="bg-canvas rounded px-3 py-2" />
        <select name="wage_type" className="bg-canvas rounded px-3 py-2"><option>daily</option><option>monthly</option></select>
        <input name="wage_rate" type="number" placeholder="Wage rate" className="bg-canvas rounded px-3 py-2" />
        <input name="join_date" type="date" className="bg-canvas rounded px-3 py-2" />
        <button className="bg-blurple text-ink rounded px-4 py-2 col-span-3">Add Worker</button>
      </form>
      <div className="bg-surface-indigo rounded-xl p-4 border border-hairline overflow-auto">
        <table className="w-full text-sm"><thead className="text-ink-400"><tr><th className="text-left py-1">Name</th><th>Role</th><th>Phone</th><th>Wage type</th><th>Rate</th></tr></thead>
        <tbody>{rows.map((r: DbRow)=>(<tr key={r.id ?? 0} className="border-t border-hairline"><td className="py-1">{r.name}</td><td>{r.role}</td><td>{r.phone}</td><td>{r.wage_type}</td><td>{r.wage_rate}</td></tr>))}</tbody></table>
      </div>
    </div>
  );
}
