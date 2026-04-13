import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CoursesGrid from '../courses/CoursesGrid';
import type { CourseDTO } from '@/lib/courses/types';

const mockCourses: CourseDTO[] = [
  {
    id: '1',
    name: 'TypeScript Avançado',
    description: 'Aprenda TypeScript do zero ao avançado.',
    price: null,
    sellable: true,
    visible: true,
    status: 'PUBLISHED',
    averageRating: 4.8,
    ratingsCount: 120,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'React com Next.js',
    description: 'Construa aplicações modernas com React e Next.js.',
    price: { amount: 9990, currency: 'BRL' },
    sellable: true,
    visible: true,
    status: 'PUBLISHED',
    averageRating: 4.5,
    ratingsCount: 88,
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
  },
];

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('CoursesGrid', () => {
  describe('when courses are provided', () => {
    it('renders all course cards', () => {
      render(<CoursesGrid courses={mockCourses} />);
      expect(screen.getByText('TypeScript Avançado')).toBeInTheDocument();
      expect(screen.getByText('React com Next.js')).toBeInTheDocument();
    });
  });

  describe('when courses list is empty', () => {
    it('renders the empty state message', () => {
      render(<CoursesGrid courses={[]} />);
      expect(screen.getByText('Nenhum curso disponível ainda')).toBeInTheDocument();
    });

    it('renders the school outlined icon in the empty state', () => {
      const { container } = render(<CoursesGrid courses={[]} />);
      // SchoolOutlinedIcon renders as an SVG — validates the import is resolved
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('when loading', () => {
    it('renders skeleton cards instead of course content', () => {
      render(<CoursesGrid courses={[]} loading={true} />);
      // Course titles must NOT appear while loading
      expect(screen.queryByText('TypeScript Avançado')).not.toBeInTheDocument();
      // Empty-state text must NOT appear while loading
      expect(screen.queryByText('Nenhum curso disponível ainda')).not.toBeInTheDocument();
    });
  });
});
