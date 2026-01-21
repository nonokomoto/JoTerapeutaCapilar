import { Spinner } from "@/components/ui";

export default function PostDetalheLoading() {
    return (
        <div className="admin-loading">
            <Spinner size="lg" />
            <p className="section-loader-text">A carregar post...</p>
        </div>
    );
}
