"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createPostAction(formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const image_url = formData.get("image_url") as string | null;
    const published = formData.get("published") === "true";

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Não autorizado" };
    }

    const { error } = await supabase.from("posts").insert({
        admin_id: user.id,
        title,
        content,
        image_url: image_url || null,
        published,
    });

    if (error) {
        return { error: "Erro ao criar publicação" };
    }

    revalidatePath("/admin/posts");
    redirect("/admin/posts");
}

export async function updatePostAction(formData: FormData) {
    const supabase = await createClient();

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const image_url = formData.get("image_url") as string | null;
    const published = formData.get("published") === "true";

    const { error } = await supabase
        .from("posts")
        .update({
            title,
            content,
            image_url: image_url || null,
            published,
        })
        .eq("id", id);

    if (error) {
        return { error: "Erro ao atualizar publicação" };
    }

    revalidatePath("/admin/posts");
    return { success: true };
}

export async function deletePostAction(formData: FormData) {
    const supabase = await createClient();

    const id = formData.get("id") as string;

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
        return { error: "Erro ao eliminar publicação" };
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
