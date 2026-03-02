"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

type Plant = {
  id: string;
  name: string;
  garden?: { id: string; name: string } | null;
};

export default function JardinsPage() {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingGardenId, setEditingGardenId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingType, setEditingType] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [updatingGarden, setUpdatingGarden] = useState(false);
  const [deletingGardenId, setDeletingGardenId] = useState<string | null>(null);
  const [plants, setPlants] = useState<Plant[]>([]);

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

      if (!gardensRes.ok) {
        throw new Error(gardensData.message || "Falha ao carregar jardins");
      }

      if (!plantsRes.ok) {
        throw new Error(plantsData.message || "Falha ao carregar plantas");
      }

      setGardens(gardensData.gardens || []);
      setPlants(plantsData.plants || []);
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

  function startEdit(garden: Garden) {
    setEditingGardenId(garden.id);
    setEditingName(garden.name || "");
    setEditingType(garden.type || "");
    setEditingDescription(garden.description || "");
  }

  function cancelEdit() {
    setEditingGardenId(null);
    setEditingName("");
    setEditingType("");
    setEditingDescription("");
  }

  async function saveEdit(gardenId: string) {
    setUpdatingGarden(true);
    setError("");
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
      const token = localStorage.getItem("accessToken");

      if (!token) throw new Error("Faça login para editar jardins");

      const res = await fetch(`${apiBase}/gardens/${gardenId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editingName,
          type: editingType,
          description: editingDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Falha ao editar jardim");

      cancelEdit();
      await loadGardens();
    } catch (err: any) {
      setError(err.message || "Erro ao editar jardim");
    } finally {
      setUpdatingGarden(false);
    }
  }

  async function removeGarden(gardenId: string) {
    const confirmed = window.confirm(
      "Apagar este jardim? As plantas ligadas ficarão sem jardim.",
    );
    if (!confirmed) return;

    setDeletingGardenId(gardenId);
    setError("");
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Faça login para apagar jardins");

      const res = await fetch(`${apiBase}/gardens/${gardenId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Falha ao apagar jardim");
      }

      if (editingGardenId === gardenId) {
        cancelEdit();
      }
      await loadGardens();
    } catch (err: any) {
      setError(err.message || "Erro ao apagar jardim");
    } finally {
      setDeletingGardenId(null);
    }
  }

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
              className="hand-drawn-button-stable bg-accent text-accent-foreground"
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
            {editingGardenId === garden.id ? (
              <div className="space-y-2">
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  placeholder="Nome"
                />
                <Input
                  value={editingType}
                  onChange={(e) => setEditingType(e.target.value)}
                  placeholder="Tipo"
                />
                <Input
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  placeholder="Descrição"
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={() => saveEdit(garden.id)}
                    disabled={updatingGarden}
                    className="hand-drawn-button-stable bg-accent text-accent-foreground"
                  >
                    {updatingGarden ? "Salvando..." : "Salvar"}
                  </Button>
                  <Button type="button" variant="outline" onClick={cancelEdit}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}

            <div className="mt-2 flex flex-wrap gap-2">
              {plants
                .filter((plant) => plant.garden?.id === garden.id)
                .slice(0, 4)
                .map((plant) => (
                  <span
                    key={plant.id}
                    className="hand-drawn-pill px-2 py-1 text-[11px] font-semibold"
                  >
                    {plant.name}
                  </span>
                ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => startEdit(garden)}
                className="hand-drawn-pill action-pill-edit px-3 py-1 font-semibold"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => removeGarden(garden.id)}
                disabled={deletingGardenId === garden.id}
                className="hand-drawn-pill action-pill-delete px-3 py-1 font-semibold text-destructive"
              >
                {deletingGardenId === garden.id ? "Apagando..." : "Apagar"}
              </button>
              <Link
                href={`/plantas?gardenId=${garden.id}`}
                className="hand-drawn-pill px-3 py-1 font-semibold"
              >
                Gerenciar plantas
              </Link>
              <Link
                href={`/diario?gardenId=${garden.id}`}
                className="hand-drawn-pill px-3 py-1 font-semibold"
              >
                Registrar no diário
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
