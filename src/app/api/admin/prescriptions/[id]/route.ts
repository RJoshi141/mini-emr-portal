import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    const { id } = await Promise.resolve(params);
    const body = await req.json();

    const medication = body.medication ? String(body.medication) : undefined;
    const dosage = body.dosage ? String(body.dosage) : undefined;
    const quantity =
        body.quantity !== undefined && body.quantity !== null ? Number(body.quantity) : undefined;
    const refillDate = body.refillDate ? new Date(String(body.refillDate)) : undefined;
    const refillSchedule = body.refillSchedule ? String(body.refillSchedule) : undefined;

    try {
        const updated = await prisma.prescription.update({
            where: { id },
            data: {
                ...(medication !== undefined ? { medication } : {}),
                ...(dosage !== undefined ? { dosage } : {}),
                ...(quantity !== undefined ? { quantity } : {}),
                ...(refillDate !== undefined ? { refillDate } : {}),
                ...(refillSchedule !== undefined ? { refillSchedule: refillSchedule as any } : {}),
            },
        });

        return NextResponse.json(updated);
    } catch {
        return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    const { id } = await Promise.resolve(params);

    try {
        await prisma.prescription.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
    }
}
