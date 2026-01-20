"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
            })
            .eq("id", authData.user.id);
    }

    revalidatePath("/admin/clientes");

    // Return success with credentials to show to admin
    return {
        success: true,
        credentials: {
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
