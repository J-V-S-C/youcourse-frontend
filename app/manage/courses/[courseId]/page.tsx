import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { Box, Typography } from '@mui/material';
import { getManagedCourseById } from '@/lib/courses/course.service';
import CourseManagerClient from '@/app/components/manage/courses/CourseManagerClient';
import { assertCourseOwnership } from '@/lib/auth/assert-owner';

export default async function ManageCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect('/login');
  }

  const { courseId } = await params;
  const course = await getManagedCourseById(courseId);

  if (!course) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'var(--background)' }}>
        <Navbar />
        <Box sx={{ flexGrow: 1, py: 6, textAlign: 'center' }}>
          <Typography variant="h4" color="var(--foreground)">Curso não encontrado.</Typography>
        </Box>
        <Footer />
      </Box>
    );
  }

  assertCourseOwnership(course, session.user.id)


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'var(--background)' }}>
      <Navbar />

      <Box sx={{ flexGrow: 1, py: 6 }}>
        <CourseManagerClient course={course} />
      </Box>

      <Footer />
    </Box>
  );
}
