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
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('E-mail ou senha inválidos. Tente novamente.');
    } else {
      router.push('/');
    }
    setLoading(false);
  };

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
          Bem-vindo de volta
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--muted)', mt: 0.5 }}>
          Entre na sua conta para continuar
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        id="login-email"
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
        id="login-password"
        label="Senha"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        required
        fullWidth
        autoComplete="current-password"
        slotProps={{
          htmlInput: { 'aria-label': 'Senha' },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  onClick={() => setShowPassword((v) => !v)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
        <MuiLink
          component={Link}
          href="/forgot-password"
          variant="body2"
          sx={{
            color: 'var(--primary)',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Esqueceu a senha?
        </MuiLink>
      </Box>

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
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>

      <Typography variant="body2" sx={{ textAlign: 'center', color: 'var(--muted)' }}>
        Não tem uma conta?{' '}
        <MuiLink
          component={Link}
          href="/register"
          sx={{
            color: 'var(--primary)',
            fontWeight: 600,
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Cadastre-se grátis
        </MuiLink>
      </Typography>
    </Box>
  );
}
