import { login, refreshAccessToken } from '@/lib/auth/auth.service';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { AuthToken } from '@/lib/auth/types';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await login(credentials.email, credentials.password);

        return user;
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user }) {
      let authToken = token as AuthToken;

      if (user) {
        authToken = {
          ...authToken,
          ...user,
        };
      }

      if (!authToken.accessTokenExpires) return authToken;

      // ainda válido
      if (Date.now() < (authToken.accessTokenExpires ?? 0)) {
        return authToken;
      }

      // expirou → refresh
      return await refreshAccessToken(authToken);
    },

    async session({ session, token }) {
      const authToken = token as AuthToken;

      session.user.id = authToken.id;
      session.accessToken = authToken.accessToken;
      session.error = authToken.error;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
