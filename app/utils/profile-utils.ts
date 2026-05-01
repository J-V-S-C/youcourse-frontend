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

  const parts = name.trim().split(' ')

  if (parts.length === 1) return parts[0][0].toUpperCase()

  const firstLetter = parts[0][0]
  const lastLetter = parts[parts.length - 1][0]


  return (firstLetter + lastLetter).toUpperCase()
}
