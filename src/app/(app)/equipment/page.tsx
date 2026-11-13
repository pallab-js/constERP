import { getDb } from "@/lib/db";
import type { DbRow } from "@/lib/types";
import { formatINR } from "@/lib/format";
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
      <form action={add} className="grid grid-cols-1 gap-3 rounded-xl border border-hairline bg-surface-indigo p-4 sm:grid-cols-2 xl:grid-cols-3">
        <input name="name" placeholder="Name" required className="rounded bg-canvas px-3 py-2" />
        <input name="type" placeholder="Type" className="rounded bg-canvas px-3 py-2" />
        <input name="reg_no" placeholder="Reg no" className="rounded bg-canvas px-3 py-2" />
        <select name="ownership" className="rounded bg-canvas px-3 py-2"><option>owned</option><option>hired</option></select>
        <input name="daily_rate" type="number" placeholder="Daily rate" className="rounded bg-canvas px-3 py-2" />
        <select name="status" className="rounded bg-canvas px-3 py-2"><option>active</option><option>maintenance</option><option>idle</option></select>
        <button className="rounded bg-blurple px-4 py-2 font-medium text-ink sm:col-span-2 xl:col-span-3">Add Equipment</button>
      </form>
      <div className="overflow-x-auto rounded-xl border border-hairline bg-surface-indigo p-4">
        <table className="w-full min-w-[760px] text-sm"><thead className="text-ink-400"><tr><th className="py-2 text-left font-medium">Name</th><th className="py-2 text-left font-medium">Type</th><th className="py-2 text-left font-medium">Reg</th><th className="py-2 text-left font-medium">Ownership</th><th className="py-2 text-right font-medium">Rate/day</th><th className="py-2 text-left font-medium">Status</th></tr></thead>
        <tbody>{rows.map((r: DbRow)=>(<tr key={r.id ?? 0} className="border-t border-hairline"><td className="py-2 pr-3 font-medium">{r.name}</td><td className="py-2 pr-3">{r.type}</td><td className="py-2 pr-3 font-mono text-xs sm:text-sm">{r.reg_no}</td><td className="py-2 pr-3 capitalize">{r.ownership}</td><td className="py-2 text-right whitespace-nowrap">{formatINR(Number(r.daily_rate ?? 0))}</td><td className="py-2 capitalize">{r.status}</td></tr>))}</tbody></table>
      </div>
    </div>
  );
}
