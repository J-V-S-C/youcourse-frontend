'use client';

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
  Lock,
} from '@mui/icons-material';
import Link from 'next/link';
import type { UnitWithLessons } from '@/lib/units/types';

interface CourseContentListProps {
  courseId: string;
  unitsWithLessons: UnitWithLessons[];
  isOwner: boolean;
}

export default function CourseContentList({ courseId, unitsWithLessons, isOwner }: CourseContentListProps) {
  if (unitsWithLessons.length === 0) {
    return (
      <Typography sx={{ color: 'var(--muted)', p: 2 }}>
        Este curso ainda não possui módulos divulgados.
      </Typography>
    );
  }

  return (
    <>
      {[...unitsWithLessons]
        .sort((a, b) => a.position - b.position)
        .map((unit) => (
          <Accordion
            key={unit.id}
            defaultExpanded
            sx={{
              mb: 1,
              bgcolor: 'var(--card)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              '&:before': { display: 'none' },
              boxShadow: 'none',
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'var(--muted)' }} />}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {unit.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--muted)' }}>
                  {unit.lessons.length} aulas
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <Divider sx={{ borderColor: 'var(--border)' }} />
              <List disablePadding>
                {[...unit.lessons]
                  .sort((a, b) => a.position - b.position)
                  .map((lesson, idx) => {
                    const hasAccess = isOwner || (lesson.isPreview && !!lesson.video?.playbackUrl);
                    const isClickable = !!(hasAccess && (!!lesson.video?.playbackUrl || isOwner));

                    return (
                      <ListItem
                        key={lesson.id}
                        divider={idx !== unit.lessons.length - 1}
                        disablePadding
                      >
                        <Box
                          component={isClickable ? Link : 'div'}
                          href={isClickable ? `/courses/${courseId}/lessons/${lesson.id}` : undefined}
                          sx={{
                            display: 'flex',
                            width: '100%',
                            px: 3,
                            py: 2,
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'background-color 0.2s',
                            cursor: isClickable ? 'pointer' : 'default',
                            '&:hover': isClickable
                              ? { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                              : {},
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 40,
                              color: hasAccess ? 'primary.main' : 'var(--muted)',
                            }}
                          >
                            {hasAccess ? <PlayCircleOutlined /> : <Lock />}
                          </ListItemIcon>
                          <ListItemText
                            primary={lesson.name}
                            secondary={!isOwner && lesson.isPreview ? 'Preview Gratuito' : undefined}
                            sx={{
                              '& .MuiListItemText-secondary': {
                                color: 'primary.main',
                                fontWeight: 500,
                              },
                            }}
                          />
                        </Box>
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