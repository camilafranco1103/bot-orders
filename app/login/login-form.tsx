"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const inputClass =
  "border-borde-fuerte bg-superficie focus-visible:outline-primario min-h-11 w-full rounded-[10px] border px-3.5 text-base focus-visible:outline-2";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-bold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state.email}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-bold">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>

      {state.error && (
        <p role="alert" className="bg-alerta-suave text-alerta-texto rounded-[10px] p-3 text-sm">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-primario text-superficie hover:bg-primario-oscuro focus-visible:outline-primario min-h-11 rounded-[10px] px-4 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60"
      >
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
