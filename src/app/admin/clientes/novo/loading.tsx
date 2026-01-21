import { Spinner } from "@/components/ui";

export default function NovoClienteLoading() {
    return (
        <div className="admin-loading">
            <Spinner size="lg" />
            <p className="section-loader-text">A preparar formulário...</p>
        </div>
    );
}
