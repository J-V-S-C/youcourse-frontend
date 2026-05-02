'use client'; // Adicione isso aqui

import {
  Box,
  Container,
  Stack,
  Avatar,
  Chip,
  Typography,
  Button,
} from '@mui/material';
import {
  MenuBookOutlined,
  Star as StarIcon,
  PlayCircleOutlined,
} from '@mui/icons-material';
import Link from 'next/link';
import { courseGradient, formatPrice } from '@/app/utils/course-utils';
import type { CourseDTO } from '@/lib/courses/types';

interface MyCourseHeaderProps {
  course: CourseDTO;
  totalLessons: number;
  firstLessonUrl: string | null;
  isOwner: boolean;
}

export default function MyCourseHeader({
  course,
  totalLessons,
  firstLessonUrl,
  isOwner,
}: MyCourseHeaderProps) {
  const gradient = courseGradient(course.id);

  return (
    <Box sx={{ background: gradient, py: { xs: 6, md: 8 }, position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.4)' }} />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          sx={{ alignItems: { xs: 'flex-start', md: 'center' } }}
        >
          <Avatar
            sx={{
              width: { xs: 80, md: 100 },
              height: { xs: 80, md: 100 },
              bgcolor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <MenuBookOutlined sx={{ fontSize: { xs: 40, md: 50 }, color: 'white' }} />
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label={isOwner ? 'Seu Curso' : 'Inscrito'}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
              />
              {course.averageRating && (
                <Chip
                  icon={<StarIcon sx={{ color: 'warning.main !important' }} />}
                  label={`${Number(course.averageRating).toFixed(1)} (${course.ratingsCount})`}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
                />
              )}
            </Stack>

            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', mb: 1, fontSize: { xs: '1.75rem', md: '3rem' } }}>
              {course.name}
            </Typography>

            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3, maxWidth: '800px' }}>
              {course.description}
            </Typography>

            <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <MenuBookOutlined sx={{ color: 'rgba(255,255,255,0.9)', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>Módulos</Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <PlayCircleOutlined sx={{ color: 'rgba(255,255,255,0.9)', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>{totalLessons} aulas</Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <MenuBookOutlined sx={{ color: 'rgba(255,255,255,0.9)', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>{formatPrice(course.price)}</Typography>
              </Stack>
            </Stack>
          </Box>

          {firstLessonUrl && (
            <Button
              component={Link}
              href={firstLessonUrl}
              variant="contained"
              size="large"
              startIcon={<PlayCircleOutlined />}
              sx={{
                bgcolor: 'var(--primary)',
                color: 'white',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                '&:hover': { bgcolor: 'color-mix(in srgb, var(--primary), black 15%) ' },
                alignSelf: { xs: 'flex-start', md: 'center' },
              }}
            >
              Começar aula
            </Button>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
