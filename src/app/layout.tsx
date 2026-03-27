import "./globals.css";
import { JetBrains_Mono, Inter } from "next/font/google";
import Nav from "@/components/nav";
import { ThemeScript } from "@/components/theme-script";
import { ThemeProvider } from "@/contexts/theme-context";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "My App",
  description: "A Next.js placeholder application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-700 dark:text-stone-300 antialiased">
        <ThemeProvider>
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
