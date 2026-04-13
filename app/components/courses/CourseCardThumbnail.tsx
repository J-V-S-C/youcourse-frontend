'use client';

import { Box, Tooltip, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

interface CourseCardThumbnailProps {
  initial: string;
  gradient: string;
  sellable: boolean;
}

export default function CourseCardThumbnail({
  initial,
  gradient,
  sellable,
}: CourseCardThumbnailProps) {
  return (
    <Box
      sx={{
        height: 160,
        background: gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <Typography
        sx={{
          color: 'rgba(255,255,255,0.9)',
          fontWeight: 800,
          fontSize: '2.5rem',
          userSelect: 'none',
        }}
      >
        {initial}
      </Typography>

      {!sellable && (
        <Tooltip title="Este curso não está à venda" placement="top">
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              bgcolor: 'rgba(0,0,0,0.45)',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LockIcon sx={{ color: '#fff', fontSize: 16 }} />
          </Box>
        </Tooltip>
      )}
    </Box>
  );
}
