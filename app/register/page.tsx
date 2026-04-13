import RegisterForm from '../components/RegisterForm';
import AuthPageLayout from '../components/auth/AuthPageLayout';

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
