'use client';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { register } from '@/lib/user/user.service';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
      router.push('/login');
    } catch {
      setError('Falha ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const passwordAdornment = (
    <InputAdornment position="end">
      <IconButton
        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        onClick={() => setShowPassword((v) => !v)}
        edge="end"
      >
        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
    >
      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.5px' }}
        >
          Crie sua conta
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--muted)', mt: 0.5 }}>
          Junte-se a milhares de aprendizes
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        id="register-name"
        label="Nome completo"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
        required
        fullWidth
        autoComplete="name"
        slotProps={{ htmlInput: { 'aria-label': 'Nome completo' } }}
      />

      <TextField
        id="register-email"
        label="E-mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        required
        fullWidth
        autoComplete="email"
        slotProps={{ htmlInput: { 'aria-label': 'E-mail' } }}
      />

      <TextField
        id="register-password"
        label="Senha"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        required
        fullWidth
        autoComplete="new-password"
        slotProps={{
          htmlInput: { 'aria-label': 'Senha' },
          input: { endAdornment: passwordAdornment },
        }}
      />

      <TextField
        id="register-confirm-password"
        label="Confirme a senha"
        type={showPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={loading}
        required
        fullWidth
        autoComplete="new-password"
        error={!!confirmPassword && password !== confirmPassword}
        helperText={
          !!confirmPassword && password !== confirmPassword ? 'As senhas não coincidem' : ''
        }
        slotProps={{ htmlInput: { 'aria-label': 'Confirme a senha' } }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={loading}
        sx={{
          bgcolor: 'var(--primary)',
          '&:hover': { bgcolor: 'var(--primary-hover)' },
          fontWeight: 700,
          py: 1.5,
          borderRadius: 2,
          fontSize: '1rem',
          mt: 0.5,
        }}
        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
      >
        {loading ? 'Criando conta...' : 'Criar conta'}
      </Button>

      <Typography variant="body2" sx={{ textAlign: 'center', color: 'var(--muted)' }}>
        Já tem uma conta?{' '}
        <MuiLink
          component={Link}
          href="/login"
          sx={{
            color: 'var(--primary)',
            fontWeight: 600,
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Entrar
        </MuiLink>
      </Typography>
    </Box>
  );
}
