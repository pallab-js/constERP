// Shared formatting + money helpers (INR, Indian number format)
export function formatINR(amount: number | null | undefined): string {
  const n = Number(amount ?? 0);
  if (!isFinite(n)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatINRCompact(amount: number | null | undefined): string {
  const n = Number(amount ?? 0);
  if (!isFinite(n)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);
}

export function formatIndianNumber(n: number | null | undefined): string {
  const v = Number(n ?? 0);
  if (!isFinite(v)) return '0';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(v);
}

export function parseNumber(v: unknown): number {
  if (v === null || v === undefined || v === '') return 0;
  const n = Number(v);
  return isFinite(n) ? n : 0;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function monthISO(date: Date = new Date()): string {
  return date.toISOString().slice(0, 7);
}

export function daysBetween(a: string, b: string): number {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(ms / 86400000);
}

export function isOverdue(dueDate: string | null | undefined): boolean {
  if (!dueDate) return false;
  return new Date(dueDate).getTime() < new Date().setHours(0, 0, 0, 0);
}

export function statusColor(status: string): string {
  switch (status) {
    case 'active':
    case 'open':
    case 'present':
    case 'owned':
    case 'active':
      return 'text-green-400';
    case 'completed':
    case 'received':
    case 'paid':
    case 'closed':
      return 'text-blurple';
    case 'on_hold':
    case 'cancelled':
    case 'absent':
    case 'hired':
    case 'idle':
    case 'maintenance':
      return 'text-ink-500';
    case 'overdue':
    case 'rejected':
      return 'text-magenta';
    case 'draft':
      return 'text-ink-400';
    case 'sent':
      return 'text-link';
    case 'approved':
      return 'text-green-400';
    default:
      return 'text-ink-400';
  }
}

export function statusBadge(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-green-500/15 text-green-400 ring-green-500/30';
    case 'completed':
      return 'bg-blurple/20 text-blurple ring-blurple/30';
    case 'on_hold':
      return 'bg-ink-500/20 text-ink-300 ring-ink-500/30';
    case 'cancelled':
      return 'bg-magenta/20 text-magenta ring-magenta/30';
    case 'open':
      return 'bg-green-500/15 text-green-400 ring-green-500/30';
    case 'received':
    case 'closed':
      return 'bg-blurple/20 text-blurple ring-blurple/30';
    case 'paid':
      return 'bg-green-500/15 text-green-400 ring-green-500/30';
    case 'unpaid':
      return 'bg-ink-500/20 text-ink-300 ring-ink-500/30';
    case 'overdue':
      return 'bg-magenta/20 text-magenta ring-magenta/30';
    case 'draft':
      return 'bg-ink-500/20 text-ink-400 ring-ink-500/30';
    case 'sent':
      return 'bg-link/20 text-link ring-link/30';
    case 'approved':
      return 'bg-green-500/15 text-green-400 ring-green-500/30';
    case 'rejected':
      return 'bg-magenta/20 text-magenta ring-magenta/30';
    case 'present':
      return 'bg-green-500/15 text-green-400 ring-green-500/30';
    case 'absent':
      return 'bg-magenta/20 text-magenta ring-magenta/30';
    case 'half':
      return 'bg-link/20 text-link ring-link/30';
    case 'owned':
      return 'bg-green-500/15 text-green-400 ring-green-500/30';
    case 'hired':
      return 'bg-link/20 text-link ring-link/30';
    case 'idle':
      return 'bg-ink-500/20 text-ink-400 ring-ink-500/30';
    case 'maintenance':
      return 'bg-magenta/20 text-magenta ring-magenta/30';
    default:
      return 'bg-ink-500/20 text-ink-300 ring-ink-500/30';
  }
}

export function initials(name: string): string {
  return (name || '?')
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function relativeDay(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff > 1) return `${diff} days ago`;
  if (diff === -1) return 'Tomorrow';
  return `${Math.abs(diff)} days from now`;
}