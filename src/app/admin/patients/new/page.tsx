"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPatientPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/admin/patients", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
            headers: { "Content-Type": "application/json" },
        });

        setLoading(false);

        if (res.ok) {
            router.push("/admin");
        } else {
            alert("Failed to create patient");
        }
    }

    return (
        <main className="p-10 max-w-xl space-y-6">
            <h1 className="text-3xl font-bold">New Patient</h1>

            <form onSubmit={submit} className="space-y-4">
                <input
                    className="w-full border p-3 rounded bg-black"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

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
                    disabled={loading}
                    className="border px-6 py-3 rounded hover:bg-white/10"
                >
                    {loading ? "Creating..." : "Create patient"}
                </button>
            </form>
        </main>
    );
}
