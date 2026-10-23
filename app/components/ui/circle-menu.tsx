"use client";

import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from "framer-motion";
import React from "react";
import { Menu, X } from "lucide-react";

/**
 * Menú circular en abanico (adaptado de "circle-menu").
 * - El botón queda fijo abajo al centro; al abrirlo, los accesos se despliegan
 *   en un semicírculo hacia arriba (así nunca se salen de la pantalla).
 * - Cada acceso es un <button> con su acción (sin enlaces vacíos).
 * - Teclado: Tab para recorrer, Escape para cerrar. Clic afuera también cierra.
 * - Respeta "reducir movimiento": sin resortes ni efectos de cierre.
 */

const ITEM_SIZE = 52;
const RADIUS = 144;
const ARC_START = 172; // grados: extremo izquierdo del abanico
const ARC_END = 8; // grados: extremo derecho del abanico
const OPEN_STAGGER = 0.025;
const CLOSE_STAGGER = 0.05;
const TRIGGER_BG = "#f4f4f5"; // zinc-100
const TRIGGER_RGB = [244, 244, 245] as const; // el mismo color, en números

/** Mezcla el color del botón con negro (pct = % del color del botón). */
const mixWithBlack = (pct: number) => {
  const [r, g, b] = TRIGGER_RGB.map((c) => Math.round((c * pct) / 100));
  return "rgb(" + r + ", " + g + ", " + b + ")";
};

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

export type CircleMenuItem = {
  id: string;
  /** Texto corto que se ve debajo del ícono. */
  label: string;
  /** Texto para lectores de pantalla (si falta, se usa label). */
  ariaLabel?: string;
  icon: React.ReactNode;
  onClick: () => void;
  /** Clases extra para el botón (por ejemplo, un color de ícono). */
  className?: string;
};

/** Punto del abanico (relativo al centro del botón principal). */
const pointOnArc = (index: number, total: number) => {
  const t = total > 1 ? index / (total - 1) : 0.5;
  const deg = ARC_START + (ARC_END - ARC_START) * t;
  const rad = (deg * Math.PI) / 180;
  return { x: Math.cos(rad) * RADIUS, y: -Math.sin(rad) * RADIUS };
};

type MenuItemProps = {
  item: CircleMenuItem;
  index: number;
  total: number;
  isOpen: boolean;
  reduce: boolean;
  onSelect: (item: CircleMenuItem) => void;
};

const MenuItem = ({ item, index, total, isOpen, reduce, onSelect }: MenuItemProps) => {
  const { x, y } = pointOnArc(index, total);
  const delay = isOpen ? index * OPEN_STAGGER : index * CLOSE_STAGGER;

  return (
    <motion.button
      type="button"
      aria-label={item.ariaLabel ?? item.label}
      initial={false}
      animate={{
        x: isOpen ? x : 0,
        y: isOpen ? y : 0,
        opacity: isOpen ? 1 : 0,
        scale: isOpen ? 1 : 0.6,
      }}
      whileHover={reduce ? undefined : { scale: 1.1, transition: { duration: 0.1, delay: 0 } }}
      transition={
        reduce
          ? { duration: 0 }
          : { delay, type: "spring", stiffness: 300, damping: 30 }
      }
      style={{
        height: ITEM_SIZE,
        width: ITEM_SIZE,
        marginLeft: -ITEM_SIZE / 2,
        pointerEvents: isOpen ? "auto" : "none",
      }}
      className={cn(
        "absolute bottom-0 left-1/2 flex cursor-pointer items-center justify-center rounded-full bg-neutral-800 text-zinc-100 transition-colors hover:bg-neutral-700",
        focusRing,
        item.className,
      )}
      onClick={() => onSelect(item)}
    >
      {item.icon}
      <motion.span
        aria-hidden="true"
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.2, delay: reduce || !isOpen ? 0 : 0.15 }}
        className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium text-zinc-100 [text-shadow:0_1px_8px_rgb(0,0,0)]"
      >
        {item.label}
      </motion.span>
    </motion.button>
  );
};

export const CircleMenu: React.FC<{
  items: CircleMenuItem[];
  className?: string;
  ariaLabel?: string;
}> = ({ items, className, ariaLabel = "Navegación principal" }) => {
  const reduce = Boolean(useReducedMotion());
  const [isOpen, setIsOpen] = React.useState(false);
  const navRef = React.useRef<HTMLElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const wasOpen = React.useRef(false);

  const triggerFx = useAnimationControls();
  const shakeFx = useAnimationControls();
  const ringFx = useAnimationControls();
  const total = items.length;

  // Clic afuera o Escape cierran el menú.
  React.useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  // Efecto de cierre: el botón "tiembla" y crece un poco mientras los accesos
  // vuelven al centro. Se omite si la persona pidió reducir el movimiento.
  React.useEffect(() => {
    if (isOpen) {
      wasOpen.current = true;
      // Si se reabrió a mitad del efecto, se deja el botón como estaba.
      shakeFx.stop();
      shakeFx.set({ x: 0 });
      triggerFx.set({ height: ITEM_SIZE, width: ITEM_SIZE, backgroundColor: TRIGGER_BG });
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    if (reduce) return;

    let cancelled = false;
    const run = async () => {
      shakeFx.start({
        x: [0, 2, -2, 0, 2, -2, 0],
        transition: {
          duration: CLOSE_STAGGER,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      });
      ringFx.start({
        rotate: -360,
        filter: "blur(1px)",
        transition: { duration: CLOSE_STAGGER * (total + 2), ease: "linear" },
      });

      const steps = Math.max(total - 1, 1);
      for (let i = 0; i < steps; i++) {
        if (cancelled) return;
        const size = Math.min(ITEM_SIZE * (1 + i * 0.15), ITEM_SIZE * 1.5);
        await triggerFx.start({
          height: size,
          width: size,
          backgroundColor: mixWithBlack(Math.max(100 - i * 10, 40)),
          transition: { duration: CLOSE_STAGGER / 2, ease: "linear" },
        });
        if (i !== steps - 1) {
          await new Promise((resolve) => setTimeout(resolve, CLOSE_STAGGER * 1000));
        }
      }
      if (cancelled) return;

      shakeFx.stop();
      shakeFx.set({ x: 0 });
      await ringFx.start({ rotate: 0, filter: "blur(0px)", transition: { duration: 0 } });
      if (cancelled) return;
      triggerFx.start({
        height: ITEM_SIZE,
        width: ITEM_SIZE,
        backgroundColor: TRIGGER_BG,
        transition: { duration: 0.1, ease: "backInOut" },
      });
    };
    void run();

    return () => {
      cancelled = true;
    };
  }, [isOpen, reduce, total, shakeFx, triggerFx, ringFx]);

  const handleSelect = (item: CircleMenuItem) => {
    setIsOpen(false);
    item.onClick();
  };

  const iconMotion = {
    initial: { opacity: 0, filter: "blur(10px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(10px)" },
    transition: { duration: reduce ? 0 : 0.2 },
  };

  return (
    <nav
      ref={navRef}
      aria-label={ariaLabel}
      style={{ width: RADIUS * 2 + ITEM_SIZE, height: RADIUS + ITEM_SIZE }}
      // El contenedor no bloquea clics: solo reciben clics el botón y los accesos.
      className={cn("pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-50 -translate-x-1/2", className)}
    >
      <div
        id="circle-menu-items"
        role="group"
        aria-label="Secciones del sitio y contacto"
        inert={!isOpen}
        className="pointer-events-none absolute inset-0"
      >
        <motion.div
          animate={ringFx}
          style={{ transformOrigin: `50% calc(100% - ${ITEM_SIZE / 2}px)` }}
          className="absolute inset-0"
        >
          {items.map((item, index) => (
            <MenuItem
              key={item.id}
              item={item}
              index={index}
              total={total}
              isOpen={isOpen}
              reduce={reduce}
              onSelect={handleSelect}
            />
          ))}
        </motion.div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center"
        style={{ height: ITEM_SIZE, width: ITEM_SIZE }}
      >
        <motion.div animate={shakeFx} className="pointer-events-auto">
          <motion.button
            ref={triggerRef}
            type="button"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
            aria-controls="circle-menu-items"
            animate={triggerFx}
            style={{ height: ITEM_SIZE, width: ITEM_SIZE }}
            className={cn(
              "relative flex cursor-pointer items-center justify-center rounded-full bg-zinc-100 text-black transition-[filter] duration-100 hover:brightness-110",
              focusRing,
            )}
            onClick={() => setIsOpen((open) => !open)}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {isOpen ? (
                <motion.span key="menu-close" {...iconMotion}>
                  <X size={18} aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span key="menu-open" {...iconMotion}>
                  <Menu size={18} aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>
    </nav>
  );
};
