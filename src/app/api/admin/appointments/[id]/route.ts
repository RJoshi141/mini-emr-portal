import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    const { id } = await Promise.resolve(params);
    const body = await req.json();

    const provider = body.provider ? String(body.provider) : undefined;
    const datetime = body.datetime ? new Date(String(body.datetime)) : undefined;
    const repeat = body.repeat ? String(body.repeat) : undefined;
    const endsAt =
        body.endsAt === null ? null : body.endsAt ? new Date(String(body.endsAt)) : undefined;

    try {
        const updated = await prisma.appointment.update({
            where: { id },
            data: {
                ...(provider !== undefined ? { provider } : {}),
                ...(datetime !== undefined ? { startAt: datetime } : {}),
                ...(repeat !== undefined ? { repeat: repeat as any } : {}),
                ...(endsAt !== undefined ? { endsAt } : {}),
            },
        });
        return NextResponse.json(updated);
    } catch {
        return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    const { id } = await Promise.resolve(params);

    try {
        await prisma.appointment.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }
}
