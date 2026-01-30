import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    const { id } = await Promise.resolve(params);
    const body = await req.json();

    const provider = typeof body.provider === "string" ? body.provider.trim() : undefined;
    const datetime = typeof body.datetime === "string" ? body.datetime : undefined;
    const repeat = typeof body.repeat === "string" ? body.repeat : undefined;

    // allow partial updates
    const data: any = {};
    if (provider) data.provider = provider;
    if (datetime) data.startAt = new Date(datetime);
    if (repeat) data.repeat = repeat;

    const updated = await prisma.appointment.update({
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

    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}
