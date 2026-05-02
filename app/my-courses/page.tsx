import { fetchCourses } from '@/lib/courses/course.service';
import { Box, Container, Typography, Stack } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import CoursesGrid from '@/app/components/courses/CoursesGrid';
import CoursesFilter from '@/app/components/courses/CoursesFilter';
import { filterAndSortCourses } from '@/app/utils/course-utils'; // Assumindo que moveu para utils

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const { q, sort } = await searchParams;
  const courses = await fetchCourses(); // fetchOwnedCourses
  const sorted = filterAndSortCourses(courses, q, sort);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'var(--background)' }}>
      <Navbar />

      <Box sx={{ background: 'var(--surface)', py: { xs: 6, md: 8 }, borderBottom: '1px solid var(--border)' }}>
        <Container maxWidth="lg">
          <Stack direction="row" spacing={2} sx={{ mb: 4, alignItems: 'center' }}>
            <SchoolIcon sx={{ fontSize: 40, color: 'var(--primary)' }} />
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'var(--foreground)', fontSize: { xs: '1.75rem', md: '3rem' } }}>
                Catálogo de Cursos
              </Typography>
              <Typography variant="body1" sx={{ color: 'var(--muted)', mt: 0.5 }}>
                Explore todos os cursos disponíveis e comece a aprender hoje mesmo
              </Typography>
            </Box>
          </Stack>

          <CoursesFilter initialQ={q} initialSort={sort} />
        </Container>
      </Box>

      <Box sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ color: 'var(--muted)', mb: 4 }}>
            {sorted.length} curso{sorted.length !== 1 ? 's' : ''} encontrado{sorted.length !== 1 ? 's' : ''}
          </Typography>
          <CoursesGrid courses={sorted} />
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
