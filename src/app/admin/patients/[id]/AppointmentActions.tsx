"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AppointmentActions({
    id,
    repeat,
    provider,
    startAtISO,
}: {
    id: string;
    repeat: string;
    provider: string;
    startAtISO: string; // pass from server as ISO
}) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const [nextProvider, setNextProvider] = useState(provider);
    const [nextDatetime, setNextDatetime] = useState(startAtISO.slice(0, 16)); // for datetime-local
    const [nextRepeat, setNextRepeat] = useState(repeat);

    const [isSaving, setIsSaving] = useState(false);

    async function onDelete() {
        if (!confirm("Delete this appointment?")) return;
        await fetch(`/api/admin/appointments/${id}`, { method: "DELETE" });
        router.refresh();
    }

    async function onEndRecurring() {
        // your existing logic (if you already have it)
        // example: set repeat to "none"
        setIsSaving(true);
        try {
            await fetch(`/api/admin/appointments/${id}`, {
                method: "PATCH",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ repeat: "none" }),
            });
            router.refresh();
        } finally {
            setIsSaving(false);
        }
    }

    async function onSave() {
        setIsSaving(true);
        try {
            await fetch(`/api/admin/appointments/${id}`, {
                method: "PATCH",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    provider: nextProvider,
                    datetime: new Date(nextDatetime).toISOString(),
                    repeat: nextRepeat,
                }),
            });
            setIsEditing(false);
            router.refresh();
        } finally {
            setIsSaving(false);
        }
    }

    if (!isEditing) {
        return (
            <div className="flex items-center gap-3 text-sm">
                <button
                    className="text-white/70 hover:text-white underline underline-offset-4"
                    onClick={() => setIsEditing(true)}
                >
                    Edit
                </button>
                {repeat !== "none" && (
                    <button
                        className="text-yellow-300 hover:text-yellow-200 underline underline-offset-4"
                        onClick={onEndRecurring}
                        disabled={isSaving}
                    >
                        End recurring
                    </button>
                )}
                <button
                    className="text-red-300 hover:text-red-200 underline underline-offset-4"
                    onClick={onDelete}
                    disabled={isSaving}
                >
                    Delete
                </button>
            </div>
        );
    }

    return (
        <div className="w-[320px] rounded-xl border border-white/10 bg-black/30 p-3 space-y-2">
            <input
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                value={nextProvider}
                onChange={(e) => setNextProvider(e.target.value)}
                placeholder="Provider"
            />
            <input
                type="datetime-local"
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                value={nextDatetime}
                onChange={(e) => setNextDatetime(e.target.value)}
            />
            <select
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                value={nextRepeat}
                onChange={(e) => setNextRepeat(e.target.value)}
            >
                <option value="none">none</option>
                <option value="weekly">weekly</option>
                <option value="monthly">monthly</option>
            </select>

            <div className="flex justify-end gap-2 pt-1">
                <button
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/70 hover:text-white"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                >
                    Cancel
                </button>
                <button
                    className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
                    onClick={onSave}
                    disabled={isSaving}
                >
                    {isSaving ? "Saving…" : "Save"}
                </button>
            </div>
        </div>
    );
}
