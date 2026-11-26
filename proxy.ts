import { NextResponse } from "next/server";
import { auth } from "@/server/auth";

// Primera barrera: corre antes de cada ruta protegida. Cada página y endpoint
// vuelve a verificar el usuario con requireUser().
export default auth((request) => {
  if (request.auth) return;

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/login", request.nextUrl));
});

export const config = {
  // Quedan afuera el login, los webhooks (validan la firma de Meta) y el cron (usa su secreto).
  matcher: ["/panel/:path*", "/api/((?!auth/|webhooks/|cron/).*)"],
};
