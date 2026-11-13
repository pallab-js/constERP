import { getDb } from "@/lib/db";
import type { DbRow } from "@/lib/types";
import { revalidatePath } from "next/cache";
export default function VendorsPage() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM vendors ORDER BY id DESC").all() as DbRow[];
  async function add(formData: FormData) {
    "use server"; const db = getDb();
    db.prepare("INSERT INTO vendors (name,category,phone,email,address,gstin) VALUES (?,?,?,?,?,?)").run(formData.get("name"),formData.get("category"),formData.get("phone"),formData.get("email"),formData.get("address"),formData.get("gstin"));
    revalidatePath("/vendors");
  }
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-blurple">Vendors</h1>
      <form action={add} className="grid grid-cols-1 gap-3 rounded-xl border border-hairline bg-surface-indigo p-4 sm:grid-cols-2 xl:grid-cols-3">
        <input name="name" placeholder="Name" required className="rounded bg-canvas px-3 py-2" />
        <select name="category" className="rounded bg-canvas px-3 py-2"><option>material</option><option>labour</option><option>equipment</option><option>service</option></select>
        <input name="phone" placeholder="Phone" className="rounded bg-canvas px-3 py-2" />
        <input name="email" placeholder="Email" className="rounded bg-canvas px-3 py-2" />
        <input name="address" placeholder="Address" className="rounded bg-canvas px-3 py-2 sm:col-span-2" />
        <input name="gstin" placeholder="GSTIN" className="rounded bg-canvas px-3 py-2" />
        <button className="rounded bg-blurple px-4 py-2 font-medium text-ink sm:col-span-2 xl:col-span-3">Add Vendor</button>
      </form>
      <div className="overflow-x-auto rounded-xl border border-hairline bg-surface-indigo p-4">
        <table className="w-full min-w-[760px] text-sm"><thead className="text-ink-400"><tr><th className="py-2 text-left font-medium">Name</th><th className="py-2 text-left font-medium">Category</th><th className="py-2 text-left font-medium">Phone</th><th className="py-2 text-left font-medium">Email</th><th className="py-2 text-left font-medium">Address</th><th className="py-2 text-left font-medium">GSTIN</th></tr></thead>
        <tbody>{rows.map((r: DbRow)=>(<tr key={r.id ?? 0} className="border-t border-hairline align-top"><td className="py-2 pr-3 font-medium">{r.name}</td><td className="py-2 pr-3 capitalize">{r.category}</td><td className="py-2 pr-3 whitespace-nowrap">{r.phone}</td><td className="py-2 pr-3 break-all">{r.email}</td><td className="py-2 pr-3 text-ink-300">{r.address}</td><td className="py-2 font-mono text-xs sm:text-sm">{r.gstin}</td></tr>))}</tbody></table>
      </div>
    </div>
  );
}
