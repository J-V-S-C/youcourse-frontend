'use client';

import { Card, CardActionArea, CardContent, Box, Typography } from '@mui/material';
import Link from 'next/link';
import type { CourseDTO } from '@/lib/courses/types';
import CourseCardThumbnail from './CourseCardThumbnail';
import CourseRating from './CourseRating';
import CoursePriceBadge from './CoursePriceBadge';
import { courseGradient, formatPrice } from '@/app/utils/course-utils';

interface CourseCardProps {
  course: CourseDTO;
}

export default function CourseCard({ course }: CourseCardProps) {
  const priceLabel = formatPrice(course.price);
  const isFree = priceLabel === 'Grátis';
  const gradient = courseGradient(course.id);

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid var(--border)',
        borderRadius: 3,
        bgcolor: 'var(--surface)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
        },
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <CardActionArea
        component={Link}
        href={`/courses/${course.id}`}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <CourseCardThumbnail
          initial={course.name.charAt(0).toUpperCase()}
          gradient={gradient}
          sellable={course.sellable}
        />

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1, p: 2.5 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: 'var(--foreground)',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
            }}
          >
            {course.name}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'var(--muted)',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
              flexGrow: 1,
            }}
          >
            {course.description}
          </Typography>

          <CourseRating
            averageRating={course.averageRating}
            ratingsCount={course.ratingsCount}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <CoursePriceBadge label={priceLabel} isFree={isFree} />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
