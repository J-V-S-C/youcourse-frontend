export interface VideoDTO {
  externalId: string;
  playbackUrl: string;
  status: 'UPLOADING' | 'PROCESSING' | 'READY' | 'FAILED';
  formattedDuration?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface LessonDTO {
  id: string;
  name: string;
  description: string;
  position: number;
  isPreview: boolean;
  video?: VideoDTO | null; // Substitui o antigo videoUrl
  hasVideo: boolean;
  isVideoReady: boolean;
  isVideoProcessing: boolean;
  isVideoFailed: boolean;
  unitId: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateLessonDto {
  name: string;
  description: string;
  position: number;
  isPreview: boolean;
}

export interface EditLessonDetailsDto {
  name: string;
  description: string;
  isPreview: boolean;
}

export interface AttachVideoDto {
  filename: string;
  contentType: string;
}

export interface ReorderLessonDto {
  position: number;
}

export interface FetchLessonsResponseDTO {
  lessons: LessonDTO[];
}

export interface AttachVideoResponse {
  lessonId: string;
  video: {
    externalId: string;
    uploadUrl: string;    // PUT here
    playbackUrl: string;  // CloudFront stable URL
  };
}