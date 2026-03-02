import Link from "next/link";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import QuickActions from "./components/QuickActions";
import TaskList from "./components/TaskList";
import DailyJournal from "./components/DailyJournal";
import GardenPlantOverview from "./components/GardenPlantOverview";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 py-6 md:space-y-8 md:py-8">
      <section className="hand-drawn-card organic-shadow p-5 md:p-7">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="mb-2 inline-flex items-center gap-2 hand-drawn-pill px-3 py-1 text-xs font-semibold text-muted-foreground">
              🌱 Diário Plandica
            </p>
            <h1 className="text-3xl font-black leading-tight text-foreground md:text-5xl">
              Seu jardim vai amar a Plandica!
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
              Registre cada cuidado com suas plantas, acompanhe tarefas do dia e
              mantenha seu cultivo organizado com um fluxo simples e acolhedor.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="hand-drawn-button bg-accent px-5 py-2.5 font-bold text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/rega">Quero Começar!</Link>
              </Button>
              <Link
                href="/anotacao"
                className="hand-drawn-pill px-4 py-2 text-sm font-semibold hover:text-accent"
              >
                Nova anotação
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative hand-drawn-card organic-shadow bg-secondary p-4">
              <div className="mb-4 rounded-[30px_22px_26px_20px] border-2 border-border/90 bg-card px-4 py-5 text-center">
                <p className="text-4xl leading-none">🧑‍🌾🌿</p>
                <p className="mt-2 text-sm font-bold">
                  Bora cuidar dessas plantinhas
                </p>
                <p className="text-xs text-muted-foreground">
                  Organize a rotina do seu jardim
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/rega"
                  className="hand-drawn-pill hover-lift p-3 text-center text-sm font-semibold"
                >
                  💧 Rega
                </Link>
                <Link
                  href="/adubacao"
                  className="hand-drawn-pill hover-lift p-3 text-center text-sm font-semibold"
                >
                  🍃 Adubação
                </Link>
                <Link
                  href="/anotacao"
                  className="hand-drawn-pill hover-lift p-3 text-center text-sm font-semibold"
                >
                  ✏️ Anotação
                </Link>
                <Link
                  href="/foto"
                  className="hand-drawn-pill hover-lift p-3 text-center text-sm font-semibold"
                >
                  📷 Foto
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-7">
          <Card className="hand-drawn-card organic-shadow p-5 md:p-6">
            <h3 className="mb-1 text-base font-black uppercase tracking-wide md:text-lg">
              Tarefas do Jardim
            </h3>
            <p className="mb-3 text-sm text-muted-foreground">
              Organize as tarefas do seu dia para cuidar do seu jardim de forma simples e eficiente.
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              <Link
                href="/rega"
                className="hand-drawn-pill hover-lift px-3 py-1.5 text-xs font-bold"
              >
                💧 Rega
              </Link>
              <Link
                href="/adubacao"
                className="hand-drawn-pill hover-lift px-3 py-1.5 text-xs font-bold"
              >
                🍃 Adubação
              </Link>
            </div>
            <TaskList />
          </Card>

          <Card className="hand-drawn-card organic-shadow p-5 md:p-6">
            <h3 className="mb-2 text-base font-black uppercase tracking-wide md:text-lg">
              Jardins e Plantas
            </h3>
            <p className="mb-3 text-sm text-muted-foreground">
              Veja seus jardins e as plantas de cada um para agir mais rápido.
            </p>
            <GardenPlantOverview />
          </Card>

          <Card className="hand-drawn-card organic-shadow p-5 md:p-6">
            <h3 className="mb-2 text-base font-black uppercase tracking-wide md:text-lg">
              Plano do Dia
            </h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Verificar umidade do substrato antes da rega.</li>
              <li>Registrar observações de crescimento e coloração.</li>
              <li>Checar folhas para sinais de estresse.</li>
            </ul>
          </Card>
        </div>

        <aside className="space-y-5 lg:col-span-5">
          <Card className="hand-drawn-card organic-shadow p-5 md:p-6">
            <h3 className="mb-1 text-base font-black uppercase tracking-wide md:text-lg">
              Ações Rápidas
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Todos os cards abaixo levam para páginas já existentes.
            </p>
            <QuickActions compact />
          </Card>

          <Card className="hand-drawn-card border-accent/40 bg-accent/10 p-4">
            <h3 className="text-lg font-black">🌼 Dica de cultivo</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Registros frequentes ajudam você a enxergar padrões e tomar
              decisões melhores no cuidado diário.
            </p>
          </Card>

          <Card className="hand-drawn-card organic-shadow p-4">
            <h3 className="text-base font-black uppercase tracking-wide">
              Diário de Hoje
            </h3>
            <p className="mt-1 mb-3 text-sm text-muted-foreground">
              O que você já observou nas plantas hoje.
            </p>
            <DailyJournal />
            <Link
              href="/diario"
              className="mt-3 inline-flex hand-drawn-pill px-3 py-1.5 text-sm font-semibold hover:text-accent"
            >
              Abrir diário completo
            </Link>
          </Card>

          <Card className="hand-drawn-card organic-shadow p-4">
            <h3 className="text-base font-black uppercase tracking-wide">
              Fotos do Jardim
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Registre seu progresso com fotos para acompanhar a evolução.
            </p>
            <div className="mt-3 rounded-[24px_20px_26px_18px] border-2 border-border/85 bg-secondary p-4 text-center">
              <p className="text-3xl">🪻📸🌼</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Quadro de registros visuais
              </p>
            </div>
            <Link
              href="/foto"
              className="mt-3 inline-flex hand-drawn-pill px-3 py-1.5 text-sm font-semibold hover:text-accent"
            >
              Abrir página de fotos
            </Link>
          </Card>
        </aside>
      </section>

      <footer className="hand-drawn-card organic-shadow flex flex-col gap-3 p-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <Link href="/" className="hand-drawn-pill px-3 py-1">
            Início
          </Link>
          <Link href="/jardins" className="hand-drawn-pill px-3 py-1">
            Jardins
          </Link>
          <Link href="/plantas" className="hand-drawn-pill px-3 py-1">
            Plantas
          </Link>
          <Link href="/diario" className="hand-drawn-pill px-3 py-1">
            Diário
          </Link>
        </div>
        <p className="text-xs md:text-sm">
          Feito com carinho para todos os jardineiros! 🌱 #PLANDICA
        </p>
      </footer>
    </main>
  );
}
