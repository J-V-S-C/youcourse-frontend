import { get } from '../http';
import type { CourseDTO, FetchCoursesResponseDTO } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function fetchCourses(): Promise<CourseDTO[]> {
  try {
    const response = await get<FetchCoursesResponseDTO>(
      `${API_BASE_URL}/courses`,
    );
    return response.courses ?? [];
  } catch {
    return [];
  }
}
