import AuthForm from "../../components/authform/index";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-4xl items-center py-8">
      <section className="w-full rounded-3xl border bg-muted/30 p-3 md:p-5">
        <AuthForm mode="login" />
      </section>
    </main>
  );
}
