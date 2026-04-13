import { Box, Card, CardContent, Skeleton } from '@mui/material';

export default function CourseCardSkeleton() {
  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid var(--border)',
        borderRadius: 3,
        bgcolor: 'var(--surface)',
        height: '100%',
      }}
    >
      <Skeleton variant="rectangular" height={160} sx={{ borderRadius: '12px 12px 0 0' }} />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2.5 }}>
        <Skeleton variant="text" width="80%" height={24} />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="65%" />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Skeleton variant="rectangular" width={90} height={20} sx={{ borderRadius: 1 }} />
          <Skeleton variant="text" width={60} />
        </Box>
        <Skeleton variant="rectangular" width={70} height={28} sx={{ borderRadius: 4, mt: 0.5 }} />
      </CardContent>
    </Card>
  );
}
