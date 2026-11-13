import { getDb } from "@/lib/db";
import type { DbRow } from "@/lib/types";
import { formatINR, formatIndianNumber } from "@/lib/format";
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
      <form action={add} className="grid grid-cols-1 gap-3 rounded-xl border border-hairline bg-surface-indigo p-4 sm:grid-cols-2 xl:grid-cols-3">
        <input name="name" placeholder="Name" required className="rounded bg-canvas px-3 py-2" />
        <input name="unit" placeholder="Unit" required className="rounded bg-canvas px-3 py-2" />
        <input name="category" placeholder="Category" className="rounded bg-canvas px-3 py-2" />
        <input name="reorder_level" type="number" placeholder="Reorder level" className="rounded bg-canvas px-3 py-2" />
        <input name="rate" type="number" placeholder="Rate" className="rounded bg-canvas px-3 py-2" />
        <button className="rounded bg-blurple px-4 py-2 font-medium text-ink sm:col-span-2 xl:col-span-1">Add Material</button>
      </form>
      <div className="overflow-x-auto rounded-xl border border-hairline bg-surface-indigo p-4">
        <table className="w-full min-w-[640px] text-sm"><thead className="text-ink-400"><tr><th className="py-2 text-left font-medium">Name</th><th className="py-2 text-left font-medium">Unit</th><th className="py-2 text-left font-medium">Category</th><th className="py-2 text-right font-medium">Reorder</th><th className="py-2 text-right font-medium">Rate</th></tr></thead>
        <tbody>{rows.map((r: DbRow)=>(<tr key={r.id ?? 0} className="border-t border-hairline"><td className="py-2 pr-3 font-medium">{r.name}</td><td className="py-2 pr-3">{r.unit}</td><td className="py-2 pr-3 capitalize">{r.category}</td><td className="py-2 text-right">{formatIndianNumber(Number(r.reorder_level ?? 0))}</td><td className="py-2 text-right whitespace-nowrap">{formatINR(Number(r.rate ?? 0))}</td></tr>))}</tbody></table>
      </div>
    </div>
  );
}
