export interface CoursePriceDTO {
  amount: number;
  currency: string;
}

export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';

export interface CourseDTO {
  id: string;
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
