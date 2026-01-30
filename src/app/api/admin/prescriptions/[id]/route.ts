import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    const { id } = await Promise.resolve(params);
    const body = await req.json();

    const medication = typeof body.medication === "string" ? body.medication : undefined;
    const dosage = typeof body.dosage === "string" ? body.dosage : undefined;
    const quantity =
        body.quantity === undefined ? undefined : Number(body.quantity);
    const refillDate = typeof body.refillDate === "string" ? body.refillDate : undefined;
    const refillSchedule =
        typeof body.refillSchedule === "string" ? body.refillSchedule : undefined;

    const data: any = {};
    if (medication) data.medication = medication;
    if (dosage) data.dosage = dosage;
    if (Number.isFinite(quantity)) data.quantity = quantity;
    if (refillDate) data.refillDate = new Date(refillDate);
    if (refillSchedule) data.refillSchedule = refillSchedule;

    const updated = await prisma.prescription.update({
        where: { id },
        data,
    });

    return NextResponse.json(updated);
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    const { id } = await Promise.resolve(params);

    await prisma.prescription.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}
