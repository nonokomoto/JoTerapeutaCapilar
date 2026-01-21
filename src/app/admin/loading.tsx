import { Spinner } from "@/components/ui";

export default function AdminLoading() {
    return (
        <div className="admin-loading">
            <Spinner size="lg" />
            <p className="section-loader-text">A carregar dashboard...</p>
        </div>
    );
}
