import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
    const body = await req.json();
    const { patientId, provider, datetime, repeat } = body;

    if (!patientId || !provider || !datetime) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
        data: {
            patientId,
            provider,
            startAt: new Date(datetime),
            repeat: repeat ?? "none",
            endsAt: null,
        },
    });

    return NextResponse.json(appointment);
}

// ✅ delete a single appointment
export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}

// ✅ end a recurring series (sets endsAt)
export async function PATCH(req: Request) {
    const body = await req.json();
    const { id, endsAt } = body;

    if (!id || !endsAt) {
        return NextResponse.json({ error: "Missing id or endsAt" }, { status: 400 });
    }

    const updated = await prisma.appointment.update({
        where: { id },
        data: { endsAt: new Date(endsAt) },
    });

    return NextResponse.json(updated);
}
