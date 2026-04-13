import LoginForm from '../components/LoginForm';
import AuthPageLayout from '../components/auth/AuthPageLayout';

export const metadata = {
  title: 'Entrar — YouCourse',
  description: 'Entre na sua conta YouCourse',
};

export default function LoginPage() {
  return (
    <AuthPageLayout maxWidth={440}>
      <LoginForm />
    </AuthPageLayout>
  );
}
