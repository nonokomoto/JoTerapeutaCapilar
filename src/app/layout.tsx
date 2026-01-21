import type { Metadata } from "next";
import { Manrope, Poppins } from "next/font/google";
import { Providers } from "./providers";
import "./styles.css";

const manrope = Manrope({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jo Terapeuta Capilar | Espaço Cliente",
  description:
    "Plataforma de acompanhamento personalizado para clientes de Jo Terapeuta Capilar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${manrope.variable} ${poppins.variable}`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
