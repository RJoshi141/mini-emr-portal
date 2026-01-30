"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PrescriptionActions({ id }: { id: string }) {
    const router = useRouter();
    const [busy, setBusy] = useState(false);

    async function onDelete() {
        if (!confirm("Delete this prescription?")) return;
        setBusy(true);
        await fetch(`/api/admin/prescriptions/${id}`, { method: "DELETE" });
        router.refresh();
        setBusy(false);
    }

    return (
        <button
            disabled={busy}
            onClick={onDelete}
            className="text-sm text-red-300 hover:text-red-200 disabled:opacity-50"
        >
            Delete
        </button>
    );
}
