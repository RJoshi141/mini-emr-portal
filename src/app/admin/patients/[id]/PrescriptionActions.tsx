"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PrescriptionActions({
    id,
    medication,
    dosage,
    quantity,
    refillDateISO,
    refillSchedule,
}: {
    id: string;
    medication: string;
    dosage: string;
    quantity: number;
    refillDateISO: string;
    refillSchedule: string;
}) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const [nextMedication, setNextMedication] = useState(medication);
    const [nextDosage, setNextDosage] = useState(dosage);
    const [nextQuantity, setNextQuantity] = useState(String(quantity));
    const [nextRefillDate, setNextRefillDate] = useState(refillDateISO.slice(0, 10));
    const [nextSchedule, setNextSchedule] = useState(refillSchedule);

    const [isSaving, setIsSaving] = useState(false);

    async function onDelete() {
        if (!confirm("Delete this prescription?")) return;
        await fetch(`/api/admin/prescriptions/${id}`, { method: "DELETE" });
        router.refresh();
    }

    async function onSave() {
        setIsSaving(true);
        try {
            await fetch(`/api/admin/prescriptions/${id}`, {
                method: "PATCH",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    medication: nextMedication,
                    dosage: nextDosage,
                    quantity: Number(nextQuantity),
                    refillDate: new Date(nextRefillDate).toISOString(),
                    refillSchedule: nextSchedule,
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
        <div className="w-[360px] rounded-xl border border-white/10 bg-black/30 p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
                <input
                    className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                    value={nextMedication}
                    onChange={(e) => setNextMedication(e.target.value)}
                    placeholder="Medication"
                />
                <input
                    className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                    value={nextDosage}
                    onChange={(e) => setNextDosage(e.target.value)}
                    placeholder="Dosage"
                />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <input
                    type="number"
                    min={1}
                    className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                    value={nextQuantity}
                    onChange={(e) => setNextQuantity(e.target.value)}
                    placeholder="Qty"
                />
                <input
                    type="date"
                    className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                    value={nextRefillDate}
                    onChange={(e) => setNextRefillDate(e.target.value)}
                />
            </div>

            <select
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                value={nextSchedule}
                onChange={(e) => setNextSchedule(e.target.value)}
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
