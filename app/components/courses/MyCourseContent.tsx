'use client'; // Adicione isso aqui

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
} from '@mui/material';
import {
  ExpandMore,
  PlayCircleOutlined,
} from '@mui/icons-material';
import Link from 'next/link';
import type { UnitWithLessons } from '@/lib/units/types';

interface MyCourseContentProps {
  courseId: string;
  unitsWithLessons: UnitWithLessons[];
}

export default function MyCourseContent({ courseId, unitsWithLessons }: MyCourseContentProps) {
  if (unitsWithLessons.length === 0) {
    return <Typography sx={{ color: 'var(--muted)', p: 2 }}>Este curso ainda não possui módulos divulgados.</Typography>;
  }

  return (
    <>
      {[...unitsWithLessons]
        .sort((a, b) => a.position - b.position)
        .map((unit) => (
          <Accordion
            key={unit.id}
            defaultExpanded
            sx={{ mb: 1, bgcolor: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)', '&:before': { display: 'none' } }}
          >
            <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'var(--muted)' }} />}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{unit.name}</Typography>
                <Typography variant="body2" sx={{ color: 'var(--muted)' }}>{unit.lessons.length} aulas</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <Divider sx={{ borderColor: 'var(--border)' }} />
              <List disablePadding>
                {[...unit.lessons]
                  .sort((a, b) => a.position - b.position)
                  .map((lesson, idx) => {
                    const isClickable = !!lesson.video?.playbackUrl;

                    return (
                      <ListItem
                        key={lesson.id}
                        divider={idx !== unit.lessons.length - 1}
                        component={isClickable ? Link : 'li'}
                        href={isClickable ? `/courses/${courseId}/lessons/${lesson.id}` : undefined}
                        sx={{
                          px: 3,
                          py: 2,
                          textDecoration: 'none',
                          color: 'inherit',
                          transition: 'background-color 0.2s',
                          cursor: isClickable ? 'pointer' : 'default',
                          '&:hover': isClickable ? { backgroundColor: 'rgba(0, 0, 0, 0.04)' } : {},
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40, color: isClickable ? 'primary.main' : 'var(--muted)' }}>
                          <PlayCircleOutlined />
                        </ListItemIcon>
                        <ListItemText
                          primary={lesson.name}
                          secondary={lesson.isPreview ? 'Preview Gratuito' : undefined}
                          sx={{ '& .MuiListItemText-secondary': { color: 'primary.main', fontWeight: 500 } }}
                        />
                      </ListItem>
                    );
                  })}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
    </>
  );
}