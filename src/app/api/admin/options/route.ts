import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    const [medications, dosages] = await Promise.all([
        prisma.medicationOption.findMany({ orderBy: { name: "asc" } }),
        prisma.dosageOption.findMany({ orderBy: { value: "asc" } }),
    ]);

    return NextResponse.json({ medications, dosages });
}
