import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="text-xs text-white/60 mb-3">Mini EMR + Patient Portal</div>
          <h1 className="text-3xl font-semibold leading-tight">Your care, organized.</h1>
          <p className="text-white/60 mt-3">
            Log in to view upcoming appointments, refills, and patient info.
          </p>

          <p className="text-xs text-white/50 mt-6">
            Admin EMR is at{" "}
            <Link className="underline hover:text-white" href="/admin">
              /admin
            </Link>
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-bold">Patient Portal</h2>
          <p className="text-white/60 mt-1">Log in to continue.</p>

          <div className="mt-5">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
