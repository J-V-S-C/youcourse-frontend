import { fetchUnits } from '@/lib/units/unit.service';
import { fetchLessons } from '@/lib/lessons/lesson.service';
import { getPublicCourseById } from '@/lib/courses/course.service';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import MyCourseHeader from '@/app/components/courses/MyCourseHeader';
import MyCourseContent from '@/app/components/courses/MyCourseContent';
import type { UnitWithLessons } from '@/lib/units/types';
import { Box, Container, Typography } from '@mui/material';

export default async function MyCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const course = await getPublicCourseById(courseId);
  if (!course || !course.visible) {
    redirect('/courses');
  }

  const units = await fetchUnits(courseId).catch(() => []);
  const unitsWithLessons: UnitWithLessons[] = await Promise.all(
    units.map(async (u) => {
      const lessons = await fetchLessons(u.id).catch(() => []);
      return { ...u, lessons };
    }),
  );

  const totalLessons = unitsWithLessons.reduce((acc, u) => acc + u.lessons.length, 0);

  let firstLessonUrl: string | null = null;
  if (unitsWithLessons.length > 0) {
    const sortedUnits = [...unitsWithLessons].sort((a, b) => a.position - b.position);
    const firstUnit = sortedUnits[0];
    if (firstUnit.lessons && firstUnit.lessons.length > 0) {
      const sortedLessons = [...firstUnit.lessons].sort((a, b) => a.position - b.position);
      firstLessonUrl = `/courses/${courseId}/lessons/${sortedLessons[0].id}`;
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'var(--background)' }}>
      <Navbar />

      <MyCourseHeader
        course={course}
        totalLessons={totalLessons}
        firstLessonUrl={firstLessonUrl}
        isOwner={session.user.id === course.creatorId}
      />

      <Box sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'var(--foreground)', mb: 4 }}>
            Conteúdo do Curso
          </Typography>
          <MyCourseContent courseId={courseId} unitsWithLessons={unitsWithLessons} />
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}