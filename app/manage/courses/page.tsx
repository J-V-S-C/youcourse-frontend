import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { Box, Container, Typography, Button, Card, CardContent, CardActions, Chip, Grid } from '@mui/material';
import { fetchCourses } from '@/lib/courses/course.service';
import Link from 'next/link';

export const metadata = {
  title: 'Gerenciar Cursos — YouCourse',
};

export default async function ManageCoursesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect('/login');
  }

  const courses = await fetchCourses();

  const userCourses = courses.filter((course) => course.creatorId === session.user.id)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'var(--background)' }}>
      <Navbar />

      <Box sx={{ flexGrow: 1, py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'var(--foreground)' }}>Gerenciar Cursos</Typography>
            <Link href="/manage/courses/new" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary">
                Adicionar Novo Curso
              </Button>
            </Link>
          </Box>

          <Grid container spacing={3}>
            {userCourses.map(course => (
              <Grid size={{ xs: 12, md: 4 }} key={course.id}>
                <Card sx={{ bgcolor: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{course.name}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 2 }}>
                      {course.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip label={course.sellable ? 'Pago' : 'Gratuito'} size="small" color='success' />
                      <Chip label={course.visible ? 'Visível' : 'Oculto'} size="small" variant="outlined" />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Link href={`/manage/courses/${course.id}`} style={{ textDecoration: 'none' }}>
                      <Button size="small">Editar</Button>
                    </Link>                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          {userCourses.length === 0 && (
            <Typography variant="body1" sx={{ color: 'var(--muted)' }}>Nenhum curso encontrado.</Typography>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
