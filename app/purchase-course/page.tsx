import { Suspense } from 'react';
import { Box, Container } from '@mui/material';
import PurchaseCourseForm from '@/app/components/purchase/PurchaseCourseForm';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import PurchaseCourseSkeleton from './loading-skeleton';

export const metadata = {
  title: 'Comprar Curso — YouCourse',
  description: 'Finalize sua compra de curso na YouCourse',
};

export default function PurchaseCoursePage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'var(--background)',
      }}
    >
      <Navbar />
      <Container sx={{ flexGrow: 1, py: { xs: 4, md: 8 } }}>
        <Suspense fallback={<PurchaseCourseSkeleton />}>
          <PurchaseCourseForm />
        </Suspense>
      </Container>
      <Footer />
    </Box>
  );
}
