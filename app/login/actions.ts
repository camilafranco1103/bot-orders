"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/server/auth";

export type LoginState = { error?: string; email?: string };

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");

  try {
    await signIn("credentials", {
      email,
      password: formData.get("password"),
      redirectTo: "/panel",
    });
  } catch (error) {
    // El mensaje no aclara qué falló, para no revelar qué emails existen.
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      return { email, error: "El email o la contraseña no son correctos." };
    }
    if (error instanceof AuthError) {
      return { email, error: "No pudimos iniciar sesión. Probá de nuevo en un momento." };
    }
    throw error; // la redirección al panel también viaja como excepción
  }
  return {};
}
