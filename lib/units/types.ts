import type { LessonDTO } from '../lessons/types';

export interface UnitDTO {
  id: string;
  name: string;
  description: string;
  position: number;
  courseId: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface UnitWithLessons extends UnitDTO {
  lessons: LessonDTO[];
}

export interface FetchUnitsResponseDTO {
  units: UnitDTO[];
}

export interface CreateUnitDto {
  name: string;
  description: string;
  position: number;
}

export interface EditUnitDetailsDto {
  name: string;
  description: string;
}

export interface ReorderUnitDto {
  position: number;
}
