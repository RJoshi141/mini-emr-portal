"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AppointmentActions({
    id,
    repeat,
}: {
    id: string;
    repeat: string;
}) {
    const router = useRouter();
    const [busy, setBusy] = useState(false);

    async function onDelete() {
        if (!confirm("Delete this appointment?")) return;
        setBusy(true);
        await fetch(`/api/admin/appointments/${id}`, { method: "DELETE" });
        router.refresh();
        setBusy(false);
    }

    async function onEndRecurring() {
        // sets endsAt to now so your UI can show it as ended
        setBusy(true);
        await fetch(`/api/admin/appointments/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endsAt: new Date().toISOString() }),
        });
        router.refresh();
        setBusy(false);
    }

    return (
        <div className="flex items-center gap-3 text-sm">
            {repeat !== "none" && (
                <button
                    disabled={busy}
                    onClick={onEndRecurring}
                    className="text-yellow-300 hover:text-yellow-200 disabled:opacity-50"
                >
                    End recurring
                </button>
            )}
            <button
                disabled={busy}
                onClick={onDelete}
                className="text-red-300 hover:text-red-200 disabled:opacity-50"
            >
                Delete
            </button>
        </div>
    );
}
