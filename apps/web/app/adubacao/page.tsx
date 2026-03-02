"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";

export default function AdubacaoPage() {
  const [planta, setPlanta] = useState("");
  const [produto, setProduto] = useState("");
  const [quando, setQuando] = useState(() => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Faça login para registrar ações");
      }
      const title = `Adubação: ${planta || "Planta"}${produto ? ` (${produto})` : ""}`;

      const res = await fetch(`${apiBase}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title,
          type: "feeding",
          dueAt: new Date(quando).toISOString(),
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : { message: await res.text() };
      if (!res.ok) throw new Error(data.message || "Falha ao salvar adubação");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl space-y-4 py-6">
      <section className="rounded-3xl border bg-card p-5 md:p-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Ação de cultivo
        </p>
        <h2 className="text-2xl font-bold tracking-tight">
          Registrar adubação 🧪
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Mantenha histórico de nutrientes para comparar resposta das plantas.
        </p>
      </section>

      <Card className="rounded-3xl p-5 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Orgânico", produto: "Adubo orgânico" },
              { label: "NPK leve", produto: "NPK 10-10-10 (dose leve)" },
              { label: "Biofertilizante", produto: "Biofertilizante" },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setProduto(preset.produto)}
                className="rounded-full border bg-muted px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {preset.label}
              </button>
            ))}
          </div>
          <label className="block text-sm font-medium">Planta</label>
          <Input
            placeholder="Ex.: Manjericão"
            value={planta}
            onChange={(e) => setPlanta(e.target.value)}
          />
          <label className="block text-sm font-medium">Produto</label>
          <Input
            placeholder="Ex.: Adubo orgânico"
            value={produto}
            onChange={(e) => setProduto(e.target.value)}
          />
          <label className="block text-sm font-medium">Quando</label>
          <Input
            type="datetime-local"
            value={quando}
            onChange={(e) => setQuando(e.target.value)}
          />
          {error && (
            <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={loading} className="rounded-xl">
              {loading ? "Salvando..." : "Salvar adubação"}
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/">Voltar</Link>
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
