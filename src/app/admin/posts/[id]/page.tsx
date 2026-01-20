import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditPostForm } from "./EditPostForm";

export default async function EditarPost({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const supabase = await createClient();
    const { id } = await params;

    const { data: post } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

    if (!post) {
        notFound();
    }

    return <EditPostForm post={post} />;
}
