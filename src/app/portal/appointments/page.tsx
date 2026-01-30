import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionPatientId } from "@/lib/auth";

export default async function PortalAppointmentsPage() {
    const patientId = await getSessionPatientId();
    if (!patientId) redirect("/");

    const now = new Date();
    const end = new Date(now);
    end.setMonth(now.getMonth() + 3);

    const appts = await prisma.appointment.findMany({
        where: { patientId, startAt: { gte: now, lte: end } },
        orderBy: { startAt: "asc" },
    });

    return (
        <main className="p-10 space-y-6">
            <Link className="underline text-white/70" href="/portal">← Back</Link>
            <h1 className="text-3xl font-bold">Appointments (next 3 months)</h1>

            <div className="rounded-xl border border-white/10 p-6">
                {appts.length === 0 ? (
                    <p className="text-white/60">No upcoming appointments.</p>
                ) : (
                    <ul className="space-y-2">
                        {appts.map((a) => (
                            <li key={a.id} className="flex justify-between border-b border-white/10 pb-2">
                                <span>{a.provider}</span>
                                <span className="text-white/70">{a.startAt.toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}
