"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Create a new client (admin creates the account)
export async function createClientAction(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const notes = formData.get("notes") as string;

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-12);

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
            name,
            role: "client",
        },
    });

    if (authError) {
        return { error: `Erreur lors de la création: ${authError.message}` };
    }

    // Update the profile with additional info
    if (authData.user) {
        await supabase
            .from("profiles")
            .update({
                phone,
                notes,
            })
            .eq("id", authData.user.id);
    }

    revalidatePath("/admin/clientes");
    redirect("/admin/clientes");
}

// Create a new update for a client
export async function createUpdateAction(formData: FormData) {
    const supabase = await createClient();

    const clientId = formData.get("client_id") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Non autorisé" };
    }

    const { error } = await supabase.from("client_updates").insert({
        client_id: clientId,
        admin_id: user.id,
        title,
        content,
    });

    if (error) {
        return { error: "Erreur lors de la création" };
    }

    revalidatePath(`/admin/clientes/${clientId}`);
    return { success: true };
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
        return { error: "Erreur lors de la mise à jour" };
    }

    revalidatePath(`/admin/clientes/${clientId}`);
    return { success: true };
}
