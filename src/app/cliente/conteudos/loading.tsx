import { Spinner } from "@/components/ui";

export default function ConteudosLoading() {
    return (
        <div className="cliente-dashboard-content cliente-page-container">
            <div className="cliente-page-header">
                <div className="skeleton-text" style={{ width: "180px", height: "28px" }} />
                <div className="skeleton-text" style={{ width: "220px", height: "16px", marginTop: "8px" }} />
            </div>
            <div className="section-loader">
                <Spinner size="lg" />
                <p className="section-loader-text">A carregar conteúdos...</p>
            </div>
        </div>
    );
}
