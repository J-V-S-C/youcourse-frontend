'use client';

import { Box, Divider, Paper } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { UserProfileDTO } from '@/lib/user/types';
import ProfileHeader from './ProfileHeader';
import ProfileRow from './ProfileRow';
import ProfileActions from './ProfileActions';
import { formatDate, getInitials } from '@/app/utils/profile-utils';

interface ProfileCardProps {
  user: UserProfileDTO;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const initials = getInitials(user.name);

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid var(--border)',
        borderRadius: 4,
        bgcolor: 'var(--surface)',
        overflow: 'hidden',
      }}
    >
      <ProfileHeader name={user.name} status={user.status} initials={initials} />

      <Box sx={{ px: { xs: 3, sm: 4 } }}>
        <ProfileRow icon={<PersonIcon />} label="Nome" value={user.name ?? '—'} />
        <Divider sx={{ borderColor: 'var(--border)' }} />
        <ProfileRow icon={<EmailIcon />} label="E-mail" value={user.email ?? '—'} />
        <Divider sx={{ borderColor: 'var(--border)' }} />
        <ProfileRow
          icon={<AccessTimeIcon />}
          label="Último acesso"
          value={formatDate(user.lastLogin)}
        />
        <Divider sx={{ borderColor: 'var(--border)' }} />
        <ProfileRow
          icon={<AccessTimeIcon />}
          label="Membro desde"
          value={formatDate(user.createdAt)}
        />
      </Box>

      <ProfileActions />
    </Paper>
  );
}
