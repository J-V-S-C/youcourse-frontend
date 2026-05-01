import type { CourseDTO } from '@/lib/courses/types';

export const GRADIENT_PALETTE = [
  'linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary), black 20%) 100%)',
  'linear-gradient(135deg, var(--secondary) 0%, color-mix(in srgb, var(--secondary), black 20%) 100%)',
  'linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent), black 20%) 100%)',
  'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
  'linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%)',
  'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)',
];

export function courseGradient(id: string): string {
  if (!id) return GRADIENT_PALETTE[0];

  const hash = id.split('').reduce((acc, char) => {
    return (acc << 5) - acc + char.charCodeAt(0)
  }, 0)

  const idx = Math.abs(hash) % GRADIENT_PALETTE.length;
  return GRADIENT_PALETTE[idx];
}

export function formatPrice(price: CourseDTO['price']): string {
  if (!price || price.amount === 0) return 'Grátis';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: price.currency || 'BRL',
  }).format(price.amount / 100);
}

export function filterAndSortCourses(
  courses: CourseDTO[],
  q?: string,
  sort?: string,
): CourseDTO[] {
  const filtered = courses.filter((c) => {
    if (!c.visible) return false;
    if (q) {
      const term = q.toLowerCase();
      return (
        c.name.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return [...filtered].sort((a, b) => {
    if (sort === 'rating') {
      return (b.averageRating ?? 0) - (a.averageRating ?? 0);
    }
    if (sort === 'name') {
      return a.name.localeCompare(b.name);
    }
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
}
