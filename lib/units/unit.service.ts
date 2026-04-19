import { get, post, patch, del } from '../http';
import type {
  UnitDTO,
  FetchUnitsResponseDTO,
  CreateUnitDto,
  EditUnitDetailsDto,
  ReorderUnitDto
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function fetchUnits(courseId: string): Promise<UnitDTO[]> {
  const response = await get<FetchUnitsResponseDTO>(
    `${API_BASE_URL}/courses/${courseId}/units`,
  );
  return response.units ?? [];
}

export async function createUnit(courseId: string, data: CreateUnitDto): Promise<void> {
  await post(`${API_BASE_URL}/courses/${courseId}/units`, data);
}

export async function editUnit(unitId: string, data: EditUnitDetailsDto): Promise<void> {
  await patch(`${API_BASE_URL}/units/${unitId}`, data)
}

export async function deleteUnit(unitId: string, token: string): Promise<void> {
  await del(`${API_BASE_URL}/units/${unitId}`);
}

export async function reorderUnit(unitId: string, data: ReorderUnitDto): Promise<void> {
  await patch(`${API_BASE_URL}/units/${unitId}/reorder`, data);
}
