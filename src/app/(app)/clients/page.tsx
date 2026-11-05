import { getDb } from "@/lib/db";
import type { DbRow } from "@/lib/types";
import { revalidatePath } from "next/cache";

export default function ClientsPage() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM clients ORDER BY id DESC").all() as DbRow[];
  async function add(formData: FormData) {
    "use server";
    const db = getDb();
    db.prepare("INSERT INTO clients (name, contact, phone, email, address, gstin) VALUES (?,?,?,?,?,?)").run(
      formData.get("name"), formData.get("contact"), formData.get("phone"), formData.get("email"), formData.get("address"), formData.get("gstin")
    );
    revalidatePath("/clients");
  }
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-blurple">Clients</h1>
      <form action={add} className="bg-surface-indigo rounded-xl p-4 border border-hairline grid grid-cols-2 gap-3">
        <input name="name" placeholder="Name" required className="bg-canvas rounded px-3 py-2" />
        <input name="contact" placeholder="Contact person" className="bg-canvas rounded px-3 py-2" />
        <input name="phone" placeholder="Phone" className="bg-canvas rounded px-3 py-2" />
        <input name="email" placeholder="Email" className="bg-canvas rounded px-3 py-2" />
        <input name="address" placeholder="Address" className="bg-canvas rounded px-3 py-2 col-span-2" />
        <input name="gstin" placeholder="GSTIN" className="bg-canvas rounded px-3 py-2" />
        <button className="bg-blurple text-ink rounded px-4 py-2 col-span-2">Add Client</button>
      </form>
      <div className="bg-surface-indigo rounded-xl p-4 border border-hairline overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-ink-400"><tr><th className="text-left py-1">Name</th><th>Contact</th><th>Phone</th><th>Email</th><th>GSTIN</th></tr></thead>
          <tbody>{rows.map((r: DbRow)=>(
            <tr key={r.id ?? 0} className="border-t border-hairline">
              <td className="py-1">{r.name}</td><td>{r.contact}</td><td>{r.phone}</td><td>{r.email}</td><td>{r.gstin}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
