import { Boton } from "@/components/boton";
import { MarcoPanel } from "@/components/marco-panel";
import { logout } from "./actions";

// Un layout envuelve a todas las páginas de su carpeta y no se vuelve a armar al navegar.
// Por eso el control de acceso va en cada página y no acá.
export default function PanelLayout({ children }: LayoutProps<"/panel">) {
  const salir = (
    <form action={logout}>
      <Boton type="submit" variante="secundario">
        Cerrar sesión
      </Boton>
    </form>
  );

  return <MarcoPanel salir={salir}>{children}</MarcoPanel>;
}
