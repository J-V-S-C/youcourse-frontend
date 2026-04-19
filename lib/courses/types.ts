export interface CoursePriceDTO {
  amount: number;
  currency: string;
}

export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';

export interface CourseDTO {
  id: string;
  creatorId: string
  name: string;
  description: string;
  price: CoursePriceDTO | null;
  sellable: boolean;
  visible: boolean;
  status: CourseStatus;
  averageRating: number | null;
  ratingsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FetchCoursesResponseDTO {
  courses: CourseDTO[];
}

export interface GetCourseByIdDTO {
  course: CourseDTO;
}

export interface CreateCourseDto {
  name: string;
  description: string;
  price?: CoursePriceDTO;
  sellable: boolean;
  visible: boolean;
}

export interface EditCourseDetailsDto {
  name: string;
  description: string;
}

export interface PublishCourseDto {
  price?: CoursePriceDTO;
}

export interface UpdateCoursePriceDto {
  price: CoursePriceDTO;
}

export interface RateCourseDto {
  stars: number;
  commentary: string;
}

export interface EditRatingDto {
  stars: number;
  commentary: string;
}
