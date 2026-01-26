"use client";

import { useState, useRef, useCallback } from "react";
import { Input } from "@/components/ui";
import { ImagePicker } from "@/components/ImagePicker";

interface PostEditorProps {
    defaultTitle?: string;
    defaultContent?: string;
    defaultCoverImage?: string | null;
    onTitleChange?: (title: string) => void;
    onContentChange?: (content: string) => void;
    onCoverImageChange?: (url: string | null) => void;
}

// Icon for inserting image
function ImageIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    );
}

export function PostEditor({
    defaultTitle = "",
    defaultContent = "",
    defaultCoverImage = null,
    onTitleChange,
    onContentChange,
    onCoverImageChange,
}: PostEditorProps) {
    const [title, setTitle] = useState(defaultTitle);
    const [content, setContent] = useState(defaultContent);
    const [coverImage, setCoverImage] = useState<string | null>(defaultCoverImage);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const cursorPositionRef = useRef<number>(0);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        onTitleChange?.(e.target.value);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        onContentChange?.(e.target.value);
    };

    const handleCoverImageChange = (url: string | null) => {
        setCoverImage(url);
        onCoverImageChange?.(url);
    };

    // Save cursor position before opening image picker
    const handleInsertImageClick = () => {
        if (textareaRef.current) {
            cursorPositionRef.current = textareaRef.current.selectionStart;
        }
        setShowImagePicker(true);
    };

    // Insert image URL at cursor position
    const handleInlineImageSelect = useCallback((url: string | null) => {
        if (url) {
            const position = cursorPositionRef.current;
            const before = content.substring(0, position);
            const after = content.substring(position);
            const imageTag = `\n[imagem: ${url}]\n`;
            const newContent = before + imageTag + after;

            setContent(newContent);
            onContentChange?.(newContent);

            // Focus back on textarea
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                    const newPosition = position + imageTag.length;
                    textareaRef.current.setSelectionRange(newPosition, newPosition);
                }
            }, 100);
        }
        setShowImagePicker(false);
    }, [content, onContentChange]);

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <div className="post-editor-simple">
            {/* Cover Image */}
            <div className="post-editor-section">
                <label className="post-editor-label">Imagem de capa</label>
                <ImagePicker
                    value={coverImage}
                    onChange={handleCoverImageChange}
                />
            </div>

            {/* Title */}
            <div className="post-editor-section">
                <Input
                    label="Título"
                    name="title"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Ex: Dicas de cuidado diário"
                    required
                />
            </div>

            {/* Content */}
            <div className="post-editor-section">
                <div className="post-editor-content-header">
                    <label className="post-editor-label">Conteúdo</label>
                    <button
                        type="button"
                        onClick={handleInsertImageClick}
                        className="post-editor-insert-btn"
                        title="Inserir imagem no texto"
                    >
                        <ImageIcon />
                        Inserir imagem
                    </button>
                </div>
                <textarea
                    ref={textareaRef}
                    name="content"
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Escreva o conteúdo da publicação...

Dicas:
• Deixe uma linha em branco para criar parágrafos
• Use - ou • no início da linha para criar listas
• URLs são automaticamente convertidas em links"
                    rows={12}
                    className="post-editor-textarea"
                    required
                />
                <div className="post-editor-stats">
                    <span>{wordCount} palavras</span>
                    <span>~{readingTime} min de leitura</span>
                </div>
            </div>

            {/* Inline Image Picker Modal */}
            {showImagePicker && (
                <div className="post-editor-modal-overlay" onClick={() => setShowImagePicker(false)}>
                    <div className="post-editor-modal" onClick={e => e.stopPropagation()}>
                        <div className="post-editor-modal-header">
                            <h3>Inserir imagem</h3>
                            <button
                                type="button"
                                onClick={() => setShowImagePicker(false)}
                                className="post-editor-modal-close"
                            >
                                ×
                            </button>
                        </div>
                        <ImagePicker
                            value={null}
                            onChange={handleInlineImageSelect}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
