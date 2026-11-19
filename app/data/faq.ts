/**
 * Preguntas frecuentes que se muestran en el sitio.
 *
 * Todo lo que dice acá sale de las propuestas en PDF (public/propuestas/) y del
 * propio sitio. No se agregó nada que no esté ahí.
 */
export type FaqItem = { question: string; answer: string };

export const FAQ: readonly FaqItem[] = [
  {
    question: "¿Cómo empiezo?",
    answer:
      "Escribinos por WhatsApp a Santiago o a Victoria (también podés usar el formulario o escribirnos por mail) y contanos qué necesitás. Con eso armamos un presupuesto a medida de tu proyecto.",
  },
  {
    question: "¿Qué incluye el precio?",
    answer:
      "Cada precio corresponde al alcance detallado en la propuesta en PDF de ese servicio, que podés descargar desde la tarjeta del plan. Lo que quede fuera de ese alcance se cotiza aparte.",
  },
  {
    question: "¿Cuánto tarda en estar lista mi web?",
    answer:
      "Los plazos los coordinamos con vos según el alcance de tu proyecto.",
  },
  {
    question: "¿Ustedes publican la web?",
    answer:
      "En la landing page para negocios incluimos SEO básico y la publicación de la web. En los demás servicios, el detalle de lo que incluye está en la propuesta en PDF de cada uno.",
  },
  {
    question: "¿Puedo cobrar o recibir pedidos online desde la web?",
    answer:
      "Los pagos no se procesan en el sitio. En el catálogo con carrito el pedido se confirma por WhatsApp y no incluye pasarela de pago, la carta digital no incluye pagos ni pedidos online, y en las landings para cursos las inscripciones y los pagos se coordinan por WhatsApp.",
  },
  {
    question: "¿Se ve bien desde el celular?",
    answer:
      "Sí. Diseñamos pensando en el celular, que es desde donde la mayoría abre las webs, y las adaptamos también a tablets y computadoras.",
  },
];

/**
 * PREGUNTAS POR COMPLETAR (COMPLETAR)
 *
 * Estas preguntas son las que más hacen los clientes, pero las propuestas en PDF
 * no responden nada sobre ellas, así que no se muestran en el sitio.
 * Cuando decidan la respuesta, pasenlas a la lista FAQ de arriba.
 *
 *  - ¿El hosting y el dominio están incluidos? ¿Cuánto cuestan por año?
 *  - ¿Cómo se paga? ¿Hay seña? ¿Qué formas de pago aceptan?
 *  - ¿Cuántas rondas de cambios entran en el precio?
 *  - ¿Hacen mantenimiento después de la entrega? ¿Cuánto cuesta?
 */
