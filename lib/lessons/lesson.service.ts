import { get, post, patch, del } from '../http';
import type {
  CreateLessonDto,
  EditLessonDetailsDto,
  AttachVideoDto,
  ReorderLessonDto,
  FetchLessonsResponseDTO,
  LessonDTO
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function fetchLessons(unitId: string): Promise<LessonDTO[]> {
  const response = await get<FetchLessonsResponseDTO>(
    `${API_BASE_URL}/units/${unitId}/lessons`,
  );
  return response.lessons ?? [];
}

export async function createLesson(unitId: string, data: CreateLessonDto): Promise<void> {
  await post(`${API_BASE_URL}/units/${unitId}/lessons`, data);
}

export async function editLesson(lessonId: string, data: EditLessonDetailsDto): Promise<void> {
  await patch(`${API_BASE_URL}/lessons/${lessonId}`, data);
}

export async function deleteLesson(lessonId: string): Promise<void> {
  await del(`${API_BASE_URL}/lessons/${lessonId}`);
}

export async function attachVideoToLesson(lessonId: string, data: AttachVideoDto): Promise<void> {
  await post(`${API_BASE_URL}/lessons/${lessonId}/video`, data);
}

export async function removeVideoFromLesson(lessonId: string): Promise<void> {
  await del(`${API_BASE_URL}/lessons/${lessonId}/video`);
}

export async function reorderLesson(lessonId: string, data: ReorderLessonDto): Promise<void> {
  await patch(`${API_BASE_URL}/lessons/${lessonId}/reorder`, data);
}
