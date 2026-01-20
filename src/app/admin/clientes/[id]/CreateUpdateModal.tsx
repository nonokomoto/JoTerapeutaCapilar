"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui";
import { CreateUpdateForm } from "./CreateUpdateForm";
import { Plus, X } from "lucide-react";

interface CreateUpdateModalProps {
    clientId: string;
    clientName: string;
}

export function CreateUpdateModal({ clientId, clientName }: CreateUpdateModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on Escape key
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    function handleClose() {
        setIsOpen(false);
    }

    return (
        <>
            {/* Trigger Button */}
            <Button onClick={() => setIsOpen(true)} size="sm">
                <Plus size={16} />
                Nova Atualização
            </Button>

            {/* Modal Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 backdrop-blur-sm"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    />

                    {/* Modal Content */}
                    <div
                        ref={modalRef}
                        className="relative w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            animation: "modalIn 0.2s ease-out",
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b ds-border-subtle">
                            <div>
                                <h2
                                    className="text-lg font-semibold"
                                    style={{ fontFamily: "var(--font-heading)" }}
                                >
                                    Nova Atualização
                                </h2>
                                <p className="text-sm ds-text-muted">
                                    Para {clientName}
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-lg ds-text-muted hover:ds-bg-muted transition-colors"
                                aria-label="Fechar"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-5">
                            <CreateUpdateForm
                                clientId={clientId}
                                onSuccess={handleClose}
                                compact
                            />
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes modalIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `}</style>
        </>
    );
}
