'use client';
import { useState } from 'react';
import { Box, Card, Typography, TextField, Button, Switch, FormControlLabel, Alert, Chip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Info, Visibility, VisibilityOff } from '@mui/icons-material';
import type { CourseDTO } from '@/lib/courses/types';
import {
  editCourse,
  hideCourse,
  publishCourse,
  unpublishCourse,
  updateCoursePrice,
} from '@/lib/courses/course.service';

export default function CourseDetailsTab({ course }: { course: CourseDTO }) {
  const router = useRouter();
  const [name, setName] = useState(course.name);
  const [description, setDescription] = useState(course.description);
  const [amount, setAmount] = useState<number>(course.price?.amount || 0);
  const [currency, setCurrency] = useState(course.price?.currency || 'BRL');
  const [visible, setVisible] = useState(course.visible);
  const [sellable, setSellable] = useState(course.sellable);
  const [loading, setLoading] = useState(false);

  const handleSellableChange = (checked: boolean) => {
    setSellable(checked);
    if (checked) setVisible(true);
  };

  const handleVisibleChange = (checked: boolean) => {
    setVisible(checked);
    if (!checked) setSellable(false);
  };

  const handleUpdateDetails = async () => {
    try {
      setLoading(true);
      await editCourse(course.id, { name, description });

      if (!visible) {
        if (course.visible || course.sellable) {
          await hideCourse(course.id);
        }
      } else if (sellable) {
        if (!course.sellable) {
          await updateCoursePrice(course.id, { price: { amount, currency } });
        }
        await publishCourse(course.id, { price: { amount, currency } });
      } else {
        if (course.sellable) {
          await unpublishCourse(course.id);
        }
        if (amount !== course.price?.amount || currency !== course.price?.currency) {
          await updateCoursePrice(course.id, { price: { amount, currency } });
        }
      }

      alert('Detalhes do curso atualizados!');
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar dados do curso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ p: 4, bgcolor: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Informações Básicas</Typography>
        <Chip
          icon={course.visible ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
          label={course.visible ? 'Publicado' : 'Rascunho'}
          color={course.visible ? 'success' : 'default'}
          variant="outlined"
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          label="Nome do Curso"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
        />
        <Box sx={{ display: 'flex', gap: 4 }}>
          <FormControlLabel
            control={<Switch checked={visible} onChange={(e) => handleVisibleChange(e.target.checked)} />}
            label="Visível no catálogo"
          />
          <FormControlLabel
            control={<Switch checked={sellable} onChange={(e) => handleSellableChange(e.target.checked)} />}
            label="Cobrar por este curso"
          />
        </Box>

        {visible && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Preço (Centavos)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                disabled={course.sellable}
                fullWidth
              />
              <TextField
                label="Moeda"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                disabled={course.sellable}
                sx={{ width: '120px' }}
              />
            </Box>

            {course.sellable && (
              <Alert icon={<Info fontSize="inherit" />} severity="info" sx={{ mt: 1 }}>
                Despublique o curso para alterar o preço, você pode fazer isso desativando a visibilidade no catálogo e salvando a alteração.
              </Alert>
            )}
          </Box>
        )}

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={handleUpdateDetails} disabled={loading} sx={{ px: 4, backgroundColor: 'var(--primary)' }}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </Box>
      </Box>
    </Card>
  );
}