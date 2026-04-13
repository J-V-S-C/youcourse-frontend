'use client';

import { Grid } from '@mui/material';
import CourseCard from './CourseCard';
import CourseCardSkeleton from './CourseCardSkeleton';
import CoursesEmptyState from './CoursesEmptyState';
import type { CourseDTO } from '@/lib/courses/types';

interface CoursesGridProps {
  courses: CourseDTO[];
  loading?: boolean;
}

const SKELETON_COUNT = 8;

export default function CoursesGrid({ courses, loading = false }: CoursesGridProps) {
  if (loading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <CourseCardSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (courses.length === 0) {
    return <CoursesEmptyState />;
  }

  return (
    <Grid container spacing={3}>
      {courses.map((course) => (
        <Grid key={course.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <CourseCard course={course} />
        </Grid>
      ))}
    </Grid>
  );
}
