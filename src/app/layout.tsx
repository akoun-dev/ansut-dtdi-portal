import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ANSUT - Portail Central des Services",
  description:
    "Portail centralisé d'accès aux services numériques ANSUT et partenaires. Dashboard unifié pour la supervision, la gestion et l'administration.",
  keywords: [
    "ANSUT",
    "portail",
    "dashboard",
    "services",
    "supervision",
    "monitoring",
  ],
  authors: [{ name: "ANSUT" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "ANSUT - Portail Central des Services",
    description:
      "Portail centralisé d'accès à tous les services numériques ANSUT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
