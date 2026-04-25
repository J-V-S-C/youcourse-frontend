'use client';

import { useState, useEffect, useCallback } from 'react';
import { Box, Card, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import type { UnitDTO } from '@/lib/units/types';
import { fetchUnits, createUnit, editUnit, deleteUnit, reorderUnit } from '@/lib/units/unit.service';

export default function UnitsTab({ courseId }: { courseId: string }) {
  const { data: session } = useSession();
  const [units, setUnits] = useState<UnitDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitDTO | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const loadUnits = useCallback(async () => {
    if (!session?.accessToken) return;
    try {
      setLoading(true);
      const data = await fetchUnits(courseId);
      setUnits(data.sort((a, b) => a.position - b.position));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [courseId, session?.accessToken]);

  useEffect(() => {
    loadUnits();
  }, [loadUnits]);

  const handleOpenDialog = (unit?: UnitDTO) => {
    if (unit) {
      setEditingUnit(unit);
      setName(unit.name);
      setDescription(unit.description);
    } else {
      setEditingUnit(null);
      setName('');
      setDescription('');
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!session?.accessToken) return;
    try {
      if (editingUnit) {
        await editUnit(editingUnit.id, { name, description });
      } else {
        await createUnit(courseId, { name, description, position: units.length });
      }
      setDialogOpen(false);
      loadUnits();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar módulo');
    }
  };

  const handleDelete = async (unitId: string) => {
    if (!session?.accessToken) return;
    if (!confirm('Excluir este módulo?')) return;
    try {
      await deleteUnit(unitId, session.accessToken);
      loadUnits();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir módulo');
    }
  };
  const handleReorder = async (unitId: string, direction: 'up' | 'down') => {
    if (!session?.accessToken) return;

    const index = units.findIndex(u => u.id === unitId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === units.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    const currentUnitId = units[index].id;
    const targetUnitId = units[targetIndex].id;
    const currentNewPosition = units[targetIndex].position;
    const targetNewPosition = units[index].position;

    setUnits(prevUnits => {
      const newUnits = [...prevUnits];

      const currentUnit = { ...newUnits[index], position: currentNewPosition };
      const targetUnit = { ...newUnits[targetIndex], position: targetNewPosition };

      newUnits[index] = targetUnit;
      newUnits[targetIndex] = currentUnit;

      return newUnits;
    });

    try {

      await Promise.all([
        reorderUnit(currentUnitId, { position: currentNewPosition }),
        reorderUnit(targetUnitId, { position: targetNewPosition })
      ]);
    } catch (err) {
      console.error('Falha ao reordenar. Revertendo estado.', err);
      loadUnits();
    }
  };
  return (
    <Card sx={{ p: 4, bgcolor: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Módulos do Curso</Typography>
        <Button sx={{ bgcolor: 'var(--primary)' }} variant="contained" size="small" onClick={() => handleOpenDialog()}>Adicionar Módulo</Button>
      </Box>

      {loading ? (
        <Typography>Carregando...</Typography>
      ) : (
        <List sx={{ bgcolor: 'var(--background)', borderRadius: 1 }}>
          {units.map((unit, index) => (
            <ListItem key={unit.id} divider>
              <ListItemText
                primary={unit.name}
                secondary={unit.description}
                sx={{ '& .MuiListItemText-secondary': { color: 'var(--muted)' } }}
              />
              <ListItemSecondaryAction sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" onClick={() => handleReorder(unit.id, 'up')} disabled={index === 0}>
                  <KeyboardArrowUp />
                </IconButton>
                <IconButton size="small" onClick={() => handleReorder(unit.id, 'down')} disabled={index === units.length - 1}>
                  <KeyboardArrowDown />
                </IconButton>
                <IconButton size="small" aria-label="edit" onClick={() => handleOpenDialog(unit)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" edge="end" aria-label="delete" color="error" onClick={() => handleDelete(unit.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          {units.length === 0 && (
            <Typography variant="body2" sx={{ p: 2, color: 'var(--muted)' }}>Nenhum módulo adicionado ainda.</Typography>
          )}
        </List>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingUnit ? 'Editar Módulo' : 'Novo Módulo'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Descrição"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
