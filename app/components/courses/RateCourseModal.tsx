'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Rating
} from '@mui/material';
import { rateCourse } from '@/lib/courses/course.service';
import { useRouter } from 'next/navigation';

interface RateCourseModalProps {
  courseId: string;
  courseName: string;
  open: boolean;
  onClose: () => void;
}

export default function RateCourseModal({ courseId, courseName, open, onClose }: RateCourseModalProps) {
  const router = useRouter();
  const [stars, setStars] = useState<number | null>(5);
  const [commentary, setCommentary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stars) {
      setError('Por favor, selecione uma nota.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await rateCourse(courseId, {
        stars,
        commentary: commentary.trim(),
      });
      alert('Avaliação enviada com sucesso! Obrigado.');
      router.refresh();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar avaliação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Avaliar Curso</DialogTitle>
      <DialogContent>
        <Box component="form" id="rate-course-form" onSubmit={handleSubmit} sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="body2" sx={{ color: 'var(--muted)' }}>
            Como você avalia o curso <strong>{courseName}</strong>?
          </Typography>

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Rating
              name="course-rating"
              value={stars}
              precision={0.5}
              size="large"
              onChange={(event, newValue) => {
                setStars(newValue);
              }}
            />
            <Typography variant="caption" sx={{ color: 'var(--muted)' }}>
              {stars ? `${stars} de 5 estrelas` : 'Clique para avaliar'}
            </Typography>
          </Box>

          <TextField
            label="Comentário (opcional)"
            fullWidth
            multiline
            rows={4}
            value={commentary}
            onChange={(e) => setCommentary(e.target.value)}
            placeholder="Conte o que achou do curso..."
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          type="submit"
          form="rate-course-form"
          variant="contained"
          disabled={loading || !stars}
          sx={{
            bgcolor: 'var(--primary)',
            '&:hover': { bgcolor: 'color-mix(in srgb, var(--primary), black 15%)' },
          }}
        >
          {loading ? 'Enviando...' : 'Enviar Avaliação'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
