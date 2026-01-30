import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionPatientId } from "@/lib/auth";

function withinNextDays(d: Date, days: number) {
    const now = new Date();
    const end = new Date(now);
    end.setDate(now.getDate() + days);
    return d >= now && d <= end;
}

export default async function PortalPage() {
    const patientId = await getSessionPatientId();
    if (!patientId) redirect("/");

    const patient = await prisma.patient.findUnique({
        where: { id: patientId },
        include: {
            appointments: { orderBy: { startAt: "asc" } },
            prescriptions: { orderBy: { refillDate: "asc" } },
        },
    });

    if (!patient) redirect("/");

    const next7Appts = patient.appointments.filter((a) => withinNextDays(a.startAt, 7));
    const next7Refills = patient.prescriptions.filter((p) => withinNextDays(p.refillDate, 7));

    return (
        <main className="p-10 space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Welcome, {patient.name}</h1>
                    <p className="text-white/70">{patient.email}</p>
                </div>

                <form
                    action="/api/auth/logout"
                    method="post"
                    className="inline"
                >
                    <button className="border px-4 py-2 rounded hover:bg-white/10">
                        Log out
                    </button>
                </form>
            </div>

            <section className="rounded-xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold">Appointments (next 7 days)</h2>
                    <Link className="underline" href="/portal/appointments">View all</Link>
                </div>

                {next7Appts.length === 0 ? (
                    <p className="text-white/60">No appointments in the next 7 days.</p>
                ) : (
                    <ul className="space-y-2">
                        {next7Appts.map((a) => (
                            <li key={a.id} className="flex justify-between border-b border-white/10 pb-2">
                                <span>{a.provider}</span>
                                <span className="text-white/70">{a.startAt.toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section className="rounded-xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold">Medication refills (next 7 days)</h2>
                    <Link className="underline" href="/portal/prescriptions">View all</Link>
                </div>

                {next7Refills.length === 0 ? (
                    <p className="text-white/60">No refills in the next 7 days.</p>
                ) : (
                    <ul className="space-y-2">
                        {next7Refills.map((p) => (
                            <li key={p.id} className="flex justify-between border-b border-white/10 pb-2">
                                <span>{p.medication} — {p.dosage}</span>
                                <span className="text-white/70">{p.refillDate.toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}
