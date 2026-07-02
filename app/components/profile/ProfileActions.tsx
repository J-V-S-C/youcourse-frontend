'use client';

import { Box, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LogoutButton from '../auth/LogoutButton';
import { useState } from 'react';
import EditProfileModal from './EditProfileModal';
import type { UserProfileDTO } from '@/lib/user/types';

interface ProfileActionsProps {
  user: UserProfileDTO;
}

export default function ProfileActions({ user }: ProfileActionsProps) {
  const [editOpen, setEditOpen] = useState(false);

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
      <Button
        variant="outlined"
        startIcon={<EditIcon />}
        onClick={() => setEditOpen(true)}
        sx={{
          borderColor: 'var(--border)',
          color: 'var(--foreground)',
          '&:hover': { borderColor: 'var(--primary)', bgcolor: 'rgba(79,70,229,0.05)' },
        }}
      >
        Editar Perfil
      </Button>
      <LogoutButton />

      {editOpen && (
        <EditProfileModal
          user={user}
          open={editOpen}
          onClose={() => setEditOpen(false)}
        />
      )}
    </Box>
  );
}
