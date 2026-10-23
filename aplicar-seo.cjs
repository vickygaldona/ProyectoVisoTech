// Codemod 7: vista previa al compartir (WhatsApp, redes), sitemap y robots.
//  - Crea app/site-url.ts con la URL del sitio (un solo lugar para cambiarla).
//  - Crea app/opengraph-image.tsx (imagen de 1200x630 generada desde el código).
//  - Crea app/sitemap.ts y app/robots.ts.
//  - Edita app/layout.tsx: metadataBase, canonical y url de Open Graph.
// Si algo no está donde se espera, no escribe nada.
// Uso: node aplicar-seo.cjs   (parado en la carpeta del proyecto)

const fs = require("fs");

const SITE = "https://visotecharg.netlify.app";
const layoutPath = "app/layout.tsx";

if (!fs.existsSync(layoutPath)) {
  console.log(`No encontré ${layoutPath}. Corré el script desde la carpeta del proyecto.`);
  process.exit(1);
}

/* ---------- archivos nuevos ---------- */

const nuevos = {
  "app/site-url.ts": `// URL pública del sitio. Si más adelante usás un dominio propio, cambialo solo acá.
export const SITE_URL = "${SITE}";
`,

  "app/sitemap.ts": `import type { MetadataRoute } from "next";
import { SITE_URL } from "./site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: \`\${SITE_URL}/privacidad\`, changeFrequency: "yearly", priority: 0.3 },
    { url: \`\${SITE_URL}/terminos\`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
`,

  "app/robots.ts": `import type { MetadataRoute } from "next";
import { SITE_URL } from "./site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: \`\${SITE_URL}/sitemap.xml\`,
  };
}
`,

  "app/opengraph-image.tsx": `import { ImageResponse } from "next/og";

export const alt = "VisoTech: webs visuales para negocios y eventos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 20% 15%, #6b21a8 0%, #1e1b4b 40%, #000000 80%)",
          color: "#fafafa",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 132,
            fontWeight: 700,
            letterSpacing: -3,
          }}
        >
          VisoTech
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 44,
            color: "#d4d4d8",
            textAlign: "center",
          }}
        >
          Webs visuales para negocios y eventos
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 56,
            fontSize: 30,
            color: "#67e8f9",
          }}
        >
          San Rafael, Mendoza
        </div>
      </div>
    ),
    { ...size },
  );
}
`,
};

/* ---------- edición del layout ---------- */

const original = fs.readFileSync(layoutPath, "utf8");
const crlf = original.includes("\r\n");
let layout = crlf ? original.replace(/\r\n/g, "\n") : original;

const edits = [
  {
    nombre: "import de SITE_URL",
    hecho: 'import { SITE_URL } from "./site-url";',
    antes: 'import "./globals.css";',
    despues: 'import "./globals.css";\nimport { SITE_URL } from "./site-url";',
  },
  {
    nombre: "metadataBase y canonical",
    hecho: "metadataBase: new URL(SITE_URL),",
    antes: "export const metadata: Metadata = {",
    despues:
      "export const metadata: Metadata = {\n  metadataBase: new URL(SITE_URL),\n  alternates: { canonical: \"/\" },",
  },
  {
    nombre: "url de Open Graph",
    hecho: '    url: "/",\n    siteName: "VisoTech",',
    antes: '    siteName: "VisoTech",',
    despues: '    url: "/",\n    siteName: "VisoTech",',
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

/* ---------- escritura (recién ahora, con todo verificado) ---------- */

for (const [ruta, contenido] of Object.entries(nuevos)) {
  if (fs.existsSync(ruta)) {
    console.log(`- ${ruta} ya existe: lo dejo como está.`);
  } else {
    fs.writeFileSync(ruta, contenido);
    console.log(`+ Creado: ${ruta}`);
  }
}

if (pendientes.length > 0) {
  for (const e of pendientes) {
    layout = layout.replace(e.antes, e.despues);
    console.log(`+ Layout: ${e.nombre}`);
  }
  if (crlf) layout = layout.replace(/\n/g, "\r\n");
  fs.writeFileSync(layoutPath, layout);
}

console.log("Listo.");
