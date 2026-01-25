"use client";

import { useState, useEffect, useCallback } from "react";
import { Attachment } from "@/types/database";
import { Modal } from "./Modal";
import { Icon } from "./Icon";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
    attachments: Attachment[];
}

/**
 * Gera URL otimizada com transformações do Supabase Storage
 * @param url - URL original da imagem
 * @param width - Largura desejada
 * @param quality - Qualidade (1-100)
 */
function getOptimizedImageUrl(url: string, width: number, quality: number = 75): string {
    // Verifica se é uma URL do Supabase Storage
    if (!url.includes('supabase')) return url;

    // Adiciona parâmetros de transformação
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}width=${width}&quality=${quality}`;
}

export function ImageGallery({ attachments }: ImageGalleryProps) {
    // Filter only image attachments
    const images = attachments.filter(att => att.file_type === "image");

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Handle keyboard navigation
    useEffect(() => {
        if (!lightboxOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                goToPrevious();
            } else if (e.key === "ArrowRight") {
                goToNext();
            } else if (e.key === "Escape") {
                setLightboxOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxOpen, currentIndex, images.length]);

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setLightboxOpen(true);
    };

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // Touch/swipe handling
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            goToNext();
        } else if (isRightSwipe) {
            goToPrevious();
        }
    };

    if (images.length === 0) return null;

    return (
        <>
            {/* Thumbnail Grid */}
            <div className="image-gallery-grid">
                {images.map((image, index) => (
                    <button
                        key={image.id}
                        onClick={() => openLightbox(index)}
                        className="image-thumbnail-wrapper"
                        type="button"
                        aria-label={`Ver imagem ${index + 1} de ${images.length}`}
                    >
                        <img
                            src={getOptimizedImageUrl(image.file_url, 160, 70)}
                            alt={image.file_name}
                            className="image-thumbnail"
                            loading="lazy"
                        />
                    </button>
                ))}
            </div>

            {/* Lightbox Modal */}
            {lightboxOpen && (
                <Modal
                    isOpen={lightboxOpen}
                    onClose={() => setLightboxOpen(false)}
                    size="full"
                    showCloseButton={false}
                    className="modal-lightbox"
                >
                    <div
                        className="lightbox-container"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setLightboxOpen(false)}
                            className="lightbox-close-btn"
                            aria-label="Fechar"
                        >
                            <X size={24} />
                        </button>

                        {/* Navigation buttons - only show if more than 1 image */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={goToPrevious}
                                    className="lightbox-nav-btn lightbox-nav-prev"
                                    aria-label="Imagem anterior"
                                >
                                    <ChevronLeft size={32} />
                                </button>
                                <button
                                    onClick={goToNext}
                                    className="lightbox-nav-btn lightbox-nav-next"
                                    aria-label="Próxima imagem"
                                >
                                    <ChevronRight size={32} />
                                </button>
                            </>
                        )}

                        {/* Current image */}
                        <div className="lightbox-image-wrapper">
                            <img
                                src={getOptimizedImageUrl(images[currentIndex].file_url, 1200, 85)}
                                alt={images[currentIndex].file_name}
                                className="lightbox-image"
                            />
                        </div>

                        {/* Image counter */}
                        {images.length > 1 && (
                            <div className="lightbox-counter">
                                {currentIndex + 1} / {images.length}
                            </div>
                        )}

                        {/* Image title */}
                        <div className="lightbox-title">
                            {images[currentIndex].file_name}
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}
