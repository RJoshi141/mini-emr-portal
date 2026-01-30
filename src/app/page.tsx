"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/portal");
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Invalid email or password");
    }


  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 p-6 space-y-4">
        <h1 className="text-2xl font-bold">Patient Portal</h1>
        <p className="text-white/70">Log in to view appointments and refills.</p>

        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full border p-3 rounded bg-black"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full border p-3 rounded bg-black"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            disabled={loading || !email || !password}
            className="w-full border px-4 py-3 rounded hover:bg-white/10 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-xs text-white/60">
          Admin EMR is at <span className="underline">/admin</span>
        </p>
      </div>
    </main>
  );
}
