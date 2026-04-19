'use client';

import { useState, useEffect, useCallback } from 'react';
import { Box, Card, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Select, MenuItem, FormControl, InputLabel, Switch, FormControlLabel } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import type { UnitDTO } from '@/lib/units/types';
import type { LessonDTO } from '@/lib/lessons/types';
import { fetchUnits } from '@/lib/units/unit.service';
import { fetchLessons, createLesson, editLesson, deleteLesson, reorderLesson } from '@/lib/lessons/lesson.service';

export default function LessonsTab({ courseId }: { courseId: string }) {
  const { data: session } = useSession();
  const [units, setUnits] = useState<UnitDTO[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [lessons, setLessons] = useState<LessonDTO[]>([]);

  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonDTO | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  const loadUnits = useCallback(async () => {
    if (!session?.accessToken) return;
    try {
      const data = await fetchUnits(courseId);
      const sorted = data.sort((a, b) => a.position - b.position);
      setUnits(sorted);
      if (sorted.length > 0 && !selectedUnitId) {
        setSelectedUnitId(sorted[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  }, [courseId, session?.accessToken, selectedUnitId]);

  const loadLessons = useCallback(async (uId: string) => {
    if (!session?.accessToken || !uId) return;
    try {
      setLoading(true);
      const data = await fetchLessons(uId);
      setLessons(data.sort((a, b) => a.position - b.position));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    loadUnits();
  }, [loadUnits]);

  useEffect(() => {
    if (selectedUnitId) {
      loadLessons(selectedUnitId);
    }
  }, [selectedUnitId, loadLessons]);

  const handleOpenDialog = (lesson?: LessonDTO) => {
    if (lesson) {
      setEditingLesson(lesson);
      setName(lesson.name);
      setDescription(lesson.description);
      setIsPreview(lesson.isPreview);
    } else {
      setEditingLesson(null);
      setName('');
      setDescription('');
      setIsPreview(false);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!session?.accessToken || !selectedUnitId) return;
    try {
      if (editingLesson) {
        await editLesson(editingLesson.id, { name, description, isPreview });
      } else {
        await createLesson(selectedUnitId, { name, description, position: lessons.length, isPreview });
      }
      setDialogOpen(false);
      loadLessons(selectedUnitId);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar aula');
    }
  };

  const handleDelete = async (lessonId: string) => {
    if (!session?.accessToken) return;
    if (!confirm('Excluir esta aula?')) return;
    try {
      await deleteLesson(lessonId);
      loadLessons(selectedUnitId);
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir aula');
    }
  };

  const handleReorder = async (lessonId: string, direction: 'up' | 'down') => {
    if (!session?.accessToken) return;
    const index = lessons.findIndex(l => l.id === lessonId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === lessons.length - 1) return;

    const newPosition = direction === 'up' ? lessons[index - 1].position : lessons[index + 1].position;
    try {
      await reorderLesson(lessonId, { position: newPosition });
      loadLessons(selectedUnitId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card sx={{ p: 4, bgcolor: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 3, gap: 2 }}>
        <Typography variant="h6">Aulas</Typography>

        <FormControl size="small" sx={{ minWidth: 200, bgcolor: 'var(--background)', borderRadius: 1 }}>
          <InputLabel id="unit-select-label" sx={{ color: 'var(--muted)' }}>Selecionar Módulo</InputLabel>
          <Select
            labelId="unit-select-label"
            value={selectedUnitId}
            label="Selecionar Módulo"
            onChange={(e) => setSelectedUnitId(e.target.value)}
            sx={{ color: 'var(--foreground)' }}
          >
            {units.map(u => (
              <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          size="small"
          disabled={!selectedUnitId}
          onClick={() => handleOpenDialog()}
        >
          Adicionar Aula
        </Button>
      </Box>

      {!selectedUnitId ? (
        <Typography variant="body2" sx={{ color: 'var(--muted)' }}>Selecione um módulo para gerenciar suas aulas.</Typography>
      ) : loading ? (
        <Typography>Carregando...</Typography>
      ) : (
        <List sx={{ bgcolor: 'var(--background)', borderRadius: 1 }}>
          {lessons.map((lesson, index) => (
            <ListItem key={lesson.id} divider>
              <ListItemText
                primary={
                  <Typography component="span">
                    {lesson.name}
                    {lesson.isPreview && <Typography component="span" variant="caption" sx={{ ml: 1, color: 'primary.main' }}>(Preview)</Typography>}
                  </Typography>
                }
                secondary={lesson.description}
                sx={{ '& .MuiListItemText-secondary': { color: 'var(--muted)' } }}
              />
              <ListItemSecondaryAction sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" onClick={() => handleReorder(lesson.id, 'up')} disabled={index === 0}>
                  <KeyboardArrowUp />
                </IconButton>
                <IconButton size="small" onClick={() => handleReorder(lesson.id, 'down')} disabled={index === lessons.length - 1}>
                  <KeyboardArrowDown />
                </IconButton>
                <IconButton size="small" aria-label="edit" onClick={() => handleOpenDialog(lesson)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" edge="end" aria-label="delete" color="error" onClick={() => handleDelete(lesson.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          {lessons.length === 0 && (
            <Typography variant="body2" sx={{ p: 2, color: 'var(--muted)' }}>Nenhuma aula neste módulo.</Typography>
          )}
        </List>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingLesson ? 'Editar Aula' : 'Nova Aula'}</DialogTitle>
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
          <FormControlLabel
            control={<Switch checked={isPreview} onChange={(e) => setIsPreview(e.target.checked)} />}
            label="Disponível para Preview Público?"
            sx={{ mt: 2 }}
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
