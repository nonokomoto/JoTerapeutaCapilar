"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createPostAction(formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const published = formData.get("published") === "true";

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Non autorisé" };
    }

    const { error } = await supabase.from("posts").insert({
        admin_id: user.id,
        title,
        content,
        published,
    });

    if (error) {
        return { error: "Erreur lors de la création" };
    }

    revalidatePath("/admin/posts");
    redirect("/admin/posts");
}

export async function updatePostAction(formData: FormData) {
    const supabase = await createClient();

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const published = formData.get("published") === "true";

    const { error } = await supabase
        .from("posts")
        .update({
            title,
            content,
            published,
        })
        .eq("id", id);

    if (error) {
        return { error: "Erreur lors de la mise à jour" };
    }

    revalidatePath("/admin/posts");
    return { success: true };
}

export async function deletePostAction(formData: FormData) {
    const supabase = await createClient();

    const id = formData.get("id") as string;

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
        return { error: "Erreur lors de la suppression" };
    }

    revalidatePath("/admin/posts");
    return { success: true };
}

export async function togglePublishAction(formData: FormData) {
    const supabase = await createClient();

    const id = formData.get("id") as string;
    const published = formData.get("published") === "true";

    await supabase
        .from("posts")
        .update({ published: !published })
        .eq("id", id);

    revalidatePath("/admin/posts");
}
