"use client";

import { useRouter } from "next/navigation";

export default function AppointmentActions({
    id,
    repeat,
}: {
    id: string;
    repeat: string;
}) {
    const router = useRouter();

    async function del() {
        await fetch(`/api/admin/appointments?id=${id}`, { method: "DELETE" });
        router.refresh();
    }

    async function endRecurring() {
        const today = new Date();
        const ymd = today.toISOString().slice(0, 10); // YYYY-MM-DD
        await fetch("/api/admin/appointments", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, endsAt: `${ymd}T23:59:59.999Z` }),
        });
        router.refresh();
    }

    return (
        <div className="flex gap-3 items-center">
            {repeat !== "none" && (
                <button
                    onClick={endRecurring}
                    className="text-yellow-300 underline hover:no-underline"
                >
                    End recurring
                </button>
            )}
            <button onClick={del} className="text-red-300 underline hover:no-underline">
                Delete
            </button>
        </div>
    );
}
