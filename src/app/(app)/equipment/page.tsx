import { getDb } from "@/lib/db";
import type { DbRow } from "@/lib/types";
import { revalidatePath } from "next/cache";
export default function EquipmentPage() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM equipment ORDER BY id DESC").all() as DbRow[];
  async function add(formData: FormData) {
    "use server"; const db = getDb();
    db.prepare("INSERT INTO equipment (name,type,reg_no,ownership,daily_rate,status) VALUES (?,?,?,?,?,?)").run(formData.get("name"),formData.get("type"),formData.get("reg_no"),formData.get("ownership")||"owned",formData.get("daily_rate")||0,formData.get("status")||"active");
    revalidatePath("/equipment");
  }
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-blurple">Equipment</h1>
      <form action={add} className="bg-surface-indigo rounded-xl p-4 border border-hairline grid grid-cols-3 gap-3">
        <input name="name" placeholder="Name" required className="bg-canvas rounded px-3 py-2" />
        <input name="type" placeholder="Type" className="bg-canvas rounded px-3 py-2" />
        <input name="reg_no" placeholder="Reg no" className="bg-canvas rounded px-3 py-2" />
        <select name="ownership" className="bg-canvas rounded px-3 py-2"><option>owned</option><option>hired</option></select>
        <input name="daily_rate" type="number" placeholder="Daily rate" className="bg-canvas rounded px-3 py-2" />
        <select name="status" className="bg-canvas rounded px-3 py-2"><option>active</option><option>maintenance</option><option>idle</option></select>
        <button className="bg-blurple text-ink rounded px-4 py-2 col-span-3">Add Equipment</button>
      </form>
      <div className="bg-surface-indigo rounded-xl p-4 border border-hairline overflow-auto">
        <table className="w-full text-sm"><thead className="text-ink-400"><tr><th className="text-left py-1">Name</th><th>Type</th><th>Reg</th><th>Ownership</th><th>Rate</th><th>Status</th></tr></thead>
        <tbody>{rows.map((r: DbRow)=>(<tr key={r.id ?? 0} className="border-t border-hairline"><td className="py-1">{r.name}</td><td>{r.type}</td><td>{r.reg_no}</td><td>{r.ownership}</td><td>{r.daily_rate}</td><td>{r.status}</td></tr>))}</tbody></table>
      </div>
    </div>
  );
}
