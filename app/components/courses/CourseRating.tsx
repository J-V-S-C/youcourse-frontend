'use client';

import { Box, Rating, Typography } from '@mui/material';

interface CourseRatingProps {
  averageRating: number | null;
  ratingsCount: number;
}

export default function CourseRating({ averageRating, ratingsCount }: CourseRatingProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 'auto' }}>
      <Rating
        value={averageRating ?? 0}
        precision={0.5}
        readOnly
        size="small"
        sx={{ color: 'var(--accent)' }}
      />
      <Typography variant="caption" sx={{ color: 'var(--muted)' }}>
        {averageRating
          ? `${averageRating.toFixed(1)} (${ratingsCount})`
          : 'Sem avaliações'}
      </Typography>
    </Box>
  );
}
