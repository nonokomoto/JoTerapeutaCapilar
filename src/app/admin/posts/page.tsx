import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, Button } from "@/components/ui";
import { togglePublishAction } from "./actions";

export default async function AdminPosts() {
    const supabase = await createClient();

    const { data: posts } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

    const publishedPosts = posts?.filter((p) => p.published) || [];
    const draftPosts = posts?.filter((p) => !p.published) || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1
                        className="text-2xl font-bold"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Publications
                    </h1>
                    <p style={{ color: "var(--text-muted)" }}>
                        Gérez vos actualités
                    </p>
                </div>
                <Link href="/admin/posts/novo">
                    <Button>+ Nouvelle publication</Button>
                </Link>
            </div>

            {/* Drafts */}
            {draftPosts.length > 0 && (
                <section>
                    <h2
                        className="text-lg font-semibold mb-4"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Brouillons ({draftPosts.length})
                    </h2>
                    <div className="space-y-3">
                        {draftPosts.map((post) => (
                            <Card key={post.id} className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold">{post.title}</h3>
                                    <p
                                        className="text-sm line-clamp-2"
                                        style={{ color: "var(--text-muted)" }}
                                    >
                                        {post.content}
                                    </p>
                                    <p
                                        className="text-xs mt-2"
                                        style={{ color: "var(--text-light)" }}
                                    >
                                        Créé le{" "}
                                        {new Date(post.created_at).toLocaleDateString("fr-FR")}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <form action={togglePublishAction}>
                                        <input type="hidden" name="id" value={post.id} />
                                        <input type="hidden" name="published" value="false" />
                                        <Button type="submit" variant="secondary">
                                            Publier
                                        </Button>
                                    </form>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* Published */}
            <section>
                <h2
                    className="text-lg font-semibold mb-4"
                    style={{ fontFamily: "var(--font-heading)" }}
                >
                    Publiées ({publishedPosts.length})
                </h2>

                {publishedPosts.length > 0 ? (
                    <div className="space-y-3">
                        {publishedPosts.map((post) => (
                            <Card key={post.id} className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold">{post.title}</h3>
                                        <span
                                            className="text-xs px-2 py-0.5 rounded-full"
                                            style={{
                                                backgroundColor: "rgba(34, 197, 94, 0.1)",
                                                color: "var(--color-success)",
                                            }}
                                        >
                                            Publié
                                        </span>
                                    </div>
                                    <p
                                        className="text-sm line-clamp-2"
                                        style={{ color: "var(--text-muted)" }}
                                    >
                                        {post.content}
                                    </p>
                                    <p
                                        className="text-xs mt-2"
                                        style={{ color: "var(--text-light)" }}
                                    >
                                        Publié le{" "}
                                        {new Date(post.updated_at).toLocaleDateString("fr-FR")}
                                    </p>
                                </div>
                                <form action={togglePublishAction}>
                                    <input type="hidden" name="id" value={post.id} />
                                    <input type="hidden" name="published" value="true" />
                                    <Button type="submit" variant="secondary">
                                        Dépublier
                                    </Button>
                                </form>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <div className="text-center py-8">
                            <div className="text-4xl mb-3">📰</div>
                            <h3 className="font-medium mb-1">Aucune publication</h3>
                            <p
                                className="text-sm"
                                style={{ color: "var(--text-muted)" }}
                            >
                                Créez votre première actualité
                            </p>
                            <Link href="/admin/posts/novo" className="inline-block mt-4">
                                <Button>Créer une publication</Button>
                            </Link>
                        </div>
                    </Card>
                )}
            </section>
        </div>
    );
}
