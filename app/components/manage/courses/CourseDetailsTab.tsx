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

  const [priceInput, setPriceInput] = useState<string>(
    course.price?.amount ? (course.price.amount / 100).toFixed(2) : '0.00'
  );
  const [currency, setCurrency] = useState(course.price?.currency || 'BRL');
  const [visible, setVisible] = useState(course.visible);
  const [sellable, setSellable] = useState(course.sellable);
  const [loading, setLoading] = useState(false);

  const numericFloatValue = parseFloat(priceInput.replace(',', '.')) || 0;

  const isPriceInvalid = numericFloatValue !== 0 && numericFloatValue < 1.50;

  const handleVisibleChange = (checked: boolean) => {
    setVisible(checked);
    if (!checked) setSellable(false);
  };

  const handleSellableChange = (checked: boolean) => {
    setSellable(checked);
    if (checked) setVisible(true);
  };

  const handleUpdateDetails = async () => {
    if (isPriceInvalid) return;

    const amountInCents = Math.round(numericFloatValue * 100);

    try {
      setLoading(true);

      await editCourse(course.id, { name, description });

      const priceChanged = amountInCents !== course.price?.amount || currency !== course.price?.currency;
      if (!course.sellable && priceChanged) {
        await updateCoursePrice(course.id, { price: { amount: amountInCents, currency } });
      }

      if (!visible) {
        if (course.visible || course.sellable) {
          await hideCourse(course.id);
        }
      }
      else if (sellable) {
        await publishCourse(course.id, { price: { amount: amountInCents, currency } });
      }
      else {
        if (!course.visible) {
          await publishCourse(course.id, { price: { amount: amountInCents, currency } });
          await unpublishCourse(course.id);
        } else if (course.sellable) {
          await unpublishCourse(course.id);
        }
      }

      alert('Dados updated com sucesso!');
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar: ' + (err instanceof Error ? err.message : 'Erro interno no servidor'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ p: 4, bgcolor: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
      {course.sellable && (
        <Alert icon={<Info fontSize="inherit" />} severity="info" sx={{ mb: 4 }}>
          Curso em modo <b>Venda Ativa</b>. Para mudar o preço, desmarque &quot;Disponível para venda&quot;, salve, e então edite o valor.<br />
          Para receber por esse curso, edite seu perfil e adicione uma conta InfinitePay.
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Configurações de Publicação</Typography>
        <Chip
          icon={course.visible ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
          label={
            course.visible
              ? `Público ${course.sellable && numericFloatValue > 0 ? '(Pago)' : '(Grátis)'}`
              : 'Privado/Rascunho'
          }
          color={course.visible ? 'success' : 'default'}
          variant="outlined"
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          label="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          fullWidth
          label="Descrição"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Box sx={{ display: 'flex', gap: 4, p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1 }}>
          <FormControlLabel
            control={<Switch checked={visible} onChange={(e) => handleVisibleChange(e.target.checked)} />}
            label="Visível no Catálogo"
          />
          <FormControlLabel
            control={<Switch checked={sellable} onChange={(e) => handleSellableChange(e.target.checked)} />}
            label="Disponível para Venda"
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="caption" sx={{ color: isPriceInvalid ? 'error.main' : 'var(--muted)', ml: 1 }}>
            * Digite o valor em Reais (Ex: 150,00). Mínimo de R$ 1,50 para cursos pagos.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Preço (R$)"
              type="text"
              value={priceInput}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setPriceInput(e.target.value)}
              onBlur={() => {
                if (!isNaN(numericFloatValue)) {
                  setPriceInput(numericFloatValue.toFixed(2));
                }
              }}
              disabled={course.sellable}
              fullWidth
              error={isPriceInvalid}
            />
            <TextField
              label="Moeda"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              disabled={course.sellable}
              sx={{ width: '120px' }}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleUpdateDetails}
            disabled={loading || isPriceInvalid}
            sx={{ px: 6, py: 1.5, fontWeight: 'bold', backgroundColor: 'var(--primary)' }}
          >
            {loading ? 'Processando...' : 'Salvar Alterações'}
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
