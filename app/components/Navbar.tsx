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
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';

const NAV_LINKS_PUBLIC = [{ label: 'Catálogo', href: '/' }];
const NAV_LINKS_AUTH = [
  { label: 'Catálogo', href: '/' },
  { label: 'Gerenciar Cursos', href: '/manage/courses' },
  { label: 'Perfil', href: '/profile' },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isAuthenticated = status === 'authenticated' && !!session && !session.error;

  useEffect(() => {
    if (session?.error === 'RefreshError') {
      signOut({ callbackUrl: '/login' });
    }
  }, [session]);

  if (status === 'loading') return null;

  const links = isAuthenticated ? NAV_LINKS_AUTH : NAV_LINKS_PUBLIC;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const drawer = (
    <Box sx={{ width: 280 }} role="presentation" onClick={() => setDrawerOpen(false)}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <SchoolIcon sx={{ color: 'var(--primary)' }} />
        <Typography variant="h6" sx={{ fontWeight: 800 }}>YouCourse</Typography>
      </Box>
      <Divider />
      <List>
        {links.map((link) => (
          <ListItem key={link.href} disablePadding>
            <ListItemButton component={Link} href={link.href}>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {!isAuthenticated ? (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => router.push('/login')}>
                <ListItemText primary="Entrar" sx={{ color: 'var(--primary)', fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => router.push('/register')}>
                <ListItemText primary="Cadastrar" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton onClick={handleSignOut}>
              <ListItemText primary="Sair" sx={{ color: 'error.main' }} />
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
          <Toolbar disableGutters sx={{ gap: { xs: 0, md: 1 } }}>
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
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                You<span style={{ color: 'var(--primary)' }}>Course</span>
              </Typography>
            </Box>

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

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
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
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => router.push('/register')}
                    sx={{ color: 'var(--foreground)', fontWeight: 600 }}
                  >
                    Cadastrar
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => router.push('/login')}
                    sx={{
                      bgcolor: 'var(--primary)',
                      '&:hover': { bgcolor: 'var(--primary-hover)' },
                      fontWeight: 600,
                      px: 3,
                    }}
                  >
                    Entrar
                  </Button>
                </Box>
              )}
            </Box>

            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 0.5 }}>
              <ThemeSwitcher />
              <IconButton
                onClick={() => setDrawerOpen(true)}
                aria-label="Menu"
                sx={{ color: 'var(--foreground)' }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            bgcolor: 'var(--surface)',
            backgroundImage: 'none',
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
