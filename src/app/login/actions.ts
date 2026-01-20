"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email e palavra-passe são obrigatórios" };
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: "Email ou palavra-passe incorretos" };
    }

    // Get user profile to determine redirect
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Erro de autenticação" };
    }

    // Use admin client to bypass RLS recursion bug when checking role
    const adminClient = createAdminClient();
    const { data: profile, error: profileError } = await adminClient
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
        // Profile not found - sign out and show error
        await supabase.auth.signOut();
        return { error: "Perfil não encontrado. Contacte o administrador." };
    }

    revalidatePath("/", "layout");

    // Redirect based on role
    if (profile.role === "admin") {
        redirect("/admin");
    } else {
        redirect("/cliente");
    }
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
}
