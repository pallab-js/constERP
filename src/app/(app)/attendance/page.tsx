import { getDb } from "@/lib/db";
import type { DbRow } from "@/lib/types";
import { revalidatePath } from "next/cache";
export default function AttendancePage() {
  const db = getDb();
  const workers = db.prepare("SELECT id,name FROM workers").all() as DbRow[];
  const projects = db.prepare("SELECT id,code FROM projects").all() as DbRow[];
  const rows = db.prepare("SELECT a.*, w.name as wname, p.code as pcode FROM attendance a LEFT JOIN workers w ON w.id=a.worker_id LEFT JOIN projects p ON p.id=a.project_id ORDER BY a.id DESC").all() as DbRow[];
  async function add(formData: FormData) {
    "use server"; const db = getDb();
    db.prepare("INSERT INTO attendance (worker_id,date,status,project_id,hours) VALUES (?,?,?,?,?)").run(formData.get("worker_id"),formData.get("date"),formData.get("status")||"present",formData.get("project_id")||null,formData.get("hours")||0);
    revalidatePath("/attendance");
  }
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-blurple">Attendance</h1>
      <form action={add} className="bg-surface-indigo rounded-xl p-4 border border-hairline grid grid-cols-3 gap-3">
        <select name="worker_id" required className="bg-canvas rounded px-3 py-2"><option value="">Worker</option>{workers.map((w: DbRow)=><option key={w.id ?? 0} value={w.id ?? ""}>{w.name}</option>)}</select>
        <input name="date" type="date" required className="bg-canvas rounded px-3 py-2" />
        <select name="status" className="bg-canvas rounded px-3 py-2"><option>present</option><option>absent</option><option>half</option></select>
        <select name="project_id" className="bg-canvas rounded px-3 py-2"><option value="">Project</option>{projects.map((p: DbRow)=><option key={p.id ?? 0} value={p.id ?? ""}>{p.code}</option>)}</select>
        <input name="hours" type="number" placeholder="Hours" className="bg-canvas rounded px-3 py-2" />
        <button className="bg-blurple text-ink rounded px-4 py-2">Add</button>
      </form>
      <div className="bg-surface-indigo rounded-xl p-4 border border-hairline overflow-auto">
        <table className="w-full text-sm"><thead className="text-ink-400"><tr><th className="text-left py-1">Date</th><th>Worker</th><th>Status</th><th>Project</th><th>Hours</th></tr></thead>
        <tbody>{rows.map((r: DbRow)=>(<tr key={r.id ?? 0} className="border-t border-hairline"><td className="py-1">{r.date}</td><td>{r.wname}</td><td>{r.status}</td><td>{r.pcode}</td><td>{r.hours}</td></tr>))}</tbody></table>
      </div>
    </div>
  );
}
