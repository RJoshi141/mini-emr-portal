import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import AddAppointment from "./AddAppointment";
import AddPrescription from "./AddPrescription";
import DeletePrescriptionButton from "./DeletePrescriptionButton";
import AppointmentActions from "./AppointmentActions";



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
        <main className="p-10 space-y-8">
            <div>
                <Link className="underline text-white/70" href="/admin">
                    ← Back
                </Link>
                <h1 className="text-3xl font-bold mt-2">{patient.name}</h1>
                <p className="text-white/70">{patient.email}</p>
            </div>

            <section className="rounded-xl border border-white/10 p-6">
                <h2 className="text-xl font-semibold mb-4">Appointments</h2>

                <AddAppointment patientId={patient.id} />
                <AddPrescription patientId={patient.id} />

                <ul className="space-y-2">
                    {patient.appointments.map((a) => (
                        <li
                            key={a.id}
                            className="flex justify-between border-b border-white/10 pb-2"
                        >
                            <span>{a.provider}</span>
                            <span className="text-white/70">
                                {a.startAt.toLocaleString()}
                            </span>
                            <AppointmentActions id={a.id} repeat={a.repeat} />
                        </li>
                    ))}
                    {patient.appointments.length === 0 && (
                        <p className="text-white/60">None</p>
                    )}
                </ul>
            </section>

            <section className="rounded-xl border border-white/10 p-6">
                <h2 className="text-xl font-semibold mb-4">Prescriptions</h2>
                <ul className="space-y-2">
                    {patient.prescriptions.map((rx) => (
                        <li key={rx.id} className="flex justify-between border-b border-white/10 pb-2 items-center">
                            <span>
                                {rx.medication} — {rx.dosage} (qty {rx.quantity})
                            </span>

                            <span className="flex items-center gap-4 text-white/70">
                                <span>Refill: {rx.refillDate.toLocaleDateString()}</span>
                                <DeletePrescriptionButton id={rx.id} />
                            </span>
                        </li>

                    ))}
                    {patient.prescriptions.length === 0 && (
                        <p className="text-white/60">None</p>
                    )}
                </ul>
            </section>
        </main>
    );

}
