"use client";

import { useEffect, useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

type Garden = {
  id: string;
  name: string;
  type?: string | null;
  description?: string | null;
  _count?: { plants: number };
};

export default function JardinsPage() {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadGardens() {
    setError("");
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("Faça login para gerenciar jardins");
        setGardens([]);
        return;
      }

      const res = await fetch(`${apiBase}/gardens`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Falha ao carregar jardins");
      setGardens(data.gardens || []);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar jardins");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
      const token = localStorage.getItem("accessToken");

      if (!token) throw new Error("Faça login para criar jardim");

      const res = await fetch(`${apiBase}/gardens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, type, description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Falha ao criar jardim");

      setName("");
      setType("");
      setDescription("");
      await loadGardens();
    } catch (err: any) {
      setError(err.message || "Erro ao criar jardim");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGardens();
  }, []);

  return (
    <main className="space-y-5 py-6">
      <Card className="hand-drawn-card p-5">
        <h1 className="text-2xl font-black">Jardins</h1>
        <p className="text-sm text-muted-foreground">
          Cadastre seus jardins/ambientes e organize as plantas por espaço.
        </p>
      </Card>

      <Card className="hand-drawn-card p-5">
        <h2 className="mb-3 text-lg font-black">Novo jardim</h2>
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
          <Input
            placeholder="Nome do jardim"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Tipo (ex.: Varanda, Estufa)"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <Input
            className="md:col-span-2"
            placeholder="Descrição opcional"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="md:col-span-2">
            <Button
              type="submit"
              disabled={loading}
              className="hand-drawn-button bg-accent text-accent-foreground"
            >
              {loading ? "Salvando..." : "Criar jardim"}
            </Button>
          </div>
        </form>
        {error ? (
          <p className="mt-3 text-sm text-destructive">{error}</p>
        ) : null}
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {gardens.map((garden) => (
          <Card key={garden.id} className="hand-drawn-card p-4">
            <p className="text-base font-bold">{garden.name}</p>
            <p className="text-sm text-muted-foreground">
              {garden.type || "Tipo não definido"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {garden.description || "Sem descrição"}
            </p>
            <p className="mt-2 text-xs font-semibold">
              🌿 {garden._count?.plants || 0} plantas
            </p>
          </Card>
        ))}
      </div>
    </main>
  );
}
