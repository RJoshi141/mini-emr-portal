import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
    const body = await req.json();
    const { patientId, medication, dosage, quantity, refillOn, refillSchedule } = body;

    if (!patientId || !medication || !dosage || !quantity || !refillOn) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const refillDate = new Date(`${refillOn}T00:00:00.000Z`);

    const rx = await prisma.prescription.create({
        data: {
            patientId,
            medication,
            dosage,
            quantity: Number(quantity),
            refillDate,
            refillSchedule: refillSchedule ?? "monthly",
        },
    });

    return NextResponse.json(rx);
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await prisma.prescription.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}
