'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText,
  Typography, Select, MenuItem, FormControl, InputLabel, Divider, IconButton
} from '@mui/material';
import { PlayCircleOutlined, Lock, Description, ArrowBack } from '@mui/icons-material';
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
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(initialUnitId);

  useEffect(() => {
    setSelectedUnitId(initialUnitId);
  }, [initialUnitId]);

  const selectedUnit = useMemo(() => {
    return unitsWithLessons.find((u) => u.id === selectedUnitId);
  }, [unitsWithLessons, selectedUnitId]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      <Box sx={{
        height: NAVBAR_HEIGHT,
        bgcolor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        px: 2,
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => router.push(`/courses/${courseId}`)} size="small" aria-label="Voltar para o curso">
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
        <Typography variant="body2" sx={{ color: 'var(--muted)', display: { xs: 'none', sm: 'block' } }}>
          {currentLesson.name}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              position: 'relative',
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
                <ListItem
                  key={lesson.id}
                  onClick={() => {
                    if (hasAccess && !isCurrent) {
                      router.push(`/courses/${courseId}/lessons/${lesson.id}`);
                    }
                  }}
                  sx={{
                    cursor: hasAccess ? 'pointer' : 'not-allowed',
                    bgcolor: isCurrent ? 'rgba(63, 81, 181, 0.08)' : 'transparent',
                    borderLeft: isCurrent ? '4px solid #3f51b5' : '4px solid transparent',
                    opacity: hasAccess ? 1 : 0.5,
                    transition: 'background-color 0.2s',
                    '&:hover': hasAccess ? { bgcolor: 'rgba(0, 0, 0, 0.04)' } : {},
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: isCurrent ? 'primary.main' : 'inherit' }}>
                    {hasAccess ? (lesson.video ? <PlayCircleOutlined /> : <Description />) : <Lock fontSize="small" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={lesson.name}
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: isCurrent ? 'primary.main' : 'var(--foreground)',
                        fontWeight: isCurrent ? 600 : 400,
                        fontSize: '0.875rem'
                      }
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: '#000', overflow: 'hidden' }}>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {currentLesson.video?.playbackUrl ? (
              <video
                key={currentLesson.video.playbackUrl}
                controls
                controlsList="nodownload"
                autoPlay
                preload="auto"
                crossOrigin="anonymous"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              >
                <source src={currentLesson.video.playbackUrl} />
                Seu navegador não suporta vídeos.
              </video>
            ) : (
              <Box sx={{ textAlign: 'center', color: '#fff' }}>
                <Description sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                <Typography variant="h6">Aula em texto</Typography>
                <Typography variant="caption">Leia o conteúdo abaixo</Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ p: 4, bgcolor: 'var(--surface)', borderTop: '1px solid var(--border)', maxHeight: '35%', overflowY: 'auto' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{currentLesson.name}</Typography>
            <Typography variant="body1" sx={{ mt: 2, color: 'var(--muted)', whiteSpace: 'pre-wrap' }}>
              {currentLesson.description}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}