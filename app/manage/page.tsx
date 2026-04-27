import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { Box, Container, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { School, Settings, BarChart, AddCircleOutlined } from '@mui/icons-material';
import Link from 'next/link';

export const metadata = {
  title: 'Painel de Gerenciamento — YouCourse',
};

export default async function ManageDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect('/login');
  }

  const menuItems = [
    {
      title: 'Meus Cursos',
      description: 'Gerencie conteúdos, módulos e aulas dos seus cursos existentes.',
      icon: <School sx={{ fontSize: 40, color: 'primary.main' }} />,
      href: '/manage/courses',
    },
    {
      title: 'Criar Curso',
      description: 'Lance um novo curso na plataforma e comece a publicar conteúdo.',
      icon: <AddCircleOutlined sx={{ fontSize: 40, color: 'secondary.main' }} />,
      href: '/manage/courses/new',
    },
    {
      title: 'Estatísticas',
      description: 'Acompanhe o engajamento dos alunos e métricas de vendas.',
      icon: <BarChart sx={{ fontSize: 40, color: 'var(--accent)' }} />,
      href: '#',
      disabled: true,
    },
    {
      title: 'Configurações',
      description: 'Ajuste preferências da sua conta de instrutor e pagamentos.',
      icon: <Settings sx={{ fontSize: 40, color: 'var(--muted)' }} />,
      href: '#',
      disabled: true,
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'var(--background)' }}>
      <Navbar />

      <Box sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 6 }}>
            <Typography variant="h6" sx={{ color: 'var(--muted)' }}>
              Bem-vindo ao seu painel de controle. O que deseja fazer hoje?
            </Typography>
          </Box>

<Grid container spacing={3}>
  {menuItems.map((item) => {
    const content = (
      <Card
        sx={{
          height: '100%',
          bgcolor: 'var(--surface)',
          border: '1px solid var(--border)',
          opacity: item.disabled ? 0.6 : 1,
          transition: 'transform 0.2s',
          '&:hover': !item.disabled ? { transform: 'translateY(-4px)' } : {},
        }}
      >
        <CardActionArea
          disabled={item.disabled}
          sx={{ height: '100%', p: 2 }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Box sx={{ mb: 2 }}>{item.icon}</Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--foreground)', mb: 1 }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--muted)' }}>
              {item.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );

    return (
      <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.title}>
        {item.disabled ? (
          content
        ) : (
          <Link href={item.href} style={{ textDecoration: 'none' }}>
            {content}
          </Link>
        )}
      </Grid>
    );
  })}
</Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}