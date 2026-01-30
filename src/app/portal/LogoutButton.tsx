"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    async function logout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
    }

    return (
        <button
            onClick={logout}
            className="border px-4 py-2 rounded hover:bg-white/10"
        >
            Log out
        </button>
    );
}
