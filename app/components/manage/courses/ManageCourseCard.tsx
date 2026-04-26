'use client';

import { useState } from 'react';
import {
  Typography, Button, Card, CardContent, CardActions,
  Chip, Box, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { DeleteOutlined, Edit } from '@mui/icons-material';
import Link from 'next/link';
import { deleteCourse } from '@/lib/courses/course.service';
import { useRouter } from 'next/navigation';
import type { CourseDTO } from '@/lib/courses/types';

interface ManageCourseCardProps {
  course: CourseDTO;
}

export default function ManageCourseCard({ course }: ManageCourseCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    setOpenConfirm(false);
    try {
      await deleteCourse(course.id);
      router.refresh(); // Atualiza a Server Page para remover o curso da lista
    } catch (error) {
      console.error("Erro ao deletar:", error);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card sx={{
        bgcolor: 'var(--card)',
        color: 'var(--foreground)',
        border: '1px solid var(--border)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>{course.name}</Typography>
          <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 2 }}>
            {course.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label={course.sellable ? 'Pago' : 'Gratuito'} size="small" color='success' />
            <Chip label={course.visible ? 'Visível' : 'Oculto'} size="small" variant="outlined" />
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Link href={`/manage/courses/${course.id}`} style={{ textDecoration: 'none' }}>
            <Button size="small" startIcon={<Edit />} sx={{ color: 'var(--primary)' }}>
              Editar
            </Button>
          </Link>

          <Button
            size="small"
            color="error"
            startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : <DeleteOutlined />}
            disabled={isDeleting}
            onClick={() => setOpenConfirm(true)}
            sx={{
              color: '#d32f2f', // Vermelho mais vivo e elegante
              '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.04)' }
            }}
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </CardActions>
      </Card>

      {/* Modal de Confirmação */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Excluir Curso?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir <strong>{course.name}</strong>?
            Esta ação é irreversível e removerá todos os dados vinculados.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenConfirm(false)} color="inherit">Cancelar</Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
              bgcolor: '#d32f2f',
              '&:hover': { bgcolor: '#b71c1c' }
            }}
          >
            Confirmar Exclusão
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}