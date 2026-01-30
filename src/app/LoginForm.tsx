"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setPending(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data?.error ?? "Invalid email or password");
                setPending(false);
                return;
            }

            // cookie is set by the route handler; now navigate
            router.push("/portal");
            router.refresh();
        } catch (err: any) {
            setError("Something went wrong. Try again.");
            setPending(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-3">
            <input
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/20 focus:ring-2 focus:ring-white/10"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
            />

            <input
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/20 focus:ring-2 focus:ring-white/10"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
            />

            {error && <p className="text-sm text-red-300">{error}</p>}

            <button
                type="submit"
                disabled={pending || !email.trim() || !password}
                className="w-full rounded-xl border border-white/10 bg-white text-black px-4 py-3 text-sm font-medium hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {pending ? "Logging in..." : "Log in"}
            </button>
        </form>
    );
}
