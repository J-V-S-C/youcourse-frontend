'use client';

import { Box, Typography } from '@mui/material';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';

export default function CoursesEmptyState() {
  return (
    <Box
      sx={{
        gridColumn: '1 / -1',
        textAlign: 'center',
        py: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <SchoolOutlinedIcon sx={{ fontSize: 72, color: 'var(--border)' }} />
      <Typography variant="h6" sx={{ color: 'var(--muted)', fontWeight: 600 }}>
        Nenhum curso disponível ainda
      </Typography>
      <Typography variant="body2" sx={{ color: 'var(--muted)', maxWidth: 380 }}>
        Em breve novos cursos serão publicados. Você pode criar o seu próprio curso em Gerenciar Cursos!
      </Typography>
    </Box>
  );
}
