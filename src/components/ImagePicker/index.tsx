"use client";

import { useState, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Search, Upload, X, Loader2, ImageIcon } from "lucide-react";

interface ImagePickerProps {
    value?: string | null;
    onChange: (url: string | null) => void;
}

interface SearchImage {
    url: string;
    thumbnail: string;
    title: string;
    source: string;
}

export function ImagePicker({ value, onChange }: ImagePickerProps) {
    const [activeTab, setActiveTab] = useState<"upload" | "search">("upload");
    const [isUploading, setIsUploading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchImage[]>([]);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith("image/")) {
            setError("Por favor, selecione uma imagem válida");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("A imagem deve ter no máximo 5MB");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            // Generate unique filename
            const ext = file.name.split(".").pop();
            const fileName = `post-${Date.now()}.${ext}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from("attachments")
                .upload(fileName, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from("attachments")
                .getPublicUrl(fileName);

            onChange(urlData.publicUrl);
        } catch (err) {
            console.error("Upload error:", err);
            setError("Erro ao fazer upload da imagem");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }

    async function handleSearch() {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setError(null);
        setSearchResults([]);

        try {
            const response = await fetch(
                `/api/images/search?q=${encodeURIComponent(searchQuery)}`
            );

            if (!response.ok) {
                throw new Error("Falha na pesquisa");
            }

            const data = await response.json();
            setSearchResults(data.images || []);

            if (data.images?.length === 0) {
                setError("Nenhuma imagem encontrada");
            }
        } catch (err) {
            console.error("Search error:", err);
            setError("Erro ao pesquisar imagens");
        } finally {
            setIsSearching(false);
        }
    }

    function handleSelectSearchImage(url: string) {
        onChange(url);
        setSearchResults([]);
        setSearchQuery("");
    }

    function handleRemoveImage() {
        onChange(null);
    }

    return (
        <div className="image-picker">
            <label className="image-picker-label">Imagem de Capa</label>

            {/* Preview */}
            {value && (
                <div className="image-picker-preview">
                    <img src={value} alt="Preview" />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="image-picker-remove"
                        aria-label="Remover imagem"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Tabs */}
            {!value && (
                <>
                    <div className="image-picker-tabs">
                        <button
                            type="button"
                            className={`image-picker-tab ${activeTab === "upload" ? "active" : ""}`}
                            onClick={() => setActiveTab("upload")}
                        >
                            <Upload size={16} />
                            Upload
                        </button>
                        <button
                            type="button"
                            className={`image-picker-tab ${activeTab === "search" ? "active" : ""}`}
                            onClick={() => setActiveTab("search")}
                        >
                            <Search size={16} />
                            Pesquisar
                        </button>
                    </div>

                    {/* Upload Tab */}
                    {activeTab === "upload" && (
                        <div className="image-picker-upload">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="image-upload"
                                disabled={isUploading}
                            />
                            <label htmlFor="image-upload" className="image-picker-dropzone">
                                {isUploading ? (
                                    <>
                                        <Loader2 size={32} className="animate-spin" />
                                        <span>A carregar...</span>
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon size={32} />
                                        <span>Clique para selecionar uma imagem</span>
                                        <span className="image-picker-hint">PNG, JPG até 5MB</span>
                                    </>
                                )}
                            </label>
                        </div>
                    )}

                    {/* Search Tab */}
                    {activeTab === "search" && (
                        <div className="image-picker-search">
                            <div className="image-picker-search-input">
                                <input
                                    type="text"
                                    placeholder="Pesquisar imagens..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
                                    className="input"
                                />
                                <button
                                    type="button"
                                    onClick={handleSearch}
                                    disabled={isSearching || !searchQuery.trim()}
                                    className="image-picker-search-btn"
                                >
                                    {isSearching ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <Search size={18} />
                                    )}
                                </button>
                            </div>

                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <div className="image-picker-results">
                                    {searchResults.map((img, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleSelectSearchImage(img.url)}
                                            className="image-picker-result"
                                        >
                                            <img
                                                src={img.thumbnail}
                                                alt={img.title}
                                                loading="lazy"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Error */}
            {error && (
                <div className="image-picker-error">
                    {error}
                </div>
            )}
        </div>
    );
}
