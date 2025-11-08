import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || "http://localhost:8080";
const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

// Mock users pour le développement sans backend
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@painboul.com",
    password: "admin123",
    name: "Admin Pain Boul",
    role: "admin",
  },
  {
    id: "2",
    email: "owner@painboul.com",
    password: "owner123",
    name: "Owner Pain Boul",
    role: "owner",
  },
  {
    id: "3",
    email: "test@test.com",
    password: "test123",
    name: "Test User",
    role: "admin",
  },
];

// Interfaces pour typer correctement les données
interface UserResponse {
  id?: number | string;
  email: string;
  name?: string;
  role?: string;
}

interface ExtendedUser extends NextAuthUser {
  role?: string;
}

interface ExtendedToken extends JWT {
  role?: string;
}

interface ExtendedSession extends Session {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "admin@exemple.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        // Validation des credentials
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing credentials");
          return null;
        }

        // MODE MOCK : Authentification avec des utilisateurs de test
        if (USE_MOCK_AUTH) {
          console.log("🔧 MODE MOCK activé - Authentification avec utilisateurs de test");

          const mockUser = MOCK_USERS.find((u) => u.email === credentials.email.trim() && u.password === credentials.password);

          if (mockUser) {
            console.log("✅ Mock login réussi:", mockUser.email);
            return {
              id: mockUser.id,
              name: mockUser.name,
              email: mockUser.email,
              role: mockUser.role,
            };
          } else {
            console.error("❌ Mock login échoué - credentials invalides");
            return null;
          }
        }

        // MODE PRODUCTION : Authentification avec le backend
        try {
          const response = await fetch(`${BACKEND_BASE_URL}/users/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email.trim(),
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            console.error("Login failed:", response.status);
            return null;
          }

          const userData: UserResponse = await response.json();

          // Validation des données utilisateur
          if (!userData?.email) {
            console.error("Invalid user data");
            return null;
          }

          // Retourner l'utilisateur avec le rôle
          return {
            id: String(userData.id ?? userData.email),
            name: userData.name || userData.email,
            email: userData.email,
            role: userData.role || "admin",
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],

  // Configuration de session
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 heures
  },

  // Callbacks pour gérer JWT et session
  callbacks: {
    async jwt({ token, user }): Promise<ExtendedToken> {
      // Ajouter les données utilisateur au token lors de la connexion
      if (user) {
        const extendedUser = user as ExtendedUser;
        token.role = extendedUser.role;
        token.email = extendedUser.email;
        token.name = extendedUser.name;
      }
      return token;
    },

    async session({ session, token }): Promise<ExtendedSession> {
      // Ajouter les données du token à la session
      if (token && session.user) {
        const extendedToken = token as ExtendedToken;
        (session.user as any).role = extendedToken.role;
        session.user.email = extendedToken.email ?? null;
        session.user.name = extendedToken.name ?? null;
      }
      return session as ExtendedSession;
    },
  },

  // Pages personnalisées
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },

  // Secret pour JWT
  secret: process.env.NEXTAUTH_SECRET,

  // Debug en développement
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
