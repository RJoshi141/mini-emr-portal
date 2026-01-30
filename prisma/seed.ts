// prisma/seed.ts
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString =
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL;

if (!connectionString) {
    throw new Error(
        "Missing DB connection string. Expected POSTGRES_URL_NON_POOLING or DATABASE_URL or POSTGRES_URL in .env"
    );
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

type SeedData = {
    medications: string[];
    dosages: string[];
    users: Array<{
        id?: number;
        name: string;
        email: string;
        password: string;
        appointments?: Array<{
            id?: number;
            provider: string;
            datetime: string; // e.g. "2025-09-16T16:30:00.000-07:00"
            repeat?: "none" | "weekly" | "monthly";
        }>;
        prescriptions?: Array<{
            id?: number;
            medication: string;
            dosage: string;
            quantity: number;
            refill_on: string; // e.g. "2025-10-05"
            refill_schedule?: "none" | "weekly" | "monthly";
        }>;

    }>;
};

async function main() {
    const filePath = path.join(process.cwd(), "prisma/seed/data.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw) as SeedData;

    // idempotent seed: clear tables first (order matters due to relations)
    await prisma.appointment.deleteMany();
    await prisma.prescription.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.medicationOption.deleteMany();
    await prisma.dosageOption.deleteMany();

    // options
    await prisma.medicationOption.createMany({
        data: data.medications.map((name) => ({ name })),
    });

    await prisma.dosageOption.createMany({
        data: data.dosages.map((value) => ({ value })),
    });

    // patients + related data
    for (const u of data.users) {
        const passwordHash = await bcrypt.hash(u.password, 10);

        const patient = await prisma.patient.create({
            data: {
                name: u.name,
                email: u.email,
                passwordHash,
            },
        });

        if (u.appointments?.length) {
            const rows = u.appointments.map((a) => {
                const startAt = new Date(a.datetime);
                if (Number.isNaN(startAt.getTime())) {
                    throw new Error(
                        `Invalid appointment datetime for ${u.email}: ${JSON.stringify(a)}`
                    );
                }
                return {
                    patientId: patient.id,
                    provider: a.provider,
                    startAt,
                    repeat: (a.repeat ?? "none") as any,
                    endsAt: null as Date | null,
                };
            });

            await prisma.appointment.createMany({ data: rows });
        }

        if (u.prescriptions?.length) {
            const rows = u.prescriptions.map((p) => {
                // Parse YYYY-MM-DD safely by forcing midnight UTC
                const refillDate = new Date(`${p.refill_on}T00:00:00.000Z`);
                if (Number.isNaN(refillDate.getTime())) {
                    throw new Error(
                        `Invalid prescription refill_on for ${u.email}: ${JSON.stringify(p)}`
                    );
                }

                return {
                    patientId: patient.id,
                    medication: p.medication,
                    dosage: p.dosage,
                    quantity: p.quantity,
                    refillDate,
                    refillSchedule: (p.refill_schedule ?? "monthly") as any,
                };

            });

            await prisma.prescription.createMany({ data: rows });
        }
    }

    console.log("✅ Seed complete");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
