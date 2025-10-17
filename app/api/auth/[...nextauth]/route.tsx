import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || "http://localhost:8080";

export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await fetch(`${BACKEND_BASE_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          });
          if (!res.ok) return null;
          const user = await res.json();
          if (!user?.email) return null;
          return {
            id: String(user.id ?? user.email),
            name: user.email,
            email: user.email,
            role: user.role,
          } as any;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        (session.user as any).role = token.role as any;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
} as any;

const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };


