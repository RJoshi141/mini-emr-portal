"use client";

import { useRouter } from "next/navigation";

export default function DeletePrescriptionButton({ id }: { id: string }) {
    const router = useRouter();

    return (
        <button
            className="text-red-300 underline hover:no-underline"
            onClick={async () => {
                await fetch(`/api/admin/prescriptions?id=${id}`, { method: "DELETE" });
                router.refresh();
            }}
        >
            Delete
        </button>
    );
}
