"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddAppointment({ patientId }: { patientId: string }) {
    const router = useRouter();

    const [provider, setProvider] = useState("");
    const [datetime, setDatetime] = useState("");
    const [loading, setLoading] = useState(false);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/admin/appointments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ patientId, provider, datetime }),
        });

        setLoading(false);

        if (!res.ok) {
            alert("Failed to add appointment");
            return;
        }

        // ✅ clear fields
        setProvider("");
        setDatetime("");

        router.refresh();
    }

    return (
        <form onSubmit={submit} className="mb-6 space-y-2">
            <h3 className="font-semibold">Add appointment</h3>

            <input
                className="border p-2 rounded bg-black w-full"
                placeholder="Provider"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
            />

            <input
                type="datetime-local"
                className="border p-2 rounded bg-black w-full"
                value={datetime}
                onChange={(e) => setDatetime(e.target.value)}
            />

            <button
                disabled={loading || !provider || !datetime}
                className="border px-4 py-2 rounded hover:bg-white/10 disabled:opacity-50"
            >
                {loading ? "Adding..." : "Add"}
            </button>
        </form>
    );
}
