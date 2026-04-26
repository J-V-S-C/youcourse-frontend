import { Box, Skeleton } from '@mui/material';

export default function LoginSkeleton() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <Skeleton variant="text" width="60%" height={32} sx={{ mx: 'auto' }} />
        <Skeleton
          variant="text"
          width="80%"
          height={20}
          sx={{ mx: 'auto', mt: 0.5 }}
        />
      </Box>

      <Skeleton
        variant="rounded"
        width="100%"
        height={56}
        sx={{ borderRadius: 2 }}
      />
      <Skeleton
        variant="rounded"
        width="100%"
        height={56}
        sx={{ borderRadius: 2 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
        <Skeleton variant="text" width={120} />
      </Box>

      <Skeleton
        variant="rounded"
        width="100%"
        height={48}
        sx={{ borderRadius: 2, mt: 0.5 }}
      />

      <Skeleton variant="text" width="50%" sx={{ mx: 'auto' }} />
    </Box>
  );
}
