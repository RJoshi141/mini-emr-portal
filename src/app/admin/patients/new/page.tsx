import Link from "next/link";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default function NewPatientPage() {
    async function createPatient(formData: FormData) {
        "use server";

        const name = String(formData.get("name") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim().toLowerCase();
        const password = String(formData.get("password") ?? "");

        if (!name || !email || !password) {
            // keep it simple: just redirect back (or you can add error state later)
            redirect("/admin/patients/new");
        }

        // IMPORTANT: if you’re hashing passwords elsewhere, use the same function.
        // If your model stores passwordHash, hash here instead of storing raw.
        // Assuming you already have a helper; otherwise keep your existing create logic.

        // If your schema is passwordHash:
        // const passwordHash = await bcrypt.hash(password, 10);

        const patient = await prisma.patient.create({
            data: {
                name,
                email,
                // passwordHash,  // use if you store hash
                passwordHash: password, // replace with hash if needed
            },
        });

        redirect(`/admin/patients/${patient.id}`);
    }

    return (
        <div className="min-h-screen">
            <header className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur">
                <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                            <span className="text-sm font-semibold">E</span>
                        </div>
                        <div>
                            <div className="text-xs text-white/50">Admin</div>
                            <div className="font-semibold leading-tight">New Patient</div>
                        </div>
                    </div>

                    <nav className="flex items-center gap-3 text-sm">
                        <Link className="text-white/70 hover:text-white" href="/admin">
                            ← Back
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-6 py-10">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h1 className="text-2xl font-bold">Create a patient</h1>
                        <p className="text-white/60 mt-1">
                            Add patient info and a password for portal login (for testing).
                        </p>
                    </div>

                    <form action={createPatient} className="p-6 space-y-4">
                        <div>
                            <label className="text-sm text-white/70">Full name</label>
                            <input
                                name="name"
                                placeholder="Jane Doe"
                                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/20 focus:ring-2 focus:ring-white/10"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-white/70">Email</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="jane@example.com"
                                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/20 focus:ring-2 focus:ring-white/10"
                            />
                            <p className="text-xs text-white/40 mt-2">
                                Email is used to log into the patient portal.
                            </p>
                        </div>

                        <div>
                            <label className="text-sm text-white/70">Password</label>
                            <input
                                name="password"
                                type="password"
                                placeholder="Set a password"
                                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/20 focus:ring-2 focus:ring-white/10"
                            />
                            <p className="text-xs text-white/40 mt-2">
                                In a real system this would be handled differently — but it helps testing.
                            </p>
                        </div>

                        <div className="pt-2 flex items-center justify-end gap-3">
                            <Link
                                href="/admin"
                                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm hover:bg-white/10"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                className="rounded-xl border border-white/10 bg-white text-black px-4 py-2.5 text-sm font-medium hover:bg-white/90"
                            >
                                Create patient
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
