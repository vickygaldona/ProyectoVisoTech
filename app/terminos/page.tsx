import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y condiciones | VisoTech",
  description:
    "Condiciones de uso del sitio web de VisoTech, el contenido de las propuestas y el alcance de la información publicada.",
};

const UPDATED = "15 de octubre de 2026";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-50">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-zinc-300">
        {children}
      </div>
    </section>
  );
}

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-16 text-zinc-300 md:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-md text-sm text-cyan-300 transition-colors hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
        >
          ← Volver al inicio
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-50 md:text-4xl">
          Términos y condiciones
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Última actualización: {UPDATED}
        </p>

        <p className="mt-8 text-base leading-relaxed text-zinc-300">
          Estos términos regulan el uso del sitio web de VisoTech. Al navegarlo
          aceptás las condiciones que se detallan a continuación. Si no estás de
          acuerdo con alguna, te pedimos que no lo utilices.
        </p>

        <Section title="1. Quiénes somos">
          <p>
            VisoTech es un proyecto de desarrollo web de Santiago y Victoria, con
            base en San Rafael, Mendoza, Argentina. Podés contactarnos por
            WhatsApp: Santiago al +54 9 2625 649736 o Victoria al
            +54 9 2604 811080.
          </p>
        </Section>

        <Section title="2. Información del sitio">
          <p>
            El sitio presenta nuestros servicios (landing pages, invitaciones
            digitales, cartas o catálogos digitales y proyectos personalizados)
            y tiene carácter informativo. Nos esforzamos por mantener los
            contenidos actualizados, pero pueden cambiar sin previo aviso.
          </p>
        </Section>

        <Section title="3. Presupuestos y propuestas">
          <p>
            Los precios dependen de cada proyecto y no figuran en el sitio. Las
            propuestas en PDF y la información de cada servicio son orientativas
            y no constituyen una oferta definitiva ni un contrato.
          </p>
          <p>
            Las condiciones concretas de un trabajo (alcance, precio, plazos,
            forma de pago y revisiones) se acuerdan por separado, en el
            presupuesto o la confirmación que enviamos a cada cliente.
          </p>
        </Section>

        <Section title="4. Propiedad intelectual">
          <p>
            El diseño, los textos, el código y demás contenidos propios de este
            sitio pertenecen a VisoTech. No está permitido copiarlos,
            reproducirlos ni usarlos con fines comerciales sin nuestra
            autorización previa.
          </p>
          <p>
            Las demos del portfolio corresponden a trabajos realizados para
            terceros. Sus marcas, nombres y contenidos pertenecen a sus
            respectivos titulares y se muestran como ejemplo de nuestro trabajo.
          </p>
        </Section>

        <Section title="5. Enlaces a sitios de terceros">
          <p>
            El sitio contiene enlaces a páginas externas, como las demos del
            portfolio y WhatsApp. No controlamos su contenido ni su
            disponibilidad, y no somos responsables por lo que allí se publique
            o por el uso que hagas de ellos.
          </p>
        </Section>

        <Section title="6. Uso adecuado">
          <p>
            Te comprometés a usar el sitio de manera lícita y a no intentar
            dañarlo, interferir con su funcionamiento ni acceder a partes que no
            estén destinadas al público.
          </p>
        </Section>

        <Section title="7. Limitación de responsabilidad">
          <p>
            Hacemos lo posible para que el sitio funcione correctamente, pero no
            garantizamos que esté siempre disponible ni libre de errores. En la
            medida que la ley lo permita, VisoTech no responde por daños
            derivados del uso del sitio o de la imposibilidad de usarlo.
          </p>
        </Section>

        <Section title="8. Privacidad">
          <p>
            El tratamiento de tus datos personales se explica en nuestra{" "}
            <Link
              href="/privacidad"
              className="text-cyan-300 underline underline-offset-4 hover:text-cyan-200"
            >
              Política de privacidad
            </Link>
            .
          </p>
        </Section>

        <Section title="9. Cambios en estos términos">
          <p>
            Podemos modificar estos términos cuando sea necesario. La versión
            vigente es la publicada en esta página, con la fecha de su última
            actualización.
          </p>
        </Section>

        <Section title="10. Ley aplicable y jurisdicción">
          <p>
            Estos términos se rigen por las leyes de la República Argentina.
            Ante cualquier controversia, serán competentes los tribunales
            ordinarios de San Rafael, Mendoza, sin perjuicio de los derechos que
            la ley reconozca a los consumidores.
          </p>
        </Section>
      </div>
    </main>
  );
}
