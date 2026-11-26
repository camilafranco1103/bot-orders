import type { Metadata } from "next";
import { Marca } from "@/components/marca";
import { SelloSinTacc } from "@/components/sello-sin-tacc";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Ingresar · Rotisería Sin TACC" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <div className="border-borde bg-superficie flex w-full max-w-sm flex-col gap-6 rounded-2xl border p-6 sm:p-8">
        <header className="flex flex-col items-start gap-4">
          <Marca />
          <SelloSinTacc />
          <h1 className="font-titulo text-3xl font-semibold">Ingresar</h1>
        </header>
        <LoginForm />
      </div>
    </main>
  );
}
