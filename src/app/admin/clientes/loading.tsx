import { Spinner } from "@/components/ui";

export default function ClientesLoading() {
    return (
        <div className="admin-loading">
            <Spinner size="lg" />
            <p className="section-loader-text">A carregar clientes...</p>
        </div>
    );
}
