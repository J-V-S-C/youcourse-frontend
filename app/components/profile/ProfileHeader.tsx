'use client';

import { Avatar, Box, Chip, Typography } from '@mui/material';
import { STATUS_COLORS, STATUS_LABELS } from '../../profile/utils';

interface ProfileHeaderProps {
  name: string | null | undefined;
  status: string | null | undefined;
  initials: string;
}

export default function ProfileHeader({ name, status, initials }: ProfileHeaderProps) {
  const statusKey = status ?? 'ACTIVE';

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)',
        py: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Avatar
        sx={{
          width: 80,
          height: 80,
          bgcolor: 'rgba(255,255,255,0.2)',
          color: '#fff',
          fontSize: '2rem',
          fontWeight: 800,
          border: '3px solid rgba(255,255,255,0.4)',
        }}
        aria-label={`Avatar de ${name ?? 'usuário'}`}
      >
        {initials}
      </Avatar>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800 }}>
          {name ?? 'Usuário'}
        </Typography>
        <Chip
          label={STATUS_LABELS[statusKey] ?? statusKey}
          color={STATUS_COLORS[statusKey] ?? 'default'}
          size="small"
          sx={{ mt: 1, fontWeight: 600 }}
        />
      </Box>
    </Box>
  );
}
