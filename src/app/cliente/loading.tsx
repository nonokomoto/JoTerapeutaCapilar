import { Spinner } from "@/components/ui";

export default function ClienteLoading() {
    return (
        <div className="cliente-dashboard-content cliente-page-container">
            <div className="section-loader">
                <Spinner size="lg" />
                <p className="section-loader-text">A carregar...</p>
            </div>
        </div>
    );
}
