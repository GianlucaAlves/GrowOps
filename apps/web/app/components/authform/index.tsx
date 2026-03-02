"use client";

import { useState } from "react";
import {useRouter} from "next/navigation";

type Props = { mode: "register" | "login" };

export default function AuthForm({ mode }: Props) {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(`${apiBase}/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const contentType = res.headers.get("content-type") || "";
      const payload = contentType.includes("application/json")
        ? await res.json()
        : { message: await res.text() };

      if (!res.ok) {
        throw new Error(payload.message || "Error");
      }
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className=" max-w-sm mx-auto p-4 bg-white rounded shadow"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold mb-4">
        {mode === "register" ? "Register" : "Login"}
      </h2>
      {mode === "register" && (
        <label className="block mb-2">
          Name
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full p-2 border rounded"
            aria-label="Name"
          />
        </label>
      )}
      <label className="block mb-2">
        Email
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full p-2 border rounded"
          aria-label="Email"
        />
      </label>
      <label className="block mb-4">
        Password
        <input
          type="password"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          className="w-full p-2 border rounded"
          aria-label="Password"
        />
      </label>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && (
        <div className="text-green-600 mb-2">
            {mode === "register"
            ? "Registration sucessul! Redirecting..."
        : "Login sucessful! Redirecting"}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
        aria-busy={loading}
      >
        {loading ? "Loading..." : mode === "register" ? "Register" : "Login"}
      </button>
    </form>
  );
}
