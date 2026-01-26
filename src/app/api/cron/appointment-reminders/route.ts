"use server";

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendAppointmentReminder } from "@/lib/email";

// Vercel Cron authentication
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
    // Verify cron secret (Vercel sends this header)
    const authHeader = request.headers.get("authorization");
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminClient = createAdminClient();

    // Get tomorrow's date range (in UTC)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowStart = new Date(tomorrow);
    tomorrowStart.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    try {
        // Fetch appointments for tomorrow with client info
        const { data: appointments, error } = await adminClient
            .from("appointments")
            .select(`
                id,
                appointment_date,
                appointment_type,
                notes,
                client_id,
                profiles!appointments_client_id_fkey (
                    id,
                    name,
                    email,
                    email_notifications
                )
            `)
            .gte("appointment_date", tomorrowStart.toISOString())
            .lte("appointment_date", tomorrowEnd.toISOString())
            .eq("completed", false);

        if (error) {
            console.error("Failed to fetch appointments:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!appointments || appointments.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No appointments for tomorrow",
                sent: 0
            });
        }

        // Send reminders to clients with notifications enabled
        let sent = 0;
        let skipped = 0;
        const errors: string[] = [];

        for (const appointment of appointments) {
            const client = appointment.profiles as unknown as {
                id: string;
                name: string;
                email: string;
                email_notifications: boolean;
            };

            if (!client || !client.email_notifications) {
                skipped++;
                continue;
            }

            const result = await sendAppointmentReminder({
                clientEmail: client.email,
                clientName: client.name,
                appointmentDate: appointment.appointment_date,
                appointmentType: appointment.appointment_type || "Tratamento",
                notes: appointment.notes,
                appointmentsUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://app.joterapeutacapilar.com'}/cliente/marcacoes`,
            });

            if (result.error) {
                errors.push(`${client.email}: ${result.error}`);
            } else {
                sent++;
            }
        }

        return NextResponse.json({
            success: true,
            sent,
            skipped,
            total: appointments.length,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error("Cron job error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
