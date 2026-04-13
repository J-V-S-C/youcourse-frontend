'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (session === null || status === null) {
    signOut({ callbackUrl: '/login' });
  }

  useEffect(() => {
    if (session?.error === 'RefreshError') {
      signOut({ callbackUrl: '/login' });
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (session?.error === 'RefreshError') {
    return (
      <div className="text-center mt-8">
        Session expired. Redirecting to login...
      </div>
    );
  }

  return children;
}
