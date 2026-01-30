import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";

function redirectHome(req: Request) {
    return NextResponse.redirect(new URL("/", req.url));
}

export async function GET(req: Request) {
    await clearSession();
    return redirectHome(req);
}

export async function POST(req: Request) {
    await clearSession();
    return redirectHome(req);
}

// Some clients/frameworks will hit HEAD implicitly
export async function HEAD(req: Request) {
    await clearSession();
    return redirectHome(req);
}
