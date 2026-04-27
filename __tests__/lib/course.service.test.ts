import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as courseService from '@/lib/courses/course.service';
import * as http from '@/lib/http';

vi.mock('@/lib/http', () => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  put: vi.fn(),
  del: vi.fn()
}));

describe('Course Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchCourses should return courses list on successful get', async () => {
    vi.mocked(http.get).mockResolvedValue({ courses: [{ id: '1', name: 'Test Course' }] });
    const res = await courseService.fetchCourses();
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe('1');
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('fetchCourses should return empty array on fetch failure', async () => {
    vi.mocked(http.get).mockRejectedValue(new Error('Network error'));
    const res = await courseService.fetchCourses();
    expect(res).toEqual([]); 
  });

  it('createCourse should trigger a post request with Authorization header', async () => {
    vi.mocked(http.post).mockResolvedValue(undefined as any);
    await courseService.createCourse({ name: 'T', description: 'T', visible: true, sellable: false }, 'token123');
    expect(http.post).toHaveBeenCalledWith(
      expect.stringContaining('/courses'),
      { name: 'T', description: 'T', visible: true, sellable: false },
      { Authorization: 'Bearer token123' }
    );
  });
});
