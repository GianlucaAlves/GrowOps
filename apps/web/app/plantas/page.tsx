"use client";

import { useEffect, useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

type Garden = { id: string; name: string };
type Plant = {
  id: string;
  name: string;
  species?: string | null;
  notes?: string | null;
  garden?: { id: string; name: string } | null;
};

export default function PlantasPage() {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [gardenId, setGardenId] = useState("");
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadData() {
    setError("");
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("Faça login para gerenciar plantas");
        setPlants([]);
        setGardens([]);
        return;
      }

      const [gardensRes, plantsRes] = await Promise.all([
        fetch(`${apiBase}/gardens`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }),
        fetch(`${apiBase}/plants`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }),
      ]);

      const gardensData = await gardensRes.json();
      const plantsData = await plantsRes.json();

      if (!gardensRes.ok)
        throw new Error(gardensData.message || "Falha ao carregar jardins");
      if (!plantsRes.ok)
        throw new Error(plantsData.message || "Falha ao carregar plantas");

      setGardens(gardensData.gardens || []);
      setPlants(plantsData.plants || []);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar plantas");
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

      if (!token) throw new Error("Faça login para cadastrar plantas");

      const res = await fetch(`${apiBase}/plants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          species,
          notes,
          gardenId: gardenId || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Falha ao criar planta");

      setName("");
      setSpecies("");
      setNotes("");
      await loadData();
    } catch (err: any) {
      setError(err.message || "Erro ao criar planta");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className="space-y-5 py-6">
      <Card className="hand-drawn-card p-5">
        <h1 className="text-2xl font-black">Plantas</h1>
        <p className="text-sm text-muted-foreground">
          Cadastre as plantas e vincule cada uma ao seu jardim.
        </p>
      </Card>

      <Card className="hand-drawn-card p-5">
        <h2 className="mb-3 text-lg font-black">Nova planta</h2>
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
          <Input
            placeholder="Nome da planta"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Espécie / strain"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
          />
          <select
            value={gardenId}
            onChange={(e) => setGardenId(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Sem jardim definido</option>
            {gardens.map((garden) => (
              <option key={garden.id} value={garden.id}>
                {garden.name}
              </option>
            ))}
          </select>
          <Input
            placeholder="Observações"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="md:col-span-2">
            <Button
              type="submit"
              disabled={loading}
              className="hand-drawn-button bg-accent text-accent-foreground"
            >
              {loading ? "Salvando..." : "Cadastrar planta"}
            </Button>
          </div>
        </form>
        {error ? (
          <p className="mt-3 text-sm text-destructive">{error}</p>
        ) : null}
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {plants.map((plant) => (
          <Card key={plant.id} className="hand-drawn-card p-4">
            <p className="text-base font-bold">{plant.name}</p>
            <p className="text-sm text-muted-foreground">
              {plant.species || "Espécie não informada"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {plant.garden?.name || "Sem jardim"}
            </p>
            <p className="mt-1 text-xs">{plant.notes || "Sem observações"}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}
