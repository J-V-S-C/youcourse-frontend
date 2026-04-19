'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, Typography, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, Select, MenuItem,
  FormControl, InputLabel, Switch, FormControlLabel, Alert
} from '@mui/material';
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload,
  VideoFile,
  DeleteSweep
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import type { UnitDTO } from '@/lib/units/types';
import type { LessonDTO } from '@/lib/lessons/types';
import { fetchUnits } from '@/lib/units/unit.service';
import {
  fetchLessons,
  createLesson,
  editLesson,
  deleteLesson,
  reorderLesson,
  attachVideoToLesson,
  removeVideoFromLesson,
  uploadFileToS3,
} from '@/lib/lessons/lesson.service';

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
  const [videoFile, setVideoFile] = useState<{ filename: string; contentType: string } | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const loadUnits = useCallback(async () => {
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
  }, [courseId, selectedUnitId]);

  const loadLessons = useCallback(async (uId: string) => {
    if (!uId) return;
    try {
      setLoading(true);
      const data = await fetchLessons(uId);
      setLessons(data.sort((a, b) => a.position - b.position));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUnits();
  }, [loadUnits]);

  useEffect(() => {
    if (selectedUnitId) {
      loadLessons(selectedUnitId);
    }
  }, [selectedUnitId, loadLessons]);

  const handleOpenDialog = (lesson?: LessonDTO) => {
    setVideoFile(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file)
      setVideoFile({
        filename: file.name,
        contentType: file.type
      });
    }
  };

  const handleSave = async () => {
    if (!selectedUnitId) return;
    try {
      setLoading(true);
      let lessonId: string;

      if (editingLesson) {
        await editLesson(editingLesson.id, { name, description, isPreview });
        lessonId = editingLesson.id;
      } else {
        const response = await createLesson(selectedUnitId, {
          name,
          description,
          position: lessons.length,
          isPreview
        });
        lessonId = response.id;
      }

      if (selectedFile && lessonId) {
        const { video } = await attachVideoToLesson(lessonId, {
          filename: selectedFile.name,
          contentType: selectedFile.type
        });

        await uploadFileToS3(video.uploadUrl, selectedFile)

      }

      setDialogOpen(false);
      loadLessons(selectedUnitId);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar aula');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lessonId: string) => {
    if (!confirm('Excluir esta aula?')) return;
    try {
      await deleteLesson(lessonId);
      loadLessons(selectedUnitId);
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir aula');
    }
  };

  const handleRemoveVideo = async (lessonId: string) => {
    if (!confirm('Remover o vídeo desta aula?')) return;
    try {
      await removeVideoFromLesson(lessonId);
      loadLessons(selectedUnitId);
    } catch (err) {
      console.error(err);
      alert('Erro ao remover vídeo');
    }
  };

  const handleReorder = async (lessonId: string, direction: 'up' | 'down') => {
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {lesson.name}
                    {lesson.isPreview && <Typography component="span" variant="caption" sx={{ color: 'primary.main' }}>(Preview)</Typography>}
                    {lesson.video && <VideoFile fontSize="inherit" color="action" />}
                  </Box>
                }
                secondary={lesson.description}
                sx={{ '& .MuiListItemText-secondary': { color: 'var(--muted)' } }}
              />
              <ListItemSecondaryAction sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton size="small" onClick={() => handleReorder(lesson.id, 'up')} disabled={index === 0}>
                  <KeyboardArrowUp />
                </IconButton>
                <IconButton size="small" onClick={() => handleReorder(lesson.id, 'down')} disabled={index === lessons.length - 1}>
                  <KeyboardArrowDown />
                </IconButton>
                <IconButton size="small" onClick={() => handleOpenDialog(lesson)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                {lesson.video && (
                  <IconButton size="small" color="warning" onClick={() => handleRemoveVideo(lesson.id)}>
                    <DeleteSweep fontSize="small" />
                  </IconButton>
                )}
                <IconButton size="small" edge="end" color="error" onClick={() => handleDelete(lesson.id)}>
                  <DeleteIcon fontSize="small" />
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
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <TextField
            autoFocus
            label="Nome"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Descrição"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Box sx={{ p: 2, border: '1px dashed var(--border)', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Vídeo da Aula</Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{ textTransform: 'none' }}
            >
              {videoFile ? videoFile.filename : 'Selecionar Vídeo'}
              <input type="file" hidden accept="video/*" onChange={handleFileChange} />
            </Button>
            {videoFile && (
              <Alert severity="success" sx={{ mt: 1.5, py: 0 }}>
                Arquivo selecionado. Clique em salvar para anexar.
              </Alert>
            )}
            {editingLesson?.video && !videoFile && (
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                Esta aula já possui um vídeo. Selecionar um novo substituirá o atual.
              </Typography>
            )}
          </Box>

          <FormControlLabel
            control={<Switch checked={isPreview} onChange={(e) => setIsPreview(e.target.checked)} />}
            label="Disponível para Preview Público?"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}