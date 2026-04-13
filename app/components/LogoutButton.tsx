'use client';

import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <Button
      variant="outlined"
      fullWidth
      startIcon={<LogoutIcon />}
      onClick={() => signOut({ callbackUrl: '/' })}
      sx={{
        borderColor: 'var(--border)',
        color: 'var(--foreground)',
        fontWeight: 600,
        py: 1.25,
        borderRadius: 2,
        '&:hover': { borderColor: 'var(--primary)', color: 'var(--primary)' },
      }}
    >
      Sair da conta
    </Button>
  );
}
