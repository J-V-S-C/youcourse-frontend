import AuthPageLayout from '../components/auth/AuthPageLayout';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

export const metadata = {
  title: 'Entrar — YouCourse',
  description: 'Entre na sua conta YouCourse',
};

export default function LoginPage() {
  return (
    <AuthPageLayout maxWidth={440}>
      <ForgotPasswordForm />
    </AuthPageLayout>
  );
}
