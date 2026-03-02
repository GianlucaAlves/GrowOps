"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Button } from "@/app/components/ui/button";

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
        </Card>
      ))}
    </div>
  );
}
