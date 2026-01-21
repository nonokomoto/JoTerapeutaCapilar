import { Spinner } from "@/components/ui";

export default function ArtigoLoading() {
    return (
        <div className="cliente-dashboard-content cliente-page-container">
            <div className="section-loader" style={{ minHeight: "400px" }}>
                <Spinner size="lg" />
                <p className="section-loader-text">A carregar artigo...</p>
            </div>
        </div>
    );
}
