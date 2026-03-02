import TaskList from "./components/TaskList/index";
import QuickActions from "./components/QuickActions/index";

export default function HomePage() {
  return (
    <main className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Today in your garden</h2>
      <QuickActions />
      <TaskList />
    </main>
  );
}