"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@/components/ui";
import { createUpdateAction, updateClientUpdateAction } from "../actions";
import { Paperclip, X, ImageIcon, FileText, Send, Save, Type, Tag, MessageSquare, Files } from "lucide-react";
import { Attachment } from "@/types/database";

interface CreateUpdateFormProps {
    clientId: string;
    onSuccess?: () => void;
    compact?: boolean;
    initialData?: {
        id: string;
        title: string;
        content: string;
        category?: string | null;
        attachments?: Attachment[];
    };
}

export function CreateUpdateForm({ clientId, onSuccess, compact = false, initialData }: CreateUpdateFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    // For editing: track removed existing files
    const [existingFiles, setExistingFiles] = useState<Attachment[]>(initialData?.attachments || []);
    const [removedFileIds, setRemovedFileIds] = useState<string[]>([]);

    // Form state for controlled inputs (needed for editing)
    const [title, setTitle] = useState(initialData?.title || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [category, setCategory] = useState(initialData?.category || "");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // Update state if initialData changes
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setContent(initialData.content);
            setCategory(initialData.category || "");
            setExistingFiles(initialData.attachments || []);
            setRemovedFileIds([]);
        }
    }, [initialData]);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        formData.append("client_id", clientId);

        // Add selected files to formData
        selectedFiles.forEach((file) => {
            formData.append("files", file);
        });

        let result;

        if (initialData) {
            // Edit mode
            formData.append("update_id", initialData.id);
            // Append removed file IDs
            removedFileIds.forEach(id => formData.append("removed_files", id));
            result = await updateClientUpdateAction(formData);
        } else {
            // Create mode
            result = await createUpdateAction(formData);
        }

        if (result?.error) {
            setError(result.error);
        } else {
            if (!initialData) {
                // Only reset if creating
                setSelectedFiles([]);
                setTitle("");
                setContent("");
                setCategory("");
                formRef.current?.reset();
            }
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
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    function removeFile(index: number) {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    }

    function removeExistingFile(id: string) {
        setExistingFiles(prev => prev.filter(f => f.id !== id));
        setRemovedFileIds(prev => [...prev, id]);
    }

    function formatFileSize(bytes: number | null): string {
        if (!bytes) return "";
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }

    // Unique ID for file input when in modal (to avoid conflicts)
    const fileInputId = compact ? "modal-file-upload" : "file-upload";

    const formContent = (
        <form ref={formRef} action={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="col-span-1 flex flex-col gap-1.5">
                    <label htmlFor="title" className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <Type size={14} style={{ color: '#F59E0B' }} />
                        Título
                    </label>
                    <input
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Consulta de 15 de janeiro"
                        required
                        className="input border border-gray-200"
                    />
                </div>

                <div className="col-span-1 flex flex-col gap-1.5">
                    <label htmlFor="category" className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <Tag size={14} style={{ color: '#3B82F6' }} />
                        Categoria
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="input w-full border border-gray-200"
                    >
                        <option value="outro">Outro</option>
                        <option value="evolucao">Evolução</option>
                        <option value="rotina">Rotina</option>
                        <option value="recomendacao">Recomendação</option>
                        <option value="agendamento">Agendamento</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label
                    htmlFor="content"
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-500"
                >
                    <MessageSquare size={14} style={{ color: '#10B981' }} />
                    Mensagem
                </label>
                <textarea
                    id="content"
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="input border border-gray-200"
                    placeholder="Descreva as observações, recomendações, progressos..."
                    required
                    style={{
                        resize: "vertical",
                        minHeight: "120px",
                    }}
                />
            </div>

            {/* Quick Category Hints */}
            <div className="text-xs text-gray-400 flex items-center gap-2 overflow-x-auto pb-1">
                <span>Sugestões:</span>
                {["Evolução", "Rotina", "Nota", "Alerta"].map(cat => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className="hover:text-primary transition-colors whitespace-nowrap"
                    >
                        #{cat}
                    </button>
                ))}
            </div>

            {/* Existing Files (Edit Mode) */}
            {existingFiles.length > 0 && (
                <div className="space-y-2">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <Files size={14} style={{ color: '#8B5CF6' }} />
                        Anexos existentes
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {existingFiles.map((file) => (
                            <div key={file.id} className="badge badge-default bg-gray-50 border-gray-200">
                                {file.file_type === 'image' ? (
                                    <ImageIcon size={14} />
                                ) : (
                                    <FileText size={14} />
                                )}
                                <a href={file.file_url} target="_blank" rel="noreferrer" className="truncate max-w-[120px] hover:underline">
                                    {file.file_name}
                                </a>
                                <button
                                    type="button"
                                    onClick={() => removeExistingFile(file.id)}
                                    className="ml-1 opacity-60 hover:text-red-500 hover:opacity-100"
                                    title="Remover anexo"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* New Selected Files Preview */}
            {selectedFiles.length > 0 && (
                <div className="space-y-2">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <Files size={14} style={{ color: '#8B5CF6' }} />
                        Novos anexos
                    </p>
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
                    {initialData ? <Save size={16} /> : <Send size={16} />}
                    {initialData ? "Guardar Alterações" : "Enviar"}
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
                {initialData ? "Editar Atualização" : "Nova Atualização"}
            </h3>
            {formContent}
        </Card>
    );
}
