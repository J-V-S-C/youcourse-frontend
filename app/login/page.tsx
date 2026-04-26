import { Suspense } from 'react';
import LoginForm from '../components/LoginForm';
import AuthPageLayout from '../components/auth/AuthPageLayout';
import LoginSkeleton from './loading-skeleton';

export const metadata = {
  title: 'Entrar — YouCourse',
  description: 'Entre na sua conta YouCourse',
};

export default function LoginPage() {
  return (
    <AuthPageLayout maxWidth={440}>
      <Suspense fallback={<LoginSkeleton />}>
        <LoginForm />
      </Suspense>
    </AuthPageLayout>
  );
}
