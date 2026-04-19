import { fetchCourses } from '@/lib/courses/course.service';
import { fetchUnits } from '@/lib/units/unit.service';
import { fetchLessons } from '@/lib/lessons/lesson.service';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon, ListItemText, Divider, Button } from '@mui/material';
import { ExpandMore, PlayCircleOutlined as PlayCircleOutline, Lock } from '@mui/icons-material';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function PublicCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const token = await getServerSession(authOptions).then((session) => session?.accessToken) || "";

  const courses = await fetchCourses();
  const course = courses.find(c => c.id === courseId) || null;

  if (!course || !course.visible) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'var(--background)' }}>
        <Navbar />
        <Container sx={{ py: 10, textAlign: 'center', flexGrow: 1 }}>
          <Typography variant="h4" color="var(--foreground)">Curso não encontrado ou indisponível.</Typography>
        </Container>
        <Footer />
      </Box>
    );
  }

  const units = await fetchUnits(courseId).catch(() => []);

  const unitsWithLessons = await Promise.all(
    units.map(async (u) => {
      const lessons = await fetchLessons(u.id).catch(() => []);
      return { ...u, lessons };
    })
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'var(--background)' }}>
      <Navbar />

      <Box sx={{ background: 'var(--surface)', py: 8, borderBottom: '1px solid var(--border)' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'var(--foreground)', mb: 2 }}>
            {course.name}
          </Typography>
          <Typography variant="h6" sx={{ color: 'var(--muted)', mb: 4, maxWidth: '800px' }}>
            {course.description}
          </Typography>
          <Button variant="contained" size="large" sx={{ py: 1.5, px: 4, fontSize: '1.1rem' }}>
            {course.sellable && course.price ? `Comprar por ${course.price.currency} ${(course.price.amount / 100).toFixed(2)}` : 'Comece a aprender agora (Grátis)'}
          </Button>
        </Container>
      </Box>

      <Box sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'var(--foreground)', mb: 4 }}>
            Conteúdo do Curso
          </Typography>

          {unitsWithLessons.length === 0 ? (
            <Typography sx={{ color: 'var(--muted)' }}>Este curso ainda não possui módulos divulgados.</Typography>
          ) : (
            unitsWithLessons.sort((a, b) => a.position - b.position).map((unit) => (
              <Accordion key={unit.id} sx={{ mb: 1, bgcolor: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
                <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'var(--muted)' }} />}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{unit.name}</Typography>
                    <Typography variant="body2" sx={{ color: 'var(--muted)' }}>
                      {unit.lessons.length} aulas
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  <Divider sx={{ borderColor: 'var(--border)' }} />
                  <List disablePadding>
                    {unit.lessons.sort((a, b) => a.position - b.position).map((lesson, idx) => {
                      const isClickable = lesson.isPreview && lesson.video?.playbackUrl;

                      return (
                        <ListItem
                          key={lesson.id}
                          divider={idx !== unit.lessons.length - 1}
                          component={isClickable ? 'a' : 'li'}
                          href={isClickable ? `/courses/${courseId}/lessons/${lesson.id}` : undefined}
                          sx={{
                            px: 3,
                            py: 2,
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'background-color 0.2s',
                            cursor: isClickable ? 'pointer' : 'default',
                            '&:hover': isClickable ? {
                              backgroundColor: 'var(--hover-bg, rgba(0, 0, 0, 0.04))'
                            } : {}
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40, color: lesson.isPreview ? 'primary.main' : 'var(--muted)' }}>
                            {lesson.isPreview ? <PlayCircleOutline /> : <Lock />}
                          </ListItemIcon>
                          <ListItemText
                            primary={lesson.name}
                            secondary={lesson.isPreview ? 'Preview Gratuito' : undefined}
                            sx={{ '& .MuiListItemText-secondary': { color: 'primary.main', fontWeight: 500 } }}
                          />
                        </ListItem>
                      );
                    })}
                    {unit.lessons.length === 0 && (
                      <ListItem sx={{ px: 3, py: 2 }}>
                        <ListItemText primary="Nenhuma aula divulgada." sx={{ color: 'var(--muted)' }} />
                      </ListItem>
                    )}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}