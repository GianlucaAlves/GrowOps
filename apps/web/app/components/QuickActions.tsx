"use client";
import Link from "next/link";
import { Card } from "@/app/components/ui/card";

type QuickActionsProps = {
  compact?: boolean;
};

export default function QuickActions({ compact = false }: QuickActionsProps) {
  return (
    <div
      className={`grid gap-3 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}
    >
      <Link href="/rega" className="group">
        <Card className="hand-drawn-card hover-lift border-primary/30 bg-primary/10 p-4">
          <div className="flex items-start gap-3">
            <span className="rounded-[16px_20px_16px_14px] border-2 bg-card px-2.5 py-2 text-base">
              💧
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold">Registrar rega</p>
              <p className="text-xs text-muted-foreground">
                Acompanhe volume e horário da água
              </p>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              abrir
            </span>
          </div>
        </Card>
      </Link>

      <Link href="/adubacao" className="group">
        <Card className="hand-drawn-card hover-lift border-accent/50 bg-accent/15 p-4">
          <div className="flex items-start gap-3">
            <span className="rounded-[16px_20px_16px_14px] border-2 bg-card px-2.5 py-2 text-base">
              🍃
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold">Registrar adubação</p>
              <p className="text-xs text-muted-foreground">
                Guarde dose e produto utilizado
              </p>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              abrir
            </span>
          </div>
        </Card>
      </Link>

      <Link href="/anotacao" className="group">
        <Card className="hand-drawn-card hover-lift border-primary/25 bg-primary/10 p-4">
          <div className="flex items-start gap-3">
            <span className="rounded-[16px_20px_16px_14px] border-2 bg-card px-2.5 py-2 text-base">
              ✏️
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold">Nova anotação</p>
              <p className="text-xs text-muted-foreground">
                Registre sinais e decisões do dia
              </p>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              abrir
            </span>
          </div>
        </Card>
      </Link>

      <Link href="/foto" className="group">
        <Card className="hand-drawn-card hover-lift border-accent/35 bg-accent/15 p-4">
          <div className="flex items-start gap-3">
            <span className="rounded-[16px_20px_16px_14px] border-2 bg-card px-2.5 py-2 text-base">
              📷
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold">Adicionar foto</p>
              <p className="text-xs text-muted-foreground">
                Monte histórico visual da evolução
              </p>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              abrir
            </span>
          </div>
        </Card>
      </Link>
    </div>
  );
}
