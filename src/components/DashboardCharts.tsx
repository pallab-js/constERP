"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#5865f2", "#35ed7e", "#ec48bd", "#00b0f4"];

export function RevenueChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#99aab5" />
        <YAxis stroke="#99aab5" />
        <Tooltip contentStyle={{ background: "#1e2353", border: "none", color: "#fff" }} />
        <Bar dataKey="value" fill="#5865f2" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ProjectStatusChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
        <Tooltip contentStyle={{ background: "#1e2353", border: "none", color: "#fff" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function SimpleBar({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#99aab5" fontSize={12} />
        <YAxis stroke="#99aab5" fontSize={12} />
        <Tooltip contentStyle={{ background: "#1e2353", border: "none", color: "#fff" }} />
        <Bar dataKey="value" fill="#ec48bd" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
