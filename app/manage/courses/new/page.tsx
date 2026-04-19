'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import AuthGuard from '@/app/components/AuthGuard';
import { Box, Container, Typography, TextField, Button, Switch, FormControlLabel, Card } from '@mui/material';
import { createCourse } from '@/lib/courses/course.service';

export default function NewCoursePage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState('BRL');
  const [sellable, setSellable] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) return;
    try {
      setLoading(true);
      await createCourse({
        name,
        description,
        sellable,
        visible,
        price: sellable ? { amount, currency } : undefined,
      }, session.accessToken);
      router.push('/manage/courses');
    } catch (err) {
      console.error(err);
      alert('Erro ao criar curso. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'var(--background)' }}>
        <Navbar />

        <Box sx={{ flexGrow: 1, py: 6 }}>
          <Container maxWidth="md">
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>Criar Novo Curso</Typography>
            
            <Card sx={{ p: 4, bgcolor: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Nome do Curso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Descrição"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  margin="normal"
                  multiline
                  rows={4}
                  required
                />
                
                <FormControlLabel
                  control={<Switch checked={visible} onChange={(e) => setVisible(e.target.checked)} />}
                  label="Tornar curso visível no catálogo?"
                  sx={{ mt: 2, display: 'block' }}
                />

                <FormControlLabel
                  control={<Switch checked={sellable} onChange={(e) => setSellable(e.target.checked)} />}
                  label="Cobrar por este curso?"
                  sx={{ mt: 2, display: 'block' }}
                />

                {sellable && (
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <TextField
                      label="Preço (Centavos)"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      required
                    />
                    <TextField
                      label="Moeda"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      required
                    />
                  </Box>
                )}

                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                  <Button variant="contained" color="primary" type="submit" disabled={loading}>
                    {loading ? 'Processando...' : 'Criar Curso'}
                  </Button>
                  <Button variant="outlined" onClick={() => router.back()}>
                    Cancelar
                  </Button>
                </Box>
              </form>
            </Card>
          </Container>
        </Box>

        <Footer />
      </Box>
    </AuthGuard>
  );
}
