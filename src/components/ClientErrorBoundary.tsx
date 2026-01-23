"use client";

import { ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary";

interface ClientErrorBoundaryProps {
    children: ReactNode;
}

export function ClientErrorBoundary({ children }: ClientErrorBoundaryProps) {
    return <ErrorBoundary>{children}</ErrorBoundary>;
}
