import TaskList from "./components/TaskList";
import QuickActions from "./components/QuickActions";

export default function HomePage() {
  return (
    <main className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Hoje no seu jardim</h2>
      <QuickActions />
      <TaskList />
      <section className="mt-8">
        <h3 className="text-lg font-semibold mb-2">
          Dica de jardinagem do dia
        </h3>
        <div className="bg-green-50 text-green-900 p-3 rounded">
          Você sabia? A maioria das plantas prefere ser regada pela manhã para
          evitar mofo e queimaduras do sol!
        </div>
      </section>
    </main>
  );
}
