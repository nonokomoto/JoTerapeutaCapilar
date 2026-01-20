"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@/components/ui";
import { createUpdateAction } from "../actions";
import { Paperclip, X, ImageIcon, FileText, Send } from "lucide-react";

interface CreateUpdateFormProps {
    clientId: string;
    onSuccess?: () => void;
    compact?: boolean;
}

export function CreateUpdateForm({ clientId, onSuccess, compact = false }: CreateUpdateFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        formData.append("client_id", clientId);

        // Add selected files to formData
        selectedFiles.forEach((file) => {
            formData.append("files", file);
        });

        const result = await createUpdateAction(formData);

        if (result?.error) {
            setError(result.error);
        } else {
            setSelectedFiles([]);
            formRef.current?.reset();
            router.refresh();
            onSuccess?.();
        }

        setIsLoading(false);
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        const validFiles = files.filter((file) => {
            const isImage = file.type.startsWith("image/");
            const isPdf = file.type === "application/pdf";
            const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB max
            return (isImage || isPdf) && isValidSize;
        });
        setSelectedFiles((prev) => [...prev, ...validFiles]);
        // Reset input to allow selecting same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    function removeFile(index: number) {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    }

    function formatFileSize(bytes: number): string {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }

    // Unique ID for file input when in modal (to avoid conflicts)
    const fileInputId = compact ? "modal-file-upload" : "file-upload";

    const formContent = (
        <form ref={formRef} action={handleSubmit} className="space-y-4">
            <Input
                label="Título"
                name="title"
                placeholder="Ex: Consulta de 15 de janeiro"
                required
            />

            <div className="flex flex-col gap-1.5">
                <label
                    htmlFor="content"
                    className="block text-sm font-medium ds-text-secondary"
                >
                    Mensagem
                </label>
                <textarea
                    id="content"
                    name="content"
                    rows={4}
                    className="input"
                    placeholder="Descreva as observações, recomendações, progressos..."
                    required
                    style={{
                        resize: "vertical",
                        minHeight: "120px",
                    }}
                />
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => (
                        <div
                            key={index}
                            className="badge badge-default"
                        >
                            {file.type.startsWith("image/") ? (
                                <ImageIcon size={14} />
                            ) : (
                                <FileText size={14} />
                            )}
                            <span className="truncate max-w-[120px]">{file.name}</span>
                            <span className="opacity-60">
                                ({formatFileSize(file.size)})
                            </span>
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="ml-1 opacity-60 hover:opacity-100"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="ds-alert-error text-sm">
                    {error}
                </div>
            )}

            {/* Actions Row */}
            <div className="flex items-center justify-between pt-2">
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id={fileInputId}
                    />
                    <label
                        htmlFor={fileInputId}
                        className="badge badge-default cursor-pointer transition-opacity hover:opacity-80"
                    >
                        <Paperclip size={16} />
                        Anexar
                    </label>
                </div>

                <Button type="submit" isLoading={isLoading}>
                    <Send size={16} />
                    Enviar
                </Button>
            </div>
        </form>
    );

    // If compact mode (in modal), return just the form without Card wrapper
    if (compact) {
        return formContent;
    }

    // Otherwise wrap in Card with title
    return (
        <Card variant="outlined">
            <h3 className="text-sm font-semibold mb-4">
                Nova Atualização
            </h3>
            {formContent}
        </Card>
    );
}
