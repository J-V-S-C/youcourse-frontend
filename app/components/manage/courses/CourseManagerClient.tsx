'use client';

import { useState } from 'react';
import { Box, Tabs, Tab, Container, Typography } from '@mui/material';
import type { CourseDTO } from '@/lib/courses/types';
import CourseDetailsTab from './CourseDetailsTab';
import UnitsTab from './UnitsTab';
import LessonsTab from './LessonsTab';

export default function CourseManagerClient({ course }: { course: CourseDTO }) {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: 'var(--foreground)' }}>
        Gerenciando: {course.name}
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabIndex} 
          onChange={(_, nv) => setTabIndex(nv)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Detalhes do Curso" sx={{ color: 'var(--foreground)' }} />
          <Tab label="Módulos" sx={{ color: 'var(--foreground)' }} />
          <Tab label="Aulas" sx={{ color: 'var(--foreground)' }} />
        </Tabs>
      </Box>

      {tabIndex === 0 && <CourseDetailsTab course={course} />}
      {tabIndex === 1 && <UnitsTab courseId={course.id} />}
      {tabIndex === 2 && <LessonsTab courseId={course.id} />}
    </Container>
  );
}
