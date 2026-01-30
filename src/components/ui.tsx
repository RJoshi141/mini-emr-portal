export function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
            {children}
        </div>
    );
}

export function CardHeader({
    title,
    subtitle,
    right,
}: {
    title: string;
    subtitle?: string;
    right?: React.ReactNode;
}) {
    return (
        <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4">
            <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                {subtitle && <p className="text-sm text-white/60 mt-1">{subtitle}</p>}
            </div>
            {right}
        </div>
    );
}

export function CardBody({ children }: { children: React.ReactNode }) {
    return <div className="p-6">{children}</div>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={[
                "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm",
                "placeholder:text-white/30 outline-none",
                "focus:border-white/20 focus:ring-2 focus:ring-white/10",
                props.className ?? "",
            ].join(" ")}
        />
    );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            {...props}
            className={[
                "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm",
                "outline-none focus:border-white/20 focus:ring-2 focus:ring-white/10",
                props.className ?? "",
            ].join(" ")}
        />
    );
}

export function Button({
    variant = "primary",
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
    const base =
        "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition border";
    const styles = {
        primary:
            "bg-white text-black border-white hover:bg-white/90",
        secondary:
            "bg-white/10 text-white border-white/10 hover:bg-white/15",
        ghost:
            "bg-transparent text-white border-transparent hover:bg-white/5",
        danger:
            "bg-red-500/15 text-red-200 border-red-500/20 hover:bg-red-500/25",
    }[variant];

    return <button {...props} className={`${base} ${styles} ${props.className ?? ""}`} />;
}

export function Badge({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70">
            {children}
        </span>
    );
}
