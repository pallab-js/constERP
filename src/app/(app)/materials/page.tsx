import { getDb } from "@/lib/db";
import type { DbRow } from "@/lib/types";
import { revalidatePath } from "next/cache";
export default function MaterialsPage() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM materials ORDER BY id DESC").all() as DbRow[];
  async function add(formData: FormData) {
    "use server"; const db = getDb();
    db.prepare("INSERT INTO materials (name,unit,category,reorder_level,rate) VALUES (?,?,?,?,?)").run(formData.get("name"),formData.get("unit"),formData.get("category"),formData.get("reorder_level")||0,formData.get("rate")||0);
    revalidatePath("/materials");
  }
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-blurple">Materials</h1>
      <form action={add} className="bg-surface-indigo rounded-xl p-4 border border-hairline grid grid-cols-3 gap-3">
        <input name="name" placeholder="Name" required className="bg-canvas rounded px-3 py-2" />
        <input name="unit" placeholder="Unit" required className="bg-canvas rounded px-3 py-2" />
        <input name="category" placeholder="Category" className="bg-canvas rounded px-3 py-2" />
        <input name="reorder_level" type="number" placeholder="Reorder level" className="bg-canvas rounded px-3 py-2" />
        <input name="rate" type="number" placeholder="Rate" className="bg-canvas rounded px-3 py-2" />
        <button className="bg-blurple text-ink rounded px-4 py-2">Add Material</button>
      </form>
      <div className="bg-surface-indigo rounded-xl p-4 border border-hairline overflow-auto">
        <table className="w-full text-sm"><thead className="text-ink-400"><tr><th className="text-left py-1">Name</th><th>Unit</th><th>Category</th><th>Reorder</th><th>Rate</th></tr></thead>
        <tbody>{rows.map((r: DbRow)=>(<tr key={r.id ?? 0} className="border-t border-hairline"><td className="py-1">{r.name}</td><td>{r.unit}</td><td>{r.category}</td><td>{r.reorder_level}</td><td>{r.rate}</td></tr>))}</tbody></table>
      </div>
    </div>
  );
}
