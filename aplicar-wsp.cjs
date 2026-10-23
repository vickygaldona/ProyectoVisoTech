// Codemod 8: usa tu propia imagen (public/wsp.png) como vista previa al compartir.
//  - Agrega la imagen a Open Graph (WhatsApp, Facebook, LinkedIn) y a la tarjeta de X/Twitter.
//  - Borra app/opengraph-image.tsx (la imagen generada por código), para que no compitan.
// Antes de correrlo, tenés que haber guardado tu imagen en public/wsp.png.
// Uso: node aplicar-wsp.cjs   (parado en la carpeta del proyecto)

const fs = require("fs");

const layoutPath = "app/layout.tsx";
const imagenPath = "public/wsp.png";
const generadaPath = "app/opengraph-image.tsx";

if (!fs.existsSync(layoutPath)) {
  console.log(`No encontré ${layoutPath}. Corré el script desde la carpeta del proyecto.`);
  process.exit(1);
}

if (!fs.existsSync(imagenPath)) {
  console.log(`Todavía no está ${imagenPath}. Guardá tu imagen ahí y volvé a correr el script. No modifiqué nada.`);
  process.exit(1);
}

const original = fs.readFileSync(layoutPath, "utf8");
const crlf = original.includes("\r\n");
let layout = crlf ? original.replace(/\r\n/g, "\n") : original;

const edits = [
  {
    nombre: "imagen en Open Graph",
    hecho: 'url: "/wsp.png"',
    antes: '    siteName: "VisoTech",',
    despues:
      '    siteName: "VisoTech",\n' +
      "    images: [\n" +
      "      {\n" +
      '        url: "/wsp.png",\n' +
      "        width: 1200,\n" +
      "        height: 630,\n" +
      '        alt: "VisoTech: webs visuales para negocios y eventos",\n' +
      "      },\n" +
      "    ],",
  },
  {
    nombre: "tarjeta de X/Twitter",
    hecho: 'card: "summary_large_image"',
    antes: "  openGraph: {",
    despues:
      "  twitter: {\n" +
      '    card: "summary_large_image",\n' +
      '    images: ["/wsp.png"],\n' +
      "  },\n" +
      "  openGraph: {",
  },
];

const pendientes = [];
for (const e of edits) {
  if (layout.includes(e.hecho)) {
    console.log(`- Ya aplicado en layout: ${e.nombre}`);
    continue;
  }
  const veces = layout.split(e.antes).length - 1;
  if (veces !== 1) {
    console.log(
      `No encontré "${e.nombre}" exactamente una vez en layout.tsx (${veces}). No modifiqué nada.`,
    );
    process.exit(1);
  }
  pendientes.push(e);
}

if (pendientes.length > 0) {
  for (const e of pendientes) {
    layout = layout.replace(e.antes, e.despues);
    console.log(`+ Layout: ${e.nombre}`);
  }
  if (crlf) layout = layout.replace(/\n/g, "\r\n");
  fs.writeFileSync(layoutPath, layout);
}

if (fs.existsSync(generadaPath)) {
  fs.unlinkSync(generadaPath);
  console.log(`+ Borrado: ${generadaPath} (ya no hace falta)`);
} else {
  console.log(`- ${generadaPath} ya no existe.`);
}

console.log("Listo.");
