"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

type Props = { mode: "register" | "login" };

export default function AuthForm({ mode }: Props) {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(`${apiBase}/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const contentType = res.headers.get("content-type") || "";
      const payload = contentType.includes("application/json")
        ? await res.json()
        : { message: await res.text() };

      if (!res.ok) {
        throw new Error(payload.message || "Error");
      }

      if (mode === "login" && payload.accessToken) {
        localStorage.setItem("accessToken", payload.accessToken);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto mt-8 w-full max-w-md rounded-3xl p-6 md:p-7">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-xl text-primary-foreground">
          {mode === "register" ? "🌱" : "🔐"}
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "register" ? "Criar conta" : "Entrar"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "register"
            ? "Comece seu diário de cultivo em poucos segundos"
            : "Acesse suas tarefas e registros do jardim"}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {mode === "register" && (
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Nome</span>
            <Input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              aria-label="Nome"
              placeholder="Seu nome"
            />
          </label>
        )}

        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Email</span>
          <Input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            aria-label="Email"
            placeholder="voce@email.com"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Senha</span>
          <Input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            aria-label="Senha"
            placeholder="Mínimo de 8 caracteres"
          />
        </label>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
            {mode === "register"
              ? "Cadastro realizado com sucesso! Redirecionando..."
              : "Login realizado com sucesso! Redirecionando..."}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-xl"
          aria-busy={loading}
        >
          {loading
            ? "Carregando..."
            : mode === "register"
              ? "Criar conta"
              : "Entrar"}
        </Button>
      </form>
    </Card>
  );
}
