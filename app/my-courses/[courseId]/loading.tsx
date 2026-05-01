import { Box, Container, CircularProgress } from '@mui/material';

export default function MyCourseLoading() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'var(--background)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, py: 20 }}>
        <CircularProgress sx={{ color: 'var(--primary)' }} />
      </Box>
    </Box>
  );
}
