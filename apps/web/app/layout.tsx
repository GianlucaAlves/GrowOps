import Header from "./components/header/index";
import "./globals.css";
import { Fredoka, Nunito } from "next/font/google";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${fredoka.variable} ${nunito.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <Header />
        <div className="mx-auto w-full max-w-6xl px-4 pb-10 md:px-6">
          {children}
        </div>
        <div className="pointer-events-none fixed bottom-3 left-3 z-10 rounded-full border-2 border-primary/30 bg-card px-2 py-0.5 text-xs font-black text-primary/80 shadow-[0_2px_0_rgba(45,90,39,0.18)]">
          N
        </div>
      </body>
    </html>
  );
}
