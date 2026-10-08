"use client";

/* eslint-disable @next/next/no-img-element */
// Dependencias: npm i gsap vecteur lucide-react framer-motion
// Requiere: Next.js (App Router) + TypeScript + Tailwind CSS 4

import * as React from "react";
import gsap from "gsap";
import { vec2, type Vec2 } from "vecteur";
import { motion, type Variants } from "framer-motion";
import {
  Home,
  LayoutGrid,
  Layers,
  MessageCircle,
  Rocket,
  ShoppingBag,
  CalendarCheck,
  Sparkles,
} from "lucide-react";

/* ============================================================
   CONSTANTES GLOBALES
   ============================================================ */

const WA_NUMBER = "549TU_NUMERO_ACA";
const WA_MESSAGE =
  "Hola VisoTech! Quiero consultar por un sitio web para mi negocio.";

const waLink = (message: string = WA_MESSAGE) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

const openWhatsApp = (message?: string) => {
  window.open(waLink(message), "_blank", "noopener,noreferrer");
};

const goTo = (id: string) => {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const GLOBAL_CSS = `
:root{--aurora-color1:rgba(168,85,247,0.2);--aurora-color2:rgba(79,70,229,0.2)}
html{scroll-behavior:smooth;background:#000}
@keyframes vt-pulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:.7;transform:scale(1.05)}}
@keyframes vt-wave{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
html.vt-cursor,html.vt-cursor *{cursor:none !important}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
`;

/* ============================================================
   MAGNETIC CURSOR
   ============================================================ */

interface MagneticCursorProps {
  children: React.ReactNode;
  magneticFactor?: number;
  lerpAmount?: number;
  hoverPadding?: number;
  hoverAttribute?: string;
  cursorSize?: number;
  cursorColor?: string;
  blendMode?: "difference" | "exclusion" | "normal" | "screen" | "overlay";
  cursorClassName?: string;
  shape?: "circle" | "square" | "rounded-square";
  disableOnTouch?: boolean;
  speedMultiplier?: number;
  maxScaleX?: number;
  maxScaleY?: number;
  contrastBoost?: number;
}

interface CursorState {
  el: HTMLDivElement | null;
  pos: {
    current: Vec2;
    target: Vec2;
    previous: Vec2;
  };
  hover: { isHovered: boolean };
  isDetaching: boolean;
}

const MagneticCursor: React.FC<MagneticCursorProps> = ({
  children,
  lerpAmount = 0.1,
  magneticFactor = 0.2,
  hoverPadding = 12,
  hoverAttribute = "data-magnetic",
  cursorSize = 24,
  cursorColor = "white",
  blendMode = "exclusion",
  cursorClassName = "",
  shape = "circle",
  disableOnTouch = true,
  speedMultiplier = 0.02,
  maxScaleX = 1,
  maxScaleY = 0.3,
  contrastBoost = 1.5,
}) => {
  const cursorRef = React.useRef<HTMLDivElement>(null);
  const cursorStateRef = React.useRef<CursorState | null>(null);
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  const configRef = React.useRef({
    magneticFactor,
    speedMultiplier,
    maxScaleX,
    maxScaleY,
    cursorSize,
    lerpAmount,
    hoverPadding,
  });

  React.useEffect(() => {
    configRef.current = {
      magneticFactor,
      speedMultiplier,
      maxScaleX,
      maxScaleY,
      cursorSize,
      lerpAmount,
      hoverPadding,
    };
  }, [
    magneticFactor,
    speedMultiplier,
    maxScaleX,
    maxScaleY,
    cursorSize,
    lerpAmount,
    hoverPadding,
  ]);

  React.useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  React.useEffect(() => {
    if (disableOnTouch && isTouchDevice) return;
    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    document.documentElement.classList.add("vt-cursor");
    gsap.set(cursorEl, { xPercent: -50, yPercent: -50 });

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const detachDuration = prefersReducedMotion ? 0.1 : 0.35;

    if (!cursorStateRef.current) {
      cursorStateRef.current = {
        el: cursorEl,
        pos: {
          current: vec2(-100, -100),
          target: vec2(-100, -100),
          previous: vec2(-100, -100),
        },
        hover: { isHovered: false },
        isDetaching: false,
      };
    }

    const update = () => {
      const state = cursorStateRef.current;
      if (!state || state.hover.isHovered) return;

      const { speedMultiplier, maxScaleX, maxScaleY, lerpAmount } =
        configRef.current;
      const effectiveLerp = prefersReducedMotion ? 1 : lerpAmount;

      state.pos.current.lerp(state.pos.target, effectiveLerp);
      const delta = state.pos.current.clone().sub(state.pos.previous);
      state.pos.previous.copy(state.pos.current);

      if (state.isDetaching) {
        gsap.set(state.el, {
          x: state.pos.current.x,
          y: state.pos.current.y,
          scaleX: 1,
          scaleY: 1,
          rotate: 0,
          overwrite: "auto",
        });
      } else {
        const speed =
          Math.sqrt(delta.x * delta.x + delta.y * delta.y) * speedMultiplier;
        gsap.set(state.el, {
          x: state.pos.current.x,
          y: state.pos.current.y,
          rotate: Math.atan2(delta.y, delta.x) * (180 / Math.PI),
          scaleX: 1 + Math.min(speed, maxScaleX),
          scaleY: 1 - Math.min(speed, maxScaleY),
          overwrite: "auto",
        });
      }
    };

    const initializePosition = (event: MouseEvent) => {
      const state = cursorStateRef.current;
      if (!state) return;
      const x = event.clientX;
      const y = event.clientY;
      state.pos.current.x = x;
      state.pos.current.y = y;
      state.pos.target.x = x;
      state.pos.target.y = y;
      state.pos.previous.x = x;
      state.pos.previous.y = y;
      gsap.set(cursorEl, { x, y, opacity: 1 });
    };

    const onMouseMove = (event: PointerEvent) => {
      const state = cursorStateRef.current;
      if (!state) return;

      state.pos.target.x = event.clientX;
      state.pos.target.y = event.clientY;

      const isInViewport =
        event.clientX >= 0 &&
        event.clientX <= window.innerWidth &&
        event.clientY >= 0 &&
        event.clientY <= window.innerHeight;

      gsap.to(cursorEl, {
        opacity: isInViewport ? 1 : 0,
        duration: 0.2,
        overwrite: "auto",
      });

      const target = event.target as HTMLElement;
      const isTextContent =
        ["P", "SPAN", "H1", "H2", "H3", "H4", "H5", "H6"].includes(
          target.tagName,
        ) || window.getComputedStyle(target).cursor === "text";

      if (isTextContent && !state.hover.isHovered && !state.isDetaching) {
        gsap.to(cursorEl, {
          scaleX: 0.5,
          scaleY: 1.5,
          duration: 0.3,
          overwrite: "auto",
        });
      }
    };

    const handleMouseLeave = () =>
      gsap.to(cursorEl, { opacity: 0, duration: 0.3 });
    const handleMouseEnter = () =>
      gsap.to(cursorEl, { opacity: 1, duration: 0.3 });

    gsap.ticker.add(update);
    window.addEventListener("pointermove", onMouseMove);
    window.addEventListener("pointermove", initializePosition, { once: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    const cleanupFunctions: (() => void)[] = [];

    const magneticElements = gsap.utils.toArray<HTMLElement>(
      `[${hoverAttribute}]`,
    );
    magneticElements.forEach((el) => {
      const xTo = gsap.quickTo(el, "x", {
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      });
      const yTo = gsap.quickTo(el, "y", {
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      });

      const handlePointerEnter = () => {
        const state = cursorStateRef.current;
        if (!state) return;
        const { magneticFactor, hoverPadding } = configRef.current;

        state.hover.isHovered = true;
        state.isDetaching = false;

        const bounds = el.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(el);
        const magneticColor =
          el.getAttribute("data-magnetic-color") || cursorColor;
        const dynamicPadding = hoverPadding * (1 + magneticFactor);
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;

        gsap.killTweensOf(cursorEl);
        gsap.to(cursorEl, {
          x: centerX,
          y: centerY,
          width: bounds.width + dynamicPadding * 2,
          height: bounds.height + dynamicPadding * 2,
          borderRadius: computedStyle.borderRadius,
          backgroundColor: magneticColor,
          scaleX: 1,
          scaleY: 1,
          rotate: 0,
          duration: 0.3,
          ease: "power3.out",
          overwrite: "all",
        });
      };

      const handlePointerLeave = () => {
        const state = cursorStateRef.current;
        if (!state) return;
        const currentX = gsap.getProperty(cursorEl, "x") as number;
        const currentY = gsap.getProperty(cursorEl, "y") as number;

        state.pos.current.x = currentX;
        state.pos.current.y = currentY;
        state.pos.previous.x = currentX;
        state.pos.previous.y = currentY;

        state.hover.isHovered = false;
        state.isDetaching = true;

        const { cursorSize } = configRef.current;
        const shapeBorderRadius =
          shape === "circle" ? "50%" : shape === "square" ? "0" : "8px";

        gsap.killTweensOf(cursorEl);
        gsap.to(cursorEl, {
          width: cursorSize,
          height: cursorSize,
          borderRadius: shapeBorderRadius,
          backgroundColor: cursorColor,
          scaleX: 1,
          scaleY: 1,
          duration: detachDuration,
          ease: "power3.out",
          overwrite: "all",
          onComplete: () => {
            state.isDetaching = false;
          },
        });
      };

      let rafId: number | null = null;
      const handlePointerMove = (event: PointerEvent) => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          const { clientX, clientY } = event;
          const { height, width, left, top } = el.getBoundingClientRect();
          const { magneticFactor } = configRef.current;
          xTo((clientX - (left + width / 2)) * magneticFactor);
          yTo((clientY - (top + height / 2)) * magneticFactor);
          rafId = null;
        });
      };

      const handlePointerOut = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("pointerenter", handlePointerEnter);
      el.addEventListener("pointerleave", handlePointerLeave);
      el.addEventListener("pointermove", handlePointerMove);
      el.addEventListener("pointerout", handlePointerOut);

      cleanupFunctions.push(() => {
        el.removeEventListener("pointerenter", handlePointerEnter);
        el.removeEventListener("pointerleave", handlePointerLeave);
        el.removeEventListener("pointermove", handlePointerMove);
        el.removeEventListener("pointerout", handlePointerOut);
      });
    });

    return () => {
      document.documentElement.classList.remove("vt-cursor");
      gsap.ticker.remove(update);
      window.removeEventListener("pointermove", onMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, [
    disableOnTouch,
    isTouchDevice,
    hoverPadding,
    hoverAttribute,
    cursorColor,
    shape,
  ]);

  if (disableOnTouch && isTouchDevice) return <>{children}</>;

  const styles: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 9999,
    pointerEvents: "none",
    opacity: 0,
    willChange: "transform, width, height, border-radius",
    backgroundColor: cursorColor,
    mixBlendMode: blendMode as React.CSSProperties["mixBlendMode"],
    width: cursorSize,
    height: cursorSize,
    borderRadius: shape === "circle" ? "50%" : shape === "square" ? "0" : "8px",
    backdropFilter: contrastBoost !== 1 ? `contrast(${contrastBoost})` : "none",
    WebkitBackdropFilter:
      contrastBoost !== 1 ? `contrast(${contrastBoost})` : "none",
  };

  return (
    <>
      <div
        ref={cursorRef}
        className={`magnetic-cursor ${cursorClassName}`}
        style={styles}
        aria-hidden="true"
      />
      {children}
    </>
  );
};

/* ============================================================
   ORIGIN BUTTON (adaptado a dark mode, con variantes)
   ============================================================ */

const FILL_DURATION = 0.5;
const FILL_EASE = [0.16, 1, 0.3, 1] as const;

type ButtonNativeProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onAnimationStart"
  | "onDrag"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDragStart"
  | "onDrop"
>;

type OriginButtonProps = ButtonNativeProps & {
  children?: React.ReactNode;
  loading?: boolean;
  variant?: "solid" | "outline";
  size?: "md" | "xl";
};

function getCoverDiameter(width: number, height: number, x: number, y: number) {
  return Math.ceil(
    2 *
      Math.max(
        Math.hypot(x, y),
        Math.hypot(width - x, y),
        Math.hypot(x, height - y),
        Math.hypot(width - x, height - y),
      ),
  );
}

function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  if (ref) {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
}

const OriginButton = React.forwardRef<HTMLButtonElement, OriginButtonProps>(
  (
    {
      children,
      className,
      disabled = false,
      loading = false,
      variant = "solid",
      size = "md",
      type = "button",
      onBlur,
      onClick,
      onFocus,
      onKeyDown,
      onKeyUp,
      onPointerCancel,
      onPointerDown,
      onPointerEnter,
      onPointerLeave,
      onPointerUp,
      ...props
    },
    ref,
  ) => {
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    const isDisabled = Boolean(disabled || loading);
    const [hovered, setHovered] = React.useState(false);
    const [isPressed, setIsPressed] = React.useState(false);
    const [origin, setOrigin] = React.useState({ x: 0, y: 0 });
    const [coverSize, setCoverSize] = React.useState(0);

    const updateOrigin = React.useCallback((x: number, y: number) => {
      const node = buttonRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      setOrigin({ x, y });
      setCoverSize(getCoverDiameter(rect.width, rect.height, x, y));
    }, []);

    const updateOriginFromPointer = React.useCallback(
      (event: React.PointerEvent<HTMLButtonElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        updateOrigin(event.clientX - rect.left, event.clientY - rect.top);
      },
      [updateOrigin],
    );

    const updateOriginFromCenter = React.useCallback(() => {
      const node = buttonRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      updateOrigin(rect.width / 2, rect.height / 2);
    }, [updateOrigin]);

    const showFill = !isDisabled && (hovered || isPressed);

    React.useLayoutEffect(() => {
      const node = buttonRef.current;
      if (!(node && showFill)) return;

      const measure = () => {
        const rect = node.getBoundingClientRect();
        setCoverSize(
          getCoverDiameter(rect.width, rect.height, origin.x, origin.y),
        );
      };

      measure();

      const observer = new ResizeObserver(measure);
      observer.observe(node);

      const fonts = document.fonts;
      if (fonts?.ready) {
        fonts.ready.then(measure).catch(() => undefined);
      }

      return () => observer.disconnect();
    }, [showFill, origin.x, origin.y]);

    const setMergedRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        buttonRef.current = node;
        assignRef(ref, node);
      },
      [ref],
    );

    const idleClasses =
      variant === "solid"
        ? "border-white/10 bg-white"
        : "border-white/25 bg-transparent";
    const textClasses =
      variant === "solid"
        ? showFill
          ? "text-white"
          : "text-neutral-950"
        : showFill
          ? "text-neutral-950"
          : "text-white";
    const fillClasses = variant === "solid" ? "bg-neutral-950" : "bg-white";
    const sizeClasses =
      size === "xl"
        ? "h-16 px-10 text-lg md:h-20 md:px-14 md:text-xl"
        : "h-12 px-8 text-[15px]";

    return (
      <motion.button
        {...props}
        aria-busy={loading || undefined}
        className={cn(
          "relative inline-flex touch-manipulation select-none items-center justify-center overflow-hidden rounded-xl border font-medium tracking-[-0.02em]",
          "transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
          "disabled:pointer-events-none disabled:opacity-50",
          sizeClasses,
          idleClasses,
          textClasses,
          className,
        )}
        data-pressed={isPressed ? "true" : "false"}
        disabled={isDisabled}
        onBlur={(event) => {
          onBlur?.(event);
          setIsPressed(false);
          if (!event.defaultPrevented) {
            setHovered(false);
          }
        }}
        onClick={onClick}
        onFocus={(event) => {
          onFocus?.(event);
          if (isDisabled || event.defaultPrevented) return;
          if (event.currentTarget.matches(":focus-visible")) {
            updateOriginFromCenter();
            setHovered(true);
          }
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (
            event.defaultPrevented ||
            isDisabled ||
            event.repeat ||
            (event.key !== " " && event.key !== "Enter")
          ) {
            return;
          }
          if (event.key === " ") {
            event.preventDefault();
          }
          updateOriginFromCenter();
          setIsPressed(true);
          setHovered(true);
        }}
        onKeyUp={(event) => {
          onKeyUp?.(event);
          if (event.key === " " || event.key === "Enter") {
            setIsPressed(false);
            if (!event.currentTarget.matches(":focus-visible")) {
              setHovered(false);
            }
          }
        }}
        onPointerCancel={(event) => {
          onPointerCancel?.(event);
          setIsPressed(false);
        }}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          if (event.defaultPrevented || isDisabled || event.button !== 0) {
            return;
          }
          updateOriginFromPointer(event);
          setIsPressed(true);
          setHovered(true);
        }}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          if (isDisabled || event.defaultPrevented) return;
          updateOriginFromPointer(event);
          setHovered(true);
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          setHovered(false);
          setIsPressed(false);
        }}
        onPointerUp={(event) => {
          onPointerUp?.(event);
          setIsPressed(false);
        }}
        ref={setMergedRef}
        type={type}
        whileTap={isDisabled ? undefined : { scale: 0.985 }}
      >
        <motion.span
          animate={{ scale: showFill && coverSize > 0 ? 1 : 0 }}
          aria-hidden
          className={cn(
            "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full",
            fillClasses,
          )}
          initial={false}
          style={{
            height: coverSize,
            left: origin.x,
            top: origin.y,
            width: coverSize,
          }}
          transition={{ duration: FILL_DURATION, ease: FILL_EASE }}
        />
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {children}
        </span>
      </motion.button>
    );
  },
);
OriginButton.displayName = "OriginButton";

/* ============================================================
   AURORA BACKGROUND
   ============================================================ */

interface AuroraBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  starCount?: number;
  gradientColors?: [string, string];
  pulseDuration?: number;
}

type Star = { x: number; y: number; peak: number; dur: number; delay: number };

const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  className = "",
  children,
  starCount = 50,
  gradientColors = [
    "var(--aurora-color1, rgba(168,85,247,0.2))",
    "var(--aurora-color2, rgba(79,70,229,0.2))",
  ],
  pulseDuration = 10,
}) => {
  const [colorA, colorB] = gradientColors;
  const [stars, setStars] = React.useState<Star[]>([]);

  React.useEffect(() => {
    setStars(
      Array.from({ length: starCount }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        peak: Math.random() * 0.8,
        dur: Math.random() * 3 + 2,
        delay: Math.random() * 5,
      })),
    );
  }, [starCount]);

  return (
    <div
      className={`relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black text-slate-50 ${className}`}
    >
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `
              radial-gradient(circle, ${colorA} 0%, transparent 80%),
              radial-gradient(circle, ${colorB} 0%, transparent 80%)
            `,
            backgroundSize: "100% 100%",
            animation: `vt-pulse ${pulseDuration}s infinite`,
          }}
        />

        <motion.div
          className="absolute inset-0 mix-blend-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute -top-1/4 -left-1/4 h-1/2 w-1/2 rounded-full bg-purple-600 opacity-40 blur-3xl filter"
            animate={{ x: [-50, 50, -50], y: [-20, 20, -20], scale: [1, 1.2, 1] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-fuchsia-600 opacity-40 blur-3xl filter"
            animate={{ x: [50, -50, 50], y: [20, -20, 20], scale: [1, 1.3, 1] }}
            transition={{
              duration: 40,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/3 left-1/3 h-1/3 w-1/3 rounded-full bg-indigo-700 opacity-30 blur-3xl filter"
            animate={{ x: [20, -20, 20], y: [-30, 30, -30], rotate: [0, 360, 0] }}
            transition={{
              duration: 50,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute h-0.5 w-0.5 rounded-full bg-white"
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, star.peak, 0] }}
            transition={{
              duration: star.dur,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-black" />
      </div>

      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};

/* ============================================================
   ANIMATED GROUP (entrada con blur escalonada para el Hero)
   ============================================================ */

const groupContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const groupItem: Variants = {
  hidden: { opacity: 0, filter: "blur(12px)", y: 12 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { type: "spring" as const, bounce: 0.3, duration: 1.5 },
  },
};

const AnimatedGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={groupContainer}
    className={className}
  >
    {React.Children.map(children, (child, index) => (
      <motion.div key={index} variants={groupItem}>
        {child}
      </motion.div>
    ))}
  </motion.div>
);

/* ============================================================
   MINIMALIST DOCK (fijo, abajo al centro)
   ============================================================ */

type DockItemData = {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

const dockItems: DockItemData[] = [
  {
    id: "inicio",
    icon: <Home size={20} />,
    label: "Inicio",
    onClick: () => goTo("inicio"),
  },
  {
    id: "servicios",
    icon: <LayoutGrid size={20} />,
    label: "Servicios",
    onClick: () => goTo("servicios"),
  },
  {
    id: "portfolio",
    icon: <Layers size={20} />,
    label: "Portfolio",
    onClick: () => goTo("portfolio"),
  },
  {
    id: "whatsapp",
    icon: <MessageCircle size={20} />,
    label: "WhatsApp",
    onClick: () => openWhatsApp(),
  },
];

const DockItemComponent: React.FC<{
  item: DockItemData;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}> = ({ item, isHovered, onHover }) => {
  return (
    <div
      data-magnetic
      className="relative rounded-lg"
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
    >
      <button
        type="button"
        aria-label={item.label}
        onClick={item.onClick}
        onFocus={() => onHover(item.id)}
        onBlur={() => onHover(null)}
        className={cn(
          "relative flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white backdrop-blur-[2px] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60",
          isHovered &&
            "-translate-y-1 scale-110 border-white/20 bg-white/10 shadow-lg shadow-white/10",
        )}
      >
        <span
          className={cn(
            "transition-all duration-300",
            isHovered && "scale-105 drop-shadow-[0_1px_4px_rgba(255,255,255,0.10)]",
          )}
        >
          {item.icon}
        </span>
      </button>

      <div
        className={cn(
          "pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/5 bg-black/70 px-2.5 py-1 text-xs font-normal text-white shadow-sm backdrop-blur transition-all duration-200",
          isHovered ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
        )}
      >
        {item.label}
        <div className="absolute left-1/2 top-full -translate-x-1/2">
          <div className="h-2 w-2 rotate-45 border-b border-r border-white/5 bg-black/70" />
        </div>
      </div>
    </div>
  );
};

const MinimalistDock: React.FC = () => {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2"
    >
      <div
        className={cn(
          "flex items-end gap-3 rounded-2xl border border-white/10 bg-black/40 px-5 py-3 shadow-2xl backdrop-blur-xl transition-transform duration-500 ease-out",
          hoveredItem && "scale-105",
        )}
      >
        {dockItems.map((item) => (
          <DockItemComponent
            key={item.id}
            item={item}
            isHovered={hoveredItem === item.id}
            onHover={setHoveredItem}
          />
        ))}
      </div>
    </nav>
  );
};

/* ============================================================
   CARD DECK CAROUSEL
   ============================================================ */

type LandPalette = "dawn" | "alpine" | "dusk" | "mist";

type Slide = {
  image?: string;
  title?: string;
  caption?: string;
  alt?: string;
  href?: string;
  palette?: LandPalette;
  seed?: number;
};

type CardDeckCarouselProps = {
  slides?: Slide[];
  height?: number | string;
  cardWidth?: string;
  aspect?: string;
  scatter?: number;
  autoplay?: number;
  background?: string;
  ink?: string;
  onChange?: (index: number) => void;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
};

function wrap(i: number, n: number): number {
  return n ? ((i % n) + n) % n : 0;
}

function deckPose(depth: number, tilt: number, reduce = false) {
  const d = Math.min(depth, 3);
  return {
    y: d ? -d * 16 : 0,
    scale: 1 - d * 0.055,
    rot: depth === 0 || reduce ? 0 : tilt,
    opacity: depth > 3 ? 0 : 1,
    shade: 1 - d * 0.07,
  };
}

function tiltFor(i: number, max: number): number {
  const u = (((i + 1) * 2654435761) >>> 0) / 4294967296;
  return (u * 2 - 1) * max;
}

function isThrow(dx: number, vx: number, w: number): boolean {
  return Math.abs(dx) > w * 0.28 || (Math.abs(vx) > 0.55 && Math.abs(dx) > 24);
}

function pad2(n: number): string {
  return n < 10 ? "0" + n : String(n);
}

const PALETTES: Record<
  LandPalette,
  {
    top: string;
    bottom: string;
    sun: string;
    far: string;
    near: string;
    mist: string;
  }
> = {
  dawn: { top: "#e7b7a5", bottom: "#f8e8d6", sun: "#fff4df", far: "#d2b2bb", near: "#3a2a3b", mist: "255,240,232" },
  alpine: { top: "#7ea5c8", bottom: "#e3ecf2", sun: "#ffffff", far: "#a9bfd0", near: "#1c3044", mist: "236,244,250" },
  dusk: { top: "#2a2450", bottom: "#ef8d60", sun: "#ffd9a6", far: "#93607c", near: "#18121f", mist: "255,196,160" },
  mist: { top: "#c4d0cb", bottom: "#eef1ec", sun: "#ffffff", far: "#aebcb5", near: "#2c3a33", mist: "246,248,245" },
};

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexRgb(h: string): [number, number, number] {
  const v = parseInt(h.replace("#", ""), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function mixRgb(a: string, b: string, t: number): string {
  const A = hexRgb(a);
  const B = hexRgb(b);
  return (
    "rgb(" + A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",") + ")"
  );
}

function paintLandscape(
  seed: number,
  palette: LandPalette,
  w = 1600,
  h = 1000,
): string {
  if (typeof document === "undefined") return "";
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  if (!g) return "";
  const P = PALETTES[palette] ?? PALETTES.dawn;
  const r = mulberry32(seed * 104729 + 7);

  const sky = g.createLinearGradient(0, 0, 0, h * 0.72);
  sky.addColorStop(0, P.top);
  sky.addColorStop(1, P.bottom);
  g.fillStyle = sky;
  g.fillRect(0, 0, w, h);
  const sx = w * (0.22 + r() * 0.56);
  const sy = h * (0.26 + r() * 0.16);
  const halo = g.createRadialGradient(sx, sy, 0, sx, sy, w * 0.45);
  halo.addColorStop(0, "rgba(" + hexRgb(P.sun).join(",") + ",.85)");
  halo.addColorStop(0.08, "rgba(" + hexRgb(P.sun).join(",") + ",.55)");
  halo.addColorStop(1, "rgba(" + hexRgb(P.sun).join(",") + ",0)");
  g.fillStyle = halo;
  g.fillRect(0, 0, w, h);
  g.fillStyle = P.sun;
  g.beginPath();
  g.arc(sx, sy, h * 0.045, 0, Math.PI * 2);
  g.fill();

  const layers = 5;
  for (let L = 0; L < layers; L++) {
    const k = L / (layers - 1);
    const base = h * (0.42 + k * 0.4);
    const amp = h * (0.07 + k * 0.1);
    const ph = [r(), r(), r(), r()].map((v) => v * Math.PI * 2);
    const fr = [1.3 + r(), 3.1 + r() * 2, 7 + r() * 4, 17 + r() * 8];
    const ridge = (x: number) => {
      const u = x / w;
      return (
        base -
        amp *
          (0.55 * Math.sin(u * fr[0] + ph[0]) +
            0.28 * Math.sin(u * fr[1] + ph[1]) +
            0.12 * Math.abs(Math.sin(u * fr[2] + ph[2])) +
            0.05 * Math.sin(u * fr[3] + ph[3]))
      );
    };
    const mist = g.createLinearGradient(0, base - amp * 1.4, 0, base + amp * 0.4);
    mist.addColorStop(0, "rgba(" + P.mist + ",0)");
    mist.addColorStop(
      1,
      "rgba(" + P.mist + "," + (0.55 - k * 0.35).toFixed(2) + ")",
    );
    g.fillStyle = mist;
    g.fillRect(0, base - amp * 1.4, w, amp * 1.8);
    const body = g.createLinearGradient(0, base - amp, 0, h);
    body.addColorStop(0, mixRgb(P.far, P.near, Math.pow(k, 1.3)));
    body.addColorStop(
      1,
      mixRgb(P.far, P.near, Math.min(1, Math.pow(k, 1.3) + 0.18)),
    );
    g.fillStyle = body;
    g.beginPath();
    g.moveTo(0, h);
    for (let x = 0; x <= w; x += 6) g.lineTo(x, ridge(x));
    g.lineTo(w, h);
    g.closePath();
    g.fill();
    if (L >= layers - 2) {
      g.fillStyle = mixRgb(P.far, P.near, Math.min(1, Math.pow(k, 1.3) + 0.08));
      for (let x = 0; x < w; x += 7 + r() * 9) {
        if (r() < 0.35) continue;
        const y = ridge(x) + 2;
        const th = h * (0.025 + r() * 0.035) * (0.6 + k);
        const tw = th * 0.32;
        g.beginPath();
        g.moveTo(x, y - th);
        g.lineTo(x + tw, y);
        g.lineTo(x - tw, y);
        g.closePath();
        g.fill();
      }
    }
  }

  const vig = g.createRadialGradient(w / 2, h * 0.45, h * 0.3, w / 2, h / 2, w * 0.78);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,.32)");
  g.fillStyle = vig;
  g.fillRect(0, 0, w, h);
  const grain = g.getImageData(0, 0, w, h);
  const d = grain.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (r() - 0.5) * 14;
    d[i] += v;
    d[i + 1] += v;
    d[i + 2] += v;
  }
  g.putImageData(grain, 0, 0);
  return c.toDataURL("image/jpeg", 0.88);
}

const shot = (url: string) =>
  "https://image.thum.io/get/width/1000/crop/1333/noanimate/" + url;

const DEMO_SLIDES: Slide[] = [
  {
    image: shot("https://carnetmanipulacionalimentos.netlify.app"),
    href: "https://carnetmanipulacionalimentos.netlify.app",
    title: "Carnet de Manipulación de Alimentos",
    caption: "Landing de curso de certificación en San Rafael.",
    alt: "Captura de la landing del Carnet de Manipulación de Alimentos",
    palette: "dawn",
    seed: 3,
  },
  {
    image: shot("https://www.carolinagarcia.com.ar"),
    href: "https://www.carolinagarcia.com.ar",
    title: "Carolina García",
    caption: "Sitio web profesional.",
    alt: "Captura del sitio de Carolina García",
    palette: "mist",
    seed: 21,
  },
  {
    image: shot("https://danger-fitness-web.netlify.app"),
    href: "https://danger-fitness-web.netlify.app",
    title: "Danger Fitness",
    caption: "Sitio web de entrenamiento.",
    alt: "Captura del sitio de Danger Fitness",
    palette: "dusk",
    seed: 14,
  },
  {
    image: shot("https://bautismo-lian.netlify.app"),
    href: "https://bautismo-lian.netlify.app",
    title: "Invitación de Bautismo",
    caption: "Invitación digital para eventos.",
    alt: "Captura de la invitación digital de bautismo",
    palette: "alpine",
    seed: 8,
  },
];

function useSlideImages(slides: Slide[]) {
  const key = slides
    .map((s) => s.image || (s.palette || "dawn") + ":" + (s.seed ?? 1))
    .join("|");
  const [painted, setPainted] = React.useState<string[]>(() =>
    slides.map(() => ""),
  );
  const [failed, setFailed] = React.useState<Record<number, boolean>>({});

  React.useEffect(() => {
    setPainted(
      slides.map((s, i) =>
        s.image && !failed[i]
          ? ""
          : paintLandscape(s.seed ?? i + 1, s.palette || "dawn"),
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, failed]);

  const srcs = slides.map((s, i) =>
    s.image && !failed[i] ? s.image : painted[i] || "",
  );
  const onError = (i: number) =>
    setFailed((f) => (f[i] ? f : { ...f, [i]: true }));

  return { srcs, onError };
}

const CD_CSS = [
  ".cd-root{position:relative;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(28px,5vh,52px);overflow:hidden;background:var(--cd-bg);color:var(--cd-ink);outline:none;padding:24px 16px;box-sizing:border-box}",
  ".cd-root:focus-visible{box-shadow:inset 0 0 0 2px var(--cd-ink)}",
  ".cd-deck{position:relative;width:var(--cd-w);aspect-ratio:var(--cd-aspect);max-height:calc(var(--cd-h) * .62);max-width:calc(var(--cd-h) * .62 * var(--cd-ar));touch-action:pan-y}",
  ".cd-card{position:absolute;inset:0;border-radius:18px;overflow:hidden;background:#1a1a1f;box-shadow:0 1px 2px rgba(0,0,0,.2),0 30px 60px -30px rgba(0,0,0,.8);border:1px solid rgba(255,255,255,.08);transition:transform .6s cubic-bezier(.2,.8,.2,1),opacity .4s ease,filter .4s ease;will-change:transform}",
  ".cd-card[data-top='1']{cursor:grab}",
  ".cd-card[data-drag='1']{cursor:grabbing;transition:none}",
  ".cd-card[data-fly='1']{transition:transform .45s cubic-bezier(.3,.5,.3,1),opacity .45s ease}",
  ".cd-card[data-snap='1']{transition:none}",
  ".cd-card img{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;display:block;pointer-events:none;user-select:none}",
  ".cd-meta{display:flex;align-items:center;gap:clamp(16px,3vw,32px);width:min(var(--cd-w),100%);max-width:560px}",
  ".cd-cap{flex:1;min-width:0;overflow:hidden;padding-bottom:.2em}",
  ".cd-cap>*{display:block;animation:cd-in .6s cubic-bezier(.2,.8,.2,1) both}",
  ".cd-title{font:500 clamp(16px,2vw,22px)/1.2 ui-sans-serif,system-ui,sans-serif;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
  ".cd-sub{margin-top:4px;font:400 13px/1.4 ui-sans-serif,system-ui,sans-serif;color:var(--cd-muted);animation-delay:.05s}",
  ".cd-count{font:500 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em;color:var(--cd-muted)}",
  ".cd-count b{color:var(--cd-ink);font-weight:500}",
  ".cd-btn{appearance:none;border:1px solid var(--cd-line);background:transparent;color:inherit;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;cursor:pointer;flex:none;transition:background .2s ease,color .2s ease}",
  ".cd-btn:hover{background:var(--cd-ink);color:#000}",
  ".cd-btn:focus-visible{outline:2px solid var(--cd-ink);outline-offset:2px}",
  ".cd-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",
  "@keyframes cd-in{from{transform:translateY(100%);opacity:0}to{transform:none;opacity:1}}",
  "@media (prefers-reduced-motion:reduce){.cd-card,.cd-card[data-fly='1']{transition:opacity .3s ease}.cd-cap>*{animation:none}}",
].join("\n");

type Override = {
  i: number;
  x: number;
  y: number;
  r: number;
  mode: "drag" | "fly" | "snap";
};

const CardDeckCarousel: React.FC<CardDeckCarouselProps> = ({
  slides = DEMO_SLIDES,
  height = "100svh",
  cardWidth = "min(78vw, 440px)",
  aspect = "4 / 5",
  scatter = 6,
  autoplay = 4200,
  background = "#000",
  ink = "#f4f4f5",
  onChange,
  className,
  style,
  ariaLabel = "Carrusel de demos",
}) => {
  const n = slides.length;
  const { srcs, onError } = useSlideImages(slides);
  const [top, setTop] = React.useState(0);
  const [over, setOver] = React.useState<Override | null>(null);
  const [reduce, setReduce] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const deckRef = React.useRef<HTMLDivElement | null>(null);
  const busy = React.useRef(false);
  const lastTouch = React.useRef(0);
  const topRef = React.useRef(0);
  topRef.current = top;

  React.useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const later = (fn: () => void, ms: number) => window.setTimeout(fn, ms);

  const throwTop = React.useCallback(
    (dirX: number, fromX = 0, fromY = 0, dirY = 0) => {
      const w = deckRef.current?.offsetWidth || 400;
      if (busy.current || n < 2) return;
      busy.current = true;
      const i = topRef.current;
      const sx = dirX >= 0 ? 1 : -1;
      setOver({
        i,
        x: fromX + sx * w * 1.25,
        y: fromY + dirY * 0.4 - 40,
        r: sx * 16,
        mode: "fly",
      });
      later(
        () => {
          setOver(null);
          setTop((t) => wrap(t + 1, n));
          busy.current = false;
        },
        reduce ? 200 : 430,
      );
    },
    [n, reduce],
  );

  const pullBack = React.useCallback(() => {
    if (busy.current || n < 2) return;
    busy.current = true;
    const i = wrap(topRef.current - 1, n);
    const w = deckRef.current?.offsetWidth || 400;
    setOver({ i, x: -w * 1.25, y: -40, r: -16, mode: "snap" });
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setOver({ i, x: 0, y: 0, r: 0, mode: "fly" });
        later(
          () => {
            setOver(null);
            setTop(i);
            busy.current = false;
          },
          reduce ? 200 : 450,
        );
      }),
    );
  }, [n, reduce]);

  React.useEffect(() => {
    onChange?.(top);
  }, [top, onChange]);

  React.useEffect(() => {
    if (!autoplay || n < 2) return;
    const root = rootRef.current;
    let seen = true;
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
    });
    if (root) io.observe(root);
    const t = window.setInterval(() => {
      if (
        !seen ||
        document.hidden ||
        performance.now() - lastTouch.current < autoplay
      )
        return;
      throwTop(1);
    }, autoplay);
    return () => {
      window.clearInterval(t);
      io.disconnect();
    };
  }, [autoplay, n, throwTop]);

  const drag = React.useRef<null | {
    x: number;
    y: number;
    lx: number;
    lt: number;
    vx: number;
  }>(null);

  const onDown = (e: React.PointerEvent) => {
    lastTouch.current = performance.now();
    if (busy.current || (e.pointerType === "mouse" && e.button !== 0)) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      lx: e.clientX,
      lt: e.timeStamp,
      vx: 0,
    };
  };

  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dt = Math.max(1, e.timeStamp - d.lt);
    d.vx = 0.8 * ((e.clientX - d.lx) / dt) + 0.2 * d.vx;
    d.lx = e.clientX;
    d.lt = e.timeStamp;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    setOver({
      i: topRef.current,
      x: dx,
      y: dy,
      r: reduce ? 0 : dx * 0.05,
      mode: "drag",
    });
  };

  const onUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    lastTouch.current = performance.now();
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    const w = deckRef.current?.offsetWidth || 400;
    if (isThrow(dx, d.vx, w)) throwTop(dx, dx, dy, dy);
    else setOver(null);
  };

  const onKey = (e: React.KeyboardEvent) => {
    lastTouch.current = performance.now();
    if (e.key === "ArrowRight") throwTop(1);
    else if (e.key === "ArrowLeft") pullBack();
    else return;
    e.preventDefault();
  };

  const s = slides[top] || {};

  const ratio = (() => {
    if (aspect.includes("/")) {
      const [a, b] = aspect.split("/").map((v) => parseFloat(v));
      return b ? a / b : 1;
    }
    return parseFloat(aspect) || 1;
  })();

  const rootStyle = {
    height,
    "--cd-h": typeof height === "number" ? height + "px" : height,
    "--cd-w": cardWidth,
    "--cd-aspect": aspect,
    "--cd-ar": String(ratio),
    "--cd-bg": background,
    "--cd-ink": ink,
    "--cd-muted": "color-mix(in srgb, var(--cd-ink) 55%, transparent)",
    "--cd-line": "color-mix(in srgb, var(--cd-ink) 18%, transparent)",
    ...style,
  } as React.CSSProperties;

  return (
    <div
      ref={rootRef}
      className={["cd-root", className].filter(Boolean).join(" ")}
      style={rootStyle}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKey}
    >
      <style>{CD_CSS}</style>
      <div ref={deckRef} className="cd-deck">
        {slides.map((sl, i) => {
          const depth = wrap(i - top, n);
          const p = deckPose(depth, tiltFor(i, scatter), reduce);
          const o = over && over.i === i ? over : null;
          const isTop = depth === 0;
          const transform = o
            ? "translate(" + o.x + "px," + o.y + "px) rotate(" + o.r + "deg)"
            : "translateY(" +
              p.y +
              "px) scale(" +
              p.scale +
              ") rotate(" +
              p.rot.toFixed(2) +
              "deg)";
          return (
            <div
              key={i}
              className="cd-card"
              data-top={isTop ? "1" : "0"}
              data-drag={o?.mode === "drag" ? "1" : "0"}
              data-fly={o?.mode === "fly" ? "1" : "0"}
              data-snap={o?.mode === "snap" ? "1" : "0"}
              style={{
                transform,
                zIndex: o ? n + 1 : n - depth,
                opacity: o ? 1 : p.opacity,
                filter: o || isTop ? "none" : "brightness(" + p.shade + ")",
              }}
              aria-hidden={isTop ? undefined : true}
              onPointerDown={isTop ? onDown : undefined}
              onPointerMove={isTop ? onMove : undefined}
              onPointerUp={isTop ? onUp : undefined}
              onPointerCancel={isTop ? onUp : undefined}
            >
              {srcs[i] ? (
                <img
                  src={srcs[i]}
                  alt={isTop ? sl.alt || sl.title || "" : ""}
                  draggable={false}
                  onError={() => onError(i)}
                />
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="cd-meta">
        <button
          type="button"
          className="cd-btn"
          aria-label="Anterior"
          onClick={() => {
            lastTouch.current = performance.now();
            pullBack();
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
        <div className="cd-cap" key={top} aria-hidden="true">
          {s.title ? <span className="cd-title">{s.title}</span> : null}
          {s.caption ? <span className="cd-sub">{s.caption}</span> : null}
        </div>
        <span className="cd-count" aria-hidden="true">
          <b>{pad2(top + 1)}</b> / {pad2(n)}
        </span>
        <button
          type="button"
          className="cd-btn"
          aria-label="Siguiente"
          onClick={() => {
            lastTouch.current = performance.now();
            throwTop(1);
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
      </div>
      {s.href ? (
        <MagneticWrap>
          <OriginButton
            variant="outline"
            onClick={() => window.open(s.href, "_blank", "noopener,noreferrer")}
          >
            Ver demo ↗
          </OriginButton>
        </MagneticWrap>
      ) : null}
      <div className="cd-sr" aria-live="polite">
        {"Tarjeta " + (top + 1) + " de " + n + (s.title ? ": " + s.title : "")}
      </div>
    </div>
  );
};

/* ============================================================
   SECCIONES
   ============================================================ */

const MagneticWrap: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <span
    data-magnetic
    data-magnetic-color="rgba(255,255,255,0.12)"
    className={cn("inline-block rounded-xl", className)}
  >
    {children}
  </span>
);

const Hero: React.FC = () => (
  <section id="inicio">
    <AuroraBackground starCount={80} pulseDuration={8} className="px-4 py-28">
      <AnimatedGroup className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h1 className="bg-gradient-to-br from-gray-50 to-gray-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-7xl">
          VisoTech: Desarrollo Web que Vende
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-300">
          Delegá el código y el diseño. Nosotros nos encargamos de que tu negocio
          local destaque y convierta.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <MagneticWrap>
            <OriginButton variant="solid" onClick={() => goTo("servicios")}>
              Ver Planes
            </OriginButton>
          </MagneticWrap>
          <MagneticWrap>
            <OriginButton variant="outline" onClick={() => openWhatsApp()}>
              Hablar por WhatsApp
            </OriginButton>
          </MagneticWrap>
        </div>
      </AnimatedGroup>
    </AuroraBackground>
  </section>
);

const planCard =
  "relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-7 backdrop-blur-xl transition-colors duration-300 hover:border-white/20";

const iconBox =
  "flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white";

const ServicesGrid: React.FC = () => (
  <section id="servicios" className="relative px-4 py-24 md:px-8">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.12),transparent_60%)]"
    />
    <div className="relative mx-auto max-w-6xl">
      <div className="mb-12 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300/70">
          Servicios
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50 md:text-5xl">
          Nuestros planes
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        {/* Plan Landing Page — pequeña (2/6) */}
        <article className={cn(planCard, "min-h-[240px] md:col-span-2")}>
          <div className={iconBox}>
            <Rocket size={20} />
          </div>
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-zinc-50">
              Plan Landing Page
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Ideal para presencia rápida.
            </p>
          </div>
        </article>

        {/* A Medida — destacada (4/6) */}
        <article
          className={cn(
            planCard,
            "min-h-[240px] border-cyan-300/30 shadow-[0_0_60px_-15px_rgba(34,211,238,0.45)] hover:border-cyan-300/50 md:col-span-4",
          )}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl"
          />
          <div className="relative flex items-start justify-between">
            <div className={cn(iconBox, "border-cyan-300/30 text-cyan-200")}>
              <Sparkles size={20} />
            </div>
            <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-200">
              Destacado
            </span>
          </div>
          <div className="relative mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-md">
              <h3 className="text-2xl font-semibold text-zinc-50">A Medida</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                Desarrollos complejos, bases de datos e integraciones. Hablá con
                Santiago para cotizar tu idea.
              </p>
            </div>
            <MagneticWrap className="shrink-0 self-start md:self-auto">
              <OriginButton
                variant="solid"
                onClick={() =>
                  openWhatsApp(
                    "Hola Santiago! Quiero cotizar un desarrollo a medida.",
                  )
                }
              >
                Cotizar por WhatsApp
              </OriginButton>
            </MagneticWrap>
          </div>
        </article>

        {/* Plan E-commerce — mediana (3/6) */}
        <article className={cn(planCard, "min-h-[240px] md:col-span-3")}>
          <div className={iconBox}>
            <ShoppingBag size={20} />
          </div>
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-zinc-50">
              Plan E-commerce
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Para tiendas y catálogos físicos.
            </p>
          </div>
        </article>

        {/* Plan Profesional — mediana (3/6) */}
        <article className={cn(planCard, "min-h-[240px] md:col-span-3")}>
          <div className={iconBox}>
            <CalendarCheck size={20} />
          </div>
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-zinc-50">
              Plan Profesional
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Sitios multisección con reservas o turnos.
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
);

const Portfolio: React.FC = () => (
  <section id="portfolio" className="relative px-4 py-24 md:px-8">
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300/70">
          Portfolio
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50 md:text-5xl">
          Nuestras Demos
        </h2>
      </div>
      <CardDeckCarousel
        slides={DEMO_SLIDES}
        height="min(92svh, 860px)"
        cardWidth="min(78vw, 400px)"
        aspect="3 / 4"
        scatter={8}
        autoplay={0}
        background="transparent"
        ink="#f4f4f5"
      />
    </div>
  </section>
);

const WaveSvg: React.FC<{ className: string }> = ({ className }) => (
  <svg
    className={`h-full w-[1800px] shrink-0 ${className}`}
    viewBox="0 0 1800 500"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 250C200 150 400 50 600 100C800 150 1000 350 1200 300C1400 250 1600 150 1800 250V500H0V250Z"
      fill="currentColor"
    />
  </svg>
);

const AnimatedWaveFooter: React.FC = () => (
  <footer className="relative overflow-hidden bg-gradient-to-b from-black via-black to-cyan-950/20 pt-24">
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute bottom-0 left-0 flex h-[420px] w-[3600px]"
        style={{ animation: "vt-wave 40s linear infinite reverse" }}
      >
        <WaveSvg className="text-slate-700/20" />
        <WaveSvg className="text-slate-700/20" />
      </div>
      <div
        className="absolute bottom-0 left-0 flex h-[340px] w-[3600px]"
        style={{ animation: "vt-wave 28s linear infinite" }}
      >
        <WaveSvg className="text-cyan-900/25" />
        <WaveSvg className="text-cyan-900/25" />
      </div>
    </div>

    <div className="relative z-10 mx-auto max-w-6xl px-4 pb-32 md:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="max-w-md text-3xl font-bold tracking-tight text-zinc-50 md:text-4xl">
            ¿Listo para digitalizar tu negocio?
          </h2>
          <div className="mt-8">
            <MagneticWrap>
              <OriginButton
                variant="outline"
                size="xl"
                onClick={() => openWhatsApp()}
              >
                Escribinos al WhatsApp
              </OriginButton>
            </MagneticWrap>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-zinc-50">Enlaces</h3>
            <nav className="space-y-2 text-sm text-zinc-400">
              <a href="#inicio" className="block transition-colors hover:text-cyan-200">
                Inicio
              </a>
              <a href="#servicios" className="block transition-colors hover:text-cyan-200">
                Servicios
              </a>
              <a href="#portfolio" className="block transition-colors hover:text-cyan-200">
                Nuestras Demos
              </a>
              <a
                href={waLink("Hola Santiago! Quiero hacer una consulta comercial.")}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:text-cyan-200"
              >
                Santiago · Ventas y cotizaciones
              </a>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-zinc-50">Contacto</h3>
            <address className="space-y-2 text-sm not-italic text-zinc-400">
              <p>San Rafael, Mendoza</p>
              <p>Argentina</p>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:text-cyan-200"
              >
                WhatsApp
              </a>
            </address>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-white/10 pt-8 text-center">
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} VisoTech. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </footer>
);

/* ============================================================
   PAGE
   ============================================================ */

export default function Page() {
  return (
    <MagneticCursor contrastBoost={1.2} cursorSize={28} blendMode="exclusion">
      <style>{GLOBAL_CSS}</style>
      <div className="dark relative min-h-screen bg-black text-zinc-50 antialiased">
        <main>
          <Hero />
          <ServicesGrid />
          <Portfolio />
        </main>
        <AnimatedWaveFooter />
        <MinimalistDock />
      </div>
    </MagneticCursor>
  );
}