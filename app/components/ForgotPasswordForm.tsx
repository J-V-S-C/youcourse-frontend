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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { recoverPassword, changePassword } from '@/lib/user/user.service';

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<'REQUEST_TOKEN' | 'RESET_PASSWORD'>(
    'REQUEST_TOKEN',
  );
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRequestToken = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await recoverPassword({email});
      setStep('RESET_PASSWORD');
     
    } catch (err) {
      setError('Ocorreu um erro ao processar a solicitação.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await changePassword({token, newPassword});
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError('Erro ao redefinir senha. Verifique o token.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Alert severity="success" sx={{ borderRadius: 2 }}>
          Senha redefinida com sucesso! Redirecionando para o login...
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={
        step === 'REQUEST_TOKEN' ? handleRequestToken : handleChangePassword
      }
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
    >
      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: 'var(--foreground)',
            letterSpacing: '-0.5px',
          }}
        >
          Recuperar Senha
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--muted)', mt: 0.5 }}>
          {step === 'REQUEST_TOKEN'
            ? 'Digite o seu e-mail para receber o token de recuperação.'
            : 'Insira o token recebido no e-mail e a sua nova senha.'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {step === 'REQUEST_TOKEN' && (
        <TextField
          id="recovery-email"
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
      )}

      {step === 'RESET_PASSWORD' && (
        <>
          <TextField
            id="recovery-token"
            label="Token"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            disabled={loading}
            required
            fullWidth
            slotProps={{ htmlInput: { 'aria-label': 'Token' } }}
          />
          <TextField
            id="new-password"
            label="Nova Senha"
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            required
            fullWidth
            slotProps={{
              htmlInput: { 'aria-label': 'Nova Senha' },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? 'Ocultar senha' : 'Mostrar senha'
                      }
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={
          loading ||
          (step === 'REQUEST_TOKEN' ? !email : !token || !newPassword)
        }
        sx={{
          bgcolor: 'var(--primary)',
          '&:hover': { bgcolor: 'var(--primary-hover)' },
          fontWeight: 700,
          py: 1.5,
          borderRadius: 2,
          fontSize: '1rem',
          mt: 0.5,
        }}
        startIcon={
          loading ? <CircularProgress size={18} color="inherit" /> : null
        }
      >
        {loading
          ? 'Processando...'
          : step === 'REQUEST_TOKEN'
            ? 'Enviar token'
            : 'Alterar senha'}
      </Button>

      <Typography
        variant="body2"
        sx={{ textAlign: 'center', color: 'var(--muted)' }}
      >
        Lembrou sua senha?{' '}
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
          Voltar ao login
        </MuiLink>
      </Typography>
    </Box>
  );
}
