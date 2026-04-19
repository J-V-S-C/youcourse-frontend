import { get, post, patch, del, put } from '../http';
import {publicGet } from '../http-public'
import type { 
  CourseDTO, 
  FetchCoursesResponseDTO, 
  CreateCourseDto, 
  EditCourseDetailsDto,
  PublishCourseDto,
  UpdateCoursePriceDto,
  RateCourseDto,
  EditRatingDto
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function fetchCourses(): Promise<CourseDTO[]> {
  try {
    const params = new URLSearchParams({page: '1', limit: '20'})
    const response = await publicGet<FetchCoursesResponseDTO>(
      `${API_BASE_URL}/courses?${params}`,
    );
    return response.courses ?? [];
  } catch (error){
    console.error("ERRO:", error)
    return [];
  }
}


export async function createCourse(data: CreateCourseDto): Promise<void> {
  await post(`${API_BASE_URL}/courses`, data);
}

export async function editCourse(courseId: string, data: EditCourseDetailsDto): Promise<void> {
  await put(`${API_BASE_URL}/courses/${courseId}`, data);
}

export async function deleteCourse(courseId: string): Promise<void> {
  await del(`${API_BASE_URL}/courses/${courseId}`);
}

export async function rateCourse(courseId: string, data: RateCourseDto): Promise<void> {
  await post(`${API_BASE_URL}/courses/${courseId}/rating`, data);
}

export async function hideCourse(courseId: string): Promise<void> {
  await patch(`${API_BASE_URL}/courses/${courseId}/hide`, undefined);
}

export async function publishCourse(courseId: string, data: PublishCourseDto): Promise<void> {
  await patch(`${API_BASE_URL}/courses/${courseId}/publish`, data);
}

export async function unpublishCourse(courseId: string): Promise<void> {
  await patch(`${API_BASE_URL}/courses/${courseId}/unpublish`, undefined);
}

export async function updateCoursePrice(courseId: string, data: UpdateCoursePriceDto): Promise<void> {
  await patch(`${API_BASE_URL}/courses/${courseId}/price`, data);
}

export async function editRating(ratingId: string, data: EditRatingDto): Promise<void> {
  await put(`${API_BASE_URL}/ratings/${ratingId}`, data);
}
