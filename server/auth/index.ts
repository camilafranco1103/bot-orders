import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "../../lib/prisma";
import { authorizeUser } from "./authorize";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // La sesión viaja en una cookie firmada y cifrada (JWT): no se guarda en la base.
  session: { strategy: "jwt", maxAge: 60 * 60 * 12 },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: (credentials) =>
        authorizeUser(credentials, (email) => prisma.user.findUnique({ where: { email } })),
    }),
  ],
  callbacks: {
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
