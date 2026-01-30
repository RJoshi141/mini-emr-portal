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

export default async function PortalPrescriptionsPage() {
    const patientId = await getSessionPatientId();
    if (!patientId) redirect("/");

    const patient = await prisma.patient.findUnique({
        where: { id: patientId },
        include: {
            prescriptions: { orderBy: { refillDate: "asc" } },
        },
    });

    if (!patient) redirect("/");

    const now = startOfToday();
    const end = addMonths(now, 3);

    const within3mo = patient.prescriptions.filter(
        (rx) => rx.refillDate >= now && rx.refillDate <= end
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
                        <Link className="text-white/70 hover:text-white" href="/portal/appointments">
                            Appointments
                        </Link>
                        <Link className="text-white hover:text-white" href="/portal/prescriptions">
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
                        <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
                        <p className="text-white/60 mt-1">
                            Medications and refills (next 3 months highlighted).
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                        <div className="text-xs text-white/50">Refills next 3 months</div>
                        <div className="text-2xl font-bold">{within3mo.length}</div>
                    </div>
                </div>

                <section className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                    <div className="p-5 border-b border-white/10 flex items-center justify-between">
                        <div>
                            <div className="font-semibold">Medication list</div>
                            <div className="text-sm text-white/60">Sorted by refill date</div>
                        </div>
                        <Link className="text-sm underline text-white/70 hover:text-white" href="/portal">
                            ← Back
                        </Link>
                    </div>

                    <div className="p-5">
                        {patient.prescriptions.length === 0 ? (
                            <p className="text-white/60">No prescriptions found.</p>
                        ) : (
                            <ul className="space-y-3">
                                {patient.prescriptions.map((rx) => {
                                    const isSoon = rx.refillDate >= now && rx.refillDate <= end;
                                    return (
                                        <li
                                            key={rx.id}
                                            className={[
                                                "rounded-xl border p-4 flex items-start justify-between gap-4",
                                                isSoon
                                                    ? "border-white/20 bg-white/[0.06]"
                                                    : "border-white/10 bg-black/20",
                                            ].join(" ")}
                                        >
                                            <div>
                                                <div className="font-medium">
                                                    {rx.medication}{" "}
                                                    <span className="text-white/60">— {rx.dosage}</span>
                                                </div>
                                                <div className="text-sm text-white/60 mt-1">
                                                    Qty {rx.quantity} •{" "}
                                                    <span className="text-white/70">{rx.refillSchedule}</span>
                                                </div>
                                                <div className="text-xs text-white/50 mt-2">
                                                    Refill date:{" "}
                                                    <span className="text-white/70">
                                                        {rx.refillDate.toLocaleDateString()}
                                                    </span>
                                                    {isSoon ? (
                                                        <span className="ml-2 inline-flex items-center rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] text-white/80">
                                                            Upcoming
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>

                                            <div className="shrink-0 text-xs text-white/50">
                                                #{rx.id.slice(0, 6)}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
