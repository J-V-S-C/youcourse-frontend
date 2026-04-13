import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Footer from '../Footer';

// next/link renders a plain <a> in tests
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('Footer', () => {
  it('renders the brand name', () => {
    render(<Footer />);
    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('Course')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'Catálogo' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: 'Cadastrar' })).toHaveAttribute('href', '/register');
  });

  it('renders the copyright notice', () => {
    render(<Footer />);
    expect(screen.getByText(/YouCourse\. Todos os direitos reservados\./)).toBeInTheDocument();
  });

  it('renders the school icon', () => {
    const { container } = render(<Footer />);
    // MUI renders SVG icons; assert at least one SVG is present
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
