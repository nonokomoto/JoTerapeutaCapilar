"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { inlineUpdateAction } from "@/app/admin/clientes/actions";
import { UpdateCategory } from "@/types/database";
import { Select } from "@/components/ui";

interface InlineEditUpdateProps {
    updateId: string;
    initialTitle: string;
    initialContent: string;
    initialCategory: UpdateCategory;
    onCancel: () => void;
}

/**
 * Inline editor for update title, content, and category
 * Features:
 * - Autosave with 2s debounce
 * - Escape to cancel
 * - Ctrl+Enter to force save
 * - Visual "saving..." indicator
 */
export function InlineEditUpdate({
    updateId,
    initialTitle,
    initialContent,
    initialCategory,
    onCancel,
}: InlineEditUpdateProps) {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [category, setCategory] = useState(initialCategory);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);

    // Autofocus title on mount
    useEffect(() => {
        titleInputRef.current?.focus();
        titleInputRef.current?.select();
    }, []);

    // Autosave function
    const saveChanges = useCallback(async () => {
        setIsSaving(true);

        const result = await inlineUpdateAction(updateId, {
            title,
            content,
            category,
        });

        setIsSaving(false);

        if (result.success) {
            setLastSaved(new Date());
        } else {
            console.error("Save failed:", result.error);
        }
    }, [updateId, title, content, category]);

    // Debounced autosave
    useEffect(() => {
        // Clear existing timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Set new timeout (2s debounce)
        saveTimeoutRef.current = setTimeout(() => {
            saveChanges();
        }, 2000);

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [title, content, category, saveChanges]);

    // Keyboard shortcuts
    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Escape to cancel
        if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
        }

        // Ctrl+Enter to force save
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            saveChanges();
        }
    };

    return (
        <div className="inline-edit-container" onKeyDown={handleKeyDown}>
            {/* Saving indicator */}
            {isSaving && (
                <div className="inline-edit-saving">
                    A guardar...
                </div>
            )}
            {!isSaving && lastSaved && (
                <div className="inline-edit-saved">
                    Guardado às {lastSaved.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
                </div>
            )}

            {/* Title input */}
            <input
                ref={titleInputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="inline-edit-title"
                placeholder="Título da atualização"
            />

            {/* Category select */}
            <div className="inline-edit-category">
                <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as UpdateCategory)}
                    options={[
                        { value: "evolucao", label: "Evolução" },
                        { value: "rotina", label: "Rotina" },
                        { value: "recomendacao", label: "Recomendação" },
                        { value: "agendamento", label: "Agendamento" },
                        { value: "outro", label: "Outro" },
                    ]}
                />
            </div>

            {/* Content textarea */}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="inline-edit-content"
                placeholder="Conteúdo da atualização (suporta Markdown)"
                rows={10}
            />

            {/* Help text */}
            <div className="inline-edit-help">
                <span className="ds-text-muted">
                    Esc para cancelar • Ctrl+Enter para guardar • Autosave a cada 2s
                </span>
            </div>
        </div>
    );
}
