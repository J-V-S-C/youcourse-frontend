'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function HeroSection() {
  const { data: session, status } = useSession();

  return (
    <Box
      component="section"
      aria-label="Seção principal"
      sx={{
        background:
          'linear-gradient(135deg, var(--primary) 0%, #7c3aed 60%, var(--primary-hover) 100%)',
        py: { xs: 10, md: 14 },
        px: 2,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 70% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          component="h1"
          variant="h2"
          sx={{
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.15,
            fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
            mb: 2,
            letterSpacing: '-1px',
          }}
        >
          Aprenda o que quiser,{' '}
          <Box component="span" sx={{ opacity: 0.85 }}>
            no seu ritmo.
          </Box>
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255,255,255,0.75)',
            mb: 5,
            fontWeight: 400,
            maxWidth: 520,
            mx: 'auto',
            fontSize: { xs: '1rem', md: '1.2rem' },
          }}
        >
          Explore cursos criados pela comunidade e dê o próximo passo na sua
          carreira.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {status === 'authenticated' ? (
            <Button
              component={Link}
              href="/my-courses"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: '#fff',
                color: 'var(--primary)',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}
            >
              Acessar Seus Cursos
            </Button>
          ) : (
            <Button
              component={Link}
              href="/register"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: '#fff',
                color: 'var(--primary)',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}
            >
              Comece grátis
            </Button>
          )}

          <Button
            component={Link}
            href="courses"
            variant="outlined"
            size="large"
            sx={{
              borderColor: 'rgba(255,255,255,0.5)',
              color: '#fff',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontSize: '1rem',
              '&:hover': {
                borderColor: '#fff',
                bgcolor: 'rgba(255,255,255,0.08)',
              },
            }}
          >
            Ver cursos
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
