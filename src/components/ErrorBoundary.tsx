"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center">
                    <div className="ds-alert-error max-w-md">
                        <h3 className="font-semibold mb-2">Algo correu mal</h3>
                        <p className="text-sm mb-4">
                            Ocorreu um erro inesperado. Por favor, tente novamente.
                        </p>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={this.handleRetry}
                        >
                            Tentar novamente
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Functional wrapper for easier usage with hooks
interface ErrorBoundaryWrapperProps {
    children: ReactNode;
    fallback?: ReactNode;
}

export function ErrorBoundaryWrapper({ children, fallback }: ErrorBoundaryWrapperProps) {
    return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
}
