"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendUpdateNotification, sendAppointmentConfirmation } from "@/lib/email";
import { UpdateCategory } from "@/types/database";

// Create a new client (admin creates the account)
export async function createClientAction(formData: FormData) {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // Verify current user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Não autorizado" };
    }

    const { data: profile } = await adminClient
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        return { error: "Apenas administradores podem criar clientes" };
    }

    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const notes = formData.get("notes") as string;
    const firstVisitDate = formData.get("first_visit_date") as string;

    // Generate a temporary password (12 characters)
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();

    // Create user with temporary password
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
            name,
            role: "client",
        },
    });

    if (authError) {
        if (authError.message.includes("already been registered")) {
            return { error: "Este email já está registado" };
        }
        return { error: `Erro ao criar cliente: ${authError.message}` };
    }

    // Update the profile with additional info
    if (authData.user) {
        await adminClient
            .from("profiles")
            .update({
                phone,
                notes,
                first_visit_date: firstVisitDate || null,
                // Se há primeira visita, também é a última visita inicial
                last_appointment_date: firstVisitDate || null,
            })
            .eq("id", authData.user.id);
    }

    revalidatePath("/admin/clientes");

    // Return success with credentials to show to admin
    return {
        success: true,
        credentials: {
            id: authData.user.id,
            email,
            password: tempPassword,
        }
    };
}

// Create a new update for a client (with optional attachments)
export async function createUpdateAction(formData: FormData) {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    const clientId = formData.get("client_id") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = (formData.get("category") as string) || "outro";
    const files = formData.getAll("files") as File[];

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Não autorizado" };
    }

    // Create the update first
    const { data: update, error } = await supabase
        .from("client_updates")
        .insert({
            client_id: clientId,
            admin_id: user.id,
            title,
            content,
            category,
        })
        .select("id")
        .single();

    if (error || !update) {
        return { error: "Erro ao criar atualização" };
    }

    // Upload files if any
    if (files && files.length > 0) {
        for (const file of files) {
            // Skip empty file inputs
            if (!file || file.size === 0) continue;

            // Validate file type
            const isImage = file.type.startsWith("image/");
            const isPdf = file.type === "application/pdf";

            if (!isImage && !isPdf) {
                continue; // Skip invalid files
            }

            // Generate unique filename
            const ext = file.name.split(".").pop();
            const fileName = `${clientId}/${update.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await adminClient.storage
                .from("attachments")
                .upload(fileName, file, {
                    contentType: file.type,
                    upsert: false,
                });

            if (uploadError) {
                console.error("Upload error:", uploadError);
                continue;
            }

            // Get public URL
            const { data: urlData } = adminClient.storage
                .from("attachments")
                .getPublicUrl(fileName);

            // Create attachment record
            await adminClient.from("attachments").insert({
                update_id: update.id,
                file_url: urlData.publicUrl,
                file_name: file.name,
                file_type: isImage ? "image" : "pdf",
                file_size: file.size,
            });
        }
    }

    // Send email notification if client has notifications enabled
    try {
        const { data: client } = await adminClient
            .from("profiles")
            .select("email, name, email_notifications")
            .eq("id", clientId)
            .single();

        if (client && client.email_notifications) {
            const updateUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://app.joterapeutacapilar.com'}/cliente/atualizacoes`;

            await sendUpdateNotification({
                clientEmail: client.email,
                clientName: client.name,
                updateTitle: title,
                updateContent: content,
                category: category as UpdateCategory,
                updateUrl,
            });
        }
    } catch (emailError) {
        // Log error but don't fail the update creation
        console.error("Failed to send notification email:", emailError);
    }

    revalidatePath(`/admin/clientes/${clientId}`);
    return { success: true };
}

// Generate new temporary password for client
export async function resetClientPasswordAction(clientId: string) {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // Verify current user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Não autorizado" };
    }

    const { data: profile } = await adminClient
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        return { error: "Apenas administradores podem alterar palavras-passe" };
    }

    // Generate new temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();

    // Update user password
    const { error: updateError } = await adminClient.auth.admin.updateUserById(
        clientId,
        { password: tempPassword }
    );

    if (updateError) {
        return { error: `Erro ao atualizar palavra-passe: ${updateError.message}` };
    }

    return {
        success: true,
        password: tempPassword,
    };
}

// Update client notes
export async function updateClientNotesAction(formData: FormData) {
    const supabase = await createClient();

    const clientId = formData.get("client_id") as string;
    const notes = formData.get("notes") as string;

    const { error } = await supabase
        .from("profiles")
        .update({ notes })
        .eq("id", clientId);

    if (error) {
        return { error: "Erro ao atualizar notas" };
    }

    revalidatePath(`/admin/clientes/${clientId}`);
    return { success: true };
}

// Update client profile (name, email, phone, notes)
export async function updateClientAction(formData: FormData) {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // Verify current user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Não autorizado" };
    }

    const { data: adminProfile } = await adminClient
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (adminProfile?.role !== "admin") {
        return { error: "Apenas administradores podem editar clientes" };
    }

    const clientId = formData.get("client_id") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const notes = formData.get("notes") as string;

    // Get current client data
    const { data: currentClient } = await adminClient
        .from("profiles")
        .select("email")
        .eq("id", clientId)
        .single();

    if (!currentClient) {
        return { error: "Cliente não encontrado" };
    }

    // If email changed, update in auth
    if (email !== currentClient.email) {
        const { error: authError } = await adminClient.auth.admin.updateUserById(
            clientId,
            { email }
        );

        if (authError) {
            if (authError.message.includes("already been registered") || authError.message.includes("already exists")) {
                return { error: "Este email já está em uso por outro utilizador" };
            }
            return { error: `Erro ao atualizar email: ${authError.message}` };
        }
    }

    // Update profile in database
    const { error: profileError } = await adminClient
        .from("profiles")
        .update({
            name,
            email,
            phone: phone || null,
            notes: notes || null,
        })
        .eq("id", clientId);

    if (profileError) {
        return { error: "Erro ao atualizar perfil" };
    }

    revalidatePath(`/admin/clientes/${clientId}`);
    revalidatePath("/admin/clientes");
    return { success: true };
}

// Delete client (and all related data)
export async function deleteClientAction(clientId: string) {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // Verify current user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Não autorizado" };
    }

    const { data: adminProfile } = await adminClient
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (adminProfile?.role !== "admin") {
        return { error: "Apenas administradores podem eliminar clientes" };
    }

    // Verify target is a client and not an admin
    const { data: clientProfile } = await adminClient
        .from("profiles")
        .select("role, name")
        .eq("id", clientId)
        .single();

    if (!clientProfile) {
        return { error: "Cliente não encontrado" };
    }

    if (clientProfile.role !== "client") {
        return { error: "Não é possível eliminar administradores" };
    }

    // Get all updates for this client to delete storage files
    const { data: updates } = await adminClient
        .from("client_updates")
        .select("id, attachments(file_url)")
        .eq("client_id", clientId);

    // Delete files from storage
    if (updates) {
        for (const update of updates) {
            if (update.attachments && Array.isArray(update.attachments)) {
                for (const att of update.attachments) {
                    // Extract path from URL
                    const url = new URL(att.file_url);
                    const pathParts = url.pathname.split("/storage/v1/object/public/attachments/");
                    if (pathParts[1]) {
                        await adminClient.storage
                            .from("attachments")
                            .remove([pathParts[1]]);
                    }
                }
            }
        }
    }

    // Delete attachments (cascade should handle this, but being explicit)
    if (updates) {
        const updateIds = updates.map(u => u.id);
        if (updateIds.length > 0) {
            await adminClient
                .from("attachments")
                .delete()
                .in("update_id", updateIds);
        }
    }

    // Delete updates
    await adminClient
        .from("client_updates")
        .delete()
        .eq("client_id", clientId);

    // Delete profile
    const { error: profileError } = await adminClient
        .from("profiles")
        .delete()
        .eq("id", clientId);

    if (profileError) {
        return { error: "Erro ao eliminar perfil" };
    }

    // Delete from auth
    const { error: authError } = await adminClient.auth.admin.deleteUser(clientId);

    if (authError) {
        console.error("Error deleting auth user:", authError);
        // Profile already deleted, so we continue
    }

    revalidatePath("/admin/clientes");
    revalidatePath("/admin");
    return { success: true };
}

/**
 * Atualiza campos de marcação no perfil do cliente
 */
export async function updateClientAppointments(
    clientId: string,
    data: {
        first_visit_date?: string | null;
        last_appointment_date?: string | null;
        next_appointment_date?: string | null;
    }
) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", clientId);

    if (error) {
        return { error: `Erro ao atualizar marcações: ${error.message}` };
    }

    revalidatePath(`/admin/clientes/${clientId}`);
    revalidatePath("/admin/clientes");
    return { success: true };
}

/**
 * Cria um registo no histórico de marcações (appointments)
 * Gera sempre update automático para o cliente (agendada ou realizada)
 */
export async function createAppointment(data: {
    client_id: string;
    appointment_date: string;
    appointment_type?: string;
    notes?: string;
    completed?: boolean;
}) {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    const { data: appointment, error } = await supabase
        .from("appointments")
        .insert(data)
        .select()
        .single();

    if (error) {
        return { error: `Erro ao criar registo de marcação: ${error.message}` };
    }

    // Criar update automático para o cliente
    if (appointment) {
        await createUpdateForNewAppointment({
            client_id: data.client_id,
            appointment_date: data.appointment_date,
            appointment_type: data.appointment_type || "tratamento",
            notes: data.notes || null,
            completed: data.completed || false,
        });
    }

    // Enviar email de confirmação se marcação for futura e cliente tem notificações ativas
    if (appointment && !data.completed) {
        try {
            const { data: client } = await adminClient
                .from("profiles")
                .select("email, name, email_notifications")
                .eq("id", data.client_id)
                .single();

            if (client && client.email_notifications) {
                const appointmentsUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://app.joterapeutacapilar.com'}/cliente/marcacoes`;

                await sendAppointmentConfirmation({
                    clientEmail: client.email,
                    clientName: client.name,
                    appointmentDate: data.appointment_date,
                    appointmentType: data.appointment_type || "Tratamento",
                    notes: data.notes,
                    appointmentsUrl,
                });
            }
        } catch (emailError) {
            console.error("Failed to send appointment confirmation email:", emailError);
        }
    }

    // Atualizar campos do profile automaticamente
    await syncProfileAppointments(data.client_id);

    revalidatePath(`/admin/clientes/${data.client_id}`);
    revalidatePath("/admin/clientes");
    return { success: true, data: appointment };
}

/**
 * Atualiza uma marcação existente
 * Se mudar para realizada, gera update automático para o cliente
 */
export async function updateAppointment(
    appointmentId: string,
    data: {
        appointment_date?: string;
        appointment_type?: string;
        notes?: string;
        completed?: boolean;
    }
) {
    const supabase = await createClient();

    // Buscar dados completos antes de atualizar
    const { data: currentAppointment } = await supabase
        .from("appointments")
        .select("client_id, appointment_date, appointment_type, notes, completed")
        .eq("id", appointmentId)
        .single();

    if (!currentAppointment) {
        return { error: "Marcação não encontrada" };
    }

    const { error } = await supabase
        .from("appointments")
        .update(data)
        .eq("id", appointmentId);

    if (error) {
        return { error: `Erro ao atualizar marcação: ${error.message}` };
    }

    // Se estava não-realizada e agora está realizada, criar update automático
    if (data.completed === true && !currentAppointment.completed) {
        await createAutoUpdateForAppointment(appointmentId, {
            client_id: currentAppointment.client_id,
            appointment_date: data.appointment_date || currentAppointment.appointment_date,
            appointment_type: data.appointment_type || currentAppointment.appointment_type,
            notes: data.notes !== undefined ? data.notes : currentAppointment.notes,
        });
    }

    // Atualizar campos do profile automaticamente
    await syncProfileAppointments(currentAppointment.client_id);

    revalidatePath(`/admin/clientes/${currentAppointment.client_id}`);
    revalidatePath("/admin/clientes");
    return { success: true };
}

/**
 * Marca uma marcação como realizada ou não realizada
 * Quando marcada como realizada, cria automaticamente uma atualização para o cliente
 */
export async function toggleAppointmentComplete(appointmentId: string, completed: boolean) {
    const supabase = await createClient();

    // Buscar dados completos da marcação
    const { data: appointment } = await supabase
        .from("appointments")
        .select("client_id, appointment_date, appointment_type, notes")
        .eq("id", appointmentId)
        .single();

    if (!appointment) {
        return { error: "Marcação não encontrada" };
    }

    const { error } = await supabase
        .from("appointments")
        .update({ completed })
        .eq("id", appointmentId);

    if (error) {
        return { error: `Erro ao atualizar marcação: ${error.message}` };
    }

    // Se marcada como realizada, criar update automático para o cliente
    if (completed) {
        await createAutoUpdateForAppointment(appointmentId, appointment);
    }

    // Atualizar campos do profile automaticamente
    await syncProfileAppointments(appointment.client_id);

    revalidatePath(`/admin/clientes/${appointment.client_id}`);
    revalidatePath("/admin/clientes");
    return { success: true };
}

/**
 * Cria uma atualização quando uma nova marcação é agendada
 */
async function createUpdateForNewAppointment(appointment: {
    client_id: string;
    appointment_date: string;
    appointment_type: string;
    notes: string | null;
    completed: boolean;
}) {
    const supabase = await createClient();

    // Obter admin_id (utilizador atual)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Formatar data em PT-PT
    const date = new Date(appointment.appointment_date);
    const dateFormatted = date.toLocaleDateString("pt-PT", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
    const timeFormatted = date.toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit"
    });

    // Template diferente para agendada vs realizada
    let title: string;
    let content: string;

    if (appointment.completed) {
        title = "Consulta Realizada";
        content = `O agendamento de ${dateFormatted} foi concluído com sucesso.`;
    } else {
        title = "Agendamento Confirmado";
        content = `O seu agendamento está confirmado para ${dateFormatted} às ${timeFormatted}.`;
    }

    // Adicionar notas se existirem
    if (appointment.notes) {
        content += `\n\nObservações: ${appointment.notes}`;
    }

    // Criar a update
    await supabase.from("client_updates").insert({
        client_id: appointment.client_id,
        admin_id: user.id,
        title,
        content
    });
}

/**
 * Cria uma atualização automática quando uma marcação é concluída (toggle)
 */
async function createAutoUpdateForAppointment(
    appointmentId: string,
    appointment: {
        client_id: string;
        appointment_date: string;
        appointment_type: string;
        notes: string | null;
    }
) {
    const supabase = await createClient();

    // Verificar se já existe update de "realizado" para evitar duplicados
    const { data: existingUpdate } = await supabase
        .from("client_updates")
        .select("id")
        .eq("client_id", appointment.client_id)
        .ilike("title", `%realizado%`)
        .gte("created_at", new Date(Date.now() - 60000).toISOString())
        .single();

    if (existingUpdate) {
        return;
    }

    // Obter admin_id (utilizador atual)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Formatar data em PT-PT
    const date = new Date(appointment.appointment_date);
    const dateFormatted = date.toLocaleDateString("pt-PT", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    // Template da update
    const title = "Consulta Realizada";
    let content = `O agendamento de ${dateFormatted} foi concluído com sucesso.`;

    // Adicionar notas se existirem
    if (appointment.notes) {
        content += `\n\nObservações: ${appointment.notes}`;
    }

    // Criar a update
    await supabase.from("client_updates").insert({
        client_id: appointment.client_id,
        admin_id: user.id,
        title,
        content
    });
}

/**
 * Cria uma atualização automática quando uma marcação é cancelada (eliminada)
 */
async function createAutoUpdateForCancelledAppointment(
    appointment: {
        client_id: string;
        appointment_date: string;
        appointment_type: string;
        notes: string | null;
    }
) {
    const supabase = await createClient();

    // Obter admin_id (utilizador atual)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Formatar data em PT-PT
    const date = new Date(appointment.appointment_date);
    const dateFormatted = date.toLocaleDateString("pt-PT", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
    const timeFormatted = date.toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit"
    });

    // Template da update
    const title = "Agendamento Cancelado";
    let content = `O agendamento de ${dateFormatted} às ${timeFormatted} foi cancelado.`;

    // Adicionar notas se existirem
    if (appointment.notes) {
        content += `\n\nMotivo/Notas: ${appointment.notes}`;
    }

    // Criar a update
    await supabase.from("client_updates").insert({
        client_id: appointment.client_id,
        admin_id: user.id,
        title,
        content
    });
}


/**
 * Elimina uma marcação
 */
export async function deleteAppointment(appointmentId: string) {
    const supabase = await createClient();

    // Buscar dados completos antes de eliminar para criar update
    const { data: appointment } = await supabase
        .from("appointments")
        .select("client_id, appointment_date, appointment_type, notes")
        .eq("id", appointmentId)
        .single();

    if (!appointment) {
        return { error: "Marcação não encontrada" };
    }

    // Criar atualização automática de cancelamento
    await createAutoUpdateForCancelledAppointment(appointment);

    const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", appointmentId);

    if (error) {
        return { error: `Erro ao eliminar marcação: ${error.message}` };
    }

    // Atualizar campos do profile automaticamente
    await syncProfileAppointments(appointment.client_id);

    revalidatePath(`/admin/clientes/${appointment.client_id}`);
    revalidatePath("/admin/clientes");
    return { success: true };
}

/**
 * Sincroniza os campos de marcação no profile com base no histórico
 * - first_visit_date: primeira marcação completa (mais antiga)
 * - last_appointment_date: última marcação completa (mais recente)
 * - next_appointment_date: próxima marcação não completa (mais próxima no futuro)
 */
async function syncProfileAppointments(clientId: string) {
    const supabase = await createClient();

    // Buscar todas as marcações do cliente
    const { data: appointments } = await supabase
        .from("appointments")
        .select("appointment_date, completed")
        .eq("client_id", clientId)
        .order("appointment_date", { ascending: true });

    if (!appointments) return;

    const now = new Date();
    const completed = appointments.filter(apt => apt.completed);
    const upcoming = appointments.filter(
        apt => !apt.completed && new Date(apt.appointment_date) >= now
    );

    const first_visit_date = completed.length > 0 ? completed[0].appointment_date : null;
    const last_appointment_date = completed.length > 0
        ? completed[completed.length - 1].appointment_date
        : null;
    const next_appointment_date = upcoming.length > 0 ? upcoming[0].appointment_date : null;

    // Atualizar profile
    await supabase
        .from("profiles")
        .update({
            first_visit_date,
            last_appointment_date,
            next_appointment_date,
        })
        .eq("id", clientId);
}

/**
 * Busca todas as marcações de um cliente
 */
export async function getClientAppointments(clientId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("client_id", clientId)
        .order("appointment_date", { ascending: false });

    if (error) {
        return { error: `Erro ao buscar marcações: ${error.message}` };
    }

    return { success: true, data: data || [] };
}

/**
 * Elimina uma atualização de cliente
 */
export async function deleteClientUpdateAction(updateId: string, clientId: string) {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // Verify current user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Não autorizado" };
    }

    // Get attachments to delete files
    const { data: update } = await adminClient
        .from("client_updates")
        .select("id, attachments(file_url)")
        .eq("id", updateId)
        .single();

    if (update && update.attachments) {
        for (const att of update.attachments) {
            // Extract path from URL
            const url = new URL(att.file_url);
            const pathParts = url.pathname.split("/storage/v1/object/public/attachments/");
            if (pathParts[1]) {
                await adminClient.storage
                    .from("attachments")
                    .remove([pathParts[1]]);
            }
        }
    }

    // Delete attachments (cascade via database usually, but safe to be explicit if not)
    await adminClient
        .from("attachments")
        .delete()
        .eq("update_id", updateId);

    // Delete the update
    const { error } = await supabase
        .from("client_updates")
        .delete()
        .eq("id", updateId);

    if (error) {
        return { error: `Erro ao eliminar atualização: ${error.message}` };
    }

    revalidatePath(`/admin/clientes/${clientId}`);
    return { success: true };
}

/**
 * Atualiza uma atualização de cliente existente
 */
export async function updateClientUpdateAction(formData: FormData) {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    const updateId = formData.get("update_id") as string;
    const clientId = formData.get("client_id") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = (formData.get("category") as string) || "outro";
    const files = formData.getAll("files") as File[];
    const removedFileIds = formData.getAll("removed_files") as string[];

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Não autorizado" };
    }

    // Update the record
    const { error } = await supabase
        .from("client_updates")
        .update({
            title,
            content,
            category,
        })
        .eq("id", updateId);

    if (error) {
        return { error: "Erro ao editar atualização" };
    }

    // Remove deleted files
    if (removedFileIds.length > 0) {
        // Get files to delete from storage
        const { data: attachments } = await adminClient
            .from("attachments")
            .select("file_url")
            .in("id", removedFileIds);

        if (attachments) {
            for (const att of attachments) {
                const url = new URL(att.file_url);
                const pathParts = url.pathname.split("/storage/v1/object/public/attachments/");
                if (pathParts[1]) {
                    await adminClient.storage.from("attachments").remove([pathParts[1]]);
                }
            }
        }

        await adminClient
            .from("attachments")
            .delete()
            .in("id", removedFileIds);
    }

    // Upload new files
    if (files && files.length > 0) {
        for (const file of files) {
            // Skip empty file inputs
            if (!file || file.size === 0) continue;

            const isImage = file.type.startsWith("image/");
            const isPdf = file.type === "application/pdf";

            if (!isImage && !isPdf) continue;

            const ext = file.name.split(".").pop();
            const fileName = `${clientId}/${updateId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

            const { error: uploadError } = await adminClient.storage
                .from("attachments")
                .upload(fileName, file, {
                    contentType: file.type,
                    upsert: false,
                });

            if (uploadError) {
                console.error("Upload error:", uploadError);
                continue;
            }

            const { data: urlData } = adminClient.storage
                .from("attachments")
                .getPublicUrl(fileName);

            await adminClient.from("attachments").insert({
                update_id: updateId,
                file_url: urlData.publicUrl,
                file_name: file.name,
                file_type: isImage ? "image" : "pdf",
                file_size: file.size,
            });
        }
    }

    revalidatePath(`/admin/clientes/${clientId}`);
    return { success: true };
}

/**
 * Inline update - apenas título, conteúdo e categoria (sem files)
 * Para autosave rápido durante edição inline
 */
export async function inlineUpdateAction(
    updateId: string,
    data: { title?: string; content?: string; category?: string }
) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Não autorizado" };
    }

    // Verify admin role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        return { error: "Apenas administradores podem editar" };
    }

    // Filter out undefined values (only update provided fields)
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.category !== undefined) updateData.category = data.category;

    if (Object.keys(updateData).length === 0) {
        return { error: "Nenhum campo para atualizar" };
    }

    const { error } = await supabase
        .from("client_updates")
        .update(updateData)
        .eq("id", updateId);

    if (error) {
        return { error: error.message };
    }

    // Get client_id for revalidation
    const { data: update } = await supabase
        .from("client_updates")
        .select("client_id")
        .eq("id", updateId)
        .single();

    if (update) {
        revalidatePath(`/admin/clientes/${update.client_id}`);
    }

    return { success: true };
}

/**
 * Alterna o estado de "Gosto" de uma atualização (para o cliente)
 */
export async function toggleUpdateLikeAction(updateId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Não autorizado" };
    }

    // Get current state
    const { data: update } = await supabase
        .from("client_updates")
        .select("client_liked")
        .eq("id", updateId)
        .single();

    if (!update) return { error: "Atualização não encontrada" };

    const newState = !update.client_liked;

    const { error } = await supabase
        .from("client_updates")
        .update({ client_liked: newState })
        .eq("id", updateId);

    if (error) {
        return { error: "Erro ao atualizar estado" };
    }

    revalidatePath("/cliente/atualizacoes");
    return { success: true, liked: newState };
}

/**
 * Cria uma nova comparação antes/depois
 */
export async function createBeforeAfterComparison(formData: FormData) {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Não autorizado" };
    }

    const clientId = formData.get("client_id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const beforeDate = formData.get("before_date") as string;
    const afterDate = formData.get("after_date") as string;
    const isFeatured = formData.get("is_featured") === "on";
    const beforeImage = formData.get("before_image") as File;
    const afterImage = formData.get("after_image") as File;

    if (!beforeImage || !afterImage || beforeImage.size === 0 || afterImage.size === 0) {
        return { error: "Ambas as imagens são obrigatórias" };
    }

    // Upload before image
    const beforeExt = beforeImage.name.split(".").pop();
    const beforeFileName = `${clientId}/before-after/${Date.now()}-before.${beforeExt}`;

    const { error: beforeUploadError } = await adminClient.storage
        .from("attachments")
        .upload(beforeFileName, beforeImage, {
            contentType: beforeImage.type,
            upsert: false,
        });

    if (beforeUploadError) {
        return { error: `Erro ao carregar imagem 'antes': ${beforeUploadError.message}` };
    }

    const { data: beforeUrlData } = adminClient.storage
        .from("attachments")
        .getPublicUrl(beforeFileName);

    // Upload after image
    const afterExt = afterImage.name.split(".").pop();
    const afterFileName = `${clientId}/before-after/${Date.now()}-after.${afterExt}`;

    const { error: afterUploadError } = await adminClient.storage
        .from("attachments")
        .upload(afterFileName, afterImage, {
            contentType: afterImage.type,
            upsert: false,
        });

    if (afterUploadError) {
        return { error: `Erro ao carregar imagem 'depois': ${afterUploadError.message}` };
    }

    const { data: afterUrlData } = adminClient.storage
        .from("attachments")
        .getPublicUrl(afterFileName);

    // If this is featured, remove featured from others
    if (isFeatured) {
        await adminClient
            .from("before_after_comparisons")
            .update({ is_featured: false })
            .eq("client_id", clientId);
    }

    // Create comparison record
    const { error: insertError } = await adminClient
        .from("before_after_comparisons")
        .insert({
            client_id: clientId,
            admin_id: user.id,
            title: title || null,
            description: description || null,
            before_image_url: beforeUrlData.publicUrl,
            before_date: beforeDate,
            after_image_url: afterUrlData.publicUrl,
            after_date: afterDate,
            is_featured: isFeatured,
        });

    if (insertError) {
        return { error: `Erro ao criar comparação: ${insertError.message}` };
    }

    // Create client update for evolution
    const beforeDateFormatted = new Date(beforeDate).toLocaleDateString("pt-PT", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
    const afterDateFormatted = new Date(afterDate).toLocaleDateString("pt-PT", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const updateTitle = title || "Nova comparação de evolução";
    const updateContent = `Adicionada nova comparação antes/depois do seu tratamento.\n\n**Período:** ${beforeDateFormatted} → ${afterDateFormatted}${description ? `\n\n**Observações:** ${description}` : ""}`;

    const { data: update } = await adminClient
        .from("client_updates")
        .insert({
            client_id: clientId,
            admin_id: user.id,
            title: updateTitle,
            content: updateContent,
            category: "evolucao",
        })
        .select("id")
        .single();

    // Add images as attachments to the update
    if (update) {
        await adminClient.from("attachments").insert([
            {
                update_id: update.id,
                file_url: beforeUrlData.publicUrl,
                file_name: `antes-${beforeDate}.${beforeExt}`,
                file_type: "image",
                file_size: beforeImage.size,
            },
            {
                update_id: update.id,
                file_url: afterUrlData.publicUrl,
                file_name: `depois-${afterDate}.${afterExt}`,
                file_type: "image",
                file_size: afterImage.size,
            },
        ]);
    }

    revalidatePath(`/admin/clientes/${clientId}`);
    revalidatePath("/cliente");
    revalidatePath("/cliente/evolucao");
    revalidatePath("/cliente/atualizacoes");
    return { success: true };
}

/**
 * Elimina uma comparação antes/depois
 */
export async function deleteBeforeAfterComparison(comparisonId: string) {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Não autorizado" };
    }

    // Get comparison to delete images
    const { data: comparison } = await adminClient
        .from("before_after_comparisons")
        .select("client_id, before_image_url, after_image_url")
        .eq("id", comparisonId)
        .single();

    if (!comparison) {
        return { error: "Comparação não encontrada" };
    }

    // Delete images from storage
    for (const imageUrl of [comparison.before_image_url, comparison.after_image_url]) {
        try {
            const url = new URL(imageUrl);
            const pathParts = url.pathname.split("/storage/v1/object/public/attachments/");
            if (pathParts[1]) {
                await adminClient.storage.from("attachments").remove([pathParts[1]]);
            }
        } catch (e) {
            console.error("Error deleting image:", e);
        }
    }

    // Delete comparison record
    const { error } = await adminClient
        .from("before_after_comparisons")
        .delete()
        .eq("id", comparisonId);

    if (error) {
        return { error: `Erro ao eliminar: ${error.message}` };
    }

    revalidatePath(`/admin/clientes/${comparison.client_id}`);
    revalidatePath("/cliente");
    revalidatePath("/cliente/evolucao");
    return { success: true };
}

/**
 * Alterna o estado de destaque de uma comparação
 */
export async function toggleFeaturedComparison(comparisonId: string, clientId: string, featured: boolean) {
    const adminClient = createAdminClient();

    // If setting as featured, remove featured from others first
    if (featured) {
        await adminClient
            .from("before_after_comparisons")
            .update({ is_featured: false })
            .eq("client_id", clientId);
    }

    const { error } = await adminClient
        .from("before_after_comparisons")
        .update({ is_featured: featured })
        .eq("id", comparisonId);

    if (error) {
        return { error: `Erro ao atualizar: ${error.message}` };
    }

    revalidatePath(`/admin/clientes/${clientId}`);
    revalidatePath("/cliente");
    revalidatePath("/cliente/evolucao");
    return { success: true };
}
