import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "./site-url";
import { EMAIL, FACEBOOK_URL, INSTAGRAM_URL } from "./site-links";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const title = "VisoTech | Landing pages, cartas e invitaciones digitales";
const description =
  "Diseñamos landing pages para negocios, cartas y catálogos digitales e invitaciones para eventos. Desde San Rafael, Mendoza. Consultá por WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "VisoTech",
    locale: "es_AR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

// ID de medición de GA4 (formato G-XXXXXXXXXX). Se configura en .env.local
// y en las variables de entorno del hosting. Si no está definido, Analytics no se carga.
const gaId = process.env.NEXT_PUBLIC_GA_ID;

// Datos estructurados para Google: ayudan a que entienda quién es VisoTech
// y que estas redes y este correo son suyos.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "VisoTech",
  url: SITE_URL,
  email: EMAIL,
  description,
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Rafael",
    addressRegion: "Mendoza",
    addressCountry: "AR",
  },
  sameAs: [INSTAGRAM_URL, FACEBOOK_URL],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}