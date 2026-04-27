import { get, post, patch, del } from '../http';
import type {
  CreateLessonDto,
  EditLessonDetailsDto,
  AttachVideoDto,
  ReorderLessonDto,
  FetchLessonsResponseDTO,
  LessonDTO,
  AttachVideoResponse
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function fetchLessons(unitId: string): Promise<LessonDTO[]> {
  const response = await get<FetchLessonsResponseDTO>(
    `${API_BASE_URL}/units/${unitId}/lessons`,
  );
  return response.lessons ?? [];
}

export async function createLesson(unitId: string, data: CreateLessonDto): Promise<LessonDTO> {
  return await post(`${API_BASE_URL}/units/${unitId}/lessons`, data);
}

export async function editLesson(lessonId: string, data: EditLessonDetailsDto): Promise<void> {
  await patch(`${API_BASE_URL}/lessons/${lessonId}`, data);
}

export async function deleteLesson(lessonId: string): Promise<void> {
  await del(`${API_BASE_URL}/lessons/${lessonId}`);
}

export async function attachVideoToLesson(
  lessonId: string,
  data: { filename: string; contentType: string }
): Promise<AttachVideoResponse> {
  return await post<AttachVideoResponse>(
    `${API_BASE_URL}/lessons/${lessonId}/video`,
    data
  );
}

export async function uploadFileToS3(uploadUrl: string, file: File): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });
  if (!res.ok) throw new Error(`S3 upload failed: ${res.status}`);
}

export async function removeVideoFromLesson(lessonId: string): Promise<void> {
  await del(`${API_BASE_URL}/lessons/${lessonId}/video`);
}

export async function reorderLesson(lessonId: string, data: ReorderLessonDto): Promise<void> {
  await patch(`${API_BASE_URL}/lessons/${lessonId}/reorder`, data);
}
