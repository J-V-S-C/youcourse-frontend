'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  IconButton,
  ListItemButton,
  useTheme,
  useMediaQuery
} from '@mui/material';

import {
  PlayCircleOutlined,
  Lock,
  Description,
  ArrowBack,
  Menu as MenuIcon
} from '@mui/icons-material';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import type { UnitDTO } from '@/lib/units/types';
import type { LessonDTO } from '@/lib/lessons/types';

const DRAWER_WIDTH = 320;
const NAVBAR_HEIGHT = 64;

export interface UnitWithLessons extends UnitDTO {
  lessons: LessonDTO[];
}

interface CoursePlayerClientProps {
  courseId: string;
  unitsWithLessons: UnitWithLessons[];
  currentLesson: LessonDTO;
  initialUnitId: string | null;
}

export default function CoursePlayerClient({
  courseId,
  unitsWithLessons,
  currentLesson,
  initialUnitId
}: CoursePlayerClientProps) {
  const router = useRouter();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(initialUnitId);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setSelectedUnitId(initialUnitId);
  }, [initialUnitId]);

  const selectedUnit = useMemo(() => {
    return unitsWithLessons.find((u) => u.id === selectedUnitId);
  }, [unitsWithLessons, selectedUnitId]);

  const handleLessonClick = (lesson: LessonDTO) => {
    const hasAccess = lesson.isPreview || !!lesson.video;

    if (!hasAccess || lesson.id === currentLesson.id) return;

    router.push(`/courses/${courseId}/lessons/${lesson.id}`);

    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>

      {/* HEADER */}
      <Box
        sx={{
          height: NAVBAR_HEIGHT,
          bgcolor: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

          {isMobile && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menu"
            >
              <MenuIcon />
            </IconButton>
          )}

          <IconButton
            onClick={() => router.push(`/courses/${courseId}`)}
            size="small"
            aria-label="Voltar para o curso"
          >
            <ArrowBack />
          </IconButton>

          <Typography
            variant="subtitle1"
            component={Link}
            href="/"
            sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}
          >
            YouCourse
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{ color: 'var(--muted)', display: { xs: 'none', sm: 'block' } }}
        >
          {currentLesson.name}
        </Typography>
      </Box>

      {/* CONTENT */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>

        {/* DRAWER */}
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? drawerOpen : true}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              bgcolor: 'var(--surface)',
              borderRight: '1px solid var(--border)',
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="unit-select-label">Módulo</InputLabel>
              <Select
                labelId="unit-select-label"
                value={selectedUnitId ?? ''}
                label="Módulo"
                onChange={(e) => setSelectedUnitId(e.target.value)}
              >
                {unitsWithLessons.map((unit) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Divider />

          <List sx={{ overflowY: 'auto' }}>
            {selectedUnit?.lessons.map((lesson) => {
              const isCurrent = lesson.id === currentLesson.id;
              const hasAccess = lesson.isPreview || !!lesson.video;

              return (
                <ListItemButton
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson)}
                  disabled={!hasAccess}
                  selected={isCurrent}
                  aria-current={isCurrent ? 'true' : undefined}
                  sx={{
                    alignItems: 'flex-start',
                    borderLeft: isCurrent ? '4px solid #3f51b5' : '4px solid transparent',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {hasAccess ? (
                      lesson.video ? <PlayCircleOutlined /> : <Description />
                    ) : (
                      <Lock fontSize="small" />
                    )}
                  </ListItemIcon>

                  <ListItemText
                    primary={lesson.name}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.875rem',
                        fontWeight: isCurrent ? 600 : 400,
                      }
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Drawer>

        {/* MAIN */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#000',
            overflow: 'hidden'
          }}
        >
          {/* VIDEO */}
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {currentLesson.video?.playbackUrl ? (
              <video
                key={currentLesson.video.playbackUrl}
                controls
                controlsList="nodownload"
                autoPlay
                preload="metadata"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              >
                <source
                  src={currentLesson.video.playbackUrl}
                  type="video/mp4"
                />
                Seu navegador não suporta vídeos.
              </video>
            ) : (
              <Box sx={{ textAlign: 'center', color: '#fff' }}>
                <Description sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                <Typography variant="h6">Aula em texto</Typography>
              </Box>
            )}
          </Box>

          {/* DESCRIPTION */}
          <Box
            sx={{
              p: 3,
              bgcolor: 'var(--surface)',
              borderTop: '1px solid var(--border)',
              maxHeight: { xs: '40%', md: '35%' },
              overflowY: 'auto'
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {currentLesson.name}
            </Typography>

            <Typography
              variant="body1"
              sx={{ mt: 2, color: 'var(--muted)', whiteSpace: 'pre-wrap' }}
            >
              {currentLesson.description}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
