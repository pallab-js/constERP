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
      <form action={add} className="grid grid-cols-1 gap-3 rounded-xl border border-hairline bg-surface-indigo p-4 sm:grid-cols-2 xl:grid-cols-3">
        <select name="worker_id" required className="rounded bg-canvas px-3 py-2"><option value="">Worker</option>{workers.map((w: DbRow)=><option key={w.id ?? 0} value={w.id ?? ""}>{w.name}</option>)}</select>
        <input name="date" type="date" required className="rounded bg-canvas px-3 py-2" />
        <select name="status" className="rounded bg-canvas px-3 py-2"><option>present</option><option>absent</option><option>half</option></select>
        <select name="project_id" className="rounded bg-canvas px-3 py-2"><option value="">Project</option>{projects.map((p: DbRow)=><option key={p.id ?? 0} value={p.id ?? ""}>{p.code}</option>)}</select>
        <input name="hours" type="number" placeholder="Hours" className="rounded bg-canvas px-3 py-2" />
        <button className="rounded bg-blurple px-4 py-2 font-medium text-ink">Add</button>
      </form>
      <div className="overflow-x-auto rounded-xl border border-hairline bg-surface-indigo p-4">
        <table className="w-full min-w-[640px] text-sm"><thead className="text-ink-400"><tr><th className="py-2 text-left font-medium">Date</th><th className="py-2 text-left font-medium">Worker</th><th className="py-2 text-left font-medium">Status</th><th className="py-2 text-left font-medium">Project</th><th className="py-2 text-right font-medium">Hours</th></tr></thead>
        <tbody>{rows.map((r: DbRow)=>(<tr key={r.id ?? 0} className="border-t border-hairline"><td className="py-2 pr-3 whitespace-nowrap">{r.date}</td><td className="py-2 pr-3">{r.wname}</td><td className="py-2 pr-3 capitalize">{r.status}</td><td className="py-2 pr-3 font-mono text-xs sm:text-sm">{r.pcode}</td><td className="py-2 text-right">{r.hours}</td></tr>))}</tbody></table>
      </div>
    </div>
  );
}
