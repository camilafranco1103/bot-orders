import { redirect } from "next/navigation";

// La app es el panel del equipo: la portada manda directo ahí.
export default function Home() {
  redirect("/panel");
}
