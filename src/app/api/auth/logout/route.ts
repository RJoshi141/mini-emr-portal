import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";

// If someone visits /api/auth/logout directly (GET), log them out and redirect home.
export async function GET(req: Request) {
    await clearSession();
    return NextResponse.redirect(new URL("/", req.url));
}

// If UI calls it via fetch (POST), also log out and redirect home.
export async function POST(req: Request) {
    await clearSession();
    return NextResponse.redirect(new URL("/", req.url));
}
