'use client';

import { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Select, MenuItem, FormControl, InputLabel, Divider } from '@mui/material';
import { PlayCircleOutlined as PlayCircleOutline, Lock } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const DRAWER_WIDTH = 320;

export default function CoursePlayerClient({ courseId, unitsWithLessons, currentLesson, initialUnitId }: any) {
  const router = useRouter();
  const [selectedUnitId, setSelectedUnitId] = useState(initialUnitId);

  const selectedUnit = unitsWithLessons.find((u: any) => u.id === selectedUnitId);

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'var(--background)' }}>
      <Drawer
        variant="permanent"
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
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'var(--foreground)' }}>
            Conteúdo
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel id="unit-select-label">Módulo</InputLabel>
            <Select
              labelId="unit-select-label"
              value={selectedUnitId}
              label="Módulo"
              onChange={(e) => setSelectedUnitId(e.target.value)}
            >
              {unitsWithLessons.map((unit: any) => (
                <MenuItem key={unit.id} value={unit.id}>
                  {unit.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Divider sx={{ borderColor: 'var(--border)' }} />
        <List sx={{ overflowY: 'auto', flexGrow: 1 }}>
          {selectedUnit?.lessons.map((lesson: any) => {
            const isClickable = lesson.isPreview || lesson.video?.playbackUrl;
            const isCurrent = lesson.id === currentLesson.id;

            return (
              <ListItem
                key={lesson.id}
                component={isClickable ? 'div' : 'li'}
                onClick={() => {
                  if (isClickable && !isCurrent) {
                    router.push(`/courses/${courseId}/lessons/${lesson.id}`);
                  }
                }}
                sx={{
                  cursor: isClickable ? 'pointer' : 'default',
                  bgcolor: isCurrent ? 'var(--hover-bg, rgba(0, 0, 0, 0.08))' : 'transparent',
                  borderLeft: isCurrent ? '4px solid primary.main' : '4px solid transparent',
                  '&:hover': isClickable && !isCurrent ? { bgcolor: 'var(--hover-bg, rgba(0, 0, 0, 0.04))' } : {},
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: isCurrent ? 'primary.main' : (lesson.isPreview ? 'primary.light' : 'var(--muted)') }}>
                  {lesson.isPreview || lesson.video ? <PlayCircleOutline /> : <Lock />}
                </ListItemIcon>
                <ListItemText
                  primary={lesson.name}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: isCurrent ? 'primary.main' : 'var(--foreground)',
                      fontWeight: isCurrent ? 'bold' : 'normal',
                      fontSize: '0.9rem'
                    }
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ width: '100%', bgcolor: '#000', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <video
            controls
            src={currentLesson.video.playbackUrl}
            style={{ width: '100%', maxHeight: '80vh', outline: 'none' }}
          >
            Seu navegador não suporta a tag de vídeo.
          </video>
        </Box>
        <Box sx={{ p: 4, bgcolor: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
          <Typography variant="h4" sx={{ color: 'var(--foreground)', fontWeight: 'bold' }}>
            {currentLesson.name}
          </Typography>
          {currentLesson.description && (
            <Typography variant="body1" sx={{ color: 'var(--muted)', mt: 2 }}>
              {currentLesson.description}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}