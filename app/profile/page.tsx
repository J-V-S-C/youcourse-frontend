import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/user/user.service';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Box, Container } from '@mui/material';
import ProfileCard from '../components/profile/ProfileCard';

export const metadata = {
  title: 'Meu Perfil — YouCourse',
  description: 'Gerencie sua conta YouCourse',
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect('/login');
  }

  const user = await getUserProfile(session.accessToken);

  if (!user) {
    redirect('/login');
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'var(--background)' }}>
      <Navbar />

      <Box
        sx={{
          flexGrow: 1,
          py: { xs: 5, md: 8 },
          background: 'radial-gradient(ellipse at 50% 0%, rgba(79,70,229,0.1) 0%, transparent 65%)',
        }}
      >
        <Container maxWidth="sm">
          <ProfileCard user={user} />
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}