"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

type Plant = {
  id: string;
  name: string;
  garden?: { id: string; name: string } | null;
};

type Garden = {
  id: string;
  name: string;
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
  { value: "pruning", label: "Poda" },
  { value: "transplant", label: "Transplante" },
  { value: "phase_change", label: "Mudança de fase" },
  { value: "note", label: "Nota" },
  { value: "photo", label: "Foto" },
];

const typeLabel: Record<string, string> = {
  observation: "Observação",
  watering: "Rega",
  feeding: "Adubação",
  pruning: "Poda",
  transplant: "Transplante",
  phase_change: "Mudança de fase",
  note: "Nota",
  photo: "Foto",
};

function toDateInputValue(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

export default function DiarioPage() {
  const searchParams = useSearchParams();
  const gardenIdFromUrl = searchParams.get("gardenId") || "";
  const plantIdFromUrl = searchParams.get("plantId") || "";
  const todayDate = useMemo(() => new Date(), []);
  const initialStartDate = useMemo(() => {
    const date = new Date(todayDate);
    date.setDate(date.getDate() - 6);
    return toDateInputValue(date);
  }, [todayDate]);
  const initialEndDate = useMemo(
    () => toDateInputValue(todayDate),
    [todayDate],
  );

  const [gardens, setGardens] = useState<Garden[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [gardenId, setGardenId] = useState("");
  const [plantId, setPlantId] = useState("");
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [type, setType] = useState("observation");
  const [note, setNote] = useState("");
  const [description, setDescription] = useState("");
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingType, setEditingType] = useState("observation");
  const [editingPlantId, setEditingPlantId] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingNote, setEditingNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingEvent, setUpdatingEvent] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  async function loadData(
    gardenFilter?: string,
    plantFilter?: string,
    startFilter?: string,
    endFilter?: string,
  ) {
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

      const plantsQuery = gardenFilter
        ? `?gardenId=${encodeURIComponent(gardenFilter)}`
        : "";

      const eventsParams = new URLSearchParams();
      if (plantFilter) {
        eventsParams.set("plantId", plantFilter);
      } else if (gardenFilter) {
        eventsParams.set("gardenId", gardenFilter);
      }
      if (startFilter) {
        eventsParams.set("startDate", `${startFilter}T00:00:00.000Z`);
      }
      if (endFilter) {
        eventsParams.set("endDate", `${endFilter}T23:59:59.999Z`);
      }

      const eventsQuery = eventsParams.toString()
        ? `?${eventsParams.toString()}`
        : "";

      const [gardensRes, plantsRes, eventsRes] = await Promise.all([
        fetch(`${apiBase}/gardens`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }),
        fetch(`${apiBase}/plants${plantsQuery}`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }),
        fetch(`${apiBase}/events${eventsQuery}`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }),
      ]);

      const gardensData = await gardensRes.json();
      const plantsData = await plantsRes.json();
      const eventsData = await eventsRes.json();

      if (!gardensRes.ok)
        throw new Error(gardensData.message || "Falha ao carregar jardins");
      if (!plantsRes.ok)
        throw new Error(plantsData.message || "Falha ao carregar plantas");
      if (!eventsRes.ok)
        throw new Error(eventsData.message || "Falha ao carregar diário");

      setGardens(gardensData.gardens || []);
      setPlants(plantsData.plants || []);
      setEvents(eventsData.events || []);
      const selectedPlantExists = (plantsData.plants || []).some(
        (plant: Plant) => plant.id === plantFilter,
      );

      if (gardenFilter) {
        setGardenId(gardenFilter);
      }

      if (plantFilter && selectedPlantExists) {
        setPlantId(plantFilter);
      } else if (!plantFilter) {
        setPlantId("");
      }

      if (startFilter) {
        setStartDate(startFilter);
      }
      if (endFilter) {
        setEndDate(endFilter);
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
      await loadData(gardenId, plantId, startDate, endDate);
    } catch (err: any) {
      setError(err.message || "Erro ao registrar evento");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(event: EventItem) {
    setEditingEventId(event.id);
    setEditingType(event.type);
    setEditingPlantId(event.plant.id);
    setEditingDescription(event.description || "");
    setEditingNote(event.note || "");
  }

  function cancelEdit() {
    setEditingEventId(null);
    setEditingType("observation");
    setEditingPlantId("");
    setEditingDescription("");
    setEditingNote("");
  }

  async function saveEdit() {
    if (!editingEventId) return;
    setUpdatingEvent(true);
    setError("");

    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Faça login para editar registros");

      const res = await fetch(`${apiBase}/events/${editingEventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plantId: editingPlantId,
          type: editingType,
          description: editingDescription,
          note: editingNote,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Falha ao editar registro");
      }

      cancelEdit();
      await loadData(gardenId, plantId, startDate, endDate);
    } catch (err: any) {
      setError(err.message || "Erro ao editar registro");
    } finally {
      setUpdatingEvent(false);
    }
  }

  async function removeEvent(eventId: string) {
    const confirmed = window.confirm("Quer mesmo apagar este registro?");
    if (!confirmed) return;

    setDeletingEventId(eventId);
    setError("");

    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Faça login para apagar registros");

      const res = await fetch(`${apiBase}/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Falha ao apagar registro");
      }

      if (editingEventId === eventId) {
        cancelEdit();
      }

      await loadData(gardenId, plantId, startDate, endDate);
    } catch (err: any) {
      setError(err.message || "Erro ao apagar registro");
    } finally {
      setDeletingEventId(null);
    }
  }

  useEffect(() => {
    setGardenId(gardenIdFromUrl);
    setPlantId(plantIdFromUrl);
    loadData(gardenIdFromUrl, plantIdFromUrl, initialStartDate, initialEndDate);
  }, [gardenIdFromUrl, plantIdFromUrl, initialEndDate, initialStartDate]);

  async function applyFilters(
    nextGardenId: string,
    nextPlantId: string,
    nextStartDate: string,
    nextEndDate: string,
  ) {
    setGardenId(nextGardenId);
    setPlantId(nextPlantId);
    await loadData(nextGardenId, nextPlantId, nextStartDate, nextEndDate);
  }

  async function applyQuickPeriod(days: number) {
    const end = toDateInputValue(new Date());
    const startDateObj = new Date();
    startDateObj.setDate(startDateObj.getDate() - (days - 1));
    const start = toDateInputValue(startDateObj);
    await applyFilters(gardenId, plantId, start, end);
  }

  const groupedEvents = useMemo(() => {
    const groups = new Map<string, EventItem[]>();

    for (const event of events) {
      const date = new Date(event.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const current = groups.get(date) || [];
      current.push(event);
      groups.set(date, current);
    }

    return Array.from(groups.entries());
  }, [events]);

  const quickStats = useMemo(() => {
    return {
      total: events.length,
      watering: events.filter((event) => event.type === "watering").length,
      feeding: events.filter((event) => event.type === "feeding").length,
      observation: events.filter((event) => event.type === "observation")
        .length,
    };
  }, [events]);

  return (
    <main className="space-y-5 py-6">
      <Card className="hand-drawn-card p-5">
        <h1 className="text-2xl font-black">Diário das plantas</h1>
        <p className="text-sm text-muted-foreground">
          Registre e acompanhe a rotina real de cada planta com histórico
          editável.
        </p>
      </Card>

      <Card className="hand-drawn-card p-5">
        <h2 className="mb-3 text-lg font-black">Filtros e período</h2>
        <div className="mb-3 flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => applyQuickPeriod(1)}
            className="hand-drawn-pill px-3 py-1 font-semibold"
          >
            Hoje
          </button>
          <button
            type="button"
            onClick={() => applyQuickPeriod(7)}
            className="hand-drawn-pill px-3 py-1 font-semibold"
          >
            Últimos 7 dias
          </button>
          <button
            type="button"
            onClick={() => applyQuickPeriod(30)}
            className="hand-drawn-pill px-3 py-1 font-semibold"
          >
            Últimos 30 dias
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <select
            value={gardenId}
            onChange={(e) =>
              applyFilters(e.target.value, "", startDate, endDate)
            }
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Todos os jardins</option>
            {gardens.map((garden) => (
              <option key={garden.id} value={garden.id}>
                {garden.name}
              </option>
            ))}
          </select>

          <select
            value={plantId}
            onChange={(e) =>
              applyFilters(gardenId, e.target.value, startDate, endDate)
            }
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Todas as plantas</option>
            {plants.map((plant) => (
              <option key={plant.id} value={plant.id}>
                {plant.name}{" "}
                {plant.garden?.name ? `(${plant.garden.name})` : ""}
              </option>
            ))}
          </select>

          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="mt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => applyFilters(gardenId, plantId, startDate, endDate)}
          >
            Aplicar filtro
          </Button>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hand-drawn-card p-3">
          <p className="text-xs text-muted-foreground">Registros no período</p>
          <p className="text-xl font-black">{quickStats.total}</p>
        </Card>
        <Card className="hand-drawn-card p-3">
          <p className="text-xs text-muted-foreground">Regas</p>
          <p className="text-xl font-black">{quickStats.watering}</p>
        </Card>
        <Card className="hand-drawn-card p-3">
          <p className="text-xs text-muted-foreground">Adubações</p>
          <p className="text-xl font-black">{quickStats.feeding}</p>
        </Card>
        <Card className="hand-drawn-card p-3">
          <p className="text-xs text-muted-foreground">Observações</p>
          <p className="text-xl font-black">{quickStats.observation}</p>
        </Card>
      </div>

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
              className="hand-drawn-button-stable bg-accent text-accent-foreground"
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
        <h2 className="mb-3 text-lg font-black">Histórico de registros</h2>
        <div className="space-y-2">
          {groupedEvents.map(([date, dateEvents]) => (
            <Card key={date} className="hand-drawn-card p-3">
              <p className="mb-2 text-sm font-black">{date}</p>

              <div className="space-y-2">
                {dateEvents.map((event) => {
                  const isEditing = editingEventId === event.id;

                  return (
                    <Card key={event.id} className="hand-drawn-card p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold">
                          {event.plant.name} •{" "}
                          {typeLabel[event.type] || event.type}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.createdAt).toLocaleTimeString(
                            "pt-BR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>

                      {isEditing ? (
                        <div className="mt-2 grid gap-2 md:grid-cols-2">
                          <select
                            value={editingPlantId}
                            onChange={(e) => setEditingPlantId(e.target.value)}
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                          >
                            {plants.map((plant) => (
                              <option key={plant.id} value={plant.id}>
                                {plant.name}
                              </option>
                            ))}
                          </select>
                          <select
                            value={editingType}
                            onChange={(e) => setEditingType(e.target.value)}
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
                            value={editingDescription}
                            onChange={(e) =>
                              setEditingDescription(e.target.value)
                            }
                            placeholder="Resumo"
                          />
                          <Input
                            className="md:col-span-2"
                            value={editingNote}
                            onChange={(e) => setEditingNote(e.target.value)}
                            placeholder="Detalhes"
                          />

                          <div className="md:col-span-2 flex flex-wrap gap-2">
                            <Button
                              type="button"
                              disabled={updatingEvent}
                              onClick={saveEdit}
                              className="hand-drawn-button-stable bg-accent text-accent-foreground"
                            >
                              {updatingEvent ? "Salvando..." : "Salvar edição"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={cancelEdit}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {event.note || event.description || "Sem detalhes"}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => startEdit(event)}
                              className="hand-drawn-pill action-pill-edit px-3 py-1 font-semibold"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => removeEvent(event.id)}
                              disabled={deletingEventId === event.id}
                              className="hand-drawn-pill action-pill-delete px-3 py-1 font-semibold text-destructive"
                            >
                              {deletingEventId === event.id
                                ? "Apagando..."
                                : "Apagar"}
                            </button>
                          </div>
                        </>
                      )}
                    </Card>
                  );
                })}
              </div>
            </Card>
          ))}

          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Ainda não existem registros para o filtro selecionado.
            </p>
          ) : null}
        </div>
      </Card>
    </main>
  );
}
