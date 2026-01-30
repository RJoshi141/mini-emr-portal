import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionPatientId } from "@/lib/auth";
import LogoutButton from "@/app/portal/LogoutButton";

function startOfToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}

function addDays(date: Date, days: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
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

    const now = startOfToday();
    const next7 = addDays(now, 7);

    const appts7 = patient.appointments.filter(
        (a) => a.startAt >= now && a.startAt <= next7
    );

    const refills7 = patient.prescriptions.filter(
        (rx) => rx.refillDate >= now && rx.refillDate <= next7
    );

    const nextAppt = patient.appointments.find((a) => a.startAt >= now) ?? null;

    return (
        <div className="min-h-screen">
            {/* Top bar */}
            <header className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur">
                <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                            <span className="text-sm font-semibold">Z</span>
                        </div>
                        <div>
                            <div className="text-xs text-white/50">Patient Portal</div>
                            <div className="font-semibold leading-tight">{patient.name}</div>
                        </div>
                    </div>

                    <nav className="flex items-center gap-3 text-sm">
                        <Link className="text-white/70 hover:text-white" href="/portal">
                            Overview
                        </Link>
                        <Link className="text-white/70 hover:text-white" href="/portal/appointments">
                            Appointments
                        </Link>
                        <Link className="text-white/70 hover:text-white" href="/portal/prescriptions">
                            Prescriptions
                        </Link>

                        <div className="ml-2">
                            <LogoutButton />
                        </div>
                    </nav>
                </div>
            </header>

            {/* Content */}
            <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
                {/* Hero */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                        <p className="text-white/60 mt-1">
                            Next 7 days at a glance — appointments and refills.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                        <div className="text-xs text-white/50">Signed in as</div>
                        <div className="text-sm font-medium">{patient.email}</div>
                    </div>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="text-xs text-white/50">Next appointment</div>
                        <div className="mt-2 text-lg font-semibold">
                            {nextAppt ? nextAppt.provider : "None scheduled"}
                        </div>
                        <div className="text-sm text-white/60 mt-1">
                            {nextAppt ? nextAppt.startAt.toLocaleString() : "You're all caught up."}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="text-xs text-white/50">Appointments in next 7 days</div>
                        <div className="mt-2 text-3xl font-bold">{appts7.length}</div>
                        <div className="text-sm text-white/60 mt-1">
                            <Link className="underline hover:text-white" href="/portal/appointments">
                                View full schedule →
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="text-xs text-white/50">Refills in next 7 days</div>
                        <div className="mt-2 text-3xl font-bold">{refills7.length}</div>
                        <div className="text-sm text-white/60 mt-1">
                            <Link className="underline hover:text-white" href="/portal/prescriptions">
                                View prescriptions →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="rounded-2xl border border-white/10 bg-white/[0.03]">
                        <div className="p-5 border-b border-white/10 flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold">Upcoming appointments</h2>
                                <p className="text-sm text-white/60">Next 7 days</p>
                            </div>
                            <Link className="text-sm underline text-white/70 hover:text-white" href="/portal/appointments">
                                View all
                            </Link>
                        </div>

                        <div className="p-5">
                            {appts7.length === 0 ? (
                                <p className="text-white/60">No appointments in the next 7 days.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {appts7.slice(0, 5).map((a) => (
                                        <li
                                            key={a.id}
                                            className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-black/20 p-4"
                                        >
                                            <div>
                                                <div className="font-medium">{a.provider}</div>
                                                <div className="text-sm text-white/60">{a.repeat}</div>
                                            </div>
                                            <div className="text-sm text-white/70">
                                                {a.startAt.toLocaleString()}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-white/[0.03]">
                        <div className="p-5 border-b border-white/10 flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold">Medication refills</h2>
                                <p className="text-sm text-white/60">Next 7 days</p>
                            </div>
                            <Link className="text-sm underline text-white/70 hover:text-white" href="/portal/prescriptions">
                                View all
                            </Link>
                        </div>

                        <div className="p-5">
                            {refills7.length === 0 ? (
                                <p className="text-white/60">No refills scheduled in the next 7 days.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {refills7.slice(0, 5).map((rx) => (
                                        <li
                                            key={rx.id}
                                            className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-black/20 p-4"
                                        >
                                            <div>
                                                <div className="font-medium">
                                                    {rx.medication} <span className="text-white/60">— {rx.dosage}</span>
                                                </div>
                                                <div className="text-sm text-white/60">
                                                    Qty {rx.quantity} • {rx.refillSchedule}
                                                </div>
                                            </div>
                                            <div className="text-sm text-white/70">
                                                {rx.refillDate.toLocaleDateString()}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
