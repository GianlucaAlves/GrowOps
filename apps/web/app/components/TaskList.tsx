"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

type Task = {
  id: string;
  title: string;
  type: string;
  dueAt: string;
  completed: boolean;
};

const typeLabel: Record<string, string> = {
  watering: "💧 Rega",
  feeding: "🍃 Adubação",
  note: "✏️ Anotação",
  photo: "📷 Foto",
};

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingType, setEditingType] = useState("watering");
  const [editingDueAt, setEditingDueAt] = useState("");
  const [updatingTask, setUpdatingTask] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const taskTypes = [
    { value: "watering", label: "Rega" },
    { value: "feeding", label: "Adubação" },
    { value: "note", label: "Anotação" },
    { value: "photo", label: "Foto" },
  ];

  function toDatetimeLocalValue(dateString: string) {
    const date = new Date(dateString);
    const offsetMs = date.getTimezoneOffset() * 60_000;
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
  }

  function startEdit(task: Task) {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
    setEditingType(task.type);
    setEditingDueAt(toDatetimeLocalValue(task.dueAt));
  }

  function cancelEdit() {
    setEditingTaskId(null);
    setEditingTitle("");
    setEditingType("watering");
    setEditingDueAt("");
  }

  async function saveTaskEdit(taskId: string) {
    setUpdatingTask(true);
    setError("");
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${apiBase}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: editingTitle,
          type: editingType,
          dueAt: editingDueAt
            ? new Date(editingDueAt).toISOString()
            : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Não foi possível editar a tarefa");
      }

      setTasks((curr) =>
        curr
          ? curr.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    title: data.task.title,
                    type: data.task.type,
                    dueAt: data.task.dueAt,
                  }
                : task,
            )
          : curr,
      );

      cancelEdit();
    } catch (err: any) {
      setError(err.message || "Erro ao editar tarefa");
    } finally {
      setUpdatingTask(false);
    }
  }

  async function removeTask(taskId: string) {
    const confirmed = window.confirm("Deseja apagar esta tarefa?");
    if (!confirmed) return;

    const previous = tasks;
    setDeletingTaskId(taskId);
    setError("");
    setTasks((curr) =>
      curr ? curr.filter((task) => task.id !== taskId) : curr,
    );

    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${apiBase}/tasks/${taskId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Não foi possível apagar a tarefa");
      }

      if (editingTaskId === taskId) {
        cancelEdit();
      }
    } catch (err: any) {
      setTasks(previous);
      setError(err.message || "Erro ao apagar tarefa");
    } finally {
      setDeletingTaskId(null);
    }
  }

  async function handleToggle(taskId: string, completed: boolean) {
    const previous = tasks;
    setPendingTaskId(taskId);
    setTasks((curr) =>
      curr
        ? curr.map((task) =>
            task.id === taskId ? { ...task, completed } : task,
          )
        : curr,
    );

    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${apiBase}/tasks/${taskId}/complete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ completed }),
      });

      if (!res.ok) {
        throw new Error("Não foi possível atualizar a tarefa");
      }
    } catch (err: any) {
      setTasks(previous);
      setError(err.message || "Erro ao atualizar tarefa");
    } finally {
      setPendingTaskId(null);
    }
  }

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      setError("");
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${apiBase}/tasks/today`, {
          credentials: "include",
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        });
        if (res.status === 401) {
          throw new Error("Faça login novamente para ver suas tarefas");
        }
        if (!res.ok) throw new Error("Falha ao carregar tarefas");
        const data = await res.json();
        setTasks(data.tasks || []);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="hand-drawn-card border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="hand-drawn-card p-8 text-center">
        <div className="mb-1 text-base font-medium">
          Nenhuma tarefa para hoje 🌿
        </div>
        <div className="text-sm text-muted-foreground">
          Aproveite o ritmo do cultivo e registre sua próxima ação.
        </div>
        <Button
          asChild
          className="mt-4 hand-drawn-button bg-accent text-accent-foreground"
        >
          <Link href="/anotacao">+ Criar sua primeira tarefa</Link>
        </Button>
        <div className="mt-6 rounded-[16px_18px_14px_20px] border-2 border-border/70 bg-muted p-3 text-xs text-muted-foreground">
          Dica: manter pequenos registros diários facilita ajustes de rotina.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <Card key={task.id} className="hand-drawn-card hover-lift p-3">
          {editingTaskId === task.id ? (
            <div className="space-y-2">
              <Input
                value={editingTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditingTitle(e.target.value)
                }
                placeholder="Título da tarefa"
              />
              <div className="grid gap-2 sm:grid-cols-2">
                <select
                  value={editingType}
                  onChange={(e) => setEditingType(e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {taskTypes.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <Input
                  type="datetime-local"
                  value={editingDueAt}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditingDueAt(e.target.value)
                  }
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={() => saveTaskEdit(task.id)}
                  disabled={updatingTask}
                  className="hand-drawn-button-stable bg-accent text-accent-foreground"
                >
                  {updatingTask ? "Salvando..." : "Salvar"}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) => handleToggle(task.id, e.target.checked)}
                  disabled={pendingTaskId === task.id}
                  aria-label={`Marcar ${task.title} como concluída`}
                  className="h-5 w-5 rounded-[6px] border-2 border-primary/45 accent-primary"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(task.dueAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </p>
                </div>
                <span className="ml-auto hand-drawn-pill px-2 py-1 text-[11px] font-medium text-muted-foreground">
                  {typeLabel[task.type] || task.type}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => startEdit(task)}
                  className="hand-drawn-pill action-pill-edit px-3 py-1 font-semibold"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => removeTask(task.id)}
                  disabled={deletingTaskId === task.id}
                  className="hand-drawn-pill action-pill-delete px-3 py-1 font-semibold text-destructive"
                >
                  {deletingTaskId === task.id ? "Apagando..." : "Apagar"}
                </button>
              </div>
            </>
          )}
        </Card>
      ))}
    </div>
  );
}
