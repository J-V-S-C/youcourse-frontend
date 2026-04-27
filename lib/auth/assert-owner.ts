import { redirect } from 'next/navigation';
import type { CourseDTO } from '../courses/types';

export function assertCourseOwnership(course: CourseDTO, userId: string) {
  if (!course) {
    redirect('/manage/courses'); 
  }

  if (course.creatorId !== userId) {
    redirect('/manage');
  }
  
  return course;
}