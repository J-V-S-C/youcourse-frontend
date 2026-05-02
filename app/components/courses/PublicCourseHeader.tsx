'use client';

import {
  Box,
  Container,
  Button,
  Typography,
} from '@mui/material';
import { courseGradient, formatPrice } from '@/app/utils/course-utils';
import type { CourseDTO } from '@/lib/courses/types';

interface PublicCourseHeaderProps {
  course: CourseDTO;
  isOwner: boolean;
}

export default function PublicCourseHeader({ course, isOwner }: PublicCourseHeaderProps) {
  const gradient = courseGradient(course.id);

  const isPaid = !!(course.price && course.price.amount > 0);
  const isAvailableForPurchase = course.sellable && isPaid;
  const isComingSoon = !course.sellable && isPaid;

  return (
    <Box sx={{ background: gradient, py: { xs: 6, md: 8 }, borderBottom: '1px solid var(--border)' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', mb: 2 }}>
          {course.name}
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, maxWidth: '800px' }}>
          {course.description}
        </Typography>

        {isOwner ? (
          <Button
            href={`/my-courses/${course.id}`}
            variant="contained"
            size="large"
            sx={{
              py: 1.5, px: 4, fontSize: '1.1rem', backgroundColor: 'var(--primary)', color: 'white',
              '&:hover': { bgcolor: 'color-mix(in srgb, var(--primary), black 15%) ' },
            }}
          >
            Acessar meu curso
          </Button>
        ) : (
          <Button
            href={
              isAvailableForPurchase
                ? `/purchase-course?courseId=${course.id}`
                : isComingSoon
                  ? undefined
                  : `/my-courses/${course.id}`
            }
            variant="contained"
            size="large"
            disabled={isComingSoon}
            sx={{
              py: 1.5, px: 4, fontSize: '1.1rem',
              backgroundColor: isComingSoon ? 'rgba(255, 255, 255, 0.2)' : 'var(--primary)',
              color: 'white',
              cursor: isComingSoon ? 'default' : 'pointer',
              '&:hover': {
                bgcolor: isComingSoon ? 'rgba(255, 255, 255, 0.2)' : 'color-mix(in srgb, var(--primary), black 15%)'
              },
              '&.Mui-disabled': {
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                opacity: 1 // Mantém o botão bem visível mesmo desativado
              }
            }}
          >
            {isAvailableForPurchase && `Comprar por ${formatPrice(course.price!)}`}
            {isComingSoon && 'Disponível em breve para venda'}
            {!isPaid && 'Começar a aprender agora'}
          </Button>
        )}
      </Container>
    </Box>
  );
}
