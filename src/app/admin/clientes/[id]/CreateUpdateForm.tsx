"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@/components/ui";
import { createUpdateAction } from "../actions";

interface CreateUpdateFormProps {
    clientId: string;
}

export function CreateUpdateForm({ clientId }: CreateUpdateFormProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            setIsOpen(false);
            setSelectedFiles([]);
            router.refresh();
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

    if (!isOpen) {
        return (
            <Button onClick={() => setIsOpen(true)} fullWidth>
                + Nova atualização
            </Button>
        );
    }

    return (
        <Card>
            <h3
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
            >
                Nova atualização
            </h3>

            <form action={handleSubmit} className="space-y-4">
                <Input
                    label="Título"
                    name="title"
                    placeholder="Ex: Consulta de 15 de janeiro"
                    required
                />

                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="content"
                        className="text-sm font-medium"
                        style={{ fontFamily: "var(--font-sans)" }}
                    >
                        Conteúdo
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        rows={5}
                        className="input"
                        placeholder="Descreva as observações, recomendações, progressos..."
                        required
                        style={{
                            resize: "vertical",
                            minHeight: "120px",
                        }}
                    />
                </div>

                {/* File Upload */}
                <div className="flex flex-col gap-2">
                    <label
                        className="text-sm font-medium"
                        style={{ fontFamily: "var(--font-sans)" }}
                    >
                        Anexos (opcional)
                    </label>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                    />

                    <label
                        htmlFor="file-upload"
                        className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-sm cursor-pointer transition-colors hover:border-gray-400"
                        style={{ borderColor: "var(--border-color)" }}
                    >
                        <span>📎</span>
                        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                            Clique para adicionar imagens ou PDF
                        </span>
                    </label>

                    {/* Selected Files Preview */}
                    {selectedFiles.length > 0 && (
                        <div className="space-y-2 mt-2">
                            {selectedFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-2 rounded-sm"
                                    style={{ backgroundColor: "var(--bg-secondary)" }}
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span>{file.type.startsWith("image/") ? "🖼️" : "📄"}</span>
                                        <span className="text-sm truncate">{file.name}</span>
                                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                                            ({formatFileSize(file.size)})
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="text-sm px-2 py-1 rounded-sm hover:bg-gray-200"
                                        style={{ color: "var(--color-error)" }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        Imagens e PDF até 10MB cada
                    </p>
                </div>

                {error && (
                    <div
                        className="p-3 text-sm rounded-sm"
                        style={{
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                            color: "var(--color-error)",
                        }}
                    >
                        {error}
                    </div>
                )}

                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            setIsOpen(false);
                            setSelectedFiles([]);
                        }}
                        fullWidth
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" isLoading={isLoading} fullWidth>
                        Publicar
                    </Button>
                </div>
            </form>
        </Card>
    );
}
