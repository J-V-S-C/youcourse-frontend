import { fetchUnits } from '@/lib/units/unit.service';
import { fetchLessons } from '@/lib/lessons/lesson.service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import CoursePlayerClient from '@/app/components/courses/CoursePlayerClient';

export default async function LessonPlayerPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = await params;
  const token = await getServerSession(authOptions).then((session) => session?.accessToken) || "";

  const units = await fetchUnits(courseId).catch(() => []);
  const unitsWithLessons = await Promise.all(
    units.map(async (u) => {
      const lessons = await fetchLessons(u.id).catch(() => []);
      return { ...u, lessons: lessons.sort((a, b) => a.position - b.position) };
    })
  );

  unitsWithLessons.sort((a, b) => a.position - b.position);

  let currentLesson = null;
  let currentUnitId = null;

  for (const unit of unitsWithLessons) {
    const found = unit.lessons.find((l) => l.id === lessonId);
    if (found) {
      currentLesson = found;
      currentUnitId = unit.id;
      break;
    }
  }

  if (!currentLesson || !currentLesson.video?.playbackUrl) {
    redirect(`/courses/${courseId}`);
  }

  const isClickable = currentLesson.isPreview && currentLesson.video?.playbackUrl;

  return (
    <CoursePlayerClient
      courseId={courseId}
      unitsWithLessons={unitsWithLessons}
      currentLesson={currentLesson}
      initialUnitId={currentUnitId}
    />
  );
}