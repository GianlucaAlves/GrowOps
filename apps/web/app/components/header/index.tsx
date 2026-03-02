"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLogged(!!token);

    const onStorage = () => {
      setIsLogged(!!localStorage.getItem("accessToken"));
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [pathname]);

  function handleLogout() {
    localStorage.removeItem("accessToken");
    setIsLogged(false);
    router.push("/auth/login");
  }

  return (
    <header className="sticky top-0 z-20 border-b-2 border-border/80 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/90 textured-paper">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[16px_20px_18px_14px] border-2 border-primary/30 bg-primary text-xl text-primary-foreground organic-shadow">
            🪴
          </div>
          <div>
            <p className="text-lg font-black tracking-tight leading-none">
              Plandica
            </p>
            <p className="text-xs text-muted-foreground">
              A sua horta & jardim felizes!
            </p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground/90">
          <Link
            href="/"
            className="hand-drawn-pill px-3 py-1.5 text-sm hover:text-accent"
          >
            Início
          </Link>
          <Link
            href="/jardins"
            className="hand-drawn-pill px-3 py-1.5 text-sm hover:text-accent"
          >
            Jardins
          </Link>
          <Link
            href="/plantas"
            className="hand-drawn-pill px-3 py-1.5 text-sm hover:text-accent"
          >
            Plantas
          </Link>
          <Link
            href="/diario"
            className="hand-drawn-pill px-3 py-1.5 text-sm hover:text-accent"
          >
            Diário
          </Link>
          <Link
            href="/rega"
            className="hand-drawn-pill px-3 py-1.5 text-sm hover:text-accent"
          >
            Rega
          </Link>
        </nav>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {isLogged ? (
            <button
              type="button"
              onClick={handleLogout}
              className="hand-drawn-button bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground"
            >
              Sair
            </button>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hand-drawn-pill px-3 py-1.5 text-sm font-semibold hover:text-accent"
              >
                Entrar
              </Link>
              <Link
                href="/auth/register"
                className="hand-drawn-button bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground"
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
