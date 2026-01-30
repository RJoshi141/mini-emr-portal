import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

// If you have these, keep them:
import AddAppointment from "./AddAppointment";
import AddPrescription from "./AddPrescription";
import AppointmentActions from "./AppointmentActions";
import PrescriptionActions from "./PrescriptionActions";

export default async function PatientDetailPage({
    params,
}: {
    params: Promise<{ id?: string }> | { id?: string };
}) {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id;
    if (!id) notFound();

    const patient = await prisma.patient.findUnique({
        where: { id },
        include: {
            appointments: { orderBy: { startAt: "asc" } },
            prescriptions: { orderBy: { refillDate: "asc" } },
        },
    });

    if (!patient) notFound();

    return (
        <div className="min-h-screen text-white bg-gradient-to-b from-[#0a0d16] via-[#0b0f1c] to-black bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]">
            {/* Top bar */}
            <header className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur">
                <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                            <span className="text-sm font-semibold">E</span>
                        </div>
                        <div>
                            <div className="text-xs text-white/50">Admin • Patient</div>
                            <div className="font-semibold leading-tight">{patient.name}</div>
                        </div>
                    </div>

                    <nav className="flex items-center gap-3 text-sm">
                        <Link className="text-white/70 hover:text-white" href="/admin">
                            ← Back to Admin
                        </Link>
                        <Link className="text-white/70 hover:text-white" href="/portal">
                            Portal
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{patient.name}</h1>
                        <p className="text-white/60 mt-1">{patient.email}</p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/admin"
                            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm hover:bg-white/10"
                        >
                            Admin Home
                        </Link>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Left: patient summary + quick actions */}
                    <aside className="lg:col-span-1 space-y-4">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                            <div className="text-xs text-white/50">Patient record</div>
                            <div className="mt-2 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Appointments</span>
                                    <span className="font-medium">{patient.appointments.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Prescriptions</span>
                                    <span className="font-medium">{patient.prescriptions.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
                            <div>
                                <div className="font-semibold">Quick actions</div>
                                <p className="text-sm text-white/60 mt-1">
                                    Add an appointment or prescription.
                                </p>
                            </div>

                            {/* If these components exist, drop them here */}
                            <div className="space-y-4">
                                <AddAppointment patientId={patient.id} />
                                <AddPrescription patientId={patient.id} />
                            </div>
                        </div>
                    </aside>

                    {/* Right: appointments + prescriptions */}
                    <section className="lg:col-span-2 space-y-4">
                        {/* Appointments */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
                            <div className="p-5 border-b border-white/10 flex items-center justify-between">
                                <div>
                                    <h2 className="font-semibold">Appointments</h2>
                                    <p className="text-sm text-white/60">Upcoming schedule</p>
                                </div>
                            </div>

                            <div className="p-5">
                                {patient.appointments.length === 0 ? (
                                    <p className="text-white/60">No appointments yet.</p>
                                ) : (
                                    <ul className="space-y-3">
                                        {patient.appointments.map((a) => (
                                            <li
                                                key={a.id}
                                                className="rounded-xl border border-white/10 bg-black/20 p-4 flex items-start justify-between gap-4"
                                            >
                                                <div>
                                                    <div className="font-medium">{a.provider}</div>
                                                    <div className="text-sm text-white/60">
                                                        {a.startAt.toLocaleString()} • {a.repeat}
                                                    </div>
                                                    {a.endsAt && (
                                                        <div className="text-xs text-white/50 mt-1">
                                                            Ends: {a.endsAt.toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Your actions (delete + end recurring) */}
                                                <div className="shrink-0">
                                                    <AppointmentActions
                                                        id={a.id}
                                                        repeat={a.repeat}
                                                        provider={a.provider}
                                                        startAtISO={a.startAt instanceof Date ? a.startAt.toISOString() : new Date(a.startAt).toISOString()}
                                                    />
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Prescriptions */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
                            <div className="p-5 border-b border-white/10 flex items-center justify-between">
                                <div>
                                    <h2 className="font-semibold">Prescriptions</h2>
                                    <p className="text-sm text-white/60">Medications and refills</p>
                                </div>
                            </div>

                            <div className="p-5">
                                {patient.prescriptions.length === 0 ? (
                                    <p className="text-white/60">No prescriptions yet.</p>
                                ) : (
                                    <ul className="space-y-3">
                                        {patient.prescriptions.map((rx) => (
                                            <li
                                                key={rx.id}
                                                className="rounded-xl border border-white/10 bg-black/20 p-4 flex items-start justify-between gap-4"
                                            >
                                                <div>
                                                    <div className="font-medium">
                                                        {rx.medication}{" "}
                                                        <span className="text-white/60">— {rx.dosage}</span>
                                                    </div>
                                                    <div className="text-sm text-white/60">
                                                        Qty {rx.quantity} • {rx.refillSchedule}
                                                    </div>
                                                    <div className="text-xs text-white/50 mt-1">
                                                        Refill date: {rx.refillDate.toLocaleDateString()}
                                                    </div>
                                                </div>

                                                {/* If you have rx delete/edit actions, use them */}
                                                <div className="shrink-0">
                                                    <PrescriptionActions
                                                        id={rx.id}
                                                        medication={rx.medication}
                                                        dosage={rx.dosage}
                                                        quantity={rx.quantity}
                                                        refillDateISO={rx.refillDate.toISOString()}
                                                        refillSchedule={rx.refillSchedule}
                                                    />
                                                </div>

                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
