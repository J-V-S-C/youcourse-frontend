'use client';

import { Box, Container, Divider, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import Link from 'next/link';

const FOOTER_LINKS = [
  { label: 'Catálogo', href: '/' },
  { label: 'Entrar', href: '/login' },
  { label: 'Cadastrar', href: '/register' },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 5,
        bgcolor: 'var(--surface)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            justifyContent: 'space-between',
            gap: 3,
          }}
        >
          {/* Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SchoolIcon sx={{ color: 'var(--primary)', fontSize: 22 }} />
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.5px' }}
            >
              You<span style={{ color: 'var(--primary)' }}>Course</span>
            </Typography>
          </Box>

          {/* Links */}
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', sm: 'flex-end' },
            }}
          >
            {FOOTER_LINKS.map((link) => (
              <Typography
                key={link.href}
                component={Link}
                href={link.href}
                variant="body2"
                sx={{
                  color: 'var(--muted)',
                  textDecoration: 'none',
                  '&:hover': { color: 'var(--primary)' },
                  transition: 'color 0.2s',
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'var(--border)' }} />

        <Typography variant="body2" sx={{ color: 'var(--muted)', textAlign: 'center' }}>
          © {new Date().getFullYear()} YouCourse. Todos os direitos reservados.
        </Typography>
      </Container>
    </Box>
  );
}
