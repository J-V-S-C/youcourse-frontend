import AuthPageLayout from '../components/auth/AuthPageLayout';
import RegisterForm from '../components/auth/RegisterForm';

export const metadata = {
  title: 'Cadastrar — YouCourse',
  description: 'Crie sua conta grátis no YouCourse',
};

export default function RegisterPage() {
  return (
    <AuthPageLayout maxWidth={480}>
      <RegisterForm />
    </AuthPageLayout>
  );
}
