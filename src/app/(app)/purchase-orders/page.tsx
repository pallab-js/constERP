import { getDb } from "@/lib/db";
import type { DbRow } from "@/lib/types";
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
      <form action={add} className="bg-surface-indigo rounded-xl p-4 border border-hairline grid grid-cols-3 gap-3">
        <input name="po_number" placeholder="PO number" required className="bg-canvas rounded px-3 py-2" />
        <select name="vendor_id" required className="bg-canvas rounded px-3 py-2"><option value="">Vendor</option>{vendors.map((v: DbRow)=><option key={v.id ?? 0} value={v.id ?? ""}>{v.name}</option>)}</select>
        <select name="project_id" className="bg-canvas rounded px-3 py-2"><option value="">Project</option>{projects.map((p: DbRow)=><option key={p.id ?? 0} value={p.id ?? ""}>{p.code}</option>)}</select>
        <input name="date" type="date" required className="bg-canvas rounded px-3 py-2" />
        <input name="expected_date" type="date" className="bg-canvas rounded px-3 py-2" />
        <select name="status" className="bg-canvas rounded px-3 py-2"><option>open</option><option>received</option><option>closed</option></select>
        <input name="total" type="number" placeholder="Total" className="bg-canvas rounded px-3 py-2" />
        <input name="notes" placeholder="Notes" className="bg-canvas rounded px-3 py-2 col-span-2" />
        <button className="bg-blurple text-ink rounded px-4 py-2 col-span-3">Add PO</button>
      </form>
      <div className="bg-surface-indigo rounded-xl p-4 border border-hairline overflow-auto">
        <table className="w-full text-sm"><thead className="text-ink-400"><tr><th className="text-left py-1">PO #</th><th>Vendor</th><th>Project</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>{rows.map((r: DbRow)=>(<tr key={r.id ?? 0} className="border-t border-hairline"><td className="py-1 font-mono">{r.po_number}</td><td>{r.vname}</td><td>{r.pcode}</td><td>{r.date}</td><td>{r.total}</td><td>{r.status}</td></tr>))}</tbody></table>
      </div>
    </div>
  );
}
