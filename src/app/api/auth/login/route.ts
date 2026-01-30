import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const patient = await prisma.patient.findUnique({ where: { email } });

    if (!patient) {
        return NextResponse.json({ error: "No patient found for that email" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, patient.passwordHash);
    if (!ok) {
        return NextResponse.json({ error: "Password incorrect" }, { status: 401 });
    }

    await createSession(patient.id);
    return NextResponse.json({ ok: true });
}
