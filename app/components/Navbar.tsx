'use client';

import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';

const NAV_LINKS_PUBLIC = [
  { label: 'Catálogo', href: '/' },
  { label: 'Entrar', href: '/login' },
  { label: 'Cadastrar', href: '/register' },
];

const NAV_LINKS_AUTH = [
  { label: 'Catálogo', href: '/' },
  { label: 'Perfil', href: '/profile' },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isAuthenticated = status === 'authenticated' && !!session;
  const links = isAuthenticated ? NAV_LINKS_AUTH : NAV_LINKS_PUBLIC;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
      <List>
        {links.map((link) => (
          <ListItem key={link.href} disablePadding>
            <ListItemButton component={Link} href={link.href}>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleSignOut}>
              <ListItemText primary="Sair" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 1 }}>
            {/* Logo */}
            <Box
              component={Link}
              href="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                flexGrow: { xs: 1, md: 0 },
              }}
            >
              <SchoolIcon sx={{ color: 'var(--primary)', fontSize: 28 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: 'var(--foreground)',
                  letterSpacing: '-0.5px',
                }}
              >
                You<span style={{ color: 'var(--primary)' }}>Course</span>
              </Typography>
            </Box>

            {/* Desktop nav */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 0.5, ml: 3 }}>
              {links.map((link) => (
                <Button
                  key={link.href}
                  component={Link}
                  href={link.href}
                  sx={{
                    color: 'var(--muted)',
                    fontWeight: 500,
                    '&:hover': { color: 'var(--foreground)', bgcolor: 'transparent' },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>

            {/* Desktop right-side actions */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              <ThemeSwitcher />
              {isAuthenticated ? (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleSignOut}
                  sx={{
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                    '&:hover': { borderColor: 'var(--primary)', color: 'var(--primary)' },
                  }}
                >
                  Sair
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => router.push('/login')}
                  sx={{
                    bgcolor: 'var(--primary)',
                    '&:hover': { bgcolor: 'var(--primary-hover)' },
                    fontWeight: 600,
                  }}
                >
                  Entrar
                </Button>
              )}
            </Box>

            {/* Mobile: theme + hamburger */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
              <ThemeSwitcher />
              <IconButton
                onClick={() => setDrawerOpen(true)}
                aria-label="Abrir menu de navegação"
                sx={{ color: 'var(--foreground)' }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawer}
      </Drawer>
    </>
  );
}
