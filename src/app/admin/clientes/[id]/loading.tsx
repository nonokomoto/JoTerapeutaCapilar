import { Spinner } from "@/components/ui";

export default function ClienteDetalheLoading() {
    return (
        <div className="admin-loading">
            <Spinner size="lg" />
            <p className="section-loader-text">A carregar cliente...</p>
        </div>
    );
}
