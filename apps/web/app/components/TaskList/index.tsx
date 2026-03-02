"use client";
import { useEffect, useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";

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
        if (!res.ok) throw new Error("Failed to load tasks");
        const data = await res.json();
        setTasks(data.tasks || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
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
        No tasks due today—enjoy your garden!
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
            aria-label={`Mark ${task.title} as done`}
            className="accent-green-600"
          />
          <span>{task.title}</span>
          <span className="ml-auto text-xs text-gray-400">{task.type}</span>
        </Card>
      ))}
    </div>
  );
}
