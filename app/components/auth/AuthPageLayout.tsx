'use client';

import { Box, Paper, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import Navbar from '@/app/components/Navbar';

interface AuthPageLayoutProps {
  children: React.ReactNode;
  maxWidth?: number;
}

export default function AuthPageLayout({ children, maxWidth = 440 }: AuthPageLayoutProps) {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'var(--background)' }}
    >
      <Navbar />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(79,70,229,0.12) 0%, transparent 70%)',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth,
            p: { xs: 3, sm: 5 },
            border: '1px solid var(--border)',
            borderRadius: 4,
            bgcolor: 'var(--surface)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon sx={{ color: 'var(--primary)', fontSize: 26 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.5px' }}
              >
                You<span style={{ color: 'var(--primary)' }}>Course</span>
              </Typography>
            </Box>
          </Box>

          {children}
        </Paper>
      </Box>
    </Box>
  );
}
