import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { createVerifyMessage } from '@/lib/auth/siwe';

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      id: 'siwe',
      name: 'Ethereum',
      credentials: {
        message: { label: 'Message', type: 'text' },
        signature: { label: 'Signature', type: 'text' },
        address: { label: 'Address', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.message || !credentials?.signature || !credentials?.address) {
          return null;
        }
        const isValid = await createVerifyMessage(
          credentials.message as string,
          credentials.signature as string,
          credentials.address as string
        );
        if (!isValid) return null;
        return {
          id: credentials.address as string,
          name: `${(credentials.address as string).slice(0, 6)}...${(credentials.address as string).slice(-4)}`,
          email: `${credentials.address}@wallet.chainforge.io`,
          walletAddress: credentials.address as string,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.walletAddress = (user as { walletAddress?: string }).walletAddress;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { walletAddress?: string }).walletAddress = token.walletAddress as string | undefined;
      }
      return session;
    },
  },
};
