import Link from "next/link";

export default function Shell({
    title,
    subtitle,
    right,
    children,
}: {
    title: string;
    subtitle?: string;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <header className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur">
                <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                            <span className="text-sm font-semibold">Z</span>
                        </div>
                        <div>
                            <div className="text-sm text-white/60">Zealthy</div>
                            <div className="font-semibold leading-tight">{title}</div>
                        </div>
                    </div>

                    <nav className="flex items-center gap-3 text-sm">
                        <Link className="text-white/70 hover:text-white" href="/">
                            Portal
                        </Link>
                        <Link className="text-white/70 hover:text-white" href="/admin">
                            Admin
                        </Link>
                        {right}
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>

            <footer className="mx-auto max-w-6xl px-6 pb-10 text-xs text-white/40">
                Mini EMR + Patient Portal
            </footer>
        </div>
    );
}
