import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de privacidad | VisoTech",
  description:
    "Cómo VisoTech trata los datos personales de quienes visitan el sitio o nos escriben por WhatsApp.",
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

export default function PrivacidadPage() {
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
          Política de privacidad
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Última actualización: {UPDATED}
        </p>

        <p className="mt-8 text-base leading-relaxed text-zinc-300">
          En VisoTech nos importa tu privacidad. Esta política explica qué datos
          personales pueden tratarse cuando visitás este sitio o nos escribís, y
          qué derechos tenés sobre ellos.
        </p>

        <Section title="1. Quiénes somos">
          <p>
            VisoTech es un proyecto de desarrollo web de Santiago y Victoria, con
            base en San Rafael, Mendoza, Argentina. Somos los responsables del
            tratamiento de los datos que se describen en esta política.
          </p>
          <p>
            Para cualquier consulta sobre tus datos, escribinos por WhatsApp:
            Santiago al +54 9 2625 649736 o Victoria al +54 9 2604 811080.
          </p>
        </Section>

        <Section title="2. Qué datos tratamos">
          <p>
            Este sitio no tiene formularios, cuentas de usuario ni registro.
            Los datos que pueden llegar a nosotros son pocos:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-zinc-100">Si nos escribís por WhatsApp:</strong>{" "}
              tu número de teléfono, tu nombre de perfil y el contenido de los
              mensajes que nos envíes.
            </li>
            <li>
              <strong className="text-zinc-100">Datos técnicos de navegación:</strong>{" "}
              como la dirección IP, el tipo de navegador y las páginas visitadas.
              Estos datos los puede registrar automáticamente el proveedor de
              hosting del sitio, por razones de seguridad y funcionamiento.
            </li>
          </ul>
          <p>
            Por ahora no usamos herramientas de analítica ni cookies de
            seguimiento o publicidad. Si en el futuro las incorporamos,
            actualizaremos esta política.
          </p>
        </Section>

        <Section title="3. Para qué usamos los datos">
          <ul className="list-disc space-y-2 pl-6">
            <li>Responder tus consultas.</li>
            <li>Armar presupuestos y propuestas para tu proyecto.</li>
            <li>Mantener la seguridad y el correcto funcionamiento del sitio.</li>
          </ul>
          <p>
            No vendemos tus datos ni los usamos para enviarte publicidad que no
            pediste.
          </p>
        </Section>

        <Section title="4. Con quién los compartimos">
          <p>
            No compartimos tus datos con terceros, salvo los servicios que
            hacen posible el sitio y la comunicación:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-zinc-100">WhatsApp (Meta):</strong> al tocar
              un botón de contacto se abre WhatsApp con un mensaje precargado.
              Desde ahí, la conversación se rige por las políticas de WhatsApp.
            </li>
            <li>
              <strong className="text-zinc-100">Proveedor de hosting:</strong>{" "}
              donde está alojado el sitio.
            </li>
          </ul>
          <p>
            También podríamos compartir datos si una autoridad competente lo
            exige conforme a la ley.
          </p>
        </Section>

        <Section title="5. Enlaces a otros sitios">
          <p>
            En el portfolio mostramos demos que se alojan en otros sitios web.
            No controlamos su contenido ni sus políticas de privacidad, así que
            te recomendamos revisarlas cuando los visites.
          </p>
        </Section>

        <Section title="6. Cuánto tiempo conservamos los datos">
          <p>
            Conservamos tus mensajes y datos de contacto mientras sean
            necesarios para atender tu consulta o el trabajo que acordemos.
            Pasado ese tiempo, o si nos lo pedís, los eliminamos.
          </p>
        </Section>

        <Section title="7. Tus derechos">
          <p>
            Según la Ley 25.326 de Protección de Datos Personales de la
            República Argentina, tenés derecho a acceder a tus datos,
            rectificarlos, actualizarlos y pedir su supresión. Para ejercer
            cualquiera de estos derechos, escribinos por WhatsApp a los números
            indicados arriba.
          </p>
          <p>
            La Agencia de Acceso a la Información Pública (AAIP) es el órgano de
            control de esa ley y atiende las denuncias y reclamos de las
            personas que consideren afectados sus derechos.
          </p>
        </Section>

        <Section title="8. Cambios en esta política">
          <p>
            Podemos actualizar esta política cuando sea necesario. Siempre vas a
            ver la fecha de la última actualización al comienzo de esta página.
          </p>
        </Section>

        <div className="mt-14 border-t border-white/10 pt-6 text-sm text-zinc-400">
          Consultá también nuestros{" "}
          <Link
            href="/terminos"
            className="text-cyan-300 underline underline-offset-4 hover:text-cyan-200"
          >
            Términos y condiciones
          </Link>
          .
        </div>
      </div>
    </main>
  );
}
