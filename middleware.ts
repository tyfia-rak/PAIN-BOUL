import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier uniquement les routes /admin et /dashboard (sauf /admin/login)
  const isProtectedRoute = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");

  const isLoginPage = pathname === "/admin/login";

  // Ne pas bloquer la page de login
  if (isLoginPage) {
    return NextResponse.next();
  }

  // Vérifier l'authentification pour les routes protégées
  if (isProtectedRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // Rediriger vers la page de login si non authentifié
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // Vérifier le rôle admin (optionnel)
    if (token.role !== "admin" && token.role !== "owner") {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Configuration des routes à protéger
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
