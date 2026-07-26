import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Next.js 16 renomeou "middleware.ts" para "proxy.ts" (mesma função, nome novo).
// Aqui fazemos só uma checagem "otimista": se não tem cookie de sessão válido,
// manda pro login. A validação de verdade (dono do pedido, role de admin, etc.)
// continua sendo feita dentro de cada página/Server Action/rota de API.

const SESSION_COOKIE = "egtech_session";

async function temSessaoValida(token: string | undefined) {
  if (!token) return null;
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload as { userId: string; role: "CUSTOMER" | "ADMIN" };
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await temSessaoValida(token);
  const { pathname } = request.nextUrl;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin") && session.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/minha-conta/:path*", "/meu-perfil/:path*", "/checkout/:path*"],
};
