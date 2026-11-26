import type { Metadata } from "next";
import { SelloSinTacc } from "@/components/sello-sin-tacc";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Ingresar · Rotisería Sin TACC" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <div className="border-borde bg-superficie flex w-full max-w-sm flex-col gap-6 rounded-2xl border p-6 sm:p-8">
        <header className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="bg-primario text-superficie font-titulo flex size-9 items-center justify-center rounded-[10px] text-lg font-semibold"
            >
              R
            </span>
            <div className="leading-snug">
              <p className="text-[13px] font-bold">Rotisería Sin TACC</p>
              <p className="text-texto-suave text-xs">Panel del equipo</p>
            </div>
          </div>
          <SelloSinTacc />
          <h1 className="font-titulo text-3xl font-semibold">Ingresar</h1>
        </header>
        <LoginForm />
      </div>
    </main>
  );
}
