"use client";

import { useState } from "react";
import { Modal, Button } from "@/components/ui";
import { createBeforeAfterComparison } from "../actions";
import { useRouter } from "next/navigation";
import { Type, Calendar, ImagePlus, FileText, Star, Send, Image } from "lucide-react";

interface CreateBeforeAfterModalProps {
    clientId: string;
}

export function CreateBeforeAfterModal({ clientId }: CreateBeforeAfterModalProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        formData.append("client_id", clientId);

        const result = await createBeforeAfterComparison(formData);

        if (result.success) {
            setIsModalOpen(false);
            router.refresh();
        } else {
            setError(result.error || "Erro ao criar comparação");
        }

        setIsSubmitting(false);
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="btn-secondary-sm"
                title="Adicionar evolução antes/depois"
            >
                <Image size={16} />
                <span className="hidden sm:inline">Evolução</span>
            </button>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nova Comparação Antes/Depois"
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="ba-title" className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                            <Type size={14} style={{ color: '#F59E0B' }} />
                            Título (opcional)
                        </label>
                        <input
                            id="ba-title"
                            type="text"
                            name="title"
                            className="input border border-gray-200"
                            placeholder="Ex: 3 meses de tratamento"
                        />
                    </div>

                    {/* Before/After Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* ANTES Column */}
                        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-3">
                            <div className="flex items-center justify-center">
                                <span className="px-3 py-1 text-xs font-semibold uppercase rounded-full bg-gray-200 text-gray-700">
                                    ANTES
                                </span>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="before-image" className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                    <ImagePlus size={14} style={{ color: '#8B5CF6' }} />
                                    Foto *
                                </label>
                                <input
                                    id="before-image"
                                    type="file"
                                    name="before_image"
                                    accept="image/*"
                                    required
                                    className="text-sm file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 file:cursor-pointer"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="before-date" className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                    <Calendar size={14} style={{ color: '#3B82F6' }} />
                                    Data *
                                </label>
                                <input
                                    id="before-date"
                                    type="date"
                                    name="before_date"
                                    required
                                    className="input border border-gray-200"
                                />
                            </div>
                        </div>

                        {/* DEPOIS Column */}
                        <div className="p-4 rounded-lg bg-green-50 border border-green-200 space-y-3">
                            <div className="flex items-center justify-center">
                                <span className="px-3 py-1 text-xs font-semibold uppercase rounded-full bg-green-200 text-green-700">
                                    DEPOIS
                                </span>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="after-image" className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                    <ImagePlus size={14} style={{ color: '#10B981' }} />
                                    Foto *
                                </label>
                                <input
                                    id="after-image"
                                    type="file"
                                    name="after_image"
                                    accept="image/*"
                                    required
                                    className="text-sm file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-green-100 file:text-green-700 hover:file:bg-green-200 file:cursor-pointer"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="after-date" className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                    <Calendar size={14} style={{ color: '#10B981' }} />
                                    Data *
                                </label>
                                <input
                                    id="after-date"
                                    type="date"
                                    name="after_date"
                                    required
                                    className="input border border-gray-200"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="ba-description" className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                            <FileText size={14} style={{ color: '#10B981' }} />
                            Notas (opcional)
                        </label>
                        <textarea
                            id="ba-description"
                            name="description"
                            className="input border border-gray-200"
                            rows={2}
                            placeholder="Observações sobre a evolução..."
                            style={{ resize: "vertical", minHeight: "60px" }}
                        />
                    </div>

                    {/* Featured Checkbox */}
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                        <input
                            type="checkbox"
                            name="is_featured"
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Star size={14} style={{ color: '#F59E0B' }} />
                        <span>Marcar como destaque na página inicial da cliente</span>
                    </label>

                    {error && (
                        <div className="ds-alert-error text-sm">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                        >
                            <Send size={16} />
                            Criar Comparação
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
