import { Suspense } from 'react';
import AuthPageLayout from '../components/auth/AuthPageLayout';
import LoginSkeleton from './loading-skeleton';
import LoginForm from '../components/auth/LoginForm';

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
