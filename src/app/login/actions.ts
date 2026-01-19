"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "E-mail et mot de passe requis" };
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: "E-mail ou mot de passe incorrect" };
    }

    // Get user profile to determine redirect
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Erreur d'authentification" };
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    revalidatePath("/", "layout");

    // Redirect based on role
    if (profile?.role === "admin") {
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
