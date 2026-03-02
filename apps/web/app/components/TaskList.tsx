"use client";
import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";

type Task = {
  id: string;
  title: string;
  type: string;
  dueAt: string;
  completed: boolean;
};

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      setError("");
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
        const res = await fetch(`${apiBase}/tasks/today`, {
          credentials: "include",
        });
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
      <div>
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-10 w-full mb-2" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        <div>Nenhuma tarefa para hoje — aproveite seu jardim!</div>
        <button
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => {}}
        >
          + Criar sua primeira tarefa
        </button>
        <div className="mt-6 text-sm text-green-800 bg-green-50 p-2 rounded">
          🌱 Dica: Regue e adube suas plantas regularmente para mantê-las
          saudáveis!
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <Card key={task.id} className="flex items-center gap-3 p-3">
          <input
            type="checkbox"
            checked={task.completed}
            readOnly
            aria-label={`Marcar ${task.title} como concluída`}
            className="accent-green-600"
          />
          <span>{task.title}</span>
          <span className="ml-auto text-xs text-gray-400">{task.type}</span>
        </Card>
      ))}
    </div>
  );
}
