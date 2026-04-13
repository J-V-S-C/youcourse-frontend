export const STATUS_COLORS: Record<string, 'success' | 'error' | 'default'> = {
  ACTIVE: 'success',
  SUSPENDED: 'error',
  DISABLED: 'default',
};

export const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Ativo',
  SUSPENDED: 'Suspenso',
  DISABLED: 'Desativado',
};

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Nunca';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}
