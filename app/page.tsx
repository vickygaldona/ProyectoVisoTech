"use client";

/* eslint-disable @next/next/no-img-element */
// Dependencias: npm i lucide-react framer-motion
// Requiere: Next.js (App Router) + TypeScript + Tailwind CSS 4
// Imágenes del portfolio: public/imagen1.png ... public/imagen4.png

import Link from "next/link";
import * as React from "react";
import { useState, useEffect } from "react";
import { motion, MotionConfig, type Variants } from "framer-motion";
import {
  Home,
  LayoutGrid,
  Layers,
  MessageCircle,
  Rocket,
  Utensils,
  PartyPopper,
  Sparkles,
  Users,
  Check,
  X,
  Zap,
  GraduationCap,
  SlidersHorizontal,
  FileText,
} from "lucide-react";

/* ============================================================
   CONTACTOS Y HELPERS GLOBALES
   ============================================================ */

type ContactId = "santiago" | "victoria";

type Contact = {
  id: ContactId;
  name: string;
  /** Formato internacional de Argentina para WhatsApp: 54 + 9 + código de área + número */
  number: string;
  graduate: string;
  initial: string;
};

const CONTACTS: readonly Contact[] = [
  {
    id: "santiago",
    name: "Santiago",
    number: "5492625649736",
    graduate: "Egresado",
    initial: "S",
  },
  {
    id: "victoria",
    name: "Victoria",
    number: "5492604811080",
    graduate: "Egresada",
    initial: "V",
  },
];

const getContact = (id: ContactId): Contact =>
  CONTACTS.find((c) => c.id === id) ?? CONTACTS[0];

const DEFAULT_TOPIC = "un sitio web para mi negocio";

const waLink = (id: ContactId, topic: string = DEFAULT_TOPIC) => {
  const { name, number } = getContact(id);
  const message = `Hola ${name}! Escribo desde la web de VisoTech. Quiero consultar por ${topic}.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

const openWhatsApp = (id: ContactId, topic?: string) => {
  window.open(waLink(id, topic), "_blank", "noopener,noreferrer");
};

const goTo = (id: string) => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
};

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const GLOBAL_CSS = `
:root{--aurora-color1:rgba(168,85,247,0.2);--aurora-color2:rgba(79,70,229,0.2)}
html{scroll-behavior:smooth;background:#000}
@keyframes vt-pulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:.7;transform:scale(1.05)}}
@keyframes vt-wave{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes vt-twinkle{0%,100%{opacity:0}50%{opacity:var(--peak,.6)}}
.vt-pulse{animation:vt-pulse var(--vt-dur,10s) infinite}
.vt-star{opacity:0;animation:vt-twinkle var(--vt-dur,3s) ease-in-out var(--vt-delay,0s) infinite}
.vt-wave-a{animation:vt-wave 40s linear infinite reverse;will-change:transform}
.vt-wave-b{animation:vt-wave 28s linear infinite;will-change:transform}
.vt-paused,.vt-paused *{animation-play-state:paused !important}
html.vt-cursor,html.vt-cursor *{cursor:none !important}
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  .vt-pulse,.vt-wave-a,.vt-wave-b{animation:none}
  .vt-star{animation:none;opacity:.35}
}
`;

/** Observa si un elemento está en pantalla (para pausar animaciones costosas). */
function useInView<T extends Element>(rootMargin = "120px") {
  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState(true);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return [ref, inView] as const;
}

/* ============================================================
   STATIC CURSOR (sin animaciones, sigue al puntero exacto)
   ============================================================ */

interface StaticCursorProps {
  children: React.ReactNode;
  variant?: "dot" | "ring" | "arrow";
  size?: number;
  color?: string;
  blendMode?: React.CSSProperties["mixBlendMode"];
  disableOnTouch?: boolean;
}

const StaticCursor: React.FC<StaticCursorProps> = ({
  children,
  variant = "ring",
  size = 24,
  color = "white",
  blendMode = "exclusion",
  disableOnTouch = true,
}) => {
  const cursorRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    setActive(!(disableOnTouch && isTouch));
  }, [disableOnTouch]);

  React.useEffect(() => {
    if (!active) return;
    const el = cursorRef.current;
    if (!el) return;

    document.documentElement.classList.add("vt-cursor");

    const onMove = (e: PointerEvent) => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      el.style.opacity = "1";
    };
    const hide = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("mouseleave", hide);
    return () => {
      document.documentElement.classList.remove("vt-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", hide);
    };
  }, [active]);

  // Punto y aro quedan centrados en el puntero; la flecha usa su punta.
  const offset = variant === "arrow" ? 0 : -size / 2;

  return (
    <>
      {active ? (
        <div
          ref={cursorRef}
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            pointerEvents: "none",
            opacity: 0,
            mixBlendMode: blendMode,
          }}
        >
          {variant === "arrow" ? (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
              <path d="M4 2v18l5-5 3.5 7 2.5-1-3.5-7H18z" />
            </svg>
          ) : (
            <span
              style={{
                display: "block",
                width: size,
                height: size,
                marginLeft: offset,
                marginTop: offset,
                borderRadius: "50%",
                backgroundColor: variant === "dot" ? color : "transparent",
                border: variant === "ring" ? `2px solid ${color}` : "none",
              }}
            />
          )}
        </div>
      ) : null}
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
  size?: "md" | "lg" | "xl";
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
        : size === "lg"
          ? "h-14 px-8 text-base md:h-16 md:px-10 md:text-lg"
          : "h-12 px-8 text-[15px]";

    return (
      <motion.button
        {...props}
        aria-busy={loading || undefined}
        className={cn(
          "relative inline-flex touch-manipulation select-none items-center justify-center overflow-hidden rounded-xl border font-medium tracking-[-0.02em]",
          "transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          focusRing,
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

/* ============================================================
   AURORA BACKGROUND (solo para el Hero)
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
  starCount = 24,
  gradientColors = [
    "var(--aurora-color1, rgba(168,85,247,0.2))",
    "var(--aurora-color2, rgba(79,70,229,0.2))",
  ],
  pulseDuration = 10,
}) => {
  const [colorA, colorB] = gradientColors;
  const [stars, setStars] = React.useState<Star[]>([]);
  const [rootRef, inView] = useInView<HTMLDivElement>();

  React.useEffect(() => {
    setStars(
      Array.from({ length: starCount }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        peak: 0.25 + Math.random() * 0.6,
        dur: Math.random() * 3 + 2,
        delay: Math.random() * 5,
      })),
    );
  }, [starCount]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden bg-black text-slate-50",
        !inView && "vt-paused",
        className,
      )}
    >
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="vt-pulse absolute inset-0 opacity-50"
          style={
            {
              backgroundImage: `
                radial-gradient(circle, ${colorA} 0%, transparent 80%),
                radial-gradient(circle, ${colorB} 0%, transparent 80%)
              `,
              backgroundSize: "100% 100%",
              "--vt-dur": `${pulseDuration}s`,
            } as React.CSSProperties
          }
        />

        {/* Los blobs con blur son lo más pesado: solo se montan mientras el hero está en pantalla */}
        {inView ? (
          <motion.div
            className="absolute inset-0 mix-blend-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute -top-1/4 -left-1/4 h-1/2 w-1/2 rounded-full bg-purple-600 opacity-40 blur-3xl will-change-transform"
              animate={{ x: [-50, 50, -50], y: [-20, 20, -20], scale: [1, 1.2, 1] }}
              transition={{
                duration: 30,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-fuchsia-600 opacity-40 blur-3xl will-change-transform"
              animate={{ x: [50, -50, 50], y: [20, -20, 20], scale: [1, 1.3, 1] }}
              transition={{
                duration: 40,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute top-1/3 left-1/3 h-1/3 w-1/3 rounded-full bg-indigo-700 opacity-30 blur-3xl will-change-transform"
              animate={{ x: [20, -20, 20], y: [-30, 30, -30] }}
              transition={{
                duration: 50,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            />
          </motion.div>
        ) : null}

        {stars.map((star, i) => (
          <span
            key={i}
            className="vt-star absolute h-0.5 w-0.5 rounded-full bg-white"
            style={
              {
                left: `${star.x}%`,
                top: `${star.y}%`,
                "--peak": star.peak.toFixed(2),
                "--vt-dur": `${star.dur.toFixed(2)}s`,
                "--vt-delay": `${star.delay.toFixed(2)}s`,
              } as React.CSSProperties
            }
          />
        ))}

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-black" />
      </div>

      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};

/* ============================================================
   MIST BACKGROUND (shader WebGL "mist" en violeta)
   Se usa como fondo fijo desde "Servicios y planes" hacia abajo.
   ============================================================ */

const MIST_VERTEX = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const MIST_FRAGMENT = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;

  #define TWO_PI 6.28318530718
  #define PI 3.14159265358979323846

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    float x1 = mix(a, b, u.x);
    float x2 = mix(c, d, u.x);
    return mix(x1, x2, u.y);
  }

  void main() {
      vec2 uv = v_uv;

      float t = u_time * 0.975 - 1.175;

      float noise_scale = 0.00338;

      uv -= 0.5;
      uv *= (noise_scale * u_resolution);
      uv /= 1.5;
      uv += 0.5;

      float n1 = noise(uv * 1.0 + t);
      float n2 = noise(uv * 2.0 - t);
      float angle = n1 * TWO_PI;
      uv.x += 0.32 * n2 * cos(angle);
      uv.y += 0.32 * n2 * sin(angle);

      for (int i = 1; i <= 5; i++) {
          float fi = float(i);
          uv.x += 0.65 / fi * cos(t + fi * 1.5 * uv.y);
          uv.y += 0.65 / fi * cos(t + fi * 1.0 * uv.x);
      }

      float sh = 1.0 - uv.y;
      sh -= 0.5;
      sh /= (noise_scale * u_resolution.y);
      sh += 0.5;

      float shape_scaling = 0.104;
      float shape = smoothstep(0.45 - shape_scaling, 0.55 + shape_scaling, sh + 0.3 * (0.33 - 0.5));
      float mixer = shape;

      // Fondo casi negro y niebla violeta (#A855F7) para combinar con el resto del sitio
      vec3 bg = vec3(0.0196, 0.0196, 0.0196);
      vec3 pink = vec3(0.659, 0.333, 0.969);

      float mistFocus = pow(sin(mixer * PI), 4.2);

      float fineMist = noise(uv * 3.5 - t * 1.3) * 0.4 + noise(uv * 1.5 + t * 0.85) * 0.6;
      float combinedDensity = mix(mixer, fineMist, 0.28) * mistFocus;

      vec3 col = mix(bg, pink, smoothstep(0.0, 0.85, combinedDensity));

      float highlight = smoothstep(0.42, 0.88, fineMist) * smoothstep(0.12, 0.9, mixer) * mistFocus;
      col = mix(col, pink * 1.15, highlight * 0.35);

      vec2 raySource = vec2(0.2, 1.25);
      vec2 rayDir = normalize(v_uv - raySource);
      float rayAngle = atan(rayDir.y, rayDir.x);

      float rays = sin(rayAngle * 6.5 + t * 0.35) * 0.35 +
                   sin(rayAngle * 12.0 - t * 0.22) * 0.25 +
                   sin(rayAngle * 24.0 + t * 0.15) * 0.15;
      rays = smoothstep(0.15, 0.82, rays * 0.5 + 0.5);

      float rayGlow = rays * smoothstep(0.15, 0.9, combinedDensity) * (1.1 - v_uv.y) * mistFocus * 0.7;
      col += pink * rayGlow * 0.38;

      float grain = random(gl_FragCoord.xy * 0.15 + t * 0.05);
      float particles = step(0.988, grain) * smoothstep(0.2, 0.9, combinedDensity);
      col += pink * particles * 0.32;

      col = pow(col, vec3(0.92));

      gl_FragColor = vec4(col, 1.0);
  }
`;

const MistBackground: React.FC<{ speed?: number; opacity?: number }> = ({
  speed = 0.6,
  opacity = 0.7,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, MIST_VERTEX);
    const fs = compile(gl.FRAGMENT_SHADER, MIST_FRAGMENT);
    if (!vs || !fs) {
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(program);
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    const startTime = performance.now();
    let raf = 0;

    const draw = (seconds: number) => {
      gl.uniform1f(timeLocation, seconds * speed);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const resize = () => {
      // Resolución reducida: es un fondo difuso y así pesa menos en celulares.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (reduce) draw(8);
    };

    const loop = () => {
      if (!document.hidden) draw((performance.now() - startTime) / 1000);
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduce) loop();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, [speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={{ opacity }}
    />
  );
};

/* ============================================================
   ANIMATED GROUP (entrada con blur escalonada para el Hero)
   ============================================================ */

const groupContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const groupItem: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)", y: 12 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { type: "spring" as const, bounce: 0.25, duration: 0.9 },
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
    label: "Servicios y planes",
    onClick: () => goTo("servicios"),
  },
  {
    id: "portfolio",
    icon: <Layers size={20} />,
    label: "Portfolio",
    onClick: () => goTo("portfolio"),
  },
  {
    id: "quienes-somos",
    icon: <Users size={20} />,
    label: "Quiénes somos",
    onClick: () => goTo("quienes-somos"),
  },
];

const DockItemComponent: React.FC<{
  item: DockItemData;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  hideTooltip?: boolean;
  expanded?: boolean;
  controls?: string;
  trigger?: boolean;
  children?: React.ReactNode;
}> = ({
  item,
  isHovered,
  onHover,
  hideTooltip = false,
  expanded,
  controls,
  trigger,
  children,
}) => {
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
        aria-expanded={expanded}
        aria-controls={controls}
        data-wa-trigger={trigger ? "" : undefined}
        onClick={item.onClick}
        onFocus={() => onHover(item.id)}
        onBlur={() => onHover(null)}
        className={cn(
          "relative flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white backdrop-blur-[2px] transition-all duration-300 ease-out",
          focusRing,
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
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/5 bg-black/70 px-2.5 py-1 text-xs font-normal text-white shadow-sm backdrop-blur transition-all duration-200",
          isHovered && !hideTooltip
            ? "translate-y-0 opacity-100"
            : "translate-y-1 opacity-0",
        )}
      >
        {item.label}
        <div className="absolute left-1/2 top-full -translate-x-1/2">
          <div className="h-2 w-2 rotate-45 border-b border-r border-white/5 bg-black/70" />
        </div>
      </div>

      {children}
    </div>
  );
};

const MinimalistDock: React.FC = () => {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const navRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      navRef.current
        ?.querySelector<HTMLButtonElement>("[data-wa-trigger]")
        ?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const whatsappItem: DockItemData = {
    id: "whatsapp",
    icon: <MessageCircle size={20} />,
    label: "WhatsApp: elegir con quién hablar",
    onClick: () => setMenuOpen((open) => !open),
  };

  return (
    <nav
      ref={navRef}
      aria-label="Navegación principal"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-50 -translate-x-1/2"
    >
      <div
        className={cn(
          "flex items-end gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 shadow-2xl backdrop-blur-xl transition-transform duration-500 ease-out sm:px-5",
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

        <DockItemComponent
          item={whatsappItem}
          isHovered={hoveredItem === whatsappItem.id}
          onHover={setHoveredItem}
          hideTooltip={menuOpen}
          expanded={menuOpen}
          controls="dock-wa-menu"
          trigger
        >
          {menuOpen ? (
            <div
              id="dock-wa-menu"
              role="group"
              aria-label="Elegir con quién hablar por WhatsApp"
              className="absolute bottom-[calc(100%+0.75rem)] right-0 w-60 rounded-2xl border border-white/10 bg-black/85 p-2 shadow-2xl backdrop-blur-xl"
            >
              {CONTACTS.map((contact) => (
                <a
                  key={contact.id}
                  href={waLink(contact.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-zinc-100 transition-colors hover:bg-white/10",
                    focusRing,
                  )}
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  Escribir a {contact.name}
                </a>
              ))}
            </div>
          ) : null}
        </DockItemComponent>
      </div>
    </nav>
  );
};

/* ============================================================
   CARD DECK CAROUSEL
   ============================================================ */

type Slide = {
  image?: string;
  title: string;
  caption?: string;
  alt?: string;
  href?: string;
};

type CardDeckCarouselProps = {
  slides?: Slide[];
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

/** Imágenes locales: colocá tus capturas en /public con estos nombres. */
const DEMO_SLIDES: Slide[] = [
  {
    image: "/imagen1.png",
    href: "https://carolinagarcia.com.ar",
    title: "Carnet de Manipulación de Alimentos",
    caption: "Landing de un curso de certificación en San Rafael.",
    alt: "Captura de la landing del Carnet de Manipulación de Alimentos",
  },
  {
    image: "/imagen2.png",
    href: "https://www.carolinagarcia.com.ar",
    title: "Carolina García",
    caption: "Sitio web profesional.",
    alt: "Captura del sitio web de Carolina García",
  },
  {
    image: "/imagen3.png",
    href: "https://danger-fitness-web.netlify.app",
    title: "Danger Fitness",
    caption: "Sitio web de entrenamiento.",
    alt: "Captura del sitio web de Danger Fitness",
  },
  {
    image: "/imagen4.png",
    href: "https://bautismo-lian.netlify.app",
    title: "Invitación de Bautismo",
    caption: "Invitación digital para eventos.",
    alt: "Captura de la invitación digital de bautismo",
  },
  {
    image: "/imagen5.png",
    href: "https://vivero-el-paraiso.netlify.app",
    title: "Vivero El Paraíso",
    caption: "Sitio web con catálogo de plantas de vid y frutos secos.",
    alt: "Captura del sitio web de Vivero El Paraíso",
  },
];

const CD_CSS = [
  ".cd-root{position:relative;width:100%;display:flex;flex-direction:column;align-items:center;gap:28px;overflow-x:clip;background:var(--cd-bg);color:var(--cd-ink);outline:none;padding:56px 16px 8px;box-sizing:border-box}",
  ".cd-root:focus-visible{box-shadow:inset 0 0 0 2px var(--cd-ink)}",
  ".cd-deck{position:relative;width:var(--cd-w);max-width:100%;aspect-ratio:var(--cd-aspect);touch-action:pan-y}",
  ".cd-card{position:absolute;inset:0;border-radius:18px;overflow:hidden;background:#1a1a1f;box-shadow:0 1px 2px rgba(0,0,0,.2),0 30px 60px -30px rgba(0,0,0,.8);border:1px solid rgba(255,255,255,.08);transition:transform .6s cubic-bezier(.2,.8,.2,1),opacity .4s ease,filter .4s ease;will-change:transform}",
  ".cd-card[data-top='1']{cursor:grab}",
  ".cd-card[data-drag='1']{cursor:grabbing;transition:none}",
  ".cd-card[data-fly='1']{transition:transform .45s cubic-bezier(.3,.5,.3,1),opacity .45s ease}",
  ".cd-card[data-snap='1']{transition:none}",
  ".cd-card img{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;object-position:top;display:block;pointer-events:none;user-select:none}",
  ".cd-fallback{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:24px;text-align:center;background:#111114}",
  ".cd-fallback strong{font-weight:600;font-size:clamp(18px,3vw,22px);line-height:1.25;text-wrap:balance}",
  ".cd-fallback span{font-size:14px;color:var(--cd-muted)}",
  ".cd-meta{display:flex;flex-direction:column;gap:20px;width:var(--cd-w);max-width:100%}",
  ".cd-cap{display:grid}",
  ".cd-cap-item{grid-area:1/1;visibility:hidden;opacity:0}",
  ".cd-cap-item[data-on='1']{visibility:visible;opacity:1;animation:cd-in .5s cubic-bezier(.2,.8,.2,1) both}",
  ".cd-title{margin:0;font-weight:600;font-size:clamp(18px,2.2vw,24px);line-height:1.25;letter-spacing:-.01em;text-wrap:balance;overflow-wrap:break-word}",
  ".cd-sub{margin:6px 0 0;font-size:15px;line-height:1.55;color:var(--cd-muted);overflow-wrap:break-word}",
  ".cd-nav{display:flex;align-items:center;justify-content:space-between;gap:16px}",
  ".cd-count{font:500 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em;color:var(--cd-muted)}",
  ".cd-count b{color:var(--cd-ink);font-weight:500}",
  ".cd-btn{appearance:none;border:1px solid var(--cd-line);background:transparent;color:inherit;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;cursor:pointer;flex:none;touch-action:manipulation;transition:background .2s ease,color .2s ease}",
  "@media (hover:hover){.cd-btn:hover{background:var(--cd-ink);color:#000}}",
  ".cd-btn:focus-visible{outline:2px solid var(--cd-ink);outline-offset:2px}",
  ".cd-demo{display:flex;justify-content:center}",
  ".cd-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",
  "@keyframes cd-in{from{transform:translateY(8px);opacity:0}to{transform:none;opacity:1}}",
  "@media (prefers-reduced-motion:reduce){.cd-card,.cd-card[data-fly='1']{transition:opacity .3s ease}.cd-cap-item[data-on='1']{animation:none}}",
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
  cardWidth = "min(78vw, 400px)",
  aspect = "3 / 4",
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
  const [top, setTop] = React.useState(0);
  const [over, setOver] = React.useState<Override | null>(null);
  const [reduce, setReduce] = React.useState(false);
  const [failed, setFailed] = React.useState<Record<number, boolean>>({});
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const deckRef = React.useRef<HTMLDivElement | null>(null);
  const busy = React.useRef(false);
  const lastTouch = React.useRef(0);
  const topRef = React.useRef(0);
  topRef.current = top;

  const markFailed = React.useCallback(
    (i: number) => setFailed((f) => (f[i] ? f : { ...f, [i]: true })),
    [],
  );

  React.useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Si la imagen falló antes de hidratar, onError no se dispara: lo revisamos al montar.
  React.useEffect(() => {
    rootRef.current
      ?.querySelectorAll<HTMLImageElement>("img[data-i]")
      .forEach((img) => {
        if (img.complete && img.naturalWidth === 0) {
          markFailed(Number(img.dataset.i));
        }
      });
  }, [markFailed]);

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
      y: dy * 0.3,
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
    if (isThrow(dx, d.vx, w)) throwTop(dx, dx, dy * 0.3, dy);
    else setOver(null);
  };

  // En pantallas táctiles el navegador cancela el gesto cuando el usuario hace
  // scroll vertical: ahí no hay que tirar la tarjeta, solo devolverla a su lugar.
  const onCancel = () => {
    drag.current = null;
    lastTouch.current = performance.now();
    setOver(null);
  };

  const onKey = (e: React.KeyboardEvent) => {
    lastTouch.current = performance.now();
    if (e.key === "ArrowRight") throwTop(1);
    else if (e.key === "ArrowLeft") pullBack();
    else return;
    e.preventDefault();
  };

  const s = slides[top] || { title: "" };

  const rootStyle = {
    "--cd-w": cardWidth,
    "--cd-aspect": aspect,
    "--cd-bg": background,
    "--cd-ink": ink,
    "--cd-muted": "color-mix(in srgb, var(--cd-ink) 68%, transparent)",
    "--cd-line": "color-mix(in srgb, var(--cd-ink) 25%, transparent)",
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
              onPointerCancel={isTop ? onCancel : undefined}
            >
              {sl.image && !failed[i] ? (
                <img
                  data-i={i}
                  src={sl.image}
                  alt={isTop ? sl.alt || sl.title : ""}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  onError={() => markFailed(i)}
                />
              ) : (
                <div className="cd-fallback" aria-hidden="true">
                  <strong>{sl.title}</strong>
                  <span>Imagen en preparación</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="cd-meta">
        {/* Todos los textos comparten la misma celda: el alto lo marca el más largo y nada se corta ni salta */}
        <div className="cd-cap">
          {slides.map((sl, i) => (
            <div
              key={i}
              className="cd-cap-item"
              data-on={i === top ? "1" : "0"}
              aria-hidden={i === top ? undefined : true}
            >
              <h3 className="cd-title">{sl.title}</h3>
              {sl.caption ? <p className="cd-sub">{sl.caption}</p> : null}
            </div>
          ))}
        </div>

        <div className="cd-nav">
          <button
            type="button"
            className="cd-btn"
            aria-label="Demo anterior"
            onClick={() => {
              lastTouch.current = performance.now();
              pullBack();
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
          <span className="cd-count" aria-hidden="true">
            <b>{pad2(top + 1)}</b> / {pad2(n)}
          </span>
          <button
            type="button"
            className="cd-btn"
            aria-label="Demo siguiente"
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
          <div className="cd-demo">
            <MagneticWrap>
              <OriginButton
                variant="outline"
                aria-label={`Ver la demo de ${s.title} (se abre en una pestaña nueva)`}
                onClick={() => window.open(s.href, "_blank", "noopener,noreferrer")}
              >
                Ver demo ↗
              </OriginButton>
            </MagneticWrap>
          </div>
        ) : null}
      </div>

      <div className="cd-sr" aria-live="polite">
        {"Demo " + (top + 1) + " de " + n + (s.title ? ": " + s.title : "")}
      </div>
    </div>
  );
};

/* ============================================================
   SECCIONES
   ============================================================ */

const Hero: React.FC = () => (
  <section id="inicio" aria-labelledby="hero-titulo">
    <AuroraBackground starCount={24} pulseDuration={8} className="px-4 py-28">
      <AnimatedGroup className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h1
          id="hero-titulo"
          className="bg-gradient-to-br from-gray-50 to-gray-400 bg-clip-text pb-1 text-4xl font-bold tracking-tight text-balance text-transparent sm:text-5xl md:text-6xl"
        >
          VisoTech: webs visuales para negocios y eventos
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-300">
          Diseñamos landing pages para negocios, cartas y catálogos digitales e
          invitaciones para eventos. A medida, con animaciones cuidadas y
          pensadas para el celular.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <MagneticWrap>
            <OriginButton variant="solid" onClick={() => goTo("servicios")}>
              Ver servicios
            </OriginButton>
          </MagneticWrap>
          <MagneticWrap>
            <OriginButton variant="outline" onClick={() => goTo("contacto")}>
              Consultar presupuesto
            </OriginButton>
          </MagneticWrap>
        </div>
      </AnimatedGroup>
    </AuroraBackground>
  </section>
);

/* ---------- Servicios y planes ---------- */

type Plan = {
  id: string;
  icon: React.ReactNode;
  title: string;
  tagline: string;
  ideal: string;
  includes: string[];
  note?: string;
  /** Texto que completa el mensaje precargado de WhatsApp: "Quiero consultar por ..." */
  topic: string;
  featured?: boolean;
  span: string;
  /** Ruta del PDF de la propuesta (archivo dentro de public/propuestas/) */
  pdf: string;
};

const PLANS: Plan[] = [
  {
    id: "landing",
    icon: <Rocket size={20} />,
    title: "Landing page para negocios",
    tagline:
      "Una página clara y visual que presenta tu negocio y lleva a la consulta.",
    ideal:
      "Gimnasios, peluquerías, tiendas, emprendimientos, profesionales y cualquier negocio que quiera tener presencia en Internet.",
    includes: [
      "Diseño personalizado con la identidad de tu negocio",
      "Animaciones y detalles visuales cuidados",
      "Adaptada a celular y computadora",
      "Botones de contacto por WhatsApp",
    ],
    topic: "una landing page para mi negocio",
    featured: true,
    span: "md:col-span-4",
    pdf: "/propuestas/01-Landing-page-para-negocios.pdf",
  },
  {
    id: "invitacion",
    icon: <PartyPopper size={20} />,
    title: "Invitación digital para eventos",
    tagline: "Una invitación web con diseño propio para compartir con tus invitados.",
    ideal: "Cumpleaños, bautismos, casamientos y otros eventos especiales.",
    includes: [
      "Diseño personalizado para tu evento",
      "Experiencia visual con animaciones",
      "Botón para confirmar asistencia por WhatsApp",
    ],
    topic: "una invitación digital para un evento",
    span: "md:col-span-2",
    pdf: "/propuestas/02-Invitacion-digital-para-eventos.pdf",
  },
  {
    id: "carta",
    icon: <Utensils size={20} />,
    title: "Carta o catálogo digital",
    tagline:
      "Tus productos o tu menú en una página visual, fácil de abrir desde el celular.",
    ideal:
      "Restaurantes, bares, cafeterías, comercios y emprendimientos que quieren mostrar sus productos o servicios.",
    includes: [
      "Fotografías de tus productos o platos",
      "Categorías y precios",
      "Botón de contacto por WhatsApp",
    ],
    note: "Es una carta para ver y consultar: no incluye pagos ni pedidos online.",
    topic: "una carta o catálogo digital",
    span: "md:col-span-3",
    pdf: "/propuestas/03-Carta-o-catalogo-digital.pdf",
  },
  {
    id: "personalizada",
    icon: <Sparkles size={20} />,
    title: "Proyecto personalizado",
    tagline:
      "Un sitio moderno armado a medida de tu identidad y tus necesidades.",
    ideal:
      "Quienes necesitan una página con una idea o una presentación diferente.",
    includes: [
      "Diseño y animaciones a medida",
      "Las secciones que tu proyecto necesite",
      "Adaptado a celular y computadora",
    ],
    note: "Nos enfocamos en diseño y frontend: sin login, paneles de administración ni pagos.",
    topic: "un proyecto web personalizado",
    span: "md:col-span-3",
    pdf: "/propuestas/04-Proyecto-personalizado.pdf",
  },
];

const planCard =
  "relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-7 backdrop-blur-xl transition-colors duration-300 hover:border-white/20";

const iconBox =
  "flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white";

const WaPill: React.FC<{
  contact: Contact;
  topic?: string;
  ariaLabel?: string;
}> = ({ contact, topic, ariaLabel }) => (
  <a
    href={waLink(contact.id, topic)}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={ariaLabel}
    className={cn(
      "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 text-sm font-medium text-white transition-colors hover:bg-white hover:text-neutral-950",
      focusRing,
    )}
  >
    <MessageCircle size={16} aria-hidden="true" />
    Escribir a {contact.name}
  </a>
);

const PlanCard: React.FC<{ plan: Plan }> = ({ plan }) => {
  const titleId = `plan-${plan.id}`;
  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        planCard,
        plan.span,
        plan.featured &&
          "border-cyan-300/30 shadow-[0_0_60px_-15px_rgba(34,211,238,0.45)] hover:border-cyan-300/50",
      )}
    >
      {plan.featured ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl"
        />
      ) : null}

      <div className="relative flex items-start justify-between">
        <div className={cn(iconBox, plan.featured && "border-cyan-300/30 text-cyan-200")}>
          {plan.icon}
        </div>
        {plan.featured ? (
          <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-200">
            Nuestro foco
          </span>
        ) : null}
      </div>

      <div className="relative mt-8">
        <h3
          id={titleId}
          className={cn(
            "font-semibold text-zinc-50",
            plan.featured ? "text-2xl" : "text-xl",
          )}
        >
          {plan.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-300">{plan.tagline}</p>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">
          <span className="font-medium text-zinc-200">Ideal para: </span>
          {plan.ideal}
        </p>
        <ul
          className={cn(
            "mt-5 grid gap-2.5 text-sm text-zinc-300",
            plan.featured && "sm:grid-cols-2",
          )}
        >
          {plan.includes.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check
                size={16}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-cyan-300"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        {plan.note ? (
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">{plan.note}</p>
        ) : null}
      </div>

      <div className="relative mt-auto border-t border-white/10 pt-5">
        <a
          href={plan.pdf}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ver la propuesta de ${plan.title} en PDF (se abre en una pestaña nueva)`}
          className={cn(
            "mb-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-medium text-neutral-950 transition-colors hover:bg-zinc-200",
            focusRing,
          )}
        >
          <FileText size={16} aria-hidden="true" />
          Ver propuesta
        </a>
        <p className="text-sm font-medium text-zinc-100">Consultar presupuesto</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {CONTACTS.map((contact) => (
            <WaPill
              key={contact.id}
              contact={contact}
              topic={plan.topic}
              ariaLabel={`Escribir a ${contact.name} por WhatsApp para consultar el presupuesto de ${plan.title}`}
            />
          ))}
        </div>
      </div>
    </article>
  );
};

/* ---------- Buscador de proyecto ---------- */

type FinderColumn = { id: string; name: string };

type FinderNeed = {
  id: string;
  label: string;
  /** Versión corta para el mensaje de WhatsApp */
  short: string;
  group: string;
  /** true o un texto = incluido; false = no incluido */
  availability: Record<string, boolean | string>;
};

const FINDER_COLUMNS: FinderColumn[] = [
  { id: "landing", name: "Landing page" },
  { id: "carta", name: "Carta o catálogo" },
  { id: "invitacion", name: "Invitación digital" },
  { id: "personalizada", name: "Proyecto personalizado" },
];

const FINDER_NEEDS: FinderNeed[] = [
  {
    id: "presentar",
    label: "Presentar mi negocio o proyecto",
    short: "presentar mi negocio o proyecto",
    group: "Qué quiero mostrar",
    availability: { landing: true, carta: false, invitacion: false, personalizada: true },
  },
  {
    id: "productos",
    label: "Mostrar productos o servicios con fotos y precios",
    short: "mostrar productos o servicios con fotos y precios",
    group: "Qué quiero mostrar",
    availability: { landing: false, carta: true, invitacion: false, personalizada: true },
  },
  {
    id: "evento",
    label: "Contar los datos de un evento (fecha, lugar y horario)",
    short: "datos de un evento",
    group: "Qué quiero mostrar",
    availability: { landing: false, carta: false, invitacion: true, personalizada: true },
  },
  {
    id: "whatsapp",
    label: "Que me contacten por WhatsApp",
    short: "contacto por WhatsApp",
    group: "Cómo quiero que se vea y funcione",
    availability: {
      landing: "Consultas",
      carta: "Consultas",
      invitacion: "Confirmar asistencia",
      personalizada: true,
    },
  },
  {
    id: "animaciones",
    label: "Animaciones y diseño a medida",
    short: "animaciones y diseño a medida",
    group: "Cómo quiero que se vea y funcione",
    availability: { landing: true, carta: true, invitacion: true, personalizada: true },
  },
  {
    id: "secciones",
    label: "Secciones y estructura a medida",
    short: "secciones y estructura a medida",
    group: "Cómo quiero que se vea y funcione",
    availability: { landing: false, carta: false, invitacion: false, personalizada: true },
  },
];

const hasNeed = (need: FinderNeed | undefined, columnId: string) => {
  const value = need?.availability[columnId];
  return value === true || (typeof value === "string" && value.trim().length > 0);
};

const PlanFinder: React.FC = () => {
  const [selected, setSelected] = React.useState<string[]>([]);

  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );

  const selectedNeeds = FINDER_NEEDS.filter((need) => selected.includes(need.id));
  const matching = FINDER_COLUMNS.filter((col) =>
    selectedNeeds.every((need) => hasNeed(need, col.id)),
  );
  // Entre los que cubren todo lo marcado, gana el más específico (el que incluye menos cosas).
  const featureCount = (colId: string) =>
    FINDER_NEEDS.filter((need) => hasNeed(need, colId)).length;
  const minCount = matching.length
    ? Math.min(...matching.map((col) => featureCount(col.id)))
    : 0;
  const best = selectedNeeds.length
    ? matching.filter((col) => featureCount(col.id) === minCount)
    : [];
  const bestIds = best.map((col) => col.id);
  const bestPlans = bestIds
    .map((id) => PLANS.find((plan) => plan.id === id))
    .filter((plan): plan is Plan => Boolean(plan));

  const groups: { label: string; items: FinderNeed[] }[] = [];
  FINDER_NEEDS.forEach((need) => {
    const group = groups.find((entry) => entry.label === need.group);
    if (group) group.items.push(need);
    else groups.push({ label: need.group, items: [need] });
  });

  const onlyCustom = best.length === 1 && best[0].id === "personalizada";
  const summary =
    best.length === 0
      ? "Marcá lo que necesitás"
      : `Te conviene: ${best.map((col) => col.name).join(" o ")}`;
  const detail =
    best.length === 0
      ? "Te mostramos qué tipo de proyecto encaja. Podés marcar varias opciones."
      : onlyCustom
        ? "Ningún otro tipo de proyecto reúne todo lo que marcaste: lo armamos a medida."
        : "Cubre todo lo que marcaste.";
  const topic = bestPlans.length
    ? `${bestPlans.map((plan) => plan.topic).join(" o ")} (necesito: ${selectedNeeds
        .map((need) => need.short)
        .join(", ")})`
    : undefined;

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
      <table className="w-full table-fixed border-collapse">
        <caption className="sr-only">
          Marcá lo que necesitás para saber qué tipo de proyecto te conviene
        </caption>
        <colgroup>
          <col className="w-full md:w-[34%]" />
          {FINDER_COLUMNS.map((col) => (
            <col key={col.id} className="hidden md:table-column" />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className="px-4 pb-3 pt-5 text-left align-bottom font-normal md:px-5">
              <span className="block text-base font-semibold text-zinc-50">
                Lo que necesito
              </span>
              <span className="mt-1 block text-sm text-zinc-400">
                {selected.length} {selected.length === 1 ? "marcada" : "marcadas"}
              </span>
            </th>
            {FINDER_COLUMNS.map((col) => {
              const isBest = bestIds.includes(col.id);
              return (
                <th
                  key={col.id}
                  scope="col"
                  className={cn(
                    "hidden px-2 pb-3 pt-4 text-center align-bottom font-normal transition-colors md:table-cell",
                    isBest && "bg-cyan-300/[0.06]",
                  )}
                >
                  <span
                    className={cn(
                      "mb-2 inline-block rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2.5 py-0.5 text-xs font-medium text-cyan-200",
                      isBest ? "visible" : "invisible",
                    )}
                  >
                    Te conviene
                  </span>
                  <span className="block text-sm font-semibold text-balance text-zinc-50">
                    {col.name}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        {groups.map((group) => (
          <tbody key={group.label}>
            <tr>
              <th
                scope="rowgroup"
                colSpan={FINDER_COLUMNS.length + 1}
                className="border-y border-white/10 bg-white/[0.03] px-4 py-2 text-left text-sm font-medium text-zinc-400 md:px-5"
              >
                {group.label}
              </th>
            </tr>
            {group.items.map((need) => {
              const checked = selected.includes(need.id);
              return (
                <tr key={need.id} className="border-b border-white/5 last:border-b-0">
                  <th scope="row" className="px-4 text-left font-normal md:px-5">
                    <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md py-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(need.id)}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-cyan-300/70 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-black",
                          checked
                            ? "border-cyan-300 bg-cyan-300 text-neutral-950"
                            : "border-white/30",
                        )}
                      >
                        {checked ? <Check size={14} strokeWidth={3} /> : null}
                      </span>
                      <span
                        className={cn(
                          "text-sm leading-snug md:text-[15px]",
                          checked ? "font-medium text-zinc-50" : "text-zinc-300",
                        )}
                      >
                        {need.label}
                      </span>
                    </label>
                  </th>
                  {FINDER_COLUMNS.map((col) => {
                    const available = hasNeed(need, col.id);
                    const value = need.availability[col.id];
                    const missing = checked && !available;
                    return (
                      <td
                        key={col.id}
                        className={cn(
                          "hidden px-2 text-center transition-colors md:table-cell",
                          bestIds.includes(col.id) && "bg-cyan-300/[0.06]",
                          missing && "opacity-40",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "inline-flex size-6 items-center justify-center rounded-full",
                            checked && available
                              ? "bg-cyan-300 text-neutral-950"
                              : available
                                ? "text-cyan-300"
                                : "text-zinc-500",
                          )}
                        >
                          {available ? <Check size={16} strokeWidth={2.5} /> : <X size={16} />}
                        </span>
                        {typeof value === "string" && available ? (
                          <span className="block text-xs leading-4 text-zinc-400">
                            {value}
                          </span>
                        ) : null}
                        <span className="sr-only">
                          {available ? "Incluido" : "No incluido"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        ))}
      </table>

      <div className="border-t border-white/10 p-5 md:p-6">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white"
          >
            <SlidersHorizontal size={16} />
          </span>
          <div className="min-w-0 flex-1">
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="text-base font-semibold text-zinc-50"
            >
              {summary}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-400">{detail}</p>
          </div>
          {selected.length > 0 ? (
            <button
              type="button"
              onClick={() => setSelected([])}
              className={cn(
                "min-h-11 shrink-0 rounded-lg px-3 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white",
                focusRing,
              )}
            >
              Borrar selección
            </button>
          ) : null}
        </div>

        {bestPlans.length > 0 ? (
          <>
            <ul className="mt-5 space-y-3">
              {bestPlans.map((plan) => (
                <li key={plan.id}>
                  <p className="text-sm font-medium text-zinc-100">{plan.title}</p>
                  <p className="text-sm leading-relaxed text-zinc-400">{plan.tagline}</p>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm font-medium text-zinc-100">
              Consultar presupuesto
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {CONTACTS.map((contact) => (
                <WaPill
                  key={contact.id}
                  contact={contact}
                  topic={topic}
                  ariaLabel={`Escribir a ${contact.name} por WhatsApp para consultar el presupuesto de ${best
                    .map((col) => col.name)
                    .join(" o ")}`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

const ServicesGrid: React.FC = () => (
  <section
    id="servicios"
    aria-labelledby="servicios-titulo"
    className="relative px-4 py-24 md:px-8"
  >
    <div className="relative mx-auto max-w-6xl">
      <div className="mb-12 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300/70">
          Servicios y planes
        </p>
        <h2
          id="servicios-titulo"
          className="mt-3 text-3xl font-bold tracking-tight text-balance text-zinc-50 md:text-5xl"
        >
          Elegí el proyecto que necesitás
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-zinc-300">
          El precio depende de cada proyecto. Escribinos por WhatsApp y te
          armamos un presupuesto.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      <div className="mt-20">
        <div className="mb-8 text-center">
          <h3 className="text-2xl font-bold tracking-tight text-balance text-zinc-50 md:text-3xl">
            ¿No sabés cuál elegir?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-base text-zinc-300">
            Marcá lo que necesitás y te mostramos qué tipo de proyecto encaja.
          </p>
        </div>
        <div className="mx-auto max-w-4xl">
          <PlanFinder />
        </div>
      </div>
    </div>
  </section>
);

/* ---------- Portfolio ---------- */

const Portfolio: React.FC = () => (
  <section
    id="portfolio"
    aria-labelledby="portfolio-titulo"
    className="relative px-4 py-24 md:px-8"
  >
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300/70">
          Portfolio
        </p>
        <h2
          id="portfolio-titulo"
          className="mt-3 text-3xl font-bold tracking-tight text-balance text-zinc-50 md:text-5xl"
        >
          Nuestras demos
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-zinc-300">
          Deslizá las tarjetas o usá las flechas para recorrer los proyectos.
        </p>
      </div>
      <CardDeckCarousel
        slides={DEMO_SLIDES}
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

/* ---------- Quiénes somos ---------- */

const AboutUs: React.FC = () => (
  <section
    id="quienes-somos"
    aria-labelledby="quienes-titulo"
    className="relative px-4 py-24 md:px-8"
  >
    <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300/70">
          Quiénes somos
        </p>
        <h2
          id="quienes-titulo"
          className="mt-3 text-3xl font-bold tracking-tight text-balance text-zinc-50 md:text-5xl"
        >
          Detrás de VisoTech estamos Santiago y Victoria
        </h2>
        <div className="mt-8 max-w-xl space-y-5 text-base leading-relaxed text-zinc-300">
          <p>
            Somos egresados de la Tecnicatura Universitaria en Programación de
            la UTN de San Rafael. Nos une el interés por la tecnología, el
            diseño y las experiencias digitales que aportan valor de verdad.
          </p>
          <p>
            Desarrollamos páginas web visuales, modernas y adaptadas a cada
            negocio o proyecto. Combinamos programación, creatividad y atención
            al detalle para que tu idea comunique mejor y deje una buena primera
            impresión.
          </p>
          <p>
            Creemos que una buena página no tiene que ser complicada: tiene que
            tener identidad propia, ser fácil de usar y mostrar lo importante
            con claridad.
          </p>
        </div>
      </div>

      <div className="relative pb-16 lg:col-span-6 lg:self-center">
        <div
          aria-hidden="true"
          className="absolute inset-x-4 bottom-0 h-44 rounded-[28px] bg-cyan-300 shadow-[0_40px_80px_-16px_rgba(34,211,238,0.55)]"
        />
        <ul className="relative z-10 grid gap-4">
          {CONTACTS.map((person) => (
            <li
              key={person.id}
              className="rounded-[28px] border border-white/10 bg-[radial-gradient(120%_120%_at_30%_10%,#1a1a1a_0%,#0f0f10_60%,#0b0b0c_100%)] p-6 shadow-2xl sm:p-8"
            >
              <p className="mb-6 flex items-center gap-2 text-sm text-zinc-300">
                <GraduationCap size={16} aria-hidden="true" />
                {person.graduate} de la UTN San Rafael
              </p>
              <div className="flex items-center gap-5">
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/5 text-2xl font-semibold text-zinc-50 ring-2 ring-white/10"
                >
                  {person.initial}
                </span>
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
                    {person.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-zinc-400">
                    Tecnicatura Universitaria en Programación
                  </p>
                </div>
              </div>
              <a
                href={waLink(person.id)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "mt-6 flex h-12 w-full items-center justify-start gap-3 rounded-2xl bg-white/10 px-4 text-sm font-medium text-white transition-colors hover:bg-white/15",
                  focusRing,
                )}
              >
                <MessageCircle size={16} aria-hidden="true" />
                Escribir a {person.name}
              </a>
            </li>
          ))}
        </ul>
        <div className="absolute inset-x-0 bottom-0 flex h-16 items-center justify-center gap-2 px-6 text-center text-sm font-medium text-neutral-950">
          <Zap size={16} aria-hidden="true" className="shrink-0" />
          Programación, creatividad y atención al detalle
        </div>
      </div>
    </div>
  </section>
);

/* ---------- Contacto + footer ---------- */

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

const footerLink = cn(
  "block rounded-md py-1 transition-colors hover:text-cyan-200",
  focusRing,
);

const AnimatedWaveFooter: React.FC = () => {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const [footerRef, inView] = useInView<HTMLElement>();

  return (
    <footer
      ref={footerRef}
      className={cn(
        "relative overflow-hidden bg-gradient-to-b from-transparent via-black/30 to-cyan-950/30 pt-24",
        !inView && "vt-paused",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="vt-wave-a absolute bottom-0 left-0 flex h-[420px] w-[3600px]">
          <WaveSvg className="text-slate-700/20" />
          <WaveSvg className="text-slate-700/20" />
        </div>
        <div className="vt-wave-b absolute bottom-0 left-0 flex h-[340px] w-[3600px]">
          <WaveSvg className="text-cyan-900/25" />
          <WaveSvg className="text-cyan-900/25" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-32 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <section id="contacto" aria-labelledby="contacto-titulo">
            <h2
              id="contacto-titulo"
              className="max-w-md text-3xl font-bold tracking-tight text-balance text-zinc-50 md:text-4xl"
            >
              ¿Hablamos de tu proyecto?
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-300">
              Escribinos por WhatsApp a Santiago o a Victoria. Contanos qué
              necesitás y vemos cómo ayudarte.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {CONTACTS.map((contact) => (
                <MagneticWrap key={contact.id}>
                  <OriginButton
                    variant="solid"
                    size="lg"
                    onClick={() => openWhatsApp(contact.id)}
                    className="w-full sm:w-auto"
                  >
                    <MessageCircle size={18} aria-hidden="true" />
                    Escribir a {contact.name}
                  </OriginButton>
                </MagneticWrap>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-zinc-50">Enlaces</h3>
              <nav aria-label="Enlaces del sitio" className="space-y-1 text-sm text-zinc-400">
                <a href="#inicio" className={footerLink}>
                  Inicio
                </a>
                <a href="#servicios" className={footerLink}>
                  Servicios y planes
                </a>
                <a href="#portfolio" className={footerLink}>
                  Nuestras demos
                </a>
                <a href="#quienes-somos" className={footerLink}>
                  Quiénes somos
                </a>
                <a href="#contacto" className={footerLink}>
                  Contacto
                </a>
                <Link href="/privacidad" className={footerLink}>
                  Política de privacidad
                </Link>
                <Link href="/terminos" className={footerLink}>
                  Términos y condiciones
                </Link>
              </nav>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold text-zinc-50">WhatsApp</h3>
              <address className="space-y-1 text-sm not-italic text-zinc-400">
                {CONTACTS.map((contact) => (
                  <a
                    key={contact.id}
                    href={waLink(contact.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={footerLink}
                  >
                    Escribir a {contact.name}
                  </a>
                ))}
                <p className="pt-3">San Rafael, Mendoza</p>
                <p>Argentina</p>
              </address>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-zinc-400">
            © {year} VisoTech. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

/* ============================================================
   PAGE
   El fondo "mist" es sticky dentro de este contenedor: el Hero lo tapa
   con su propio fondo y aparece recién desde "Servicios y planes" hacia abajo.
   ============================================================ */

export default function Page() {
  return (
    <MotionConfig reducedMotion="user">
      <StaticCursor variant="ring" size={24} blendMode="exclusion">
        <style>{GLOBAL_CSS}</style>
        <div className="dark relative min-h-screen overflow-x-clip bg-black text-zinc-50 antialiased">
          <a
            href="#contenido"
            className={cn(
              "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-neutral-950",
              focusRing,
            )}
          >
            Saltar al contenido
          </a>

          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none sticky top-0 z-0 -mb-[100svh] h-svh w-full overflow-hidden bg-black"
            >
              <MistBackground speed={0.6} opacity={0.7} />
              {/* Velo oscuro para que el texto se lea bien sobre la niebla */}
              <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="relative z-10">
              <main id="contenido">
                <Hero />
                <ServicesGrid />
                <Portfolio />
                <AboutUs />
              </main>
              <AnimatedWaveFooter />
            </div>
          </div>

          <MinimalistDock />
        </div>
      </StaticCursor>
    </MotionConfig>
  );
}