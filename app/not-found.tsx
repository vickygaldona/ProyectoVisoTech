import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada | VisoTech",
  robots: { index: false, follow: false },
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-1 flex-col items-center justify-center overflow-hidden bg-black px-4 py-24 text-center text-zinc-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-purple-600/30 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-fuchsia-600/25 blur-3xl" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 flex max-w-xl flex-col items-center">
        <p
          aria-hidden="true"
          className="bg-gradient-to-br from-gray-50 to-gray-500 bg-clip-text text-8xl font-bold tracking-tight text-transparent sm:text-9xl"
        >
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Esta página no existe
        </h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-300">
          Puede que el enlace esté mal escrito o que la página ya no esté
          disponible. Volvé al inicio o mirá los servicios de VisoTech.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className={`inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white px-8 text-[15px] font-medium text-neutral-950 transition-colors hover:bg-zinc-200 ${focusRing}`}
          >
            Volver al inicio
          </Link>
          <Link
            href="/#servicios"
            className={`inline-flex h-12 items-center justify-center rounded-xl border border-white/40 bg-transparent px-8 text-[15px] font-medium text-white transition-colors hover:bg-white hover:text-neutral-950 ${focusRing}`}
          >
            Ver servicios
          </Link>
        </div>
      </div>
    </main>
  );
}