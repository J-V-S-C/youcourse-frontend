import { Box, Container, Typography } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import CoursesGrid from './components/courses/CoursesGrid';
import { fetchCourses } from '@/lib/courses/course.service';

export const metadata = {
  title: 'YouCourse — Aprenda o que quiser',
  description: 'Portal de cursos online. Explore, aprenda e cresça com os melhores instrutores.',
};

export default async function HomePage() {
  const courses = await fetchCourses();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <HeroSection />

      {/* Catalog Section */}
      <Box
        id="catalogo"
        component="section"
        aria-label="Catálogo de cursos"
        sx={{ py: { xs: 8, md: 10 }, flexGrow: 1 }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 5 }}>
            <Typography
              component="h2"
              variant="h4"
              sx={{ fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.5px' }}
            >
              Catálogo de Cursos
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--muted)', mt: 1 }}>
              {courses.length > 0
                ? `${courses.length} curso${courses.length !== 1 ? 's' : ''} disponíve${courses.length !== 1 ? 'is' : 'l'}`
                : 'Explorando o catálogo...'}
            </Typography>
          </Box>

          <CoursesGrid courses={courses} />
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
