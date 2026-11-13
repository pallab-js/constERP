import { getDb } from "@/lib/db";
import type { DbRow } from "@/lib/types";
import { formatINR } from "@/lib/format";
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
      <form action={add} className="grid grid-cols-1 gap-3 rounded-xl border border-hairline bg-surface-indigo p-4 sm:grid-cols-2 xl:grid-cols-3">
        <input name="name" placeholder="Name" required className="rounded bg-canvas px-3 py-2" />
        <input name="role" placeholder="Role" className="rounded bg-canvas px-3 py-2" />
        <input name="phone" placeholder="Phone" className="rounded bg-canvas px-3 py-2" />
        <select name="wage_type" className="rounded bg-canvas px-3 py-2"><option>daily</option><option>monthly</option></select>
        <input name="wage_rate" type="number" placeholder="Wage rate" className="rounded bg-canvas px-3 py-2" />
        <input name="join_date" type="date" className="rounded bg-canvas px-3 py-2" />
        <button className="rounded bg-blurple px-4 py-2 font-medium text-ink sm:col-span-2 xl:col-span-3">Add Worker</button>
      </form>
      <div className="overflow-x-auto rounded-xl border border-hairline bg-surface-indigo p-4">
        <table className="w-full min-w-[720px] text-sm"><thead className="text-ink-400"><tr><th className="py-2 text-left font-medium">Name</th><th className="py-2 text-left font-medium">Role</th><th className="py-2 text-left font-medium">Phone</th><th className="py-2 text-left font-medium">Wage type</th><th className="py-2 text-right font-medium">Rate</th><th className="py-2 text-left font-medium">Joined</th></tr></thead>
        <tbody>{rows.map((r: DbRow)=>(<tr key={r.id ?? 0} className="border-t border-hairline"><td className="py-2 pr-3 font-medium">{r.name}</td><td className="py-2 pr-3">{r.role}</td><td className="py-2 pr-3 whitespace-nowrap">{r.phone}</td><td className="py-2 pr-3 capitalize">{r.wage_type}</td><td className="py-2 text-right whitespace-nowrap">{formatINR(Number(r.wage_rate ?? 0))}</td><td className="py-2 whitespace-nowrap">{r.join_date}</td></tr>))}</tbody></table>
      </div>
    </div>
  );
}
