'use client';

import { Box, Typography } from '@mui/material';

interface ProfileRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export default function ProfileRow({ icon, label, value }: ProfileRowProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
      <Box sx={{ color: 'var(--muted)', flexShrink: 0 }}>{icon}</Box>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{ color: 'var(--muted)', display: 'block', fontWeight: 500 }}
        >
          {label}
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'var(--foreground)', fontWeight: 500, wordBreak: 'break-word' }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
