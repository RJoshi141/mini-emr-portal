"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Option = { id: string; name?: string; value?: string };

export default function AddPrescription({ patientId }: { patientId: string }) {
    const router = useRouter();

    const [medications, setMedications] = useState<Option[]>([]);
    const [dosages, setDosages] = useState<Option[]>([]);

    const [medication, setMedication] = useState("");
    const [dosage, setDosage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [refillOn, setRefillOn] = useState("");
    const [refillSchedule, setRefillSchedule] = useState<"monthly" | "weekly" | "none">("monthly");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const res = await fetch("/api/admin/options");
            const data = await res.json();
            setMedications(data.medications);
            setDosages(data.dosages);

            // default select first options for convenience
            if (data.medications?.[0]?.name) setMedication(data.medications[0].name);
            if (data.dosages?.[0]?.value) setDosage(data.dosages[0].value);
        })();
    }, []);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/admin/prescriptions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                patientId,
                medication,
                dosage,
                quantity,
                refillOn,
                refillSchedule,
            }),
        });

        setLoading(false);

        if (!res.ok) {
            alert("Failed to add prescription");
            return;
        }

        // ✅ reset everything
        setMedication(medications?.[0]?.name ?? "");
        setDosage(dosages?.[0]?.value ?? "");
        setQuantity(1);
        setRefillOn("");
        setRefillSchedule("monthly");

        router.refresh();
    }


    return (
        <form onSubmit={submit} className="mb-6 space-y-2">
            <h3 className="font-semibold">Add prescription</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select
                    className="border p-2 rounded bg-black w-full"
                    value={medication}
                    onChange={(e) => setMedication(e.target.value)}
                >
                    {medications.map((m) => (
                        <option key={m.id} value={m.name}>
                            {m.name}
                        </option>
                    ))}
                </select>

                <select
                    className="border p-2 rounded bg-black w-full"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                >
                    {dosages.map((d) => (
                        <option key={d.id} value={d.value}>
                            {d.value}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    min={1}
                    className="border p-2 rounded bg-black w-full"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    placeholder="Quantity"
                />

                <input
                    type="date"
                    className="border p-2 rounded bg-black w-full"
                    value={refillOn}
                    onChange={(e) => setRefillOn(e.target.value)}
                />

                <select
                    className="border p-2 rounded bg-black w-full"
                    value={refillSchedule}
                    onChange={(e) => setRefillSchedule(e.target.value as any)}
                >
                    <option value="monthly">monthly</option>
                    <option value="weekly">weekly</option>
                    <option value="none">none</option>
                </select>
            </div>

            <button
                disabled={loading || !medication || !dosage || !refillOn}
                className="border px-4 py-2 rounded hover:bg-white/10 disabled:opacity-50"
            >
                {loading ? "Adding..." : "Add"}
            </button>
        </form>
    );
}
