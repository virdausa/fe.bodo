import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const roboto = Roboto({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Basic
  title: {
    default: "Bodo2",
    template: "%s | Bodo2",
  },
  description: "Bodo2 adalah aplikasi kelas berbasis NextJS dan ExpressJS",

  keywords: ["Bodo2", "Aplikasi Kelas"],

  authors: [{ name: "LinCie", url: "https://lincie.me" }],
  creator: "LinCie",
  publisher: "LinCie",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
      },
      {
        rel: "android-chrome",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
      },
    ],
  },

  manifest: "/site.webmanifest",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "Bodo2 | Home",
    description: "Bodo2 adalah aplikasi kelas berbasis NextJS dan ExpressJS",
    url: "https://cognito.my.id/",
    siteName: "Bodo2",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://cognito.my.id/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bodo2",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@Ke_Lin_Cie",
    creator: "@Ke_Lin_Cie",
    title: "Bodo2 | Home",
    description: "Bodo2 adalah aplikasi kelas berbasis NextJS dan ExpressJS",
    images: ["https://cognito.my.id/twitter-card.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable} text-foreground bg-background antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
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
