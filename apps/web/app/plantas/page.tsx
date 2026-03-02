"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const gardenIdFromUrl = searchParams.get("gardenId") || "";

  const [gardens, setGardens] = useState<Garden[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [gardenId, setGardenId] = useState("");
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingPlantId, setEditingPlantId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingSpecies, setEditingSpecies] = useState("");
  const [editingNotes, setEditingNotes] = useState("");
  const [editingGardenId, setEditingGardenId] = useState("");
  const [updatingPlant, setUpdatingPlant] = useState(false);
  const [deletingPlantId, setDeletingPlantId] = useState<string | null>(null);

  async function loadData(selectedGardenId?: string) {
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

      const query = selectedGardenId
        ? `?gardenId=${encodeURIComponent(selectedGardenId)}`
        : "";

      const [gardensRes, plantsRes] = await Promise.all([
        fetch(`${apiBase}/gardens`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }),
        fetch(`${apiBase}/plants${query}`, {
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
      await loadData(gardenId);
    } catch (err: any) {
      setError(err.message || "Erro ao criar planta");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setGardenId(gardenIdFromUrl);
    loadData(gardenIdFromUrl);
  }, [gardenIdFromUrl]);

  async function applyFilter(nextGardenId: string) {
    setGardenId(nextGardenId);
    await loadData(nextGardenId);
  }

  function startEdit(plant: Plant) {
    setEditingPlantId(plant.id);
    setEditingName(plant.name || "");
    setEditingSpecies(plant.species || "");
    setEditingNotes(plant.notes || "");
    setEditingGardenId(plant.garden?.id || "");
  }

  function cancelEdit() {
    setEditingPlantId(null);
    setEditingName("");
    setEditingSpecies("");
    setEditingNotes("");
    setEditingGardenId("");
  }

  async function saveEdit(plantId: string) {
    setUpdatingPlant(true);
    setError("");
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Faça login para editar plantas");

      const res = await fetch(`${apiBase}/plants/${plantId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editingName,
          species: editingSpecies,
          notes: editingNotes,
          gardenId: editingGardenId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Falha ao editar planta");

      cancelEdit();
      await loadData(gardenId);
    } catch (err: any) {
      setError(err.message || "Erro ao editar planta");
    } finally {
      setUpdatingPlant(false);
    }
  }

  async function removePlant(plantId: string) {
    const confirmed = window.confirm(
      "Apagar esta planta? O histórico diário dessa planta também será removido.",
    );
    if (!confirmed) return;

    setDeletingPlantId(plantId);
    setError("");
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Faça login para apagar plantas");

      const res = await fetch(`${apiBase}/plants/${plantId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Falha ao apagar planta");
      }

      if (editingPlantId === plantId) {
        cancelEdit();
      }

      await loadData(gardenId);
    } catch (err: any) {
      setError(err.message || "Erro ao apagar planta");
    } finally {
      setDeletingPlantId(null);
    }
  }

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

        <div className="mb-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyFilter("")}
            className="hand-drawn-pill px-3 py-1 text-xs font-semibold"
          >
            Todas
          </button>
          {gardens.map((garden) => (
            <button
              key={garden.id}
              type="button"
              onClick={() => applyFilter(garden.id)}
              className="hand-drawn-pill px-3 py-1 text-xs font-semibold"
            >
              {garden.name}
            </button>
          ))}
        </div>

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
              className="hand-drawn-button-stable bg-accent text-accent-foreground"
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
            {editingPlantId === plant.id ? (
              <div className="space-y-2">
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  placeholder="Nome"
                />
                <Input
                  value={editingSpecies}
                  onChange={(e) => setEditingSpecies(e.target.value)}
                  placeholder="Espécie"
                />
                <select
                  value={editingGardenId}
                  onChange={(e) => setEditingGardenId(e.target.value)}
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
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Observações"
                />

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={() => saveEdit(plant.id)}
                    disabled={updatingPlant}
                    className="hand-drawn-button-stable bg-accent text-accent-foreground"
                  >
                    {updatingPlant ? "Salvando..." : "Salvar"}
                  </Button>
                  <Button type="button" variant="outline" onClick={cancelEdit}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-base font-bold">{plant.name}</p>
                <p className="text-sm text-muted-foreground">
                  {plant.species || "Espécie não informada"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {plant.garden?.name || "Sem jardim"}
                </p>
                <p className="mt-1 text-xs">
                  {plant.notes || "Sem observações"}
                </p>
              </>
            )}

            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => startEdit(plant)}
                className="hand-drawn-pill action-pill-edit px-3 py-1 font-semibold"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => removePlant(plant.id)}
                disabled={deletingPlantId === plant.id}
                className="hand-drawn-pill action-pill-delete px-3 py-1 font-semibold text-destructive"
              >
                {deletingPlantId === plant.id ? "Apagando..." : "Apagar"}
              </button>
              <Link
                href={`/diario?plantId=${plant.id}`}
                className="hand-drawn-pill px-3 py-1 font-semibold"
              >
                Registrar no diário
              </Link>
              <Link
                href="/rega"
                className="hand-drawn-pill px-3 py-1 font-semibold"
              >
                Registrar rega
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
