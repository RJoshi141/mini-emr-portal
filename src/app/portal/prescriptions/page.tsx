import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionPatientId } from "@/lib/auth";

export default async function PortalPrescriptionsPage() {
    const patientId = await getSessionPatientId();
    if (!patientId) redirect("/");

    const now = new Date();
    const end = new Date(now);
    end.setMonth(now.getMonth() + 3);

    const rx = await prisma.prescription.findMany({
        where: { patientId, refillDate: { gte: now, lte: end } },
        orderBy: { refillDate: "asc" },
    });

    return (
        <main className="p-10 space-y-6">
            <Link className="underline text-white/70" href="/portal">← Back</Link>
            <h1 className="text-3xl font-bold">Prescriptions (next 3 months)</h1>

            <div className="rounded-xl border border-white/10 p-6">
                {rx.length === 0 ? (
                    <p className="text-white/60">No upcoming refills.</p>
                ) : (
                    <ul className="space-y-2">
                        {rx.map((p) => (
                            <li key={p.id} className="flex justify-between border-b border-white/10 pb-2">
                                <span>
                                    {p.medication} — {p.dosage} (qty {p.quantity})
                                </span>
                                <span className="text-white/70">{p.refillDate.toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}
