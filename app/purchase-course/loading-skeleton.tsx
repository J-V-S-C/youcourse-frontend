import {
  Box,
  Container,
  Paper,
  Typography,
  Skeleton,
  Stack,
} from '@mui/material';

export default function PurchaseCourseSkeleton() {
  return (
    <Container maxWidth="md">
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          border: '1px solid var(--border)',
          borderRadius: 4,
          bgcolor: 'var(--surface)',
        }}
      >
        <Stack spacing={3}>
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          <Skeleton variant="text" width="40%" height={32} />
          <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
        </Stack>
      </Paper>
    </Container>
  );
}
