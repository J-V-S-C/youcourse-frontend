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
              course.sellable && course.price && course.price.amount > 0
                ? `/purchase-course?courseId=${course.id}`
                : `/my-courses/${course.id}`
            }
            variant="contained"
            size="large"
            sx={{
              py: 1.5, px: 4, fontSize: '1.1rem', backgroundColor: 'var(--primary)', color: 'white',
              '&:hover': { bgcolor: 'color-mix(in srgb, var(--primary), black 15%) ' },
            }}
          >
            {course.sellable && course.price && course.price.amount > 0
              ? `Comprar por ${formatPrice(course.price)}`
              : 'Começar a aprender agora'}
          </Button>
        )}
      </Container>
    </Box>
  );
}
