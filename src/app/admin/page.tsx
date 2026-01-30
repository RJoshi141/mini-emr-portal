import Link from "next/link";
import { prisma } from "@/lib/db";

function formatDate(d: Date | null) {
    if (!d) return "—";
    return d.toLocaleString();
}

export default async function AdminPage() {
    const patients = await prisma.patient.findMany({
        include: {
            appointments: true,
            prescriptions: true,
        },
        orderBy: { createdAt: "asc" },
    });

    const now = new Date();

    const rows = patients.map((p) => {
        const nextAppt = p.appointments
            .map((a) => a.startAt)
            .filter((d) => d > now)
            .sort((a, b) => a.getTime() - b.getTime())[0] ?? null;

        const nextRefill = p.prescriptions
            .map((rx) => rx.refillDate)
            .filter((d) => d > now)
            .sort((a, b) => a.getTime() - b.getTime())[0] ?? null;

        return { p, nextAppt, nextRefill };
    });

    return (
        <main className="p-10">
            <div className="flex items-end justify-between mb-6">
                <h1 className="text-3xl font-bold">Mini EMR — Patients</h1>

                <Link
                    href="/admin/patients/new"
                    className="rounded-lg border px-4 py-2 hover:bg-white/10"
                >
                    + New patient
                </Link>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm">
                    <thead className="bg-white/5">
                        <tr className="text-left">
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Next appointment</th>
                            <th className="p-3">Next refill</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map(({ p, nextAppt, nextRefill }) => (
                            <tr key={p.id} className="border-t border-white/10">
                                <td className="p-3 font-medium">
                                    <Link className="underline hover:no-underline" href={`/admin/patients/${p.id}`}>
                                        {p.name}
                                    </Link>
                                </td>
                                <td className="p-3">{p.email}</td>
                                <td className="p-3">{formatDate(nextAppt)}</td>
                                <td className="p-3">{formatDate(nextRefill)}</td>
                                <td className="p-3 text-right">
                                    <Link className="underline hover:no-underline" href={`/admin/patients/${p.id}`}>
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}

                        {rows.length === 0 && (
                            <tr>
                                <td className="p-6 text-center text-white/60" colSpan={5}>
                                    No patients yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
