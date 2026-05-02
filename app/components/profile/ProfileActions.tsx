'use client';

import { Box } from '@mui/material';
import LogoutButton from '../auth/LogoutButton';

export default function ProfileActions() {
  return (
    <Box
      sx={{
        px: { xs: 3, sm: 4 },
        py: 3,
        display: 'flex',
        gap: 2,
        flexDirection: { xs: 'column', sm: 'row' },
      }}
    >
      <LogoutButton />
    </Box>
  );
}
