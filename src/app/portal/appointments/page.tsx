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

function addMonths(date: Date, months: number) {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
}

export default async function PortalAppointmentsPage() {
    const patientId = await getSessionPatientId();
    if (!patientId) redirect("/");

    const patient = await prisma.patient.findUnique({
        where: { id: patientId },
        include: {
            appointments: { orderBy: { startAt: "asc" } },
        },
    });

    if (!patient) redirect("/");

    const now = startOfToday();
    const end = addMonths(now, 3);
    const upcoming = patient.appointments.filter(
        (a) => a.startAt >= now && a.startAt <= end
    );

    return (
        <div className="min-h-screen">
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
                        <Link className="text-white hover:text-white" href="/portal/appointments">
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

            <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
                        <p className="text-white/60 mt-1">
                            Showing upcoming appointments for the next 3 months.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                        <div className="text-xs text-white/50">Upcoming</div>
                        <div className="text-2xl font-bold">{upcoming.length}</div>
                    </div>
                </div>

                <section className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                    <div className="p-5 border-b border-white/10 flex items-center justify-between">
                        <div>
                            <div className="font-semibold">Schedule</div>
                            <div className="text-sm text-white/60">Sorted by date</div>
                        </div>
                        <Link className="text-sm underline text-white/70 hover:text-white" href="/portal">
                            ← Back
                        </Link>
                    </div>

                    <div className="p-5">
                        {upcoming.length === 0 ? (
                            <p className="text-white/60">No upcoming appointments.</p>
                        ) : (
                            <ul className="space-y-3">
                                {upcoming.map((a) => (
                                    <li
                                        key={a.id}
                                        className="rounded-xl border border-white/10 bg-black/20 p-4 flex items-start justify-between gap-4"
                                    >
                                        <div>
                                            <div className="font-medium">{a.provider}</div>
                                            <div className="text-sm text-white/60 mt-1">
                                                {a.startAt.toLocaleString()}
                                            </div>
                                            <div className="text-xs text-white/50 mt-2">
                                                Repeat: <span className="text-white/70">{a.repeat}</span>
                                                {a.endsAt ? (
                                                    <>
                                                        {" "}• Ends{" "}
                                                        <span className="text-white/70">
                                                            {a.endsAt.toLocaleDateString()}
                                                        </span>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="shrink-0 text-xs text-white/50">
                                            #{a.id.slice(0, 6)}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
