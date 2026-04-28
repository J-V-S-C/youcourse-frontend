'use client';

import { Chip } from '@mui/material';

interface CoursePriceBadgeProps {
  label: string;
  isFree: boolean;
}


export default function CoursePriceBadge({ label, isFree }: CoursePriceBadgeProps) {
  return (
    <Chip

      label={label}
      size="small"
      sx={{
        fontWeight: 700,
        fontSize: '0.8rem',
        bgcolor: isFree ? 'var(--secondary)' : 'var(--primary)',
        color: '#fff',
        px: 0.5,
      }}
    />
  );
}
