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
} from '@mui/material';
import type { UserProfileDTO } from '@/lib/user/types';
import { updateProfile } from '@/lib/user/user.service';
import { useRouter } from 'next/navigation';

interface EditProfileModalProps {
  user: UserProfileDTO;
  open: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ user, open, onClose }: EditProfileModalProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name ?? '');
  const [email, setEmail] = useState(user.email ?? '');
  const [paymentHandle, setPaymentHandle] = useState(user.paymentHandle ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateProfile(user.id, {
        name,
        email,
        paymentHandle: paymentHandle.trim() === '' ? null : paymentHandle,
      });
      router.refresh(); // Refresh page to see changes
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Perfil</DialogTitle>
      <DialogContent>
        <Box component="form" id="edit-profile-form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <TextField
            label="Nome"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            label="E-mail"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            label="Usuário InfinitePay (Handle)"
            fullWidth
            value={paymentHandle}
            onChange={(e) => setPaymentHandle(e.target.value)}
            margin="normal"
            placeholder="@seu_usuario"
            helperText="Opcional. Se preenchido, os pagamentos de seus cursos irão direto para sua conta InfinitePay."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          type="submit"
          form="edit-profile-form"
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: 'var(--primary)',
            '&:hover': { bgcolor: 'color-mix(in srgb, var(--primary), black 15%)' },
          }}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
