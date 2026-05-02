'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Card, Typography, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, Select, MenuItem,
  FormControl, InputLabel, Switch, FormControlLabel, Alert, Tooltip, Divider
} from '@mui/material';
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload,
  VideoCall,
  DeleteSweep,
  Visibility, // Novo: Para assistir
  PublishedWithChanges, // Novo: Para substituir/trocar
  OndemandVideo // Novo: Para indicar presença de vídeo
} from '@mui/icons-material';
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
import { useRouter } from 'next/navigation';

export default function LessonsTab({ courseId }: { courseId: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter()

  const [units, setUnits] = useState<UnitDTO[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [lessons, setLessons] = useState<LessonDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonDTO | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingForId, setUploadingForId] = useState<string | null>(null);

  const loadUnits = useCallback(async () => {
    try {
      const data = await fetchUnits(courseId);
      const sorted = data.sort((a, b) => a.position - b.position);
      setUnits(sorted);
      if (sorted.length > 0 && !selectedUnitId) {
        setSelectedUnitId(sorted[0].id);
      }
    } catch (err) { console.error(err); }
  }, [courseId, selectedUnitId]);

  const loadLessons = useCallback(async (uId: string) => {
    if (!uId) return;
    try {
      setLoading(true);
      const data = await fetchLessons(uId);
      setLessons(data.sort((a, b) => a.position - b.position));
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadUnits(); }, [loadUnits]);
  useEffect(() => { if (selectedUnitId) loadLessons(selectedUnitId); }, [selectedUnitId, loadLessons]);

  const handleOpenDialog = (lesson?: LessonDTO) => {
    setSelectedFile(null);
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

  const handleDirectVideoUpload = (lessonId: string) => {
    setUploadingForId(lessonId);
    fileInputRef.current?.click();
  };

  const processVideoUpload = async (lessonId: string, file: File) => {
    try {
      setLoading(true);
      const { video } = await attachVideoToLesson(lessonId, {
        filename: file.name,
        contentType: file.type
      });
      await uploadFileToS3(video.uploadUrl, file);
      loadLessons(selectedUnitId);
    } catch (err) {
      alert('Erro ao carregar vídeo');
    } finally {
      setLoading(false);
      setUploadingForId(null);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (uploadingForId) {
      await processVideoUpload(uploadingForId, file);
    } else {
      setSelectedFile(file);
    }
    e.target.value = '';
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
          name, description, position: lessons.length, isPreview
        });
        lessonId = response.id;
      }
      if (selectedFile && lessonId) {
        await processVideoUpload(lessonId, selectedFile);
      }
      setDialogOpen(false);
      loadLessons(selectedUnitId);
    } catch (err) {
      alert('Erro ao salvar aula');
      console.error(err)
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lessonId: string) => {
    if (!confirm('Excluir esta aula?')) return;
    await deleteLesson(lessonId);
    loadLessons(selectedUnitId);
  };

  const handleRemoveVideo = async (lessonId: string) => {
    if (!confirm('Remover o vídeo desta aula?')) return;
    await removeVideoFromLesson(lessonId);
    loadLessons(selectedUnitId);
  };

  const handleReorder = async (lessonId: string, direction: 'up' | 'down') => {
    const index = lessons.findIndex(l => l.id === lessonId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === lessons.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const currentLessonId = lessons[index].id;
    const targetLessonId = lessons[targetIndex].id;
    const currentNewPosition = lessons[targetIndex].position;
    const targetNewPosition = lessons[index].position;

    setLessons(prev => {
      const copy = [...prev];
      [copy[index], copy[targetIndex]] = [copy[targetIndex], copy[index]];
      return copy.map((l, i) => ({ ...l, position: i }));
    });

    try {
      await Promise.all([
        reorderLesson(currentLessonId, { position: currentNewPosition }),
        reorderLesson(targetLessonId, { position: targetNewPosition })
      ]);
    } catch (err) {
      if (selectedUnitId) loadLessons(selectedUnitId);
    }
  };

  return (
    <Card sx={{ p: 4, bgcolor: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
      <input type="file" hidden accept="video/*" ref={fileInputRef} onChange={handleFileChange} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
        <Typography variant="h6">Aulas</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Módulo</InputLabel>
            <Select value={selectedUnitId} label="Módulo" onChange={(e) => setSelectedUnitId(e.target.value)}>
              {units.map(u => <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="contained" disabled={!selectedUnitId} onClick={() => handleOpenDialog()} sx={{ bgcolor: "var(--primary)" }}>
            Adicionar Aula
          </Button>
        </Box>
      </Box>

      {!selectedUnitId ? (
        <Typography variant="body2" sx={{ color: 'var(--muted)' }}>Selecione um módulo.</Typography>
      ) : (
        <List sx={{ bgcolor: 'var(--background)', borderRadius: 1 }}>
          {lessons.map((lesson, index) => (
            <ListItem key={lesson.id} divider sx={{ py: 2 }}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {lesson.video ? <OndemandVideo fontSize="small" color="primary" /> : null}
                    {lesson.name}
                    {lesson.isPreview && <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>(Preview)</Typography>}
                  </Box>
                }
                secondary={lesson.description}
              />
              <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {lesson.video && (
                  <Tooltip title="Visualizar Vídeo">
                    <IconButton size="small" color="primary" onClick={
                      () => router.push(`/courses/${courseId}/lessons/${lesson.id}`)
                    }>
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}

                <Tooltip title={lesson.video ? "Substituir Vídeo" : "Anexar Vídeo"}>
                  <IconButton
                    size="small"
                    onClick={() => handleDirectVideoUpload(lesson.id)}
                    sx={{ color: lesson.video ? 'var(--primary)' : 'var(--warning)' }}
                  >
                    {lesson.video ? <PublishedWithChanges fontSize="small" /> : <VideoCall fontSize="small" />}
                  </IconButton>
                </Tooltip>

                <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 20 }} />

                <IconButton size="small" onClick={() => handleReorder(lesson.id, 'up')} disabled={index === 0}><KeyboardArrowUp /></IconButton>
                <IconButton size="small" onClick={() => handleReorder(lesson.id, 'down')} disabled={index === lessons.length - 1}><KeyboardArrowDown /></IconButton>
                <IconButton size="small" onClick={() => handleOpenDialog(lesson)}><EditIcon fontSize="small" /></IconButton>

                {lesson.video && (
                  <Tooltip title="Remover Vídeo">
                    <IconButton size="small" color="warning" onClick={() => handleRemoveVideo(lesson.id)}><DeleteSweep fontSize="small" /></IconButton>
                  </Tooltip>
                )}
                <IconButton size="small" color="error" onClick={() => handleDelete(lesson.id)}><DeleteIcon fontSize="small" /></IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          {lessons.length === 0 && !loading && (
            <Typography variant="body2" sx={{ p: 2, color: 'var(--muted)' }}>Nenhuma aula neste módulo.</Typography>
          )}
        </List>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingLesson ? 'Editar Aula' : 'Nova Aula'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <TextField label="Nome" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Descrição" fullWidth multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />

          {editingLesson ? (
            <Box sx={{ p: 2, border: '1px dashed var(--border)', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Vídeo da Aula</Typography>
              <Button variant="outlined" component="label" startIcon={<CloudUpload />} fullWidth>
                {selectedFile ? selectedFile.name : (editingLesson.video ? 'Substituir Vídeo' : 'Selecionar Vídeo')}
                <input type="file" hidden accept="video/*" onChange={handleFileChange} />
              </Button>
            </Box>
          ) : (
            <Alert severity="info">Salve a aula primeiro para anexar um vídeo ou use o atalho na lista após criar.</Alert>
          )}

          <FormControlLabel
            control={<Switch checked={isPreview} onChange={(e) => setIsPreview(e.target.checked)} />}
            label="Preview Público (Gratuito)"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={loading}>
            {loading ? 'Processando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
