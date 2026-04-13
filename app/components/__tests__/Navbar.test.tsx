import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from '../Navbar';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockPush = vi.fn();
const mockSignOut = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

// ThemeSwitcher is an independent responsibility; stub it out
vi.mock('../ThemeSwitcher', () => ({
  ThemeSwitcher: () => <button aria-label="Alternar tema" />,
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

import { useSession } from 'next-auth/react';

function mockUnauthenticated() {
  vi.mocked(useSession).mockReturnValue({
    data: null,
    status: 'unauthenticated',
    update: vi.fn(),
  });
}

function mockAuthenticated() {
  vi.mocked(useSession).mockReturnValue({
    data: { user: { id: 'user-1' }, expires: '9999' },
    status: 'authenticated',
    update: vi.fn(),
  });
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when the user is unauthenticated', () => {
    beforeEach(mockUnauthenticated);

    it('renders public navigation links', () => {
      render(<Navbar />);
      expect(screen.getAllByRole('link', { name: 'Catálogo' }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('link', { name: 'Entrar' }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('link', { name: 'Cadastrar' }).length).toBeGreaterThan(0);
    });

    it('does not render a sign-out button', () => {
      render(<Navbar />);
      expect(screen.queryByRole('button', { name: /sair/i })).not.toBeInTheDocument();
    });

    it('renders an "Entrar" CTA button that navigates to /login', () => {
      render(<Navbar />);
      const loginBtn = screen.getByRole('button', { name: /entrar/i });
      fireEvent.click(loginBtn);
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    it('renders the school logo icon', () => {
      const { container } = render(<Navbar />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('when the user is authenticated', () => {
    beforeEach(mockAuthenticated);

    it('renders authenticated navigation links', () => {
      render(<Navbar />);
      expect(screen.getAllByRole('link', { name: 'Catálogo' }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('link', { name: 'Perfil' }).length).toBeGreaterThan(0);
    });

    it('does not render Entrar or Cadastrar links', () => {
      render(<Navbar />);
      expect(screen.queryByRole('link', { name: 'Entrar' })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Cadastrar' })).not.toBeInTheDocument();
    });

    it('calls signOut when the Sair button is clicked', () => {
      render(<Navbar />);
      // Navbar renders two "Sair" controls: one in the desktop bar, one in the drawer list
      const logoutBtns = screen.getAllByRole('button', { name: /sair/i });
      expect(logoutBtns.length).toBeGreaterThanOrEqual(1);
      fireEvent.click(logoutBtns[0]);
      expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/' });
    });
  });

  describe('mobile drawer', () => {
    beforeEach(mockUnauthenticated);

    it('opens the drawer when the hamburger icon button is clicked', () => {
      render(<Navbar />);
      // MUI Drawer renders a dialog element when open
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      const menuBtn = screen.getByRole('button', { name: /abrir menu/i });
      fireEvent.click(menuBtn);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });
});
