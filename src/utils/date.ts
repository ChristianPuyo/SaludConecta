export function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
}

export function formatShortDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
  } catch {
    return iso;
  }
}

export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Hace ${days}d`;
  return formatShortDate(new Date(timestamp).toISOString());
}

export function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}
