"use client";

import { useEffect, useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

type Plant = {
  id: string;
  name: string;
  garden?: { id: string; name: string } | null;
};

type EventItem = {
  id: string;
  type: string;
  note?: string | null;
  description?: string | null;
  createdAt: string;
  plant: Plant;
};

const eventTypes = [
  { value: "observation", label: "Observação" },
  { value: "watering", label: "Rega" },
  { value: "feeding", label: "Adubação" },
  { value: "note", label: "Nota" },
  { value: "photo", label: "Foto" },
];

export default function DiarioPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [plantId, setPlantId] = useState("");
  const [type, setType] = useState("observation");
  const [note, setNote] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadData() {
    setError("");
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Faça login para usar o diário");
        setEvents([]);
        setPlants([]);
        return;
      }

      const [plantsRes, eventsRes] = await Promise.all([
        fetch(`${apiBase}/plants`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }),
        fetch(`${apiBase}/events/today`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }),
      ]);

      const plantsData = await plantsRes.json();
      const eventsData = await eventsRes.json();

      if (!plantsRes.ok)
        throw new Error(plantsData.message || "Falha ao carregar plantas");
      if (!eventsRes.ok)
        throw new Error(eventsData.message || "Falha ao carregar diário");

      setPlants(plantsData.plants || []);
      setEvents(eventsData.events || []);
      if (!plantId && plantsData.plants?.length) {
        setPlantId(plantsData.plants[0].id);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar diário");
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
      if (!token) throw new Error("Faça login para registrar no diário");

      const res = await fetch(`${apiBase}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plantId,
          type,
          note,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Falha ao registrar evento");

      setNote("");
      setDescription("");
      await loadData();
    } catch (err: any) {
      setError(err.message || "Erro ao registrar evento");
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
        <h1 className="text-2xl font-black">Diário do dia</h1>
        <p className="text-sm text-muted-foreground">
          Registre diariamente o que está acontecendo com suas plantas.
        </p>
      </Card>

      <Card className="hand-drawn-card p-5">
        <h2 className="mb-3 text-lg font-black">Novo registro</h2>
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
          <select
            value={plantId}
            onChange={(e) => setPlantId(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            {plants.length === 0 ? (
              <option value="">Sem plantas cadastradas</option>
            ) : null}
            {plants.map((plant) => (
              <option key={plant.id} value={plant.id}>
                {plant.name}{" "}
                {plant.garden?.name ? `(${plant.garden.name})` : ""}
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            {eventTypes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <Input
            className="md:col-span-2"
            placeholder="Resumo curto"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            className="md:col-span-2"
            placeholder="Observação detalhada"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="md:col-span-2">
            <Button
              type="submit"
              disabled={loading || !plantId}
              className="hand-drawn-button bg-accent text-accent-foreground"
            >
              {loading ? "Salvando..." : "Registrar no diário"}
            </Button>
          </div>
        </form>
        {error ? (
          <p className="mt-3 text-sm text-destructive">{error}</p>
        ) : null}
      </Card>

      <Card className="hand-drawn-card p-5">
        <h2 className="mb-3 text-lg font-black">Registros de hoje</h2>
        <div className="space-y-2">
          {events.map((event) => (
            <Card key={event.id} className="hand-drawn-card p-3">
              <p className="text-sm font-semibold">
                {event.plant.name} • {event.type}
              </p>
              <p className="text-sm text-muted-foreground">
                {event.note || event.description || "Sem detalhes"}
              </p>
            </Card>
          ))}
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Ainda não existem registros no diário para hoje.
            </p>
          ) : null}
        </div>
      </Card>
    </main>
  );
}
