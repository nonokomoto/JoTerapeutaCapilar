import { Spinner } from "@/components/ui";

export default function PostsLoading() {
    return (
        <div className="admin-loading">
            <Spinner size="lg" />
            <p className="section-loader-text">A carregar conteúdos...</p>
        </div>
    );
}
