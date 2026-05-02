import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { Box, Container, Typography, Button, Card, CardContent, CardActions, Chip, Grid } from '@mui/material';
import { fetchCreatorCourses } from '@/lib/courses/course.service';
import Link from 'next/link';
import ManageCourseCard from '@/app/components/manage/courses/ManageCourseCard';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Gerenciar Cursos — YouCourse',
};

export default async function ManageCoursesPage() {


  const courses = await fetchCreatorCourses();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'var(--background)' }}>
      <Navbar />

      <Box sx={{ flexGrow: 1, py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'var(--foreground)' }}>
              Gerenciar Cursos
            </Typography>
            <Link href="/manage/courses/new" style={{ textDecoration: 'none' }}>
              <Button variant="contained" sx={{ backgroundColor: "var(--primary)" }}>
                Adicionar Novo Curso
              </Button>
            </Link>
          </Box>

          <Grid container spacing={3}>
            {courses.map(course => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id} >
                <ManageCourseCard course={course} />
              </Grid>
            ))}
          </Grid>

          {courses.length === 0 && (
            <Typography variant="body1" sx={{ color: 'var(--muted)' }}>
              Nenhum curso encontrado.
            </Typography>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
