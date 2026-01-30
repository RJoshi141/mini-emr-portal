import { redirect } from "next/navigation";
import { getSessionPatientId } from "@/lib/auth";

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const patientId = await getSessionPatientId();
    if (!patientId) redirect("/");

    return <>{children}</>;
}
