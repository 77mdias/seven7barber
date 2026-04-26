import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Mock users for development (used when USE_MOCK_AUTH=true)
const MOCK_USERS = [
  { id: 'mock-client-1', email: 'client@seven7barber.dev', password: 'devpassword123', name: 'Test Client', role: 'CLIENT' },
  { id: 'mock-barber-1', email: 'barber@seven7barber.dev', password: 'devpassword123', name: 'Test Barber', role: 'BARBER' },
  { id: 'mock-admin-1', email: 'admin@seven7barber.dev', password: 'devpassword123', name: 'Test Admin', role: 'ADMIN' },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Check for mock auth mode
        if (process.env.USE_MOCK_AUTH === 'true') {
          const mockUser = MOCK_USERS.find(
            u => u.email === credentials.email && u.password === credentials.password
          );
          if (mockUser) {
            return {
              id: mockUser.id,
              name: mockUser.name,
              email: mockUser.email,
              role: mockUser.role,
            };
          }
          return null;
        }

        // Real API authentication
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
            headers: { "Content-Type": "application/json" }
          });
          const user = await res.json();

          if (res.ok && user) {
            return {
              id: user.user.id,
              name: user.user.name,
              email: user.user.email,
              role: user.user.role,
              accessToken: user.access_token,
            };
          }
          return null;
        } catch (e) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  }
};
