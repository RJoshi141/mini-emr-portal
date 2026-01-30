import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
    const body = await req.json();
    let { name, email, password } = body;
    name = String(name ?? "").trim();
    email = String(email ?? "").trim().toLowerCase();
    password = String(password ?? "");

    if (!name || !email || !password) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const patient = await prisma.patient.create({
        data: { name, email, passwordHash },
    });

    return NextResponse.json(patient);
}
