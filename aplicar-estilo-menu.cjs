/* eslint-disable */
/**
 * Codemod - Estilo del menú circular (como la imagen de referencia)
 *
 * Uso (desde la carpeta del proyecto, al lado de package.json):
 *   node aplicar-estilo-menu.cjs
 *
 * IMPORTANTE: correr primero  node aplicar-menu.cjs  (pasa el menú a círculo completo).
 *
 * Qué cambia (solo estilo, no toca íconos, textos ni lógica):
 *   - Accesos un poco más grandes (48 -> 52 px) y círculo más abierto (112 -> 140 px).
 *   - Accesos en gris oscuro liso: sin borde, sin sombra y sin desenfoque.
 *   - Botón central blanco liso: sin brillo celeste alrededor.
 *
 * Todo o nada, idempotente y respeta los saltos de línea (CRLF de Windows).
 * Para deshacer:  git checkout app/components/ui/circle-menu.tsx
 */
const fs = require("fs");

const COMPONENT = "app/components/ui/circle-menu.tsx";

if (!fs.existsSync(COMPONENT)) {
  console.error("No encuentro " + COMPONENT + ". Corré este script desde la carpeta del proyecto.");
  process.exit(1);
}

const original = fs.readFileSync(COMPONENT, "utf8");
const eol = original.includes("\r\n") ? "\r\n" : "\n";
let src = original.replace(/\r\n/g, "\n");

if (!src.includes("pointOnCircle")) {
  console.error(
    "El menú todavía está en versión abanico. Corré primero:  node aplicar-menu.cjs  y después este script.",
  );
  process.exit(1);
}

// done = texto que existe solo si el cambio ya estaba aplicado.
const EDITS = [
  {
    name: "tamaño de los accesos",
    from: "const ITEM_SIZE = 48;",
    to: "const ITEM_SIZE = 52;",
    done: "const ITEM_SIZE = 52;",
  },
  {
    name: "radio del círculo",
    from: "const RADIUS = 112;",
    to: "const RADIUS = 140;",
    done: "const RADIUS = 140;",
  },
  {
    name: "estilo de los accesos",
    from: "border border-white/15 bg-zinc-900/85 text-zinc-100 shadow-lg backdrop-blur-md transition-colors hover:bg-zinc-800",
    to: "bg-neutral-800 text-zinc-100 transition-colors hover:bg-neutral-700",
    done: "bg-neutral-800 text-zinc-100 transition-colors hover:bg-neutral-700",
  },
  {
    name: "botón central",
    from: "bg-zinc-100 text-black shadow-[0_0_0_1px_rgba(255,255,255,0.25),0_8px_30px_rgba(34,211,238,0.25)] transition-[filter]",
    to: "bg-zinc-100 text-black transition-[filter]",
    done: "bg-zinc-100 text-black transition-[filter]",
  },
];

const count = (text, piece) => text.split(piece).length - 1;

// Primero se valida todo; recién después se escribe (todo o nada).
const pending = [];
for (const edit of EDITS) {
  if (count(src, edit.done) >= 1) {
    console.log("  = " + edit.name + ": ya estaba aplicado");
    continue;
  }
  const n = count(src, edit.from);
  if (n !== 1) {
    console.error(
      "No pude aplicar '" + edit.name + "' (encontré " + n + " coincidencias). No se cambió nada.",
    );
    process.exit(1);
  }
  pending.push(edit);
}

if (pending.length === 0) {
  console.log("Nada para hacer: el estilo ya está aplicado.");
  process.exit(0);
}

for (const edit of pending) {
  src = src.replace(edit.from, () => edit.to);
  console.log("  + " + edit.name);
}

fs.writeFileSync(COMPONENT, src.replace(/\n/g, eol), "utf8");
console.log("Listo: " + COMPONENT + " actualizado.");
