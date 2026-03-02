"use client";

import { useEffect, useState } from "react";
import { Card } from "@/app/components/ui/card";

type EventItem = {
  id: string;
  type: string;
  description?: string | null;
  note?: string | null;
  createdAt: string;
  plant: {
    id: string;
    name: string;
    garden?: {
      id: string;
      name: string;
    } | null;
  };
};

const typeLabel: Record<string, string> = {
  watering: "💧 Rega",
  feeding: "🍃 Adubação",
  pruning: "✂️ Poda",
  training: "🪢 Treino",
  ipm: "🛡️ Manejo",
  transplant: "🪴 Transplante",
  observation: "👀 Observação",
  phase_change: "🔁 Mudança de fase",
  note: "📝 Nota",
  photo: "📷 Foto",
};

export default function DailyJournal() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError("");
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
        const token = localStorage.getItem("accessToken");

        if (!token) {
          setEvents([]);
          return;
        }

        const res = await fetch(`${apiBase}/events/today`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Não foi possível carregar o diário");
        }

        const data = await res.json();
        setEvents(data.events || []);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar diário");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Carregando diário...</p>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (!events.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Ainda não há registros no diário de hoje.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {events.map((event) => (
        <Card key={event.id} className="hand-drawn-card p-3">
          <div className="flex items-center gap-2">
            <span className="hand-drawn-pill px-2 py-1 text-[11px] font-bold">
              {typeLabel[event.type] || event.type}
            </span>
            <p className="text-sm font-semibold">{event.plant.name}</p>
            {event.plant.garden?.name ? (
              <span className="text-xs text-muted-foreground">
                em {event.plant.garden.name}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {event.note || event.description || "Registro sem descrição"}
          </p>
        </Card>
      ))}
    </div>
  );
}
