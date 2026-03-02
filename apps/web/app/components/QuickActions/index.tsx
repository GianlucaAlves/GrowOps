"use client";
import { Button } from "@/app/components/ui/button";
import { Plus } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button variant="outline" className="flex items-center gap-2">
        <Plus size={16} /> Add Watering
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <Plus size={16} /> Add Feeding
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <Plus size={16} /> Add Note
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <Plus size={16} /> Add Photo
      </Button>
    </div>
  );
}
