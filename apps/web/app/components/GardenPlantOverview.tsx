"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/app/components/ui/card";

type Garden = {
  id: string;
  name: string;
  type?: string | null;
  _count?: { plants: number };
};

type Plant = {
  id: string;
  name: string;
  species?: string | null;
  garden?: { id: string; name: string } | null;
};

export default function GardenPlantOverview() {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
        const token = localStorage.getItem("accessToken");

        if (!token) {
          setGardens([]);
          setPlants([]);
          setLoading(false);
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
        setError(err.message || "Erro ao carregar jardins e plantas");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const plantsByGarden = useMemo(() => {
    const grouped = new Map<string, Plant[]>();

    for (const plant of plants) {
      const key = plant.garden?.id || "__sem_jardim__";
      const current = grouped.get(key) || [];
      current.push(plant);
      grouped.set(key, current);
    }

    return grouped;
  }, [plants]);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Carregando jardins...</p>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (!gardens.length) {
    return (
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>Você ainda não criou um jardim.</p>
        <Link
          href="/jardins"
          className="hand-drawn-pill inline-flex px-3 py-1.5 font-semibold"
        >
          Criar primeiro jardim
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {gardens.map((garden) => {
        const gardenPlants = plantsByGarden.get(garden.id) || [];

        return (
          <Card key={garden.id} className="hand-drawn-card p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-black">{garden.name}</p>
              <span className="text-xs text-muted-foreground">
                {gardenPlants.length || garden._count?.plants || 0} plantas
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {garden.type || "Tipo não definido"}
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {gardenPlants.length ? (
                gardenPlants.slice(0, 4).map((plant) => (
                  <Link
                    key={plant.id}
                    href={`/diario?plantId=${plant.id}`}
                    className="hand-drawn-pill px-2 py-1 text-[11px] font-semibold"
                  >
                    🌿 {plant.name}
                  </Link>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">
                  Nenhuma planta cadastrada neste jardim.
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
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
        );
      })}
    </div>
  );
}
