'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Stack,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import { useSearchParams, useRouter } from 'next/navigation';
import { getPublicCourseById, purchaseCourse } from '@/lib/courses/course.service';
import { formatPrice } from '@/app/utils/course-utils';

export default function PurchaseCourseForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get('courseId');

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setError('ID do curso não fornecido');
      setLoading(false);
      return;
    }

    getPublicCourseById(courseId)
      .then((data) => {
        if (!data) {
          setError('Curso não encontrado');
        } else if (!data.sellable) {
          setError('Este curso não está disponível para compra');
        } else {
          setCourse(data);
        }
      })
      .catch(() => setError('Erro ao carregar curso'))
      .finally(() => setLoading(false));
  }, [courseId]);

  const handlePurchase = async () => {
    if (!courseId) return;

    setPurchasing(true);
    setError(null);

    try {
      const response = await purchaseCourse(courseId);
      if (response.paymentUrl === 'FREE_ENROLLMENT') {
        window.location.href = `/my-courses/${courseId}`;
      } else if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        setError('Link de pagamento não gerado');
      }
    } catch (err) {
      setError('Erro ao processar compra. Tente novamente.');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <CircularProgress />
      </Container>
    );
  }

  if (error || !course) {
    return (
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: 5,
            border: '1px solid var(--border)',
            borderRadius: 4,
            bgcolor: 'var(--surface)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" color="error" gutterBottom>
            {error || 'Curso não encontrado'}
          </Typography>
          <Button onClick={() => router.push('/courses')} sx={{ mt: 2 }}>
            Ver todos os cursos
          </Button>
        </Paper>
      </Container>
    );
  }

  const price = formatPrice(course.price);

  return (
    <Container maxWidth="md">
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          border: '1px solid var(--border)',
          borderRadius: 4,
          bgcolor: 'var(--surface)',
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 'bold', color: 'var(--foreground)', mb: 1 }}
        >
          Finalizar Compra
        </Typography>
        <Typography variant="body1" sx={{ color: 'var(--muted)', mb: 4 }}>
          Revise os detalhes do curso antes de confirmar
        </Typography>

        <Divider sx={{ borderColor: 'var(--border)', mb: 4 }} />

        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" sx={{ color: 'var(--foreground)', mb: 1 }}>
              {course.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--muted)' }}>
              {course.description}
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: 'var(--background)',
              p: 3,
              borderRadius: 2,
              border: '1px solid var(--border)',
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              sx={{ alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between' }}
              spacing={2}
            >
              <Box>
                <Typography variant="body2" sx={{ color: 'var(--muted)', mb: 0.5 }}>
                  Valor do curso
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 'bold', color: 'var(--primary)' }}
                >
                  {price}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleOutlineIcon sx={{ color: 'success.main' }} />
                <Typography variant="body2" sx={{ color: 'var(--muted)' }}>
                  Compra segura via InfinitePay
                </Typography>
              </Box>
            </Stack>
          </Box>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={() => router.back()}
              sx={{ borderRadius: 2 }}
            >
              Voltar
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={handlePurchase}
              disabled={purchasing}
              sx={{
                borderRadius: 2,
                px: 4,
                bgcolor: 'var(--primary)',
                '&:hover': { bgcolor: 'var(--primary-dark, #4338ca)' },
              }}
            >
              {purchasing ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                `Pagar ${price}`
              )}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
