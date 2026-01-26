import { Resend } from "resend";
import { UpdateCategory } from "@/types/database";

// Lazy initialization to avoid errors when RESEND_API_KEY is not set
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY not configured - email notifications disabled");
        return null;
    }
    if (!resendClient) {
        resendClient = new Resend(process.env.RESEND_API_KEY);
    }
    return resendClient;
}

const CATEGORY_EMOJI: Record<UpdateCategory, string> = {
    evolucao: "📈",
    rotina: "📅",
    recomendacao: "💡",
    agendamento: "⏰",
    outro: "📝",
};

interface SendUpdateNotificationParams {
    clientEmail: string;
    clientName: string;
    updateTitle: string;
    updateContent: string;
    category: UpdateCategory;
    updateUrl: string;
}

/**
 * Envia email de notificação quando admin cria uma nova atualização
 */
export async function sendUpdateNotification({
    clientEmail,
    clientName,
    updateTitle,
    updateContent,
    category,
    updateUrl,
}: SendUpdateNotificationParams) {
    const categoryEmoji = CATEGORY_EMOJI[category];

    // Truncate content for preview (first 200 chars)
    const contentPreview = updateContent.length > 200
        ? updateContent.substring(0, 200) + "..."
        : updateContent;

    const resend = getResendClient();

    // If Resend is not configured, skip email silently
    if (!resend) {
        console.log("Email notification skipped - Resend not configured");
        return { success: true, skipped: true };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: "Jo Terapeuta Capilar <noreply@joterapeutacapilar.com>",
            to: [clientEmail],
            subject: `Nova atualização: ${updateTitle}`,
            html: getEmailTemplate({
                clientName,
                updateTitle,
                contentPreview,
                categoryEmoji,
                updateUrl,
            }),
        });

        if (error) {
            console.error("Failed to send email:", error);
            return { error: error.message };
        }

        return { success: true, messageId: data?.id };
    } catch (error) {
        console.error("Email send exception:", error);
        return { error: "Erro ao enviar email" };
    }
}

/**
 * Template HTML para email de notificação
 */
function getEmailTemplate({
    clientName,
    updateTitle,
    contentPreview,
    categoryEmoji,
    updateUrl,
}: {
    clientName: string;
    updateTitle: string;
    contentPreview: string;
    categoryEmoji: string;
    updateUrl: string;
}) {
    return `
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nova Atualização</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; color: #1f2937;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;">

                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #C4A77D 0%, #8B7355 100%); padding: 32px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                                Nova Atualização
                            </h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.5; color: #374151;">
                                Olá <strong>${clientName}</strong>,
                            </p>

                            <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5; color: #374151;">
                                A sua terapeuta capilar adicionou uma nova atualização ao seu perfil:
                            </p>

                            <div style="background-color: #f9fafb; border-left: 4px solid #C4A77D; padding: 20px; margin-bottom: 24px; border-radius: 4px;">
                                <h2 style="margin: 0 0 12px; font-size: 18px; font-weight: 600; color: #1f2937;">
                                    ${updateTitle}
                                </h2>
                                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                                    ${contentPreview}
                                </p>
                            </div>

                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 8px 0;">
                                        <a href="${updateUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #C4A77D 0%, #8B7355 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                                            Ver Atualização Completa
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 8px; font-size: 12px; line-height: 1.5; color: #9ca3af; text-align: center;">
                                Este email foi enviado porque tem notificações ativadas.
                            </p>
                            <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #9ca3af; text-align: center;">
                                Pode desativar notificações nas definições do seu perfil.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}

// ============================================
// APPOINTMENT EMAILS
// ============================================

interface SendAppointmentEmailParams {
    clientEmail: string;
    clientName: string;
    appointmentDate: string; // ISO date string
    appointmentType: string;
    notes?: string | null;
    appointmentsUrl: string;
}

/**
 * Formata data para exibição em português
 */
function formatDatePT(isoDate: string): string {
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    return date.toLocaleDateString('pt-PT', options);
}

/**
 * Formata apenas a data (sem hora)
 */
function formatDateOnlyPT(isoDate: string): string {
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };
    return date.toLocaleDateString('pt-PT', options);
}

/**
 * Formata apenas a hora
 */
function formatTimePT(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Envia email de confirmação de marcação
 */
export async function sendAppointmentConfirmation({
    clientEmail,
    clientName,
    appointmentDate,
    appointmentType,
    notes,
    appointmentsUrl,
}: SendAppointmentEmailParams) {
    const resend = getResendClient();

    if (!resend) {
        console.log("Email notification skipped - Resend not configured");
        return { success: true, skipped: true };
    }

    const formattedDate = formatDateOnlyPT(appointmentDate);
    const formattedTime = formatTimePT(appointmentDate);

    try {
        const { data, error } = await resend.emails.send({
            from: "Jo Terapeuta Capilar <noreply@app.joterapeutacapilar.com>",
            to: [clientEmail],
            subject: `Marcação confirmada - ${formattedDate}`,
            html: getAppointmentConfirmationTemplate({
                clientName,
                appointmentDate: formattedDate,
                appointmentTime: formattedTime,
                appointmentType,
                notes,
                appointmentsUrl,
            }),
        });

        if (error) {
            console.error("Failed to send appointment confirmation:", error);
            return { error: error.message };
        }

        return { success: true, messageId: data?.id };
    } catch (error) {
        console.error("Appointment confirmation email exception:", error);
        return { error: "Erro ao enviar email de confirmação" };
    }
}

/**
 * Envia email de lembrete de marcação
 */
export async function sendAppointmentReminder({
    clientEmail,
    clientName,
    appointmentDate,
    appointmentType,
    notes,
    appointmentsUrl,
}: SendAppointmentEmailParams) {
    const resend = getResendClient();

    if (!resend) {
        console.log("Email notification skipped - Resend not configured");
        return { success: true, skipped: true };
    }

    const formattedDate = formatDateOnlyPT(appointmentDate);
    const formattedTime = formatTimePT(appointmentDate);

    try {
        const { data, error } = await resend.emails.send({
            from: "Jo Terapeuta Capilar <noreply@app.joterapeutacapilar.com>",
            to: [clientEmail],
            subject: `Lembrete: Marcação amanhã - ${formattedTime}`,
            html: getAppointmentReminderTemplate({
                clientName,
                appointmentDate: formattedDate,
                appointmentTime: formattedTime,
                appointmentType,
                notes,
                appointmentsUrl,
            }),
        });

        if (error) {
            console.error("Failed to send appointment reminder:", error);
            return { error: error.message };
        }

        return { success: true, messageId: data?.id };
    } catch (error) {
        console.error("Appointment reminder email exception:", error);
        return { error: "Erro ao enviar email de lembrete" };
    }
}

/**
 * Template HTML para confirmação de marcação
 */
function getAppointmentConfirmationTemplate({
    clientName,
    appointmentDate,
    appointmentTime,
    appointmentType,
    notes,
    appointmentsUrl,
}: {
    clientName: string;
    appointmentDate: string;
    appointmentTime: string;
    appointmentType: string;
    notes?: string | null;
    appointmentsUrl: string;
}) {
    const notesSection = notes ? `
                            <div style="margin-top: 16px;">
                                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                                    <strong>Notas:</strong> ${notes}
                                </p>
                            </div>` : '';

    return `
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Marcação Confirmada</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; color: #1f2937;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;">

                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #C4A77D 0%, #8B7355 100%); padding: 32px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                                Marcação Confirmada
                            </h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.5; color: #374151;">
                                Olá <strong>${clientName}</strong>,
                            </p>

                            <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5; color: #374151;">
                                A sua marcação foi confirmada com sucesso!
                            </p>

                            <div style="background-color: #f9fafb; border-left: 4px solid #C4A77D; padding: 20px; margin-bottom: 24px; border-radius: 4px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding-bottom: 12px;">
                                            <p style="margin: 0; font-size: 14px; color: #6b7280;">Data</p>
                                            <p style="margin: 4px 0 0; font-size: 16px; font-weight: 600; color: #1f2937;">
                                                ${appointmentDate}
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-bottom: 12px;">
                                            <p style="margin: 0; font-size: 14px; color: #6b7280;">Hora</p>
                                            <p style="margin: 4px 0 0; font-size: 16px; font-weight: 600; color: #1f2937;">
                                                ${appointmentTime}
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p style="margin: 0; font-size: 14px; color: #6b7280;">Tipo de Sessão</p>
                                            <p style="margin: 4px 0 0; font-size: 16px; font-weight: 600; color: #1f2937;">
                                                ${appointmentType}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                ${notesSection}
                            </div>

                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 8px 0;">
                                        <a href="${appointmentsUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #C4A77D 0%, #8B7355 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                                            Ver Minhas Marcações
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 8px; font-size: 12px; line-height: 1.5; color: #9ca3af; text-align: center;">
                                Se precisar remarcar ou cancelar, entre em contacto connosco.
                            </p>
                            <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #9ca3af; text-align: center;">
                                Jo Terapeuta Capilar
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}

/**
 * Template HTML para lembrete de marcação
 */
function getAppointmentReminderTemplate({
    clientName,
    appointmentDate,
    appointmentTime,
    appointmentType,
    notes,
    appointmentsUrl,
}: {
    clientName: string;
    appointmentDate: string;
    appointmentTime: string;
    appointmentType: string;
    notes?: string | null;
    appointmentsUrl: string;
}) {
    const notesSection = notes ? `
                            <div style="margin-top: 16px;">
                                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                                    <strong>Notas:</strong> ${notes}
                                </p>
                            </div>` : '';

    return `
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lembrete de Marcação</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; color: #1f2937;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;">

                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #C4A77D 0%, #8B7355 100%); padding: 32px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                                Lembrete de Marcação
                            </h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.5; color: #374151;">
                                Olá <strong>${clientName}</strong>,
                            </p>

                            <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5; color: #374151;">
                                Este é um lembrete da sua marcação <strong>amanhã</strong>:
                            </p>

                            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin-bottom: 24px; border-radius: 4px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding-bottom: 12px;">
                                            <p style="margin: 0; font-size: 14px; color: #92400e;">Data</p>
                                            <p style="margin: 4px 0 0; font-size: 16px; font-weight: 600; color: #78350f;">
                                                ${appointmentDate}
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-bottom: 12px;">
                                            <p style="margin: 0; font-size: 14px; color: #92400e;">Hora</p>
                                            <p style="margin: 4px 0 0; font-size: 16px; font-weight: 600; color: #78350f;">
                                                ${appointmentTime}
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p style="margin: 0; font-size: 14px; color: #92400e;">Tipo de Sessão</p>
                                            <p style="margin: 4px 0 0; font-size: 16px; font-weight: 600; color: #78350f;">
                                                ${appointmentType}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                ${notesSection}
                            </div>

                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 8px 0;">
                                        <a href="${appointmentsUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #C4A77D 0%, #8B7355 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                                            Ver Minhas Marcações
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 8px; font-size: 12px; line-height: 1.5; color: #9ca3af; text-align: center;">
                                Se precisar remarcar ou cancelar, entre em contacto connosco o mais breve possível.
                            </p>
                            <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #9ca3af; text-align: center;">
                                Jo Terapeuta Capilar
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}
