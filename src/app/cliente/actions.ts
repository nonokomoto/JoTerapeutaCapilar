"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ReactionType, ReactionCount } from "@/types/database";

/**
 * Marca uma atualização como lida pelo cliente
 * Só marca se ainda não foi lida (client_read_at IS NULL)
 */
export async function markUpdateAsRead(updateId: string) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Não autenticado" };
    }

    // Update client_read_at to now, only if it's currently NULL
    const { error } = await supabase
        .from("client_updates")
        .update({ client_read_at: new Date().toISOString() })
        .eq("id", updateId)
        .eq("client_id", user.id) // RLS + extra safety
        .is("client_read_at", null); // Only update if unread

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/cliente/atualizacoes");
    return { success: true };
}

/**
 * Adiciona ou remove uma reação de um cliente numa atualização
 * Toggle: se já existe, remove; se não existe, adiciona
 */
export async function toggleReaction(updateId: string, reaction: ReactionType) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Não autenticado" };
    }

    // Check if reaction already exists
    const { data: existing } = await supabase
        .from("update_reactions")
        .select("id")
        .eq("update_id", updateId)
        .eq("user_id", user.id)
        .eq("reaction", reaction)
        .single();

    if (existing) {
        // Remove reaction
        const { error } = await supabase
            .from("update_reactions")
            .delete()
            .eq("id", existing.id);

        if (error) {
            return { error: error.message };
        }
    } else {
        // Add reaction
        const { error } = await supabase
            .from("update_reactions")
            .insert({
                update_id: updateId,
                user_id: user.id,
                reaction,
            });

        if (error) {
            return { error: error.message };
        }
    }

    revalidatePath("/cliente/atualizacoes");
    revalidatePath("/admin/clientes/[id]");
    return { success: true };
}

/**
 * Busca e agrega reações para um update específico
 * Retorna counts por tipo de reação + se user atual reagiu
 */
export async function getUpdateReactions(updateId: string): Promise<ReactionCount[]> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: reactions } = await supabase
        .from("update_reactions")
        .select("reaction, user_id")
        .eq("update_id", updateId);

    if (!reactions || reactions.length === 0) {
        return [];
    }

    // Aggregate by reaction type
    const aggregated = new Map<ReactionType, ReactionCount>();

    reactions.forEach((r) => {
        const existing = aggregated.get(r.reaction as ReactionType);
        if (existing) {
            existing.count++;
            if (user && r.user_id === user.id) {
                existing.user_reacted = true;
            }
        } else {
            aggregated.set(r.reaction as ReactionType, {
                reaction: r.reaction as ReactionType,
                count: 1,
                user_reacted: user ? r.user_id === user.id : false,
            });
        }
    });

    return Array.from(aggregated.values());
}

/**
 * Adiciona ou remove uma reação de um utilizador num post
 * Toggle: se já existe, remove; se não existe, adiciona
 */
export async function togglePostReaction(postId: string, reaction: ReactionType) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Não autenticado" };
    }

    // Check if reaction already exists
    const { data: existing } = await supabase
        .from("post_reactions")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .eq("reaction", reaction)
        .single();

    if (existing) {
        // Remove reaction
        const { error } = await supabase
            .from("post_reactions")
            .delete()
            .eq("id", existing.id);

        if (error) {
            return { error: error.message };
        }
    } else {
        // Add reaction
        const { error } = await supabase
            .from("post_reactions")
            .insert({
                post_id: postId,
                user_id: user.id,
                reaction,
            });

        if (error) {
            return { error: error.message };
        }
    }

    revalidatePath("/cliente/conteudos");
    return { success: true };
}

/**
 * Atualiza preferência de notificações por email
 */
export async function updateEmailNotificationPreference(enabled: boolean) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Não autenticado" };
    }

    const { error } = await supabase
        .from("profiles")
        .update({ email_notifications: enabled })
        .eq("id", user.id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/cliente/perfil");
    return { success: true };
}
