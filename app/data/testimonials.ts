/**
 * Testimonios de clientes.
 *
 * COMPLETAR: la sección "Lo que dicen nuestros clientes" aparece en el sitio
 * SOLO cuando esta lista tiene al menos un testimonio. Mientras esté vacía, no se
 * muestra nada (así nunca se publica un testimonio inventado).
 *
 * Pidanle a cada cliente (por ejemplo Carolina García, Danger Fitness o Vivero
 * El Paraíso) una frase corta con su permiso para publicarla, y agréguenla así:
 *
 *   {
 *     quote: "Texto real que escribió el cliente.",
 *     name: "Nombre de la persona",
 *     business: "Negocio o proyecto",
 *   },
 */
export type Testimonial = {
  quote: string;
  name: string;
  business: string;
};

export const TESTIMONIALS: readonly Testimonial[] = [];
