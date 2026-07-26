import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = request.cookies.get("google_oauth_state")?.value;

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(
      new URL("/login?erro=google_falhou", request.url)
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL("/login?erro=google_nao_configurado", request.url)
    );
  }

  const redirectUri = new URL("/api/auth/google/callback", request.url).toString();

  try {
    // 1. Troca o code pelo access_token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      throw new Error("Falha ao trocar o código pelo token do Google.");
    }
    const tokenData = await tokenRes.json();

    // 2. Busca os dados do usuário
    const profileRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    );
    if (!profileRes.ok) {
      throw new Error("Falha ao buscar perfil do Google.");
    }
    const profile = await profileRes.json();

    const googleId: string = profile.sub;
    const email: string = profile.email;
    const name: string = profile.name ?? email;

    // 3. Cria ou atualiza o usuário local
    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId }, { email }] },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { name, email, googleId },
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId },
      });
    }

    await setSessionCookie({ userId: user.id, role: user.role });

    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("google_oauth_state");
    return response;
  } catch (error) {
    console.error("Erro no login com Google:", error);
    return NextResponse.redirect(
      new URL("/login?erro=google_falhou", request.url)
    );
  }
}
