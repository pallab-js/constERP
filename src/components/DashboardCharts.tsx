"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#5865f2", "#35ed7e", "#ec48bd", "#00b0f4"];

export function RevenueChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-56 w-full min-w-0 sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis dataKey="name" stroke="#99aab5" fontSize={12} />
          <YAxis stroke="#99aab5" fontSize={12} width={48} tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`} />
          <Tooltip contentStyle={{ background: "#1e2353", border: "1px solid #23272a", color: "#fff" }} />
          <Bar dataKey="value" fill="#5865f2" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProjectStatusChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-56 w-full min-w-0 sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={75} label>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Tooltip contentStyle={{ background: "#1e2353", border: "1px solid #23272a", color: "#fff" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SimpleBar({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-52 w-full min-w-0 sm:h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis dataKey="name" stroke="#99aab5" fontSize={12} interval={0} tick={{ fontSize: 11 }} />
          <YAxis stroke="#99aab5" fontSize={12} width={40} />
          <Tooltip contentStyle={{ background: "#1e2353", border: "1px solid #23272a", color: "#fff" }} />
          <Bar dataKey="value" fill="#ec48bd" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
