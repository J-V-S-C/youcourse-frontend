import type { CourseDTO } from '@/lib/courses/types';

export const GRADIENT_PALETTE = [
  'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
  'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)',
];

export function courseGradient(id: string): string {
  const idx = id.charCodeAt(0) % GRADIENT_PALETTE.length;
  return GRADIENT_PALETTE[idx];
}

export function formatPrice(price: CourseDTO['price']): string {
  if (!price || price.amount === 0) return 'Grátis';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: price.currency ?? 'BRL',
  }).format(price.amount / 100);

}
