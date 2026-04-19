import { render, screen, waitFor } from '@testing-library/react';
import LessonsTab from '@/app/components/manage/courses/LessonsTab';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSession } from 'next-auth/react';
import * as unitService from '@/lib/units/unit.service';
import * as lessonService from '@/lib/lessons/lesson.service';

vi.mock('next-auth/react', () => ({
  useSession: vi.fn()
}));

vi.mock('@/lib/units/unit.service', () => ({
  fetchUnits: vi.fn()
}));

vi.mock('@/lib/lessons/lesson.service', () => ({
  fetchLessons: vi.fn(),
  createLesson: vi.fn(),
  deleteLesson: vi.fn()
}));

describe('LessonsTab Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSession).mockReturnValue({
      data: { accessToken: 'valid_token' } as any,
      status: 'authenticated'
    });
  });

  it('renders correctly and loads units into select', async () => {
    vi.mocked(unitService.fetchUnits).mockResolvedValue([
      { id: 'u1', name: 'First Module', description: '', position: 0, courseId: 'c1', createdAt: '', updatedAt: '' }
    ]);
    vi.mocked(lessonService.fetchLessons).mockResolvedValue([
      { id: 'l1', name: 'Introduction', description: '', position: 0, isPreview: true, unitId: 'u1', createdAt: '', updatedAt: '' }
    ]);

    render(<LessonsTab courseId="c1" />);
    
    // Wait for modules string
    await waitFor(() => {
      expect(screen.getByText('Aulas')).toBeInTheDocument();
    });

    // Check if the mock unit is implicitly fetching lessons for the first one
    await waitFor(() => {
      expect(lessonService.fetchLessons).toHaveBeenCalledWith('u1', 'valid_token');
    });

    expect(screen.getByText('Introduction')).toBeInTheDocument();
    expect(screen.getByText('(Preview)')).toBeInTheDocument();
  });

  it('handles empty states gracefully when no units exist (edge case)', async () => {
    vi.mocked(unitService.fetchUnits).mockResolvedValue([]);
    render(<LessonsTab courseId="c1" />);
    await waitFor(() => {
      expect(screen.getByText('Selecione um módulo para gerenciar suas aulas.')).toBeInTheDocument();
    });
  });

  it('shows unauthenticated or missing token states (edge case)', async () => {
    // If not authenticated, services shouldn't be called, or gracefully error checking
    vi.mocked(useSession).mockReturnValue({ data: null, status: 'unauthenticated' } as any);
    render(<LessonsTab courseId="c1" />);
    expect(unitService.fetchUnits).not.toHaveBeenCalled();
  });
});
