"use client";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button variant="outline" className="flex items-center gap-2">
        <Plus size={16} /> Adicionar rega
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <Plus size={16} /> Adicionar adubação
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <Plus size={16} /> Adicionar anotação
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <Plus size={16} /> Adicionar foto
      </Button>
    </div>
  );
}
