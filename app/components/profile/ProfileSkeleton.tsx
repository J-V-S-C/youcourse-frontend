'use client';

import { Box, Paper, Skeleton } from '@mui/material';

export default function ProfileSkeleton() {
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
      {/* Header skeleton */}
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
        <Skeleton variant="circular" width={80} height={80} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
        <Skeleton variant="text" width={160} height={28} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
        <Skeleton variant="rounded" width={70} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 8 }} />
      </Box>

      {/* Row skeletons */}
      <Box sx={{ px: { xs: 3, sm: 4 } }}>
        {[1, 2, 3, 4].map((i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="30%" height={16} />
              <Skeleton variant="text" width="60%" height={22} />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Actions skeleton */}
      <Box sx={{ px: { xs: 3, sm: 4 }, py: 3 }}>
        <Skeleton variant="rounded" height={48} sx={{ borderRadius: 2 }} />
      </Box>
    </Paper>
  );
}
