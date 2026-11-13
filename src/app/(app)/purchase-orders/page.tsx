import { getDb } from "@/lib/db";
import type { DbRow } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { revalidatePath } from "next/cache";
export default function POPage() {
  const db = getDb();
  const vendors = db.prepare("SELECT id,name FROM vendors").all() as DbRow[];
  const projects = db.prepare("SELECT id,code FROM projects").all() as DbRow[];
  const rows = db.prepare("SELECT po.*, v.name as vname, p.code as pcode FROM purchase_orders po LEFT JOIN vendors v ON v.id=po.vendor_id LEFT JOIN projects p ON p.id=po.project_id ORDER BY po.id DESC").all() as DbRow[];
  async function add(formData: FormData) {
    "use server"; const db = getDb();
    db.prepare("INSERT INTO purchase_orders (po_number,vendor_id,project_id,date,expected_date,status,total,notes) VALUES (?,?,?,?,?,?,?,?)").run(formData.get("po_number"),formData.get("vendor_id"),formData.get("project_id")||null,formData.get("date"),formData.get("expected_date"),formData.get("status")||"open",formData.get("total")||0,formData.get("notes"));
    revalidatePath("/purchase-orders");
  }
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-blurple">Purchase Orders</h1>
      <form action={add} className="grid grid-cols-1 gap-3 rounded-xl border border-hairline bg-surface-indigo p-4 sm:grid-cols-2 xl:grid-cols-3">
        <input name="po_number" placeholder="PO number" required className="rounded bg-canvas px-3 py-2" />
        <select name="vendor_id" required className="rounded bg-canvas px-3 py-2"><option value="">Vendor</option>{vendors.map((v: DbRow)=><option key={v.id ?? 0} value={v.id ?? ""}>{v.name}</option>)}</select>
        <select name="project_id" className="rounded bg-canvas px-3 py-2"><option value="">Project</option>{projects.map((p: DbRow)=><option key={p.id ?? 0} value={p.id ?? ""}>{p.code}</option>)}</select>
        <input name="date" type="date" required className="rounded bg-canvas px-3 py-2" />
        <input name="expected_date" type="date" className="rounded bg-canvas px-3 py-2" />
        <select name="status" className="rounded bg-canvas px-3 py-2"><option>open</option><option>received</option><option>closed</option><option>cancelled</option></select>
        <input name="total" type="number" placeholder="Total" className="rounded bg-canvas px-3 py-2" />
        <input name="notes" placeholder="Notes" className="rounded bg-canvas px-3 py-2 sm:col-span-2" />
        <button className="rounded bg-blurple px-4 py-2 font-medium text-ink sm:col-span-2 xl:col-span-3">Add PO</button>
      </form>
      <div className="overflow-x-auto rounded-xl border border-hairline bg-surface-indigo p-4">
        <table className="w-full min-w-[760px] text-sm"><thead className="text-ink-400"><tr><th className="py-2 text-left font-medium">PO #</th><th className="py-2 text-left font-medium">Vendor</th><th className="py-2 text-left font-medium">Project</th><th className="py-2 text-left font-medium">Date</th><th className="py-2 text-right font-medium">Total</th><th className="py-2 text-left font-medium">Status</th></tr></thead>
        <tbody>{rows.map((r: DbRow)=>(<tr key={r.id ?? 0} className="border-t border-hairline"><td className="py-2 pr-3 font-mono">{r.po_number}</td><td className="py-2 pr-3">{r.vname}</td><td className="py-2 pr-3">{r.pcode}</td><td className="py-2 pr-3 whitespace-nowrap">{r.date}</td><td className="py-2 text-right whitespace-nowrap">{formatINR(Number(r.total ?? 0))}</td><td className="py-2 capitalize">{r.status}</td></tr>))}</tbody></table>
      </div>
    </div>
  );
}
