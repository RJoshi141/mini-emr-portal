"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, CardHeader, CardBody, Input, Button, Badge } from "@/components/ui";

type PatientRow = {
    id: string;
    name: string;
    email: string;
    _count?: { appointments: number; prescriptions: number };
};

export default function PatientsTable({ patients }: { patients: PatientRow[] }) {
    const [q, setQ] = useState("");

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return patients;
        return patients.filter(
            (p) =>
                p.name.toLowerCase().includes(s) || p.email.toLowerCase().includes(s)
        );
    }, [q, patients]);

    return (
        <Card>
            <CardHeader
                title="Patients"
                subtitle="Manage patients, appointments, and prescriptions."
                right={
                    <Link href="/admin/patients/new">
                        <Button>New patient</Button>
                    </Link>
                }
            />
            <CardBody>
                <div className="mb-4">
                    <Input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search by name or email…"
                    />
                </div>

                <div className="overflow-hidden rounded-xl border border-white/10">
                    <table className="w-full text-sm">
                        <thead className="bg-white/[0.04] text-white/70">
                            <tr>
                                <th className="text-left px-4 py-3">Patient</th>
                                <th className="text-left px-4 py-3">Email</th>
                                <th className="text-left px-4 py-3">Status</th>
                                <th className="text-right px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p) => (
                                <tr key={p.id} className="border-t border-white/10 hover:bg-white/[0.02]">
                                    <td className="px-4 py-3 font-medium">{p.name}</td>
                                    <td className="px-4 py-3 text-white/70">{p.email}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Badge>{p._count?.appointments ?? 0} appts</Badge>
                                            <Badge>{p._count?.prescriptions ?? 0} meds</Badge>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link className="text-white/80 underline hover:text-white" href={`/admin/patients/${p.id}`}>
                                            Open
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td className="px-4 py-6 text-white/50" colSpan={4}>
                                        No patients match that search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardBody>
        </Card>
    );
}
